const mysql = require('mysql2/promise');

const addMoreData = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        console.log('开始添加更多商家和商品数据...\n');

        // 添加新分类
        const newCategories = [
            ['烧烤', '🍖', 7],
            ['日料', '🍣', 8],
            ['奶茶', '🧋', 9],
            ['川菜', '🌶️', 10]
        ];
        for (const cat of newCategories) {
            await pool.query('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)', cat);
        }
        console.log('✓ 新分类已添加');

        // 添加更多商家
        const newShops = [
            ['喜茶', '新式茶饮开创者', '北京市朝阳区三里屯太古里', '400-888-8897', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop', 4.8, 30, 2.00, 25.00],
            ['海底捞', '服务最好的火锅', '北京市朝阳区望京街88号', '400-888-8898', 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop', 4.9, 45, 5.00, 50.00],
            ['西贝莜面村', '西北菜连锁品牌', '北京市海淀区西直门外大街1号', '400-888-8899', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 4.6, 35, 4.00, 40.00],
            ['瑞幸咖啡', '中国本土咖啡品牌', '北京市东城区建国门内大街8号', '400-888-8900', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', 4.5, 20, 0.00, 20.00],
            ['奈雪的茶', '高端茶饮品牌', '北京市西城区金融街购物中心', '400-888-8901', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop', 4.7, 35, 3.00, 30.00],
            ['真功夫', '中式快餐连锁', '北京市丰台区方庄路2号', '400-888-8902', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop', 4.3, 25, 2.00, 15.00],
            ['呷哺呷哺', '台式小火锅', '北京市昌平区回龙观西大街', '400-888-8903', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', 4.4, 30, 3.00, 35.00],
            ['永和大王', '中式早餐连锁', '北京市通州区梨园路10号', '400-888-8904', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', 4.2, 20, 1.00, 12.00],
            ['蜜雪冰城', '平价茶饮品牌', '北京市大兴区黄村西大街', '400-888-8905', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop', 4.5, 25, 0.00, 10.00],
            ['老乡鸡', '中式快餐品牌', '北京市顺义区天竺路5号', '400-888-8906', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', 4.3, 28, 2.00, 18.00],
            ['和府捞面', '书房里的养生面', '北京市朝阳区望京SOHO', '400-888-8907', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop', 4.6, 30, 3.00, 25.00],
            ['张亮麻辣烫', '知名麻辣烫连锁', '北京市海淀区五道口', '400-888-8908', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', 4.4, 25, 1.00, 15.00]
        ];
        for (const shop of newShops) {
            await pool.query('INSERT INTO shops (name, description, address, phone, image_url, rating, delivery_time, delivery_fee, min_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', shop);
        }
        console.log('✓ 12个新商家已添加');

        // 为新商家添加商品
        const newProducts = [
            // 喜茶 (7)
            [7, 9, '多肉葡萄', '新鲜葡萄+芝士奶盖', 32.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 100, 1],
            [7, 9, '芝芝莓莓', '新鲜草莓+芝士', 36.00, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', 80, 1],
            [7, 9, '烤黑糖波波牛乳', '黑糖珍珠+鲜牛乳', 28.00, 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', 90, 0],
            [7, 9, '满杯红柚', '西柚果茶', 25.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop', 85, 0],
            [7, 9, '芋泥波波茶', '芋泥+波波', 26.00, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 70, 0],
            [7, 5, '芋泥蛋糕', '芋泥奶油蛋糕', 22.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', 50, 0],
            [7, 9, '纯绿妍', '茉莉绿茶', 18.00, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop', 120, 0],
            [7, 9, '生打椰椰奶冻', '椰奶+奶冻', 29.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop', 75, 0],
            // 海底捞 (8)
            [8, 7, '招牌虾滑', '手工鲜虾滑', 48.00, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', 60, 1],
            [8, 7, '毛肚', '七上八下鲜毛肚', 58.00, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', 50, 1],
            [8, 7, '嫩牛肉', '精选嫩牛肉片', 52.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 55, 1],
            [8, 7, '鸭肠', '脆嫩鸭肠', 38.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 45, 0],
            [8, 7, '黄喉', '牛黄喉', 42.00, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', 40, 0],
            [8, 7, '金针菇', '新鲜金针菇', 18.00, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=400&fit=crop', 100, 0],
            [8, 7, '土豆片', '薄切土豆片', 12.00, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', 120, 0],
            [8, 7, '鸳鸯锅底', '麻辣+清汤', 68.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', 40, 1],
            [8, 7, '四人套餐', '火锅四人套餐', 288.00, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', 20, 1],
            // 西贝莜面村 (9)
            [9, 2, '莜面鱼鱼', '手工莜面制作', 32.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 70, 1],
            [9, 2, '烤羊排', '内蒙古烤羊排', 128.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 30, 1],
            [9, 2, '黄米凉糕', '山西特色凉糕', 28.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', 50, 0],
            [9, 2, '凉皮', '西北风味凉皮', 22.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 80, 0],
            [9, 2, '肉夹馍', '陕西肉夹馍', 18.00, 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=400&fit=crop', 100, 0],
            [9, 2, '羊肉串', '烤羊肉串5串', 35.00, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', 60, 0],
            [9, 2, '酸汤鱼', '贵州酸汤鱼', 88.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', 35, 0],
            [9, 2, '大盘鸡', '新疆大盘鸡', 78.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 40, 0],
            // 瑞幸咖啡 (10)
            [10, 4, '生椰拿铁', '椰浆+浓缩咖啡', 29.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', 150, 1],
            [10, 4, '厚乳拿铁', '厚乳+咖啡', 26.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', 120, 1],
            [10, 4, '丝绒拿铁', '丝绒奶+咖啡', 28.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 100, 0],
            [10, 4, '美式咖啡', '经典美式', 21.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 200, 0],
            [10, 4, '陨石拿铁', '黑糖珍珠+咖啡', 32.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop', 80, 0],
            [10, 5, '提拉米苏大福', '提拉米苏味', 16.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 60, 0],
            [10, 5, '半熟芝士', '轻芝士蛋糕', 18.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop', 50, 0],
            [10, 4, '椰云拿铁', '椰云奶盖+咖啡', 32.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', 90, 1],
            // 奈雪的茶 (11)
            [11, 9, '霸气芝士草莓', '草莓+芝士奶盖', 36.00, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', 80, 1],
            [11, 9, '霸气橙子', '满杯鲜橙', 28.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', 90, 0],
            [11, 9, '霸气葡萄', '巨峰葡萄', 32.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 70, 0],
            [11, 5, '草莓魔法棒', '草莓欧包', 22.00, 'https://images.unsplash.com/photo-1585476263060-b7a6b710f2a1?w=400&h=400&fit=crop', 50, 0],
            [11, 5, '嘟嘟包', '咸蛋黄嘟嘟', 18.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', 60, 0],
            [11, 9, '生椰拿铁', '椰奶咖啡', 32.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', 85, 0],
            [11, 9, '金色山脉', '纯茶系列', 22.00, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop', 100, 0],
            [11, 5, '奥利奥布雷', '布雷甜品', 25.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 45, 0],
            // 真功夫 (12)
            [12, 2, '香汁排骨饭', '招牌排骨饭', 28.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 80, 1],
            [12, 2, '冬菇鸡腿饭', '冬菇蒸鸡腿', 26.00, 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=400&fit=crop', 70, 1],
            [12, 2, '酸菜卤肉饭', '台式卤肉饭', 24.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 75, 0],
            [12, 3, '蒸蛋', '嫩滑蒸蛋', 8.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0],
            [12, 3, '炖汤', '每日炖汤', 15.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', 80, 0],
            [12, 4, '豆浆', '现磨豆浆', 6.00, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 150, 0],
            [12, 2, '台式三杯鸡饭', '三杯鸡套餐', 30.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 60, 0],
            [12, 6, '双人套餐', '两份主食+汤+菜', 58.00, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', 40, 1],
            // 呷哺呷哺 (13)
            [13, 7, '单人套餐', '锅底+肉+菜', 48.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', 60, 1],
            [13, 7, '肥牛', '精选肥牛卷', 38.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 70, 1],
            [13, 7, '羊肉卷', '新西兰羊肉', 42.00, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', 55, 0],
            [13, 7, '蔬菜拼盘', '时蔬拼盘', 22.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', 80, 0],
            [13, 7, '豆腐', '嫩豆腐', 12.00, 'https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=400&h=400&fit=crop', 90, 0],
            [13, 7, '粉丝', '红薯粉丝', 10.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 100, 0],
            [13, 4, '酸梅汤', '自制酸梅汤', 12.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 120, 0],
            [13, 7, '虾滑', '手工虾滑', 35.00, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', 50, 0],
            // 永和大王 (14)
            [14, 2, '卤肉饭', '台式卤肉饭', 22.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 80, 1],
            [14, 2, '三杯鸡饭', '台式三杯鸡', 26.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 70, 0],
            [14, 2, '宫保鸡丁饭', '经典宫保鸡丁', 24.00, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', 75, 0],
            [14, 3, '油条', '现炸油条', 6.00, 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop', 150, 0],
            [14, 3, '豆浆', '现磨豆浆', 5.00, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 200, 0],
            [14, 3, '蛋饼', '葱花蛋饼', 10.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0],
            [14, 2, '牛肉面', '红烧牛肉面', 28.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 60, 0],
            [14, 3, '小笼包', '鲜肉小笼包', 18.00, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', 80, 0],
            // 蜜雪冰城 (15)
            [15, 9, '摩天脆脆', '冰淇淋甜筒', 3.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 200, 1],
            [15, 9, '柠檬水', '新鲜柠檬水', 4.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 300, 1],
            [15, 9, '珍珠奶茶', '经典珍珠奶茶', 8.00, 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', 150, 0],
            [15, 9, '草莓摇摇奶昔', '草莓奶昔', 10.00, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', 100, 0],
            [15, 9, '满杯百香果', '百香果茶', 9.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', 120, 0],
            [15, 9, '棒打鲜橙', '鲜橙果茶', 8.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', 130, 0],
            [15, 9, '芋圆葡萄', '芋圆+葡萄', 10.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 90, 0],
            [15, 9, '芝士奶盖茶', '奶盖绿茶', 10.00, 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', 100, 0],
            // 老乡鸡 (16)
            [16, 2, '肥西老母鸡汤', '招牌老母鸡汤', 38.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', 60, 1],
            [16, 2, '葱油鸡', '香嫩葱油鸡', 32.00, 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=400&fit=crop', 50, 1],
            [16, 2, '农家小炒肉', '湖南小炒肉', 28.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 70, 0],
            [16, 2, '梅菜扣肉', '经典梅菜扣肉', 35.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 45, 0],
            [16, 2, '西红柿炒蛋', '家常西红柿炒蛋', 18.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 80, 0],
            [16, 2, '红烧鱼块', '家常红烧鱼', 32.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', 40, 0],
            [16, 3, '蒸蛋', '嫩滑蒸蛋', 8.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0],
            [16, 2, '农家一碗香', '鸡蛋肉丁炒辣椒', 26.00, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', 60, 0],
            // 和府捞面 (17)
            [17, 2, '草本汤猪软骨面', '招牌猪骨面', 38.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 60, 1],
            [17, 2, '酸辣汤雪花肥牛面', '酸汤肥牛面', 42.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 50, 1],
            [17, 2, '番茄汤猪软骨面', '番茄猪骨面', 38.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 55, 0],
            [17, 2, '草本汤笋衣面', '素面', 28.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 60, 0],
            [17, 3, '溏心蛋', '日式溏心蛋', 8.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0],
            [17, 3, '卤牛肉', '切片卤牛肉', 22.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 50, 0],
            [17, 3, '拍黄瓜', '凉拌黄瓜', 12.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', 80, 0],
            [17, 2, '拌面', '葱油拌面', 22.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 70, 0],
            // 张亮麻辣烫 (18)
            [18, 7, '经典麻辣烫', '自选麻辣烫', 25.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 100, 1],
            [18, 7, '麻辣拌', '干拌麻辣烫', 25.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 80, 1],
            [18, 7, '酸辣粉', '重庆酸辣粉', 18.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 90, 0],
            [18, 7, '土豆粉', '砂锅土豆粉', 20.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 70, 0],
            [18, 7, '米线', '过桥米线', 22.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 75, 0],
            [18, 4, '酸梅汤', '自制酸梅汤', 8.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 120, 0],
            [18, 3, '炸串', '炸串拼盘', 20.00, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', 60, 0],
            [18, 7, '冒菜', '成都冒菜', 30.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 50, 0]
        ];

        for (const product of newProducts) {
            await pool.query('INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', product);
        }
        console.log('✓ 新商品已添加');

        console.log('\n✅ 数据扩充完成！');
        console.log('商家: 6 → 18个');
        console.log('商品: 54 → 150+个');
        console.log('分类: 6 → 10个');
        
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

addMoreData();
