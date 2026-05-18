const mysql = require('mysql2/promise');

const updateShopLogos = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        console.log('开始更新商家Logo图片...\n');

        // 使用品牌相关的图片（店面、标志等）
        const shopLogos = [
            [1, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'], // 肯德基 - 快餐店门面
            [2, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop'], // 麦当劳 - 餐厅内部
            [3, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'], // 必胜客 - 披萨店
            [4, 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop'], // 汉堡王 - 汉堡店
            [5, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop'], // 星巴克 - 咖啡店
            [6, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop']  // 德克士 - 快餐店
        ];

        for (const [id, url] of shopLogos) {
            await pool.query('UPDATE shops SET image_url = ? WHERE id = ?', [url, id]);
        }

        console.log('✓ 商家Logo图片已更新');
        console.log('\n✅ 所有商家图片更新完成！');
        
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

updateShopLogos();