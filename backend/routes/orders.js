const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, c.username, c.phone as customer_phone, c.nickname,
             s.name as shop_name, s.image_url as shop_image
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN shops s ON o.shop_id = s.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer orders
router.get('/customer/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, s.name as shop_name, s.image_url as shop_image,
             a.name as receiver_name, a.phone as receiver_phone,
             CONCAT(a.province, a.city, a.district, a.detail) as full_address
      FROM orders o
      JOIN shops s ON o.shop_id = s.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.customer_id = ?
      ORDER BY o.created_at DESC
    `, [req.params.customerId]);

    // Get order items for each order
    for (let order of rows) {
      const [items] = await pool.query(`
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order detail
router.get('/:id', async (req, res) => {
  try {
    const [orderRows] = await pool.query(`
      SELECT o.*, c.username, c.phone as customer_phone, c.nickname,
             s.name as shop_name, s.image_url as shop_image,
             CONCAT(a.province, a.city, a.district, a.detail) as full_address,
             a.name as receiver_name, a.phone as receiver_phone
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN shops s ON o.shop_id = s.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const [itemRows] = await pool.query(`
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({ ...orderRows[0], items: itemRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { customer_id, shop_id, address_id, items, total_amount, delivery_fee, remark } = req.body;

    // Generate order number
    const orderNo = 'ORD' + new Date().toISOString().slice(0,10).replace(/-/g,'') +
                    String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, shop_id, address_id, total_amount, delivery_fee, status, order_no, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_id, shop_id, address_id || null, total_amount, delivery_fee || 0, 'pending', orderNo, remark || '']
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await connection.commit();
    res.json({ success: true, id: orderId, order_no: orderNo, message: 'Order created successfully' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process return
router.put('/:id/return', async (req, res) => {
  try {
    const { reason } = req.body;
    await pool.query(
      'UPDATE orders SET status = ?, return_reason = ? WHERE id = ?',
      ['returned', reason, req.params.id]
    );
    res.json({ message: 'Return processed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', async (req, res) => {
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
