const mysql = require('mysql2/promise');

const updateData = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        // 更新乱码的分类数据
        const updates = [
            [7, '热销菜品', '🔥', 1],
            [8, '主食', '🍚', 2],
            [9, '小吃', '🍟', 3],
            [10, '饮品', '🥤', 4],
            [11, '甜品', '🍰', 5],
            [12, '套餐', '🍱', 6]
        ];

        for (const [id, name, icon, sort_order] of updates) {
            await pool.query('UPDATE categories SET name = ?, icon = ?, sort_order = ? WHERE id = ?', [name, icon, sort_order, id]);
        }
        console.log('分类数据更新成功');

        // 删除乱码的分类（id 1-6）
        await pool.query('DELETE FROM categories WHERE id IN (1, 2, 3, 4, 5, 6)');
        console.log('乱码分类已删除');

        // 更新商品的category_id
        await pool.query('UPDATE products SET category_id = category_id - 6 WHERE category_id > 6');
        console.log('商品分类ID已更新');

        console.log('\n数据更新完成！');
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

updateData();