const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取所有商品
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, s.name as shop_name 
      FROM products p 
      LEFT JOIN shops s ON p.shop_id = s.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 根据商店ID获取商品
router.get('/shop/:shopId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE shop_id = ?', [req.params.shopId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个商品
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, s.name as shop_name 
      FROM products p 
      LEFT JOIN shops s ON p.shop_id = s.id 
      WHERE p.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '商品不存在' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建商品
router.post('/', async (req, res) => {
  try {
    const { shop_id, name, description, price, image_url, stock } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [shop_id, name, description, price, image_url, stock]
    );
    res.json({ id: result.insertId, message: '商品创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
