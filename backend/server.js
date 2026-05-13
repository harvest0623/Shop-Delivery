const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 测试数据库连接
const pool = require('./config/database');

app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    res.json({ status: 'OK', message: '数据库连接成功' });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: '数据库连接失败', error: error.message });
  }
});

// 路由
app.use('/api/users', require('./routes/users'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
