const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取商品的所有评价（JOIN customers获取用户名和头像）
router.get('/product/:productId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, c.username, c.nickname, c.avatar_url
      FROM reviews r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.productId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 提交评价
router.post('/', async (req, res) => {
  try {
    const { customer_id, product_id, order_id, rating, content, images } = req.body;
    if (!customer_id || !product_id || !rating) {
      return res.status(400).json({ error: '缺少必要参数：customer_id、product_id、rating' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: '评分范围为1-5' });
    }
    const [result] = await pool.query(
      'INSERT INTO reviews (customer_id, product_id, order_id, rating, content, images) VALUES (?, ?, ?, ?, ?, ?)',
      [customer_id, product_id, order_id || null, rating, content || '', images || null]
    );
    res.json({ id: result.insertId, message: '评价提交成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取商品平均评分
router.get('/average/:productId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT AVG(rating) as average_rating, COUNT(*) as review_count FROM reviews WHERE product_id = ?',
      [req.params.productId]
    );
    const { average_rating, review_count } = rows[0];
    res.json({
      product_id: req.params.productId,
      average_rating: average_rating ? parseFloat(parseFloat(average_rating).toFixed(1)) : 0,
      review_count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
