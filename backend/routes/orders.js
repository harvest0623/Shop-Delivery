const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取所有订单
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.username, u.phone as user_phone 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户订单
router.get('/user/:userId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.username 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.params.userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个订单详情
router.get('/:id', async (req, res) => {
  try {
    const [orderRows] = await pool.query(`
      SELECT o.*, u.username, u.phone as user_phone, u.address 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `, [req.params.id]);
    
    if (orderRows.length === 0) {
      return res.status(404).json({ error: '订单不存在' });
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

// 创建订单
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { user_id, items, total_amount, delivery_address } = req.body;
    
    // 创建订单
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES (?, ?, ?, ?)',
      [user_id, total_amount, delivery_address, 'pending']
    );
    
    const orderId = orderResult.insertId;
    
    // 创建订单项
    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }
    
    await connection.commit();
    res.json({ id: orderId, message: '订单创建成功' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// 更新订单状态
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: '订单状态更新成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
