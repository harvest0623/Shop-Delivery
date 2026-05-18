const pool = require('./config/database');

async function updateToChinese() {
    try {
        // 更新商家名称为中文
        const shopUpdates = [
            { id: 1, name: '肯德基', description: '全球知名炸鸡连锁品牌', address: '北京市东城区王府井大街1号' },
            { id: 2, name: '麦当劳', description: '全球最大快餐连锁品牌', address: '北京市西城区西单北大街100号' },
            { id: 3, name: '必胜客', description: '全球知名披萨连锁品牌', address: '北京市朝阳区望京街9号' },
            { id: 4, name: '汉堡王', description: '以火烤汉堡闻名', address: '北京市海淀区中关村大街1号' },
            { id: 5, name: '星巴克', description: '全球知名咖啡连锁品牌', address: '北京市朝阳区国贸中心' },
            { id: 6, name: '德克士', description: '中国本土快餐品牌', address: '北京市通州区万达广场' },
            { id: 7, name: '喜茶', description: '新式茶饮开创者', address: '北京市朝阳区三里屯太古里' },
            { id: 8, name: '海底捞', description: '服务最好的火锅', address: '北京市朝阳区望京街88号' },
            { id: 9, name: '西贝莜面村', description: '西北菜连锁品牌', address: '北京市海淀区西直门外大街1号' },
            { id: 10, name: '瑞幸咖啡', description: '中国本土咖啡品牌', address: '北京市东城区建国门内大街8号' },
            { id: 11, name: '奈雪的茶', description: '高端茶饮品牌', address: '北京市西城区金融街购物中心' },
            { id: 12, name: '真功夫', description: '中式快餐连锁品牌', address: '北京市丰台区方庄路2号' },
            { id: 13, name: '呷哺呷哺', description: '台式小火锅', address: '北京市昌平区回龙观西大街' },
            { id: 14, name: '永和大王', description: '中式早餐连锁品牌', address: '北京市通州区梨园路10号' },
            { id: 15, name: '蜜雪冰城', description: '平价茶饮品牌', address: '北京市大兴区黄村西大街' },
            { id: 16, name: '老乡鸡', description: '中式快餐品牌', address: '北京市顺义区天竺路5号' },
            { id: 17, name: '和府捞面', description: '书房里的健康面', address: '北京市朝阳区望京SOHO' },
            { id: 18, name: '张亮麻辣烫', description: '知名麻辣烫连锁品牌', address: '北京市海淀区五道口' }
        ];

        for (const shop of shopUpdates) {
            await pool.query(
                'UPDATE shops SET name = ?, description = ?, address = ? WHERE id = ?',
                [shop.name, shop.description, shop.address, shop.id]
            );
        }
        console.log('商家名称更新完成');

        // 更新商品名称为中文
        const productUpdates = [
            // 肯德基
            { id: 1, name: '吮指原味鸡', description: '经典脆皮炸鸡' },
            { id: 2, name: '香辣鸡翅', description: '6块香辣鸡翅' },
            { id: 3, name: '老北京鸡肉卷', description: '经典老北京风味鸡肉卷' },
            { id: 4, name: '奥尔良烤鸡腿堡', description: '鲜嫩奥尔良烤鸡' },
            { id: 5, name: '上校鸡块', description: '10块黄金鸡块' },
            { id: 6, name: '薯条（中）', description: '金黄酥脆薯条' },
            { id: 7, name: '九珍果汁', description: '清爽九果混合' },
            { id: 8, name: '蛋挞（6只）', description: '香甜葡式蛋挞' },
            // 麦当劳
            { id: 9, name: '巨无霸', description: '双层牛肉汉堡' },
            { id: 10, name: '麦辣鸡腿堡', description: '香辣鸡腿汉堡' },
            { id: 11, name: '板烧鸡腿堡', description: '鲜嫩板烧鸡肉' },
            { id: 12, name: '麦香鸡', description: '经典鸡肉汉堡' },
            { id: 13, name: '薯条（大）', description: '超大份薯条' },
            { id: 14, name: '麦乐鸡（6块）', description: '黄金麦乐鸡' },
            { id: 15, name: '可乐（中）', description: '冰爽可乐' },
            { id: 16, name: '麦旋风', description: '奥利奥冰淇淋' },
            // 必胜客
            { id: 17, name: '超级至尊披萨', description: '多种配料经典披萨' },
            { id: 18, name: '夏威夷披萨', description: '菠萝火腿风味' },
            { id: 19, name: '芝士披萨', description: '浓郁芝士拉丝' },
            { id: 20, name: '意式肉酱面', description: '经典意大利肉酱面' },
            { id: 21, name: '蒜香面包', description: '香蒜烤面包' },
            { id: 22, name: '鸡翅拼盘', description: '12块鸡翅' },
            { id: 23, name: '美式咖啡', description: '浓郁黑咖啡' },
            { id: 24, name: '提拉米苏', description: '经典意大利甜点' },
            // 汉堡王
            { id: 25, name: '皇堡', description: '火烤牛肉汉堡' },
            { id: 26, name: '双层皇堡', description: '双层牛肉火烤' },
            { id: 27, name: '培根芝士堡', description: '培根芝士牛肉堡' },
            { id: 28, name: '脆鸡三明治', description: '酥脆鸡肉三明治' },
            { id: 29, name: '鸡条', description: '10根酥脆鸡条' },
            { id: 30, name: '洋葱圈', description: '金黄洋葱圈' },
            { id: 31, name: '香草奶昔', description: '香滑香草奶昔' },
            { id: 32, name: '巧克力奶昔', description: '浓郁巧克力奶昔' },
            // 星巴克
            { id: 33, name: '焦糖玛奇朵', description: '香甜焦糖咖啡' },
            { id: 34, name: '抹茶拿铁', description: '日式抹茶拿铁' },
            { id: 35, name: '美式咖啡', description: '经典黑咖啡' },
            { id: 36, name: '拿铁', description: '经典拿铁' },
            { id: 37, name: '摩卡星冰乐', description: '冰爽摩卡咖啡' },
            { id: 38, name: '蓝莓麦芬', description: '新鲜蓝莓蛋糕' },
            { id: 39, name: '芝士蛋糕', description: '经典芝士蛋糕' },
            { id: 40, name: '热巧克力', description: '浓郁热可可' },
            // 德克士
            { id: 41, name: '脆皮炸鸡', description: '德克士招牌炸鸡' },
            { id: 42, name: '香辣鸡翅', description: '4块香辣鸡翅' },
            { id: 43, name: '超级鸡腿堡', description: '超大鸡腿汉堡' },
            { id: 44, name: '咖喱鸡饭', description: '日式咖喱饭' },
            { id: 45, name: '薯条（大）', description: '金黄酥脆薯条' },
            { id: 46, name: '玉米浓汤', description: '奶香玉米汤' },
            { id: 47, name: '百事可乐', description: '冰爽百事' },
            { id: 48, name: '菠萝派', description: '香甜菠萝派' },
            // 喜茶
            { id: 49, name: '多肉葡萄', description: '新鲜葡萄+芝士奶盖' },
            { id: 50, name: '多肉草莓', description: '新鲜草莓+芝士' },
            { id: 51, name: '黑糖波波牛乳', description: '黑糖珍珠+鲜奶' },
            { id: 52, name: '满杯红柚', description: '红柚果茶' },
            { id: 53, name: '芋泥波波', description: '芋泥+波波' },
            { id: 54, name: '芋泥蛋糕', description: '芋泥奶油蛋糕' },
            { id: 55, name: '纯绿妍', description: '茉莉绿茶' },
            { id: 56, name: '椰椰冻冻奶', description: '椰奶+布丁' },
            // 海底捞
            { id: 57, name: '招牌虾滑', description: '手打鲜虾滑' },
            { id: 58, name: '毛肚', description: '七上八下鲜毛肚' },
            { id: 59, name: '嫩牛肉', description: '精选嫩牛肉片' },
            { id: 60, name: '鸭肠', description: '脆嫩鸭肠' },
            { id: 61, name: '牛黄喉', description: '牛黄喉' },
            { id: 62, name: '金针菇', description: '新鲜金针菇' },
            { id: 63, name: '土豆片', description: '薄切土豆片' },
            { id: 64, name: '鸳鸯锅底', description: '麻辣+清汤' },
            // 西贝
            { id: 65, name: '莜面鱼鱼', description: '手工莜面' },
            { id: 66, name: '烤羊排', description: '内蒙古烤羊排' },
            { id: 67, name: '黄米凉糕', description: '山西特色凉糕' },
            { id: 68, name: '凉皮', description: '西北风味凉皮' },
            { id: 69, name: '肉夹馍', description: '陕西肉夹馍' },
            { id: 70, name: '羊肉串', description: '5串烤羊肉串' },
            { id: 71, name: '酸汤鱼', description: '贵州酸汤鱼' },
            { id: 72, name: '大盘鸡', description: '新疆大盘鸡' },
            // 瑞幸
            { id: 73, name: '生椰拿铁', description: '椰奶+浓缩咖啡' },
            { id: 74, name: '厚乳拿铁', description: '厚乳+咖啡' },
            { id: 75, name: '丝绒拿铁', description: '丝绒奶+咖啡' },
            { id: 76, name: '美式咖啡', description: '经典美式' },
            { id: 77, name: '陨石拿铁', description: '黑糖珍珠+咖啡' },
            { id: 78, name: '提拉米苏大福', description: '提拉米苏口味' },
            { id: 79, name: '半熟芝士', description: '轻芝士蛋糕' },
            { id: 80, name: '椰云拿铁', description: '椰云奶盖+咖啡' },
            // 奈雪
            { id: 81, name: '霸气芝士草莓', description: '草莓+芝士奶盖' },
            { id: 82, name: '霸气橙子', description: '满杯鲜橙' },
            { id: 83, name: '霸气葡萄', description: '巨峰葡萄' },
            { id: 84, name: '草莓魔法棒', description: '草莓面包' },
            { id: 85, name: '嘟嘟包', description: '咸蛋黄嘟嘟' },
            { id: 86, name: '生椰拿铁', description: '椰奶咖啡' },
            { id: 87, name: '金色山脉', description: '纯茶系列' },
            { id: 88, name: '奥利奥布蕾', description: '布蕾甜品' },
            // 真功夫
            { id: 89, name: '香汁排骨饭', description: '招牌排骨饭' },
            { id: 90, name: '香菇滑鸡饭', description: '香菇蒸鸡' },
            { id: 91, name: '酸菜卤肉饭', description: '台式卤肉饭' },
            { id: 92, name: '蒸蛋', description: '嫩滑蒸蛋' },
            { id: 93, name: '炖汤', description: '每日炖汤' },
            { id: 94, name: '豆浆', description: '鲜磨豆浆' },
            { id: 95, name: '三杯鸡饭', description: '三杯鸡套餐' },
            { id: 96, name: '双人套餐', description: '双主菜+汤+蔬菜' },
            // 呷哺呷哺
            { id: 97, name: '单人套餐', description: '锅底+肉+蔬菜' },
            { id: 98, name: '牛肉片', description: '精选牛肉片' },
            { id: 99, name: '羊肉片', description: '新西兰羊肉' },
            { id: 100, name: '蔬菜拼盘', description: '时令蔬菜拼盘' },
            { id: 101, name: '豆腐', description: '嫩豆腐' },
            { id: 102, name: '粉条', description: '红薯粉条' },
            { id: 103, name: '酸梅汤', description: '自制酸梅汤' },
            { id: 104, name: '虾滑', description: '手打虾滑' },
            // 永和大王
            { id: 105, name: '卤肉饭', description: '台式卤肉饭' },
            { id: 106, name: '三杯鸡饭', description: '台式三杯鸡' },
            { id: 107, name: '宫保鸡丁饭', description: '经典宫保鸡丁' },
            { id: 108, name: '油条', description: '现炸油条' },
            { id: 109, name: '豆浆', description: '鲜磨豆浆' },
            { id: 110, name: '蛋饼', description: '葱花蛋饼' },
            { id: 111, name: '牛肉面', description: '红烧牛肉面' },
            { id: 112, name: '小笼包', description: '鲜肉小笼包' },
            // 蜜雪冰城
            { id: 113, name: '摩天脆脆', description: '冰淇淋甜筒' },
            { id: 114, name: '柠檬水', description: '新鲜柠檬水' },
            { id: 115, name: '珍珠奶茶', description: '经典珍珠奶茶' },
            { id: 116, name: '草莓摇摇奶昔', description: '草莓奶昔' },
            { id: 117, name: '百香果茶', description: '百香果茶' },
            { id: 118, name: '鲜橙茶', description: '鲜橙果茶' },
            { id: 119, name: '芋圆葡萄', description: '芋圆+葡萄' },
            { id: 120, name: '芝士奶盖茶', description: '芝士奶盖绿茶' },
            // 老乡鸡
            { id: 121, name: '老母鸡汤', description: '招牌老母鸡汤' },
            { id: 122, name: '葱油鸡', description: '嫩滑葱油鸡' },
            { id: 123, name: '农家小炒肉', description: '湖南小炒肉' },
            { id: 124, name: '梅菜扣肉', description: '经典梅菜扣肉' },
            { id: 125, name: '西红柿炒蛋', description: '家常西红柿炒蛋' },
            { id: 126, name: '红烧鱼', description: '家常红烧鱼' },
            { id: 127, name: '蒸蛋', description: '嫩滑蒸蛋' },
            { id: 128, name: '农家一碗香', description: '鸡蛋猪肉炒辣椒' },
            // 和府捞面
            { id: 129, name: '草本猪软骨面', description: '招牌猪骨面' },
            { id: 130, name: '酸汤肥牛面', description: '酸汤肥牛面' },
            { id: 131, name: '番茄猪软骨面', description: '番茄猪骨面' },
            { id: 132, name: '草本笋衣面', description: '素食面' },
            { id: 133, name: '溏心蛋', description: '日式溏心蛋' },
            { id: 134, name: '卤牛肉', description: '切片卤牛肉' },
            { id: 135, name: '拍黄瓜', description: '凉拌黄瓜' },
            { id: 136, name: '拌面', description: '葱油拌面' },
            // 张亮麻辣烫
            { id: 137, name: '经典麻辣烫', description: '自选麻辣烫' },
            { id: 138, name: '麻辣拌', description: '干拌麻辣烫' },
            { id: 139, name: '酸辣粉', description: '重庆酸辣粉' },
            { id: 140, name: '砂锅土豆粉', description: '砂锅土豆粉' },
            { id: 141, name: '过桥米线', description: '云南过桥米线' },
            { id: 142, name: '酸梅汤', description: '自制酸梅汤' },
            { id: 143, name: '炸串', description: '炸串拼盘' },
            { id: 144, name: '冒菜', description: '成都冒菜' }
        ];

        for (const product of productUpdates) {
            await pool.query(
                'UPDATE products SET name = ?, description = ? WHERE id = ?',
                [product.name, product.description, product.id]
            );
        }
        console.log('商品名称更新完成');

        console.log('\n更新完成！');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateToChinese();
