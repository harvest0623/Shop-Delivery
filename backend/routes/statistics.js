const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get sales statistics
router.get('/', async (req, res) => {
  try {
    const { range = 'month' } = req.query;

    let startDate, endDate;
    const today = new Date();

    switch (range) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        endDate = startDate;
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setDate(today.getDate() - 30);
        startDate = monthAgo.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'all':
        startDate = '2000-01-01';
        endDate = '2099-12-31';
        break;
      default:
        startDate = '2000-01-01';
        endDate = '2099-12-31';
    }

    // Overall statistics
    const [statsRows] = await pool.query(`
      SELECT
        COUNT(*) as totalOrders,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as totalSales,
        SUM(CASE WHEN status = 'returned' THEN total_amount ELSE 0 END) as totalRefunds,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) -
        SUM(CASE WHEN status = 'returned' THEN total_amount ELSE 0 END) as netSales,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingOrders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completedOrders,
        COUNT(CASE WHEN status = 'returned' THEN 1 END) as returnedOrders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelledOrders
      FROM orders
      WHERE DATE(created_at) BETWEEN ? AND ?
    `, [startDate, endDate]);

    // Top products
    const [topProducts] = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.image_url,
        s.name as shop_name,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.quantity * oi.price) as total_amount
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN shops s ON p.shop_id = s.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed' AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY p.id, p.name, p.image_url, s.name
      ORDER BY total_quantity DESC
      LIMIT 10
    `, [startDate, endDate]);

    // Top shops
    const [topShops] = await pool.query(`
      SELECT
        s.id,
        s.name,
        s.image_url,
        COUNT(DISTINCT o.id) as order_count,
        SUM(o.total_amount) as total_amount
      FROM shops s
      JOIN orders o ON s.id = o.shop_id
      WHERE o.status = 'completed' AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY s.id, s.name, s.image_url
      ORDER BY total_amount DESC
      LIMIT 10
    `, [startDate, endDate]);

    // Daily trend
    const [dailyTrend] = await pool.query(`
      SELECT
        DATE(created_at) as date,
        SUM(total_amount) as amount,
        COUNT(*) as order_count
      FROM orders
      WHERE status = 'completed' AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [startDate, endDate]);

    res.json({
      totalOrders: statsRows[0].totalOrders || 0,
      totalSales: statsRows[0].totalSales || 0,
      totalRefunds: statsRows[0].totalRefunds || 0,
      netSales: statsRows[0].netSales || 0,
      pendingOrders: statsRows[0].pendingOrders || 0,
      completedOrders: statsRows[0].completedOrders || 0,
      returnedOrders: statsRows[0].returnedOrders || 0,
      cancelledOrders: statsRows[0].cancelledOrders || 0,
      topProducts: topProducts || [],
      topShops: topShops || [],
      dailyTrend: dailyTrend || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get shop sales summary using view
router.get('/shops', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sales_summary_view ORDER BY net_sales DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get customer order summary using view
router.get('/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customer_order_view ORDER BY total_spent DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
