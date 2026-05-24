const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 获取所有用户列表（不返回密码）
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email, phone, nickname, avatar_url, created_at FROM customers');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, password, email, phone, nickname } = req.body;
        // 使用bcrypt加密密码，10轮加密
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO customers (username, password, email, phone, nickname) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, email, phone, nickname || username]
        );
        
        res.json({ id: result.insertId, message: '用户注册成功' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // 根据用户名查询用户
        const [rows] = await pool.query('SELECT * FROM customers WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        const user = rows[0];
        // 验证密码
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }
        
        // 判断是否为管理员
        const isAdmin = username === 'admin';
        // 生成JWT Token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email,
                phone: user.phone,
                nickname: user.nickname,
                is_admin: isAdmin
            } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
