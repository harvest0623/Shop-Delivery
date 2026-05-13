-- 删除旧数据
USE shop_delivery;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE products;
TRUNCATE TABLE shops;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 插入用户
INSERT INTO users (username, password, email, phone, address) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'admin@shop.com', '13800138000', '北京市朝阳区');

-- 插入商家
INSERT INTO shops (name, description, address, phone, image_url) VALUES
('肯德基', '全球知名炸鸡连锁品牌，提供美味炸鸡、汉堡等', '北京市东城区王府井', '400-888-8890', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20restaurant%20chinese%20style&image_size=square'),
('麦当劳', '全球最大的快餐连锁品牌，汉堡薯条的代名词', '北京市西城区西单', '400-888-8891', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McDonalds%20restaurant%20chinese%20style&image_size=square'),
('必胜客', '全球知名披萨连锁，提供各种口味披萨', '北京市朝阳区望京', '400-888-8892', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pizza%20restaurant%20italian%20style&image_size=square'),
('汉堡王', '以火焰烧烤汉堡闻名的快餐品牌', '北京市海淀区中关村', '400-888-8893', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Burger%20King%20restaurant&image_size=square'),
('星巴克', '全球知名咖啡连锁，提供优质咖啡饮品', '北京市国贸中心', '400-888-8895', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Starbucks%20coffee%20shop&image_size=square'),
('赛百味', '新鲜三明治连锁，自选配料健康美味', '北京市三里屯', '400-888-8894', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Subway%20sandwich%20shop&image_size=square'),
('德克士', '中国本土快餐品牌，脆皮炸鸡特色', '北京市通州区', '400-888-8896', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20fried%20chicken%20restaurant&image_size=square'),
('大快活', '港式快餐连锁，提供港式美食', '北京市崇文门', '400-888-8897', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hong%20Kong%20style%20fast%20food&image_size=square');

-- 肯德基 (shop_id=1)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(1, '原味炸鸡', '外酥里嫩的经典炸鸡，肯德基招牌', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=crispy%20fried%20chicken%20pieces&image_size=square', 100),
(1, '香辣鸡翅', '6块香辣鸡翅，辣度适中', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20chicken%20wings%206%20pieces&image_size=square', 80),
(1, '奥尔良烤鸡腿', '鲜嫩多汁的烤鸡腿', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=roasted%20chicken%20leg%20juicy&image_size=square', 90),
(1, '老北京鸡肉卷', '经典北京风味鸡肉卷', 25.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Beijing%20chicken%20wrap&image_size=square', 70),
(1, '上校鸡块', '10块金黄鸡块，配番茄酱', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20nuggets%20golden&image_size=square', 85),
(1, '薯条(中)', '金黄酥脆的薯条', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20french%20fries&image_size=square', 120),
(1, '蛋挞', '6个香甜蛋挞', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=portuguese%20egg%20tarts&image_size=square', 60),
(1, '全家桶', '全家分享套餐，含炸鸡、薯条、饮料', 128.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20family%20bucket%20meal&image_size=square', 40);

-- 麦当劳 (shop_id=2)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(2, '巨无霸', '双层牛肉汉堡，麦当劳招牌', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Big%20Mac%20hamburger&image_size=square', 120),
(2, '薯条(大)', '超大份金黄薯条', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=large%20french%20fries&image_size=square', 150),
(2, '麦旋风', '奥利奥冰淇淋', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McFlurry%20ice%20cream%20Oreo&image_size=square', 80),
(2, '麦辣鸡腿堡', '香辣鸡腿汉堡', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20chicken%20burger&image_size=square', 100),
(2, '板烧鸡腿堡', '鲜嫩板烧鸡腿堡', 30.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=grilled%20chicken%20burger&image_size=square', 90),
(2, '开心乐园餐', '儿童套餐，含玩具', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=happy%20meal%20kids%20meal&image_size=square', 50),
(2, '麦香鸡', '经典鸡肉汉堡', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20burger%20classic&image_size=square', 110),
(2, '可乐(中杯)', '冰爽可乐', 10.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cola%20drink%20cup%20ice&image_size=square', 200);

-- 必胜客 (shop_id=3)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(3, '超级至尊披萨', '多种配料，经典之选', 88.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=supreme%20pizza%20all%20toppings&image_size=square', 50),
(3, '夏威夷披萨', '菠萝火腿口味', 78.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hawaiian%20pizza%20pineapple%20ham&image_size=square', 60),
(3, '芝士披萨', '浓郁芝士拉丝', 68.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheese%20pizza%20four%20cheeses&image_size=square', 70),
(3, '意大利肉酱面', '经典意式肉酱面', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spaghetti%20bolognese%20pasta&image_size=square', 80),
(3, '蒜香面包', '香浓蒜味面包', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=garlic%20bread%20cheese&image_size=square', 90),
(3, '鸡翅拼盘', '12块鸡翅拼盘', 48.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20wings%20platter&image_size=square', 55),
(3, '提拉米苏', '经典意式甜点', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=tiramisu%20dessert&image_size=square', 40),
(3, '美式咖啡', '浓郁黑咖啡', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=americano%20coffee&image_size=square', 100);

-- 汉堡王 (shop_id=4)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(4, '皇堡', '火焰烧烤牛肉堡', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Whopper%20burger%20flame%20grilled&image_size=square', 100),
(4, '双层皇堡', '双层牛肉火焰烧烤', 48.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=double%20whopper%20burger&image_size=square', 70),
(4, '鸡条', '10块香脆鸡条', 25.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20fries%20strips&image_size=square', 150),
(4, '洋葱圈', '金黄洋葱圈', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=onion%20rings%20golden&image_size=square', 80),
(4, '培根芝士堡', '培根芝士牛肉堡', 42.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=bacon%20cheese%20burger&image_size=square', 85),
(4, '芝士薯条', '芝士浇酱薯条', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheese%20fries%20loaded&image_size=square', 90),
(4, '香草奶昔', '香浓香草奶昔', 24.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=vanilla%20milkshake&image_size=square', 60),
(4, '巧克力奶昔', '浓郁巧克力奶昔', 24.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chocolate%20milkshake&image_size=square', 60);

-- 星巴克 (shop_id=5)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(5, '焦糖玛奇朵', '香甜焦糖咖啡', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=caramel%20macchiato%20coffee&image_size=square', 100),
(5, '抹茶拿铁', '日式抹茶拿铁', 36.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=matcha%20latte%20green%20tea&image_size=square', 80),
(5, '美式咖啡', '经典黑咖啡', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=americano%20black%20coffee&image_size=square', 120),
(5, '摩卡星冰乐', '冰爽摩卡咖啡', 42.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mocha%20frappuccino%20iced&image_size=square', 70),
(5, '蓝莓玛芬', '新鲜蓝莓蛋糕', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=blueberry%20muffin%20cake&image_size=square', 60),
(5, '芝士蛋糕', '经典芝士蛋糕', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheesecake%20slice&image_size=square', 50),
(5, '热巧克力', '浓郁热可可', 30.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=hot%20chocolate%20drink&image_size=square', 90),
(5, '拿铁咖啡', '经典拿铁', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=latte%20coffee%20milk&image_size=square', 110);

-- 赛百味 (shop_id=6)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(6, '火鸡胸三明治', '新鲜火鸡胸肉', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=turkey%20sandwich%20fresh&image_size=square', 60),
(6, '意大利三明治', '意式香肠火腿', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Italian%20sandwich%20salami&image_size=square', 70),
(6, '金枪鱼三明治', '美味金枪鱼', 30.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=tuna%20sandwich%20fish&image_size=square', 80),
(6, '蔬菜三明治', '健康素食选择', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=vegetarian%20sandwich%20veggies&image_size=square', 90),
(6, '凯撒沙拉', '新鲜凯撒沙拉', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Caesar%20salad%20fresh&image_size=square', 50),
(6, '巧克力曲奇', '手工巧克力曲奇', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chocolate%20chip%20cookie&image_size=square', 100),
(6, '柠檬水', '清爽柠檬饮品', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=lemonade%20drink%20fresh&image_size=square', 150),
(6, '美式三明治', '经典火腿三明治', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=ham%20sandwich%20classic&image_size=square', 100);

-- 德克士 (shop_id=7)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(7, '脆皮炸鸡', '德克士招牌脆皮炸鸡', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=crispy%20fried%20chicken%20Chinese&image_size=square', 100),
(7, '香辣鸡翅', '4块香辣鸡翅', 20.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20chicken%20wings%204&image_size=square', 80),
(7, '超级鸡腿堡', '超大鸡腿汉堡', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=super%20chicken%20burger%20large&image_size=square', 90),
(7, '蛋卷冰淇淋', '香甜蛋卷冰淇淋', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=soft%20serve%20ice%20cream%20cone&image_size=square', 120),
(7, '玉米浓汤', '香浓玉米汤', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=corn%20soup%20creamy&image_size=square', 70),
(7, '咖喱鸡块饭', '日式咖喱饭', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=curry%20chicken%20rice&image_size=square', 60),
(7, '菠萝派', '香甜菠萝派', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pineapple%20pie%20fried&image_size=square', 80),
(7, '百事可乐', '冰爽百事', 10.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Pepsi%20cola%20drink&image_size=square', 200);

-- 大快活 (shop_id=8)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(8, '叉烧饭', '港式叉烧饭', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hong%20Kong%20char%20siu%20rice&image_size=square', 60),
(8, '咖喱牛腩饭', '浓郁咖喱牛腩', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=curry%20beef%20brisket%20rice&image_size=square', 50),
(8, '鱼蛋粉', '港式鱼蛋粉', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hong%20Kong%20fish%20balls%20noodles&image_size=square', 70),
(8, '奶茶', '港式丝袜奶茶', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hong%20Kong%20milk%20tea&image_size=square', 90),
(8, '菠萝油', '冰火菠萝油', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pineapple%20bun%20butter&image_size=square', 80),
(8, '冻柠茶', '港式冻柠茶', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hong%20Kong%20iced%20lemon%20tea&image_size=square', 100),
(8, '牛腩面', '牛腩汤面', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=beef%20brisket%20noodles%20soup&image_size=square', 65),
(8, '蛋挞', '港式蛋挞', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hong%20Kong%20egg%20tarts&image_size=square', 75);

-- 验证插入
SELECT 
    s.id as shop_id, 
    s.name as shop_name, 
    COUNT(p.id) as product_count 
FROM shops s 
LEFT JOIN products p ON s.id = p.shop_id 
GROUP BY s.id, s.name;

SELECT '中文数据初始化成功！' AS message;
