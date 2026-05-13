const mysql = require('mysql2/promise');

const fixCategories = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        // 先更新商品的外键关联，再删除乱码数据
        // 更新 category_id: 7->1, 8->2, 9->3, 10->4, 11->5, 12->6
        await pool.query('UPDATE products SET category_id = 1 WHERE category_id = 7');
        await pool.query('UPDATE products SET category_id = 2 WHERE category_id = 8');
        await pool.query('UPDATE products SET category_id = 3 WHERE category_id = 9');
        await pool.query('UPDATE products SET category_id = 4 WHERE category_id = 10');
        await pool.query('UPDATE products SET category_id = 5 WHERE category_id = 11');
        await pool.query('UPDATE products SET category_id = 6 WHERE category_id = 12');
        console.log('商品分类ID已更新');

        // 删除乱码的分类（id 1-6），但这些已经被更新了，所以现在可以删除7-12
        await pool.query('DELETE FROM categories WHERE id IN (7, 8, 9, 10, 11, 12)');
        console.log('乱码分类已删除');

        // 更新正确分类的ID（1-6）
        await pool.query('UPDATE categories SET id = 100 WHERE id = 1');
        await pool.query('UPDATE categories SET id = 1 WHERE id = 100');
        
        await pool.query('UPDATE categories SET id = 200 WHERE id = 2');
        await pool.query('UPDATE categories SET id = 2 WHERE id = 200');
        
        await pool.query('UPDATE categories SET id = 300 WHERE id = 3');
        await pool.query('UPDATE categories SET id = 3 WHERE id = 300');
        
        await pool.query('UPDATE categories SET id = 400 WHERE id = 4');
        await pool.query('UPDATE categories SET id = 4 WHERE id = 400');
        
        await pool.query('UPDATE categories SET id = 500 WHERE id = 5');
        await pool.query('UPDATE categories SET id = 5 WHERE id = 500');
        
        await pool.query('UPDATE categories SET id = 600 WHERE id = 6');
        await pool.query('UPDATE categories SET id = 6 WHERE id = 600');
        
        console.log('分类ID已修复');
        console.log('\n完成！');
        
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

fixCategories();