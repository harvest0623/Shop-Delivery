const mysql = require('mysql2/promise');

const cleanupData = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        // 删除乱码的分类数据（id 1-6）
        await pool.query('DELETE FROM categories WHERE id IN (1, 2, 3, 4, 5, 6)');
        console.log('已删除乱码分类数据');

        // 重置分类ID
        await pool.query('ALTER TABLE categories AUTO_INCREMENT = 1');
        console.log('分类ID已重置');

        // 重新插入正确的分类数据
        const categories = [
            ['热销菜品', '🔥', 1],
            ['主食', '🍚', 2],
            ['小吃', '🍟', 3],
            ['饮品', '🥤', 4],
            ['甜品', '🍰', 5],
            ['套餐', '🍱', 6]
        ];

        for (const cat of categories) {
            await pool.query('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)', cat);
        }
        console.log('分类数据重新插入成功');

        console.log('\n数据清理完成！');
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

cleanupData();