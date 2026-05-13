-- 创建数据库
DROP DATABASE IF EXISTS shop_delivery;
CREATE DATABASE shop_delivery DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop_delivery;

-- 创建商品分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建商家表
CREATE TABLE shops (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    phone VARCHAR(20),
    image_url VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 4.5,
    delivery_time INT DEFAULT 30,
    delivery_fee DECIMAL(5,2) DEFAULT 3.00,
    min_order DECIMAL(5,2) DEFAULT 20.00,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_shops_status (status)
);

-- 创建商品表
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 100,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_products_shop (shop_id),
    INDEX idx_products_category (category_id)
);

-- 创建顾客表
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    nickname VARCHAR(50),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建地址表
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    detail VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_addresses_customer (customer_id)
);

-- 创建订单表
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    shop_id INT NOT NULL,
    address_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(5,2) NOT NULL,
    status ENUM('pending', 'paid', 'preparing', 'delivering', 'completed', 'cancelled') DEFAULT 'pending',
    order_no VARCHAR(50) UNIQUE NOT NULL,
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id),
    INDEX idx_orders_customer (customer_id),
    INDEX idx_orders_status (status)
);

-- 创建订单项表
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_items_order (order_id)
);

-- 创建购物车表
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY idx_cart_unique (customer_id, product_id)
);

-- 创建索引
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- 插入分类数据
INSERT INTO categories (name, icon, sort_order) VALUES
('热销菜品', '🔥', 1),
('主食', '🍚', 2),
('小吃', '🍟', 3),
('饮品', '🥤', 4),
('甜品', '🍰', 5),
('套餐', '🍱', 6);

