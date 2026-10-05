const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取用户通知列表（按时间倒序）
router.get('/customer/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE customer_id = ? ORDER BY created_at DESC',
      [req.params.customerId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取未读数量
router.get('/unread-count/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM notifications WHERE customer_id = ? AND is_read = 0',
      [req.params.customerId]
    );
    res.json({ count: rows[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 全部标记已读
router.put('/read-all', async (req, res) => {
  try {
    const customer_id = req.query.customer_id;
    if (!customer_id) {
      return res.status(400).json({ error: '缺少必要参数：customer_id' });
    }
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE customer_id = ? AND is_read = 0',
      [customer_id]
    );
    res.json({ message: '全部标记已读', updated: result.affectedRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 标记单条已读
router.put('/:id/read', async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '通知不存在' });
    }
    res.json({ message: '标记已读成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建通知（管理员使用）
router.post('/', async (req, res) => {
  try {
    const { customer_id, title, content, type } = req.body;
    if (!customer_id || !title || !content) {
      return res.status(400).json({ error: '缺少必要参数：customer_id、title、content' });
    }
    const [result] = await pool.query(
      'INSERT INTO notifications (customer_id, title, content, type) VALUES (?, ?, ?, ?)',
      [customer_id, title, content, type || 'system']
    );
    res.json({ id: result.insertId, message: '通知创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
