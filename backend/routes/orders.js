const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取所有订单（管理员）
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

// 获取顾客的订单列表
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

    // 为每个订单获取订单项
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

// 获取单个订单详情
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

// 创建新订单
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // 开启事务
    await connection.beginTransaction();

    // 解析请求体
    const { customer_id, shop_id, address_id, items, total_amount, delivery_fee, remark } = req.body;

    // 生成订单编号：ORD + 年月日 + 4位随机数
    const orderNo = 'ORD' + new Date().toISOString().slice(0,10).replace(/-/g,'') +
                    String(Math.floor(Math.random() * 10000)).padStart(4, '0');

    // 插入订单记录
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, shop_id, address_id, total_amount, delivery_fee, status, order_no, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_id, shop_id, address_id || null, total_amount, delivery_fee || 0, 'pending', orderNo, remark || '']
    );

    const orderId = orderResult.insertId;

    // 插入订单项（触发器会自动减库存）
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // 提交事务
    await connection.commit();
    res.json({ success: true, id: orderId, order_no: orderNo, message: 'Order created successfully' });
  } catch (error) {
    // 出错回滚
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    // 释放连接
    connection.release();
  }
});

// 更新订单状态
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 处理退货申请
router.put('/:id/return', async (req, res) => {
  try {
    // 解析请求体
    const { reason } = req.body;

    // 更新订单状态为已退货
    await pool.query(
      'UPDATE orders SET status = ?, return_reason = ? WHERE id = ?',
      ['returned', reason, req.params.id]
    );
    res.json({ message: 'Return processed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取消订单
router.put('/:id/cancel', async (req, res) => {
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', req.params.id]);
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