-- 插入商家数据
INSERT INTO shops (name, description, address, phone, image_url, rating, delivery_time, delivery_fee, min_order) VALUES
('肯德基', '全球知名炸鸡连锁品牌', '北京市东城区王府井大街1号', '400-888-8890', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20restaurant%20exterior%20modern&image_size=square', 4.8, 25, 3.00, 20.00),
('麦当劳', '全球最大的快餐连锁品牌', '北京市西城区西单北大街100号', '400-888-8891', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McDonalds%20restaurant%20exterior%20golden%20arches&image_size=square', 4.7, 28, 3.00, 15.00),
('必胜客', '全球知名披萨连锁', '北京市朝阳区望京街9号', '400-888-8892', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Pizza%20Hut%20restaurant%20exterior%20pizza&image_size=square', 4.6, 30, 5.00, 30.00),
('汉堡王', '以火焰烧烤汉堡闻名', '北京市海淀区中关村大街1号', '400-888-8893', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Burger%20King%20restaurant%20exterior&image_size=square', 4.5, 32, 4.00, 25.00),
('星巴克', '全球知名咖啡连锁', '北京市朝阳区国贸中心', '400-888-8895', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Starbucks%20coffee%20shop%20exterior&image_size=square', 4.9, 20, 0.00, 35.00),
('德克士', '中国本土快餐品牌', '北京市通州区万达广场', '400-888-8896', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20fast%20food%20restaurant%20exterior&image_size=square', 4.4, 25, 3.00, 18.00);

-- 插入肯德基商品 (shop_id=1)
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(1, 1, '原味炸鸡', '外酥里嫩的经典炸鸡', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=crispy%20fried%20chicken%20pieces%20golden&image_size=square', 100, 1),
(1, 1, '香辣鸡翅', '6块香辣鸡翅', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20chicken%20wings%206%20pieces&image_size=square', 80, 1),
(1, 2, '老北京鸡肉卷', '经典北京风味鸡肉卷', 25.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Beijing%20chicken%20wrap%20roll&image_size=square', 70, 0),
(1, 2, '奥尔良烤鸡腿堡', '鲜嫩奥尔良烤鸡腿', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=grilled%20chicken%20burger%20fresh&image_size=square', 90, 0),
(1, 3, '上校鸡块', '10块金黄鸡块', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20nuggets%20golden%20crispy&image_size=square', 85, 0),
(1, 3, '薯条(中)', '金黄酥脆薯条', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20french%20fries%20medium&image_size=square', 120, 0),
(1, 4, '九珍果汁', '清爽九种水果混合', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mixed%20fruit%20juice%20drink&image_size=square', 100, 0),
(1, 5, '蛋挞(6个)', '香甜葡式蛋挞', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=portuguese%20egg%20tarts%206%20pieces&image_size=square', 60, 0),
(1, 6, '全家桶', '全家分享套餐', 128.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20family%20bucket%20meal%20combo&image_size=square', 40, 1);

-- 插入麦当劳商品 (shop_id=2)
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(2, 1, '巨无霸', '双层牛肉汉堡', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Big%20Mac%20hamburger%20double%20patty&image_size=square', 120, 1),
(2, 1, '麦辣鸡腿堡', '香辣鸡腿汉堡', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20chicken%20burger%20crispy&image_size=square', 100, 1),
(2, 2, '板烧鸡腿堡', '鲜嫩板烧鸡腿', 30.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=grilled%20chicken%20burger%20juicy&image_size=square', 90, 0),
(2, 2, '麦香鸡', '经典鸡肉汉堡', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20burger%20classic&image_size=square', 110, 0),
(2, 3, '薯条(大)', '超大份薯条', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=large%20french%20fries%20golden&image_size=square', 150, 0),
(2, 3, '鸡块(6块)', '金黄鸡块', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20nuggets%206%20pieces%20golden&image_size=square', 100, 0),
(2, 4, '可乐(中杯)', '冰爽可乐', 10.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cola%20drink%20cup%20ice&image_size=square', 200, 0),
(2, 5, '麦旋风', '奥利奥冰淇淋', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McFlurry%20ice%20cream%20Oreo&image_size=square', 80, 1),
(2, 6, '开心乐园餐', '儿童套餐', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=happy%20meal%20kids%20burger%20fries&image_size=square', 50, 0);

-- 插入必胜客商品 (shop_id=3)
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(3, 1, '超级至尊披萨', '多种配料经典披萨', 88.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=supreme%20pizza%20all%20toppings%20delicious&image_size=square', 50, 1),
(3, 1, '夏威夷披萨', '菠萝火腿口味', 78.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Hawaiian%20pizza%20pineapple%20ham&image_size=square', 60, 1),
(3, 2, '芝士披萨', '浓郁芝士拉丝', 68.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=four%20cheese%20pizza%20melted&image_size=square', 70, 0),
(3, 2, '意大利肉酱面', '经典意式肉酱面', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spaghetti%20bolognese%20pasta&image_size=square', 80, 0),
(3, 3, '蒜香面包', '香浓蒜味面包', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=garlic%20bread%20cheese%20crispy&image_size=square', 90, 0),
(3, 3, '鸡翅拼盘', '12块鸡翅', 48.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20wings%20platter%20variety&image_size=square', 55, 0),
(3, 4, '美式咖啡', '浓郁黑咖啡', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=americano%20coffee%20black&image_size=square', 100, 0),
(3, 5, '提拉米苏', '经典意式甜点', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=tiramisu%20dessert%20cream&image_size=square', 40, 0),
(3, 6, '双人套餐', '披萨+意面+饮品', 158.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pizza%20combo%20meal%20for%20two&image_size=square', 30, 1);

-- 插入汉堡王商品 (shop_id=4)
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(4, 1, '皇堡', '火焰烧烤牛肉堡', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Whopper%20burger%20flame%20grilled%20beef&image_size=square', 100, 1),
(4, 1, '双层皇堡', '双层牛肉火焰烧烤', 48.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=double%20whopper%20burger%20two%20patties&image_size=square', 70, 1),
(4, 2, '培根芝士堡', '培根芝士牛肉堡', 42.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=bacon%20cheese%20burger%20delicious&image_size=square', 85, 0),
(4, 2, '鸡肉三明治', '香脆鸡肉三明治', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=crispy%20chicken%20sandwich%20fresh&image_size=square', 90, 0),
(4, 3, '鸡条', '10块香脆鸡条', 25.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20fries%20strips%20crispy&image_size=square', 150, 0),
(4, 3, '洋葱圈', '金黄洋葱圈', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=onion%20rings%20golden%20fried&image_size=square', 80, 0),
(4, 4, '香草奶昔', '香浓香草奶昔', 24.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=vanilla%20milkshake%20creamy&image_size=square', 60, 0),
(4, 4, '巧克力奶昔', '浓郁巧克力奶昔', 24.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chocolate%20milkshake%20rich&image_size=square', 60, 0),
(4, 6, '超值套餐', '汉堡+薯条+饮品', 68.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=burger%20meal%20combo%20fries%20drink&image_size=square', 50, 0);

-- 插入星巴克商品 (shop_id=5)
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(5, 1, '焦糖玛奇朵', '香甜焦糖咖啡', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=caramel%20macchiato%20coffee%20latte&image_size=square', 100, 1),
(5, 1, '抹茶拿铁', '日式抹茶拿铁', 36.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=matcha%20latte%20green%20tea%20milk&image_size=square', 80, 1),
(5, 4, '美式咖啡', '经典黑咖啡', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=americano%20coffee%20black&image_size=square', 120, 0),
(5, 4, '拿铁咖啡', '经典拿铁', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=latte%20coffee%20milk%20foam&image_size=square', 110, 0),
(5, 4, '摩卡星冰乐', '冰爽摩卡咖啡', 42.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mocha%20frappuccino%20iced%20coffee&image_size=square', 70, 0),
(5, 5, '蓝莓玛芬', '新鲜蓝莓蛋糕', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=blueberry%20muffin%20cake%20fresh&image_size=square', 60, 0),
(5, 5, '芝士蛋糕', '经典芝士蛋糕', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheesecake%20slice%20creamy&image_size=square', 50, 0),
(5, 4, '热巧克力', '浓郁热可可', 30.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=hot%20chocolate%20drink%20rich&image_size=square', 90, 0),
(5, 6, '下午茶套餐', '咖啡+蛋糕', 58.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=afternoon%20tea%20set%20coffee%20cake&image_size=square', 40, 1);

-- 插入德克士商品 (shop_id=6)
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(6, 1, '脆皮炸鸡', '德克士招牌炸鸡', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20crispy%20fried%20chicken%20golden&image_size=square', 100, 1),
(6, 1, '香辣鸡翅', '4块香辣鸡翅', 20.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20chicken%20wings%204%20pieces&image_size=square', 80, 1),
(6, 2, '超级鸡腿堡', '超大鸡腿汉堡', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=super%20chicken%20burger%20large&image_size=square', 90, 0),
(6, 2, '咖喱鸡块饭', '日式咖喱饭', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=curry%20chicken%20rice%20Japanese&image_size=square', 60, 0),
(6, 3, '薯条(大)', '金黄酥脆薯条', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20french%20fries%20large&image_size=square', 120, 0),
(6, 3, '玉米浓汤', '香浓玉米汤', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=corn%20soup%20creamy%20bowl&image_size=square', 70, 0),
(6, 4, '百事可乐', '冰爽百事', 10.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Pepsi%20cola%20drink%20ice&image_size=square', 200, 0),
(6, 5, '菠萝派', '香甜菠萝派', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pineapple%20pie%20fried%20sweet&image_size=square', 80, 0),
(6, 5, '蛋卷冰淇淋', '香甜冰淇淋', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=soft%20serve%20ice%20cream%20cone&image_size=square', 120, 0);

-- 插入顾客数据
INSERT INTO customers (username, password, email, phone, nickname) VALUES
('user1', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'user1@example.com', '13800138001', '美食达人'),
('user2', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'user2@example.com', '13800138002', '外卖小王子'),
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'admin@shop.com', '13800138000', '管理员');

-- 插入地址数据
INSERT INTO addresses (customer_id, name, phone, province, city, district, detail, is_default) VALUES
(1, '张三', '13800138001', '北京市', '北京市', '朝阳区', '望京SOHO T1楼1001室', 1),
(1, '李四', '13800138001', '北京市', '北京市', '海淀区', '中关村大街1号', 0),
(2, '王五', '13800138002', '北京市', '北京市', '东城区', '王府井大街100号', 1);

-- 创建视图
CREATE VIEW shop_product_view AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.description as product_desc,
    p.price,
    p.image_url as product_image,
    p.is_featured,
    s.id as shop_id,
    s.name as shop_name,
    s.image_url as shop_image,
    s.rating,
    s.delivery_time,
    s.delivery_fee,
    c.name as category_name,
    c.icon as category_icon
FROM products p
JOIN shops s ON p.shop_id = s.id
LEFT JOIN categories c ON p.category_id = c.id;

-- 创建视图：订单详情
CREATE VIEW order_detail_view AS
SELECT 
    o.id as order_id,
    o.order_no,
    o.total_amount,
    o.delivery_fee,
    o.status,
    o.created_at,
    c.username,
    c.phone as customer_phone,
    s.name as shop_name,
    a.detail as address_detail,
    a.name as receiver_name,
    a.phone as receiver_phone
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN shops s ON o.shop_id = s.id
JOIN addresses a ON o.address_id = a.id;

-- 创建存储过程：获取商家商品
DELIMITER //
CREATE PROCEDURE GetShopProducts(IN shopId INT)
BEGIN
    SELECT 
        p.*,
        c.name as category_name,
        c.icon as category_icon
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.shop_id = shopId
    ORDER BY p.is_featured DESC, p.sort_order;
END //
DELIMITER ;

-- 创建存储过程：获取分类商品
DELIMITER //
CREATE PROCEDURE GetCategoryProducts(IN categoryId INT)
BEGIN
    SELECT 
        p.*,
        s.name as shop_name,
        s.image_url as shop_image,
        s.rating,
        s.delivery_time
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.category_id = categoryId
    ORDER BY p.price DESC;
END //
DELIMITER ;

-- 创建存储过程：获取顾客订单
DELIMITER //
CREATE PROCEDURE GetCustomerOrders(IN customerId INT)
BEGIN
    SELECT 
        o.*,
        s.name as shop_name,
        s.image_url as shop_image
    FROM orders o
    JOIN shops s ON o.shop_id = s.id
    WHERE o.customer_id = customerId
    ORDER BY o.created_at DESC;
END //
DELIMITER ;

-- 创建触发器：下单后更新库存
DELIMITER //
CREATE TRIGGER UpdateStockAfterOrder
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock = stock - NEW.quantity 
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- 创建触发器：取消订单恢复库存
DELIMITER //
CREATE TRIGGER RestoreStockOnCancel
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE order_items oi
        JOIN products p ON oi.product_id = p.id
        SET p.stock = p.stock + oi.quantity
        WHERE oi.order_id = NEW.id;
    END IF;
END //
DELIMITER ;

-- 创建用户并授权
CREATE USER IF NOT EXISTS 'shop_admin'@'localhost' IDENTIFIED BY 'Shop123456';
GRANT ALL PRIVILEGES ON shop_delivery.* TO 'shop_admin'@'localhost';
FLUSH PRIVILEGES;

SELECT '数据库初始化完成！' AS message;
