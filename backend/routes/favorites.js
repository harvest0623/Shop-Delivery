const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取用户收藏列表（JOIN shops和products）
router.get('/customer/:customerId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, 
        s.name AS shop_name, s.image_url AS shop_image,
        p.name AS product_name, p.price AS product_price, p.image_url AS product_image
      FROM favorites f
      LEFT JOIN shops s ON f.shop_id = s.id
      LEFT JOIN products p ON f.product_id = p.id
      WHERE f.customer_id = ?
      ORDER BY f.created_at DESC
    `, [req.params.customerId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 检查是否已收藏（通过query参数查询）
router.get('/check', async (req, res) => {
  try {
    const { customer_id, shop_id, product_id } = req.query;
    if (!customer_id) {
      return res.status(400).json({ error: '缺少必要参数：customer_id' });
    }
    let sql = 'SELECT id FROM favorites WHERE customer_id = ?';
    const params = [customer_id];
    if (shop_id) {
      sql += ' AND shop_id = ?';
      params.push(shop_id);
    }
    if (product_id) {
      sql += ' AND product_id = ?';
      params.push(product_id);
    }
    const [rows] = await pool.query(sql, params);
    res.json({ is_favorited: rows.length > 0, favorite_id: rows.length > 0 ? rows[0].id : null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加收藏
router.post('/', async (req, res) => {
  try {
    const { customer_id, shop_id, product_id } = req.body;
    if (!customer_id) {
      return res.status(400).json({ error: '缺少必要参数：customer_id' });
    }
    // 检查是否已收藏
    let checkSql = 'SELECT id FROM favorites WHERE customer_id = ?';
    const checkParams = [customer_id];
    if (shop_id) {
      checkSql += ' AND shop_id = ?';
      checkParams.push(shop_id);
    }
    if (product_id) {
      checkSql += ' AND product_id = ?';
      checkParams.push(product_id);
    }
    const [existing] = await pool.query(checkSql, checkParams);
    if (existing.length > 0) {
      return res.status(400).json({ error: '已经收藏过了' });
    }

    const [result] = await pool.query(
      'INSERT INTO favorites (customer_id, shop_id, product_id) VALUES (?, ?, ?)',
      [customer_id, shop_id || null, product_id || null]
    );
    res.json({ id: result.insertId, message: '收藏成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 取消收藏
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM favorites WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '收藏记录不存在' });
    }
    res.json({ message: '取消收藏成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
