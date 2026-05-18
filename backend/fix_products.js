const mysql = require('mysql2/promise');

const fixProducts = async () => {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'huang426523',
        database: 'shop_delivery'
    });

    try {
        console.log('开始添加新商家的商品...\n');

        // 获取新商家的实际ID
        const [shops] = await pool.query('SELECT id, name FROM shops WHERE id > 6 ORDER BY id');
        const shopMap = {};
        shops.forEach(s => shopMap[s.name] = s.id);
        
        console.log('新商家ID映射:');
        Object.entries(shopMap).forEach(([name, id]) => console.log(`  ${name}: ${id}`));

        // 新商家商品数据
        const productsData = [
            // 喜茶
            {shop: '喜茶', cat: 9, name: '多肉葡萄', desc: '新鲜葡萄+芝士奶盖', price: 32.00, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', stock: 100, feat: 1},
            {shop: '喜茶', cat: 9, name: '芝芝莓莓', desc: '新鲜草莓+芝士', price: 36.00, img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', stock: 80, feat: 1},
            {shop: '喜茶', cat: 9, name: '烤黑糖波波牛乳', desc: '黑糖珍珠+鲜牛乳', price: 28.00, img: 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', stock: 90, feat: 0},
            {shop: '喜茶', cat: 9, name: '满杯红柚', desc: '西柚果茶', price: 25.00, img: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop', stock: 85, feat: 0},
            {shop: '喜茶', cat: 9, name: '芋泥波波茶', desc: '芋泥+波波', price: 26.00, img: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', stock: 70, feat: 0},
            {shop: '喜茶', cat: 5, name: '芋泥蛋糕', desc: '芋泥奶油蛋糕', price: 22.00, img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', stock: 50, feat: 0},
            {shop: '喜茶', cat: 9, name: '纯绿妍', desc: '茉莉绿茶', price: 18.00, img: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop', stock: 120, feat: 0},
            {shop: '喜茶', cat: 9, name: '生打椰椰奶冻', desc: '椰奶+奶冻', price: 29.00, img: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop', stock: 75, feat: 0},
            
            // 海底捞
            {shop: '海底捞', cat: 7, name: '招牌虾滑', desc: '手工鲜虾滑', price: 48.00, img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', stock: 60, feat: 1},
            {shop: '海底捞', cat: 7, name: '毛肚', desc: '七上八下鲜毛肚', price: 58.00, img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', stock: 50, feat: 1},
            {shop: '海底捞', cat: 7, name: '嫩牛肉', desc: '精选嫩牛肉片', price: 52.00, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 55, feat: 1},
            {shop: '海底捞', cat: 7, name: '鸭肠', desc: '脆嫩鸭肠', price: 38.00, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', stock: 45, feat: 0},
            {shop: '海底捞', cat: 7, name: '黄喉', desc: '牛黄喉', price: 42.00, img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', stock: 40, feat: 0},
            {shop: '海底捞', cat: 7, name: '金针菇', desc: '新鲜金针菇', price: 18.00, img: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '海底捞', cat: 7, name: '土豆片', desc: '薄切土豆片', price: 12.00, img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', stock: 120, feat: 0},
            {shop: '海底捞', cat: 7, name: '鸳鸯锅底', desc: '麻辣+清汤', price: 68.00, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', stock: 40, feat: 1},
            {shop: '海底捞', cat: 7, name: '四人套餐', desc: '火锅四人套餐', price: 288.00, img: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', stock: 20, feat: 1},
            
            // 西贝莜面村
            {shop: '西贝莜面村', cat: 2, name: '莜面鱼鱼', desc: '手工莜面制作', price: 32.00, img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', stock: 70, feat: 1},
            {shop: '西贝莜面村', cat: 2, name: '烤羊排', desc: '内蒙古烤羊排', price: 128.00, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 30, feat: 1},
            {shop: '西贝莜面村', cat: 2, name: '黄米凉糕', desc: '山西特色凉糕', price: 28.00, img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', stock: 50, feat: 0},
            {shop: '西贝莜面村', cat: 2, name: '凉皮', desc: '西北风味凉皮', price: 22.00, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', stock: 80, feat: 0},
            {shop: '西贝莜面村', cat: 2, name: '肉夹馍', desc: '陕西肉夹馍', price: 18.00, img: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '西贝莜面村', cat: 2, name: '羊肉串', desc: '烤羊肉串5串', price: 35.00, img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', stock: 60, feat: 0},
            {shop: '西贝莜面村', cat: 2, name: '酸汤鱼', desc: '贵州酸汤鱼', price: 88.00, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', stock: 35, feat: 0},
            {shop: '西贝莜面村', cat: 2, name: '大盘鸡', desc: '新疆大盘鸡', price: 78.00, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', stock: 40, feat: 0},
            
            // 瑞幸咖啡
            {shop: '瑞幸咖啡', cat: 4, name: '生椰拿铁', desc: '椰浆+浓缩咖啡', price: 29.00, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', stock: 150, feat: 1},
            {shop: '瑞幸咖啡', cat: 4, name: '厚乳拿铁', desc: '厚乳+咖啡', price: 26.00, img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', stock: 120, feat: 1},
            {shop: '瑞幸咖啡', cat: 4, name: '丝绒拿铁', desc: '丝绒奶+咖啡', price: 28.00, img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '瑞幸咖啡', cat: 4, name: '美式咖啡', desc: '经典美式', price: 21.00, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', stock: 200, feat: 0},
            {shop: '瑞幸咖啡', cat: 4, name: '陨石拿铁', desc: '黑糖珍珠+咖啡', price: 32.00, img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop', stock: 80, feat: 0},
            {shop: '瑞幸咖啡', cat: 5, name: '提拉米苏大福', desc: '提拉米苏味', price: 16.00, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', stock: 60, feat: 0},
            {shop: '瑞幸咖啡', cat: 5, name: '半熟芝士', desc: '轻芝士蛋糕', price: 18.00, img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop', stock: 50, feat: 0},
            {shop: '瑞幸咖啡', cat: 4, name: '椰云拿铁', desc: '椰云奶盖+咖啡', price: 32.00, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', stock: 90, feat: 1},
            
            // 奈雪的茶
            {shop: '奈雪的茶', cat: 9, name: '霸气芝士草莓', desc: '草莓+芝士奶盖', price: 36.00, img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', stock: 80, feat: 1},
            {shop: '奈雪的茶', cat: 9, name: '霸气橙子', desc: '满杯鲜橙', price: 28.00, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', stock: 90, feat: 0},
            {shop: '奈雪的茶', cat: 9, name: '霸气葡萄', desc: '巨峰葡萄', price: 32.00, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', stock: 70, feat: 0},
            {shop: '奈雪的茶', cat: 5, name: '草莓魔法棒', desc: '草莓欧包', price: 22.00, img: 'https://images.unsplash.com/photo-1585476263060-b7a6b710f2a1?w=400&h=400&fit=crop', stock: 50, feat: 0},
            {shop: '奈雪的茶', cat: 5, name: '嘟嘟包', desc: '咸蛋黄嘟嘟', price: 18.00, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', stock: 60, feat: 0},
            {shop: '奈雪的茶', cat: 9, name: '生椰拿铁', desc: '椰奶咖啡', price: 32.00, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', stock: 85, feat: 0},
            {shop: '奈雪的茶', cat: 9, name: '金色山脉', desc: '纯茶系列', price: 22.00, img: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '奈雪的茶', cat: 5, name: '奥利奥布雷', desc: '布雷甜品', price: 25.00, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', stock: 45, feat: 0},
            
            // 真功夫
            {shop: '真功夫', cat: 2, name: '香汁排骨饭', desc: '招牌排骨饭', price: 28.00, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', stock: 80, feat: 1},
            {shop: '真功夫', cat: 2, name: '冬菇鸡腿饭', desc: '冬菇蒸鸡腿', price: 26.00, img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=400&fit=crop', stock: 70, feat: 1},
            {shop: '真功夫', cat: 2, name: '酸菜卤肉饭', desc: '台式卤肉饭', price: 24.00, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 75, feat: 0},
            {shop: '真功夫', cat: 3, name: '蒸蛋', desc: '嫩滑蒸蛋', price: 8.00, img: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '真功夫', cat: 3, name: '炖汤', desc: '每日炖汤', price: 15.00, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', stock: 80, feat: 0},
            {shop: '真功夫', cat: 4, name: '豆浆', desc: '现磨豆浆', price: 6.00, img: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', stock: 150, feat: 0},
            {shop: '真功夫', cat: 2, name: '台式三杯鸡饭', desc: '三杯鸡套餐', price: 30.00, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', stock: 60, feat: 0},
            {shop: '真功夫', cat: 6, name: '双人套餐', desc: '两份主食+汤+菜', price: 58.00, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', stock: 40, feat: 1},
            
            // 呷哺呷哺
            {shop: '呷哺呷哺', cat: 7, name: '单人套餐', desc: '锅底+肉+菜', price: 48.00, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', stock: 60, feat: 1},
            {shop: '呷哺呷哺', cat: 7, name: '肥牛', desc: '精选肥牛卷', price: 38.00, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 70, feat: 1},
            {shop: '呷哺呷哺', cat: 7, name: '羊肉卷', desc: '新西兰羊肉', price: 42.00, img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', stock: 55, feat: 0},
            {shop: '呷哺呷哺', cat: 7, name: '蔬菜拼盘', desc: '时蔬拼盘', price: 22.00, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', stock: 80, feat: 0},
            {shop: '呷哺呷哺', cat: 7, name: '豆腐', desc: '嫩豆腐', price: 12.00, img: 'https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=400&h=400&fit=crop', stock: 90, feat: 0},
            {shop: '呷哺呷哺', cat: 7, name: '粉丝', desc: '红薯粉丝', price: 10.00, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '呷哺呷哺', cat: 4, name: '酸梅汤', desc: '自制酸梅汤', price: 12.00, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', stock: 120, feat: 0},
            {shop: '呷哺呷哺', cat: 7, name: '虾滑', desc: '手工虾滑', price: 35.00, img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', stock: 50, feat: 0},
            
            // 永和大王
            {shop: '永和大王', cat: 2, name: '卤肉饭', desc: '台式卤肉饭', price: 22.00, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 80, feat: 1},
            {shop: '永和大王', cat: 2, name: '三杯鸡饭', desc: '台式三杯鸡', price: 26.00, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', stock: 70, feat: 0},
            {shop: '永和大王', cat: 2, name: '宫保鸡丁饭', desc: '经典宫保鸡丁', price: 24.00, img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', stock: 75, feat: 0},
            {shop: '永和大王', cat: 3, name: '油条', desc: '现炸油条', price: 6.00, img: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop', stock: 150, feat: 0},
            {shop: '永和大王', cat: 3, name: '豆浆', desc: '现磨豆浆', price: 5.00, img: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', stock: 200, feat: 0},
            {shop: '永和大王', cat: 3, name: '蛋饼', desc: '葱花蛋饼', price: 10.00, img: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '永和大王', cat: 2, name: '牛肉面', desc: '红烧牛肉面', price: 28.00, img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', stock: 60, feat: 0},
            {shop: '永和大王', cat: 3, name: '小笼包', desc: '鲜肉小笼包', price: 18.00, img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', stock: 80, feat: 0},
            
            // 蜜雪冰城
            {shop: '蜜雪冰城', cat: 9, name: '摩天脆脆', desc: '冰淇淋甜筒', price: 3.00, img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', stock: 200, feat: 1},
            {shop: '蜜雪冰城', cat: 9, name: '柠檬水', desc: '新鲜柠檬水', price: 4.00, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', stock: 300, feat: 1},
            {shop: '蜜雪冰城', cat: 9, name: '珍珠奶茶', desc: '经典珍珠奶茶', price: 8.00, img: 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', stock: 150, feat: 0},
            {shop: '蜜雪冰城', cat: 9, name: '草莓摇摇奶昔', desc: '草莓奶昔', price: 10.00, img: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '蜜雪冰城', cat: 9, name: '满杯百香果', desc: '百香果茶', price: 9.00, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', stock: 120, feat: 0},
            {shop: '蜜雪冰城', cat: 9, name: '棒打鲜橙', desc: '鲜橙果茶', price: 8.00, img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', stock: 130, feat: 0},
            {shop: '蜜雪冰城', cat: 9, name: '芋圆葡萄', desc: '芋圆+葡萄', price: 10.00, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', stock: 90, feat: 0},
            {shop: '蜜雪冰城', cat: 9, name: '芝士奶盖茶', desc: '奶盖绿茶', price: 10.00, img: 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', stock: 100, feat: 0},
            
            // 老乡鸡
            {shop: '老乡鸡', cat: 2, name: '肥西老母鸡汤', desc: '招牌老母鸡汤', price: 38.00, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', stock: 60, feat: 1},
            {shop: '老乡鸡', cat: 2, name: '葱油鸡', desc: '香嫩葱油鸡', price: 32.00, img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=400&fit=crop', stock: 50, feat: 1},
            {shop: '老乡鸡', cat: 2, name: '农家小炒肉', desc: '湖南小炒肉', price: 28.00, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', stock: 70, feat: 0},
            {shop: '老乡鸡', cat: 2, name: '梅菜扣肉', desc: '经典梅菜扣肉', price: 35.00, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 45, feat: 0},
            {shop: '老乡鸡', cat: 2, name: '西红柿炒蛋', desc: '家常西红柿炒蛋', price: 18.00, img: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', stock: 80, feat: 0},
            {shop: '老乡鸡', cat: 2, name: '红烧鱼块', desc: '家常红烧鱼', price: 32.00, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', stock: 40, feat: 0},
            {shop: '老乡鸡', cat: 3, name: '蒸蛋', desc: '嫩滑蒸蛋', price: 8.00, img: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '老乡鸡', cat: 2, name: '农家一碗香', desc: '鸡蛋肉丁炒辣椒', price: 26.00, img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', stock: 60, feat: 0},
            
            // 和府捞面
            {shop: '和府捞面', cat: 2, name: '草本汤猪软骨面', desc: '招牌猪骨面', price: 38.00, img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', stock: 60, feat: 1},
            {shop: '和府捞面', cat: 2, name: '酸辣汤雪花肥牛面', desc: '酸汤肥牛面', price: 42.00, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', stock: 50, feat: 1},
            {shop: '和府捞面', cat: 2, name: '番茄汤猪软骨面', desc: '番茄猪骨面', price: 38.00, img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', stock: 55, feat: 0},
            {shop: '和府捞面', cat: 2, name: '草本汤笋衣面', desc: '素面', price: 28.00, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', stock: 60, feat: 0},
            {shop: '和府捞面', cat: 3, name: '溏心蛋', desc: '日式溏心蛋', price: 8.00, img: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', stock: 100, feat: 0},
            {shop: '和府捞面', cat: 3, name: '卤牛肉', desc: '切片卤牛肉', price: 22.00, img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', stock: 50, feat: 0},
            {shop: '和府捞面', cat: 3, name: '拍黄瓜', desc: '凉拌黄瓜', price: 12.00, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', stock: 80, feat: 0},
            {shop: '和府捞面', cat: 2, name: '拌面', desc: '葱油拌面', price: 22.00, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', stock: 70, feat: 0},
            
            // 张亮麻辣烫
            {shop: '张亮麻辣烫', cat: 7, name: '经典麻辣烫', desc: '自选麻辣烫', price: 25.00, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', stock: 100, feat: 1},
            {shop: '张亮麻辣烫', cat: 7, name: '麻辣拌', desc: '干拌麻辣烫', price: 25.00, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', stock: 80, feat: 1},
            {shop: '张亮麻辣烫', cat: 7, name: '酸辣粉', desc: '重庆酸辣粉', price: 18.00, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', stock: 90, feat: 0},
            {shop: '张亮麻辣烫', cat: 7, name: '土豆粉', desc: '砂锅土豆粉', price: 20.00, img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', stock: 70, feat: 0},
            {shop: '张亮麻辣烫', cat: 7, name: '米线', desc: '过桥米线', price: 22.00, img: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', stock: 75, feat: 0},
            {shop: '张亮麻辣烫', cat: 4, name: '酸梅汤', desc: '自制酸梅汤', price: 8.00, img: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', stock: 120, feat: 0},
            {shop: '张亮麻辣烫', cat: 3, name: '炸串', desc: '炸串拼盘', price: 20.00, img: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', stock: 60, feat: 0},
            {shop: '张亮麻辣烫', cat: 7, name: '冒菜', desc: '成都冒菜', price: 30.00, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', stock: 50, feat: 0}
        ];

        let count = 0;
        for (const p of productsData) {
            const shopId = shopMap[p.shop];
            if (!shopId) {
                console.log(`跳过未知商家: ${p.shop}`);
                continue;
            }
            await pool.query(
                'INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [shopId, p.cat, p.name, p.desc, p.price, p.img, p.stock, p.feat]
            );
            count++;
        }
        
        console.log(`\n✓ ${count}个新商品已添加`);
        console.log('\n✅ 数据扩充完成！');
        
        process.exit(0);
    } catch (error) {
        console.error('错误:', error.message);
        process.exit(1);
    }
};

fixProducts();
