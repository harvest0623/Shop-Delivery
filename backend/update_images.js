const mysql = require('mysql2/promise');

const updateImages = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        console.log('开始更新图片URL...\n');

        // 更新商家图片
        const shopImages = [
            [1, 'https://picsum.photos/400/300?random=10'],
            [2, 'https://picsum.photos/400/300?random=20'],
            [3, 'https://picsum.photos/400/300?random=30'],
            [4, 'https://picsum.photos/400/300?random=40'],
            [5, 'https://picsum.photos/400/300?random=50'],
            [6, 'https://picsum.photos/400/300?random=60']
        ];

        for (const [id, url] of shopImages) {
            await pool.query('UPDATE shops SET image_url = ? WHERE id = ?', [url, id]);
        }
        console.log('✓ 商家图片已更新');

        // 更新商品图片
        const productImages = [
            [1, 'https://picsum.photos/300/300?random=101'],
            [2, 'https://picsum.photos/300/300?random=102'],
            [3, 'https://picsum.photos/300/300?random=103'],
            [4, 'https://picsum.photos/300/300?random=104'],
            [5, 'https://picsum.photos/300/300?random=105'],
            [6, 'https://picsum.photos/300/300?random=106'],
            [7, 'https://picsum.photos/300/300?random=107'],
            [8, 'https://picsum.photos/300/300?random=108'],
            [9, 'https://picsum.photos/300/300?random=109'],
            [10, 'https://picsum.photos/300/300?random=110'],
            [11, 'https://picsum.photos/300/300?random=111'],
            [12, 'https://picsum.photos/300/300?random=112'],
            [13, 'https://picsum.photos/300/300?random=113'],
            [14, 'https://picsum.photos/300/300?random=114'],
            [15, 'https://picsum.photos/300/300?random=115'],
            [16, 'https://picsum.photos/300/300?random=116'],
            [17, 'https://picsum.photos/300/300?random=117'],
            [18, 'https://picsum.photos/300/300?random=118'],
            [19, 'https://picsum.photos/300/300?random=119'],
            [20, 'https://picsum.photos/300/300?random=120'],
            [21, 'https://picsum.photos/300/300?random=121'],
            [22, 'https://picsum.photos/300/300?random=122'],
            [23, 'https://picsum.photos/300/300?random=123'],
            [24, 'https://picsum.photos/300/300?random=124'],
            [25, 'https://picsum.photos/300/300?random=125'],
            [26, 'https://picsum.photos/300/300?random=126'],
            [27, 'https://picsum.photos/300/300?random=127'],
            [28, 'https://picsum.photos/300/300?random=128'],
            [29, 'https://picsum.photos/300/300?random=129'],
            [30, 'https://picsum.photos/300/300?random=130'],
            [31, 'https://picsum.photos/300/300?random=131'],
            [32, 'https://picsum.photos/300/300?random=132'],
            [33, 'https://picsum.photos/300/300?random=133'],
            [34, 'https://picsum.photos/300/300?random=134'],
            [35, 'https://picsum.photos/300/300?random=135'],
            [36, 'https://picsum.photos/300/300?random=136'],
            [37, 'https://picsum.photos/300/300?random=137'],
            [38, 'https://picsum.photos/300/300?random=138'],
            [39, 'https://picsum.photos/300/300?random=139'],
            [40, 'https://picsum.photos/300/300?random=140'],
            [41, 'https://picsum.photos/300/300?random=141'],
            [42, 'https://picsum.photos/300/300?random=142'],
            [43, 'https://picsum.photos/300/300?random=143'],
            [44, 'https://picsum.photos/300/300?random=144'],
            [45, 'https://picsum.photos/300/300?random=145'],
            [46, 'https://picsum.photos/300/300?random=146'],
            [47, 'https://picsum.photos/300/300?random=147'],
            [48, 'https://picsum.photos/300/300?random=148'],
            [49, 'https://picsum.photos/300/300?random=149'],
            [50, 'https://picsum.photos/300/300?random=150'],
            [51, 'https://picsum.photos/300/300?random=151'],
            [52, 'https://picsum.photos/300/300?random=152'],
            [53, 'https://picsum.photos/300/300?random=153'],
            [54, 'https://picsum.photos/300/300?random=154']
        ];

        for (const [id, url] of productImages) {
            await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
        }
        console.log('✓ 商品图片已更新');

        console.log('\n✅ 所有图片URL更新完成！');
        
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

updateImages();