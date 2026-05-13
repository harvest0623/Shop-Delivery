const mysql = require('mysql2/promise');

const checkDatabase = async () => {
    try {
        const pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'huang426523',
            database: 'shop_delivery'
        });

        const [tables] = await pool.query('SHOW TABLES');
        console.log('数据库中的表:', tables);

        const [shops] = await pool.query('SELECT * FROM shops');
        console.log('\n商家数据:', shops);

        const [products] = await pool.query('SELECT * FROM products');
        console.log('\n商品数据:', products);

        const [categories] = await pool.query('SELECT * FROM categories');
        console.log('\n分类数据:', categories);

        const [customers] = await pool.query('SELECT * FROM customers');
        console.log('\n顾客数据:', customers);

        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

checkDatabase();