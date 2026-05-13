const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: '分类不存在' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, icon, sort_order } = req.body;
        const [result] = await pool.query(
            'INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)',
            [name, icon, sort_order || 0]
        );
        res.json({ id: result.insertId, message: '分类创建成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;