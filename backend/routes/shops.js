const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取所有商店
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shops');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个商店
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM shops WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '商店不存在' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建商店
router.post('/', async (req, res) => {
  try {
    const { name, description, address, phone, image_url } = req.body;
    const [result] = await pool.query(
      'INSERT INTO shops (name, description, address, phone, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, address, phone, image_url]
    );
    res.json({ id: result.insertId, message: '商店创建成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
