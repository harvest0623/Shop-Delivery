const mysql = require('mysql2/promise');

const updateFoodImages = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        console.log('开始更新美食图片...\n');

        // 更新商家图片 - 使用对应的品牌logo或店面图片
        const shopImages = [
            [1, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop'], // 肯德基 - 炸鸡
            [2, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop'], // 麦当劳 - 汉堡
            [3, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'], // 必胜客 - 披萨
            [4, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'], // 汉堡王 - 汉堡
            [5, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'], // 星巴克 - 咖啡
            [6, 'https://images.unsplash.com/photo-1528278327378-91d253d73f4c?w=400&h=300&fit=crop']  // 德克士 - 炸鸡
        ];

        for (const [id, url] of shopImages) {
            await pool.query('UPDATE shops SET image_url = ? WHERE id = ?', [url, id]);
        }
        console.log('✓ 商家图片已更新');

        // 更新商品图片 - 肯德基
        const kfcProducts = [
            [1, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop'],  // 原味炸鸡
            [2, 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=300&h=300&fit=crop'],  // 香辣鸡翅
            [3, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&h=300&fit=crop'],  // 老北京鸡肉卷
            [4, 'https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=300&h=300&fit=crop'],  // 奥尔良烤鸡腿堡
            [5, 'https://images.unsplash.com/photo-1562967916-eb82221dfb2c?w=300&h=300&fit=crop'],  // 上校鸡块
            [6, 'https://images.unsplash.com/photo-1630384060421-cb20aeb65535?w=300&h=300&fit=crop'],  // 薯条
            [7, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&h=300&fit=crop'],  // 九珍果汁
            [8, 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300&h=300&fit=crop'],  // 蛋挞
            [9, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop']   // 全家桶
        ];

        for (const [id, url] of kfcProducts) {
            await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
        }

        // 麦当劳
        const mcdonaldsProducts = [
            [10, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=300&fit=crop'], // 巨无霸
            [11, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=300&fit=crop'], // 麦辣鸡腿堡
            [12, 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=300&h=300&fit=crop'], // 板烧鸡腿堡
            [13, 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=300&h=300&fit=crop'], // 麦香鸡
            [14, 'https://images.unsplash.com/photo-1630384060421-cb20aeb65535?w=300&h=300&fit=crop'], // 薯条
            [15, 'https://images.unsplash.com/photo-1562967916-eb82221dfb2c?w=300&h=300&fit=crop'], // 鸡块
            [16, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop'], // 可乐
            [17, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop'], // 麦旋风
            [18, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=300&fit=crop']  // 开心乐园餐
        ];

        for (const [id, url] of mcdonaldsProducts) {
            await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
        }

        // 必胜客
        const pizzaHutProducts = [
            [19, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop'], // 超级至尊披萨
            [20, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop'], // 夏威夷披萨
            [21, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop'], // 芝士披萨
            [22, 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=300&fit=crop'], // 意大利肉酱面
            [23, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop'], // 蒜香面包
            [24, 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=300&h=300&fit=crop'], // 鸡翅拼盘
            [25, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop'], // 美式咖啡
            [26, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=300&fit=crop'], // 提拉米苏
            [27, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop']  // 双人套餐
        ];

        for (const [id, url] of pizzaHutProducts) {
            await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
        }

        // 汉堡王
        const burgerKingProducts = [
            [28, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop'], // 皇堡
            [29, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=300&h=300&fit=crop'], // 双层皇堡
            [30, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=300&fit=crop'], // 培根芝士堡
            [31, 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=300&h=300&fit=crop'], // 鸡肉三明治
            [32, 'https://images.unsplash.com/photo-1562967916-eb82221dfb2c?w=300&h=300&fit=crop'], // 鸡条
            [33, 'https://images.unsplash.com/photo-1630384060421-cb20aeb65535?w=300&h=300&fit=crop'], // 洋葱圈
            [34, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop'], // 香草奶昔
            [35, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300&h=300&fit=crop'], // 巧克力奶昔
            [36, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop']  // 超值套餐
        ];

        for (const [id, url] of burgerKingProducts) {
            await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
        }

        // 星巴克
        const starbucksProducts = [
            [37, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop'], // 焦糖玛奇朵
            [38, 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?w=300&h=300&fit=crop'], // 抹茶拿铁
            [39, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop'], // 美式咖啡
            [40, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&h=300&fit=crop'], // 拿铁咖啡
            [41, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop'], // 摩卡星冰乐
            [42, 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=300&h=300&fit=crop'], // 蓝莓玛芬
            [43, 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=300&h=300&fit=crop'], // 芝士蛋糕
            [44, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=300&h=300&fit=crop'], // 热巧克力
            [45, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop']  // 下午茶套餐
        ];

        for (const [id, url] of starbucksProducts) {
            await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
        }

        // 德克士
        const dicosProducts = [
            [46, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop'], // 脆皮炸鸡
            [47, 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=300&h=300&fit=crop'], // 香辣鸡翅
            [48, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=300&fit=crop'], // 超级鸡腿堡
            [49, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop'], // 咖喱鸡块饭
            [50, 'https://images.unsplash.com/photo-1630384060421-cb20aeb65535?w=300&h=300&fit=crop'], // 薯条
            [51, 'https://images.unsplash.com/photo-1547592166-23acbe346499?w=300&h=300&fit=crop'], // 玉米浓汤
            [52, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop'], // 百事可乐
            [53, 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300&h=300&fit=crop'], // 菠萝派
            [54, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=300&fit=crop']  // 蛋卷冰淇淋
        ];

        for (const [id, url] of dicosProducts) {
            await pool.query('UPDATE products SET image_url = ? WHERE id = ?', [url, id]);
        }

        console.log('✓ 商品图片已更新');
        console.log('\n✅ 所有美食图片更新完成！');
        
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

updateFoodImages();