const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// 获取用户积分总额和积分记录
router.get('/customer/:customerId', async (req, res) => {
  try {
    const [totalRows] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_points FROM points_log WHERE customer_id = ?',
      [req.params.customerId]
    );
    const [logs] = await pool.query(
      'SELECT id, customer_id, amount, type, description, created_at FROM points_log WHERE customer_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.params.customerId]
    );
    res.json({
      customer_id: req.params.customerId,
      total_points: totalRows[0].total_points,
      logs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 签到（检查是否已签到，增加积分，记录日志）
router.post('/checkin', async (req, res) => {
  try {
    const { customer_id } = req.body;
    if (!customer_id) {
      return res.status(400).json({ error: '缺少必要参数：customer_id' });
    }
    // 获取今天的日期（只取日期部分）
    const today = new Date().toISOString().slice(0, 10);
    // 检查今天是否已签到
    const [existing] = await pool.query(
      "SELECT id FROM points_log WHERE customer_id = ? AND type = 'checkin' AND DATE(created_at) = ?",
      [customer_id, today]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: '今日已签到，请勿重复签到' });
    }

    // 计算连续签到天数
    const [streakRows] = await pool.query(
      "SELECT COUNT(*) AS streak FROM points_log WHERE customer_id = ? AND type = 'checkin' AND DATE(created_at) >= DATE_SUB(?, INTERVAL 7 DAY)",
      [customer_id, today]
    );
    const streak = streakRows[0].streak;

    // 根据连续签到天数给予不同积分奖励
    let points = 10;
    if (streak >= 6) points = 50;
    else if (streak >= 3) points = 20;

    // 写入签到记录
    await pool.query(
      'INSERT INTO user_checkin (customer_id, checkin_date, points) VALUES (?, ?, ?)',
      [customer_id, today, points]
    );

    // 写入积分记录
    await pool.query(
      "INSERT INTO points_log (customer_id, amount, type, description) VALUES (?, ?, 'checkin', ?)",
      [customer_id, points, `每日签到 +${points}积分`]
    );

    res.json({ message: '签到成功', points, streak: streak + 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 检查今日签到状态
router.get('/checkin/status', async (req, res) => {
  try {
    const customer_id = req.query.customer_id;
    if (!customer_id) {
      return res.status(400).json({ error: '缺少必要参数：customer_id' });
    }
    const today = new Date().toISOString().slice(0, 10);
    const [existing] = await pool.query(
      "SELECT id FROM points_log WHERE customer_id = ? AND type = 'checkin' AND DATE(created_at) = ?",
      [customer_id, today]
    );
    res.json({ checked_in: existing.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取每日任务列表
router.get('/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM daily_tasks ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取用户任务完成状态
router.get('/tasks/customer/:customerId', async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const [rows] = await pool.query(`
      SELECT t.*, 
        COALESCE(ut.progress, 0) AS progress,
        COALESCE(ut.is_completed, 0) AS completed
      FROM daily_tasks t
      LEFT JOIN user_tasks ut 
        ON t.id = ut.task_id 
        AND ut.customer_id = ? 
        AND ut.date = ?
      ORDER BY t.id ASC
    `, [req.params.customerId, today]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 完成任务
router.post('/tasks/complete', async (req, res) => {
  try {
    const { task_id, customer_id } = req.body;
    if (!task_id || !customer_id) {
      return res.status(400).json({ error: '缺少必要参数：task_id、customer_id' });
    }
    // 检查任务是否存在
    const [taskRows] = await pool.query('SELECT * FROM daily_tasks WHERE id = ?', [task_id]);
    if (taskRows.length === 0) {
      return res.status(404).json({ error: '任务不存在' });
    }
    // 检查今日是否已完成
    const today = new Date().toISOString().slice(0, 10);
    const [existing] = await pool.query(
      "SELECT id FROM user_tasks WHERE task_id = ? AND customer_id = ? AND date = ? AND is_completed = 1",
      [task_id, customer_id, today]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: '今日已完成该任务' });
    }

    const task = taskRows[0];
    // 记录任务完成状态（使用 UPSERT）
    await pool.query(
      'INSERT INTO user_tasks (customer_id, task_id, progress, is_completed, completed_at, date) VALUES (?, ?, 1, 1, NOW(), ?) ON DUPLICATE KEY UPDATE progress = 1, is_completed = 1, completed_at = NOW()',
      [customer_id, task_id, today]
    );
    // 增加积分
    await pool.query(
      "INSERT INTO points_log (customer_id, amount, type, description) VALUES (?, ?, 'task', ?)",
      [customer_id, task.points_reward, `完成任务：${task.name}`]
    );
    await pool.query('UPDATE customers SET points = points + ? WHERE id = ?', [task.points_reward, customer_id]);

    res.json({ success: true, message: '任务完成，积分已增加', points_earned: task.points_reward });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
