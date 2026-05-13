const mysql = require('mysql2/promise');

const testConnection = async () => {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'huang426523',
            database: 'shop_delivery'
        });

        const [rows] = await pool.query('SELECT * FROM customers');
        console.log('数据库连接成功！');
        console.log('customers表数据:', rows);
        
        process.exit(0);
    } catch (error) {
        console.error('数据库连接失败:', error.message);
        process.exit(1);
    }
};

testConnection();