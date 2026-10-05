const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const hour = new Date().getHours();

    let recommendedProducts = [];

    try {
      const [prefs] = await pool.query(`
        SELECT p.*, s.name AS shop_name
        FROM products p
        LEFT JOIN shops s ON p.shop_id = s.id
        WHERE p.category_id IN (
          SELECT DISTINCT p2.category_id
          FROM order_items oi
          JOIN products p2 ON oi.product_id = p2.id
          JOIN orders o ON oi.order_id = o.id
          WHERE o.customer_id = ?
        )
        ORDER BY p.id DESC
        LIMIT 8
      `, [customerId]);
      recommendedProducts = prefs;
    } catch (e) {}

    if (recommendedProducts.length < 8) {
      const existingIds = recommendedProducts.map(p => p.id);
      let hotSql = `
        SELECT p.*, s.name AS shop_name
        FROM products p
        LEFT JOIN shops s ON p.shop_id = s.id
      `;
      const hotParams = [];
      if (existingIds.length > 0) {
        hotSql += ` WHERE p.id NOT IN (${existingIds.map(() => '?').join(',')})`;
        hotParams.push(...existingIds);
      }
      hotSql += ' ORDER BY p.id DESC LIMIT ?';
      hotParams.push(8 - recommendedProducts.length);
      const [hotProducts] = await pool.query(hotSql, hotParams);
      recommendedProducts = [...recommendedProducts, ...hotProducts];
    }

    let timeTag = 'default';
    let reason = '为你精选优质商品';
    if (hour >= 6 && hour < 10) { timeTag = 'breakfast'; reason = '早餐时间，来份营养早餐'; }
    else if (hour >= 11 && hour < 14) { timeTag = 'lunch'; reason = '午餐时间，美味不等待'; }
    else if (hour >= 17 && hour < 20) { timeTag = 'dinner'; reason = '晚餐时间，犒劳辛苦一天的自己'; }
    else if (hour >= 20 || hour < 2) { timeTag = 'late_night'; reason = '夜宵时间，来份深夜美食'; }

    res.json({
      customer_id: customerId,
      time_tag: timeTag,
      reason: reason,
      generated_at: new Date().toISOString(),
      recommendations: recommendedProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/feedback', async (req, res) => {
  try {
    const { customer_id, product_id, feedback_type } = req.body;
    if (!customer_id || !product_id || !feedback_type) {
      return res.status(400).json({ error: '缺少必要参数' });
    }
    res.json({ message: '反馈提交成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
