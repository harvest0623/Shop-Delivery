-- ============================================
-- Shop Delivery System - Complete Database Setup
-- Includes: Tables, Views, Stored Procedures, Triggers, Initial Data
-- ============================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS shop_delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shop_delivery;

-- 2. Create User and Grant Privileges
DROP USER IF EXISTS 'shop_admin'@'localhost';
CREATE USER 'shop_admin'@'localhost' IDENTIFIED BY 'shop123456';
GRANT ALL PRIVILEGES ON shop_delivery.* TO 'shop_admin'@'localhost';
FLUSH PRIVILEGES;

-- 3. Drop existing tables and views
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS shops;
DROP VIEW IF EXISTS order_detail_view;
DROP VIEW IF EXISTS shop_product_view;
DROP VIEW IF EXISTS sales_summary_view;
DROP VIEW IF EXISTS customer_order_view;
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Create Tables

-- 4.1 Shops Table
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
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Shops Information';

-- 4.2 Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(100),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Product Categories';

-- 4.3 Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shop_id INT NOT NULL,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock INT DEFAULT 100,
    is_featured TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='Products Information';

-- 4.4 Customers Table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    nickname VARCHAR(50),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Customers Information';

-- 4.5 Addresses Table
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    name VARCHAR(50),
    phone VARCHAR(20),
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    detail VARCHAR(255),
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Delivery Addresses';

-- 4.6 Cart Table
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (customer_id, product_id)
) ENGINE=InnoDB COMMENT='Shopping Cart';

-- 4.7 Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    shop_id INT NOT NULL,
    address_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending',
    order_no VARCHAR(50) UNIQUE,
    remark TEXT,
    return_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL
) ENGINE=InnoDB COMMENT='Orders';

-- 4.8 Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='Order Items';

-- 5. Create Views

-- 5.1 Order Detail View
CREATE VIEW order_detail_view AS
SELECT 
    o.id AS order_id,
    o.order_no,
    o.total_amount,
    o.delivery_fee,
    o.status,
    o.remark,
    o.return_reason,
    o.created_at,
    c.username,
    c.phone AS customer_phone,
    c.nickname,
    s.name AS shop_name,
    s.image_url AS shop_image,
    CONCAT(a.province, a.city, a.district, a.detail) AS address_detail,
    a.name AS receiver_name,
    a.phone AS receiver_phone
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN shops s ON o.shop_id = s.id
LEFT JOIN addresses a ON o.address_id = a.id;

-- 5.2 Shop Product View
CREATE VIEW shop_product_view AS
SELECT 
    p.id AS product_id,
    p.name AS product_name,
    p.description AS product_desc,
    p.price,
    p.image_url AS product_image,
    p.stock,
    p.is_featured,
    s.id AS shop_id,
    s.name AS shop_name,
    s.image_url AS shop_image,
    s.rating,
    s.delivery_time,
    s.delivery_fee,
    c.name AS category_name,
    c.icon AS category_icon
FROM products p
JOIN shops s ON p.shop_id = s.id
LEFT JOIN categories c ON p.category_id = c.id;

-- 5.3 Sales Summary View
CREATE VIEW sales_summary_view AS
SELECT 
    s.id AS shop_id,
    s.name AS shop_name,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) AS total_sales,
    SUM(CASE WHEN o.status = 'returned' THEN o.total_amount ELSE 0 END) AS total_returns,
    SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) - 
    SUM(CASE WHEN o.status = 'returned' THEN o.total_amount ELSE 0 END) AS net_sales,
    COUNT(CASE WHEN o.status = 'completed' THEN 1 END) AS completed_orders,
    COUNT(CASE WHEN o.status = 'returned' THEN 1 END) AS returned_orders,
    COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) AS cancelled_orders
FROM shops s
LEFT JOIN orders o ON s.id = o.shop_id
GROUP BY s.id, s.name;

-- 5.4 Customer Order View
CREATE VIEW customer_order_view AS
SELECT 
    c.id AS customer_id,
    c.username,
    c.nickname,
    COUNT(o.id) AS total_orders,
    SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) AS total_spent,
    MAX(o.created_at) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.username, c.nickname;

-- 6. Create Stored Procedures

-- 6.1 Create Order Procedure
DELIMITER //
CREATE PROCEDURE CreateOrder(
    IN p_customer_id INT,
    IN p_shop_id INT,
    IN p_address_id INT,
    IN p_total_amount DECIMAL(10,2),
    IN p_delivery_fee DECIMAL(5,2),
    IN p_remark TEXT
)
BEGIN
    DECLARE v_order_no VARCHAR(50);
    DECLARE v_order_id INT;
    
    SET v_order_no = CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 10000), 4, '0'));
    
    INSERT INTO orders (customer_id, shop_id, address_id, total_amount, delivery_fee, status, order_no, remark)
    VALUES (p_customer_id, p_shop_id, p_address_id, p_total_amount, p_delivery_fee, 'pending', v_order_no, p_remark);
    
    SET v_order_id = LAST_INSERT_ID();
    
    SELECT v_order_id AS order_id, v_order_no AS order_no;
END //
DELIMITER ;

-- 6.2 Process Return Procedure
DELIMITER //
CREATE PROCEDURE ProcessReturn(
    IN p_order_id INT,
    IN p_reason VARCHAR(255)
)
BEGIN
    DECLARE v_status VARCHAR(20);
    
    SELECT status INTO v_status FROM orders WHERE id = p_order_id;
    
    IF v_status = 'completed' THEN
        UPDATE orders 
        SET status = 'returned', return_reason = p_reason, updated_at = NOW()
        WHERE id = p_order_id;
        
        SELECT 'Return Success' AS message, p_order_id AS order_id;
    ELSE
        SELECT 'Order status does not allow return' AS message, p_order_id AS order_id;
    END IF;
END //
DELIMITER ;

-- 6.3 Get Sales Statistics Procedure
DELIMITER //
CREATE PROCEDURE GetSalesStatistics(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        COUNT(*) AS total_orders,
        SUM(total_amount) AS total_amount,
        SUM(delivery_fee) AS total_delivery_fee,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count,
        COUNT(CASE WHEN status = 'returned' THEN 1 END) AS returned_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count
    FROM orders
    WHERE DATE(created_at) BETWEEN p_start_date AND p_end_date;
END //
DELIMITER ;

-- 6.4 Add to Cart Procedure
DELIMITER //
CREATE PROCEDURE AddToCart(
    IN p_customer_id INT,
    IN p_product_id INT,
    IN p_quantity INT
)
BEGIN
    DECLARE v_stock INT;
    DECLARE v_exists INT;
    
    SELECT stock INTO v_stock FROM products WHERE id = p_product_id;
    
    IF v_stock < p_quantity THEN
        SELECT 'Insufficient stock' AS message;
    ELSE
        SELECT COUNT(*) INTO v_exists FROM cart 
        WHERE customer_id = p_customer_id AND product_id = p_product_id;
        
        IF v_exists > 0 THEN
            UPDATE cart SET quantity = quantity + p_quantity, updated_at = NOW()
            WHERE customer_id = p_customer_id AND product_id = p_product_id;
        ELSE
            INSERT INTO cart (customer_id, product_id, quantity)
            VALUES (p_customer_id, p_product_id, p_quantity);
        END IF;
        
        SELECT 'Added successfully' AS message;
    END IF;
END //
DELIMITER ;

-- 7. Create Triggers

-- 7.1 Stock Reduction Trigger on Order Insert
DELIMITER //
CREATE TRIGGER trg_after_order_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock = stock - NEW.quantity
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- 7.2 Stock Recovery Trigger on Order Return
DELIMITER //
CREATE TRIGGER trg_after_order_return
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != 'returned' AND NEW.status = 'returned' THEN
        UPDATE products p
        JOIN order_items oi ON p.id = oi.product_id
        SET p.stock = p.stock + oi.quantity
        WHERE oi.order_id = NEW.id;
    END IF;
END //
DELIMITER ;

-- 7.3 Stock Recovery Trigger on Order Cancel
DELIMITER //
CREATE TRIGGER trg_after_order_cancel
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        UPDATE products p
        JOIN order_items oi ON p.id = oi.product_id
        SET p.stock = p.stock + oi.quantity
        WHERE oi.order_id = NEW.id;
    END IF;
END //
DELIMITER ;

-- 8. Insert Initial Data

-- 8.1 Categories
INSERT INTO categories (name, icon, sort_order) VALUES
('Hot Dishes', 'fire', 1),
('Main Food', 'rice', 2),
('Snacks', 'fries', 3),
('Drinks', 'drink', 4),
('Desserts', 'cake', 5),
('Set Meals', 'bento', 6),
('BBQ', 'meat', 7),
('Japanese', 'sushi', 8),
('Milk Tea', 'bubble-tea', 9),
('Sichuan', 'spicy', 10);

-- 8.2 Shops
INSERT INTO shops (name, description, address, phone, image_url, rating, delivery_time, delivery_fee, min_order) VALUES
('KFC', 'Global Famous Fried Chicken Chain', 'Wangfujing Street 1, Dongcheng District, Beijing', '400-888-8890', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop', 4.8, 25, 3.00, 20.00),
('McDonald\'s', 'World\'s Largest Fast Food Chain', 'Xidan North Street 100, Xicheng District, Beijing', '400-888-8891', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop', 4.7, 28, 3.00, 15.00),
('Pizza Hut', 'Global Famous Pizza Chain', 'Wangjing Street 9, Chaoyang District, Beijing', '400-888-8892', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', 4.6, 30, 5.00, 30.00),
('Burger King', 'Famous for Flame-Grilled Burgers', 'Zhongguancun Street 1, Haidian District, Beijing', '400-888-8893', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop', 4.5, 32, 4.00, 25.00),
('Starbucks', 'Global Famous Coffee Chain', 'Guomao Center, Chaoyang District, Beijing', '400-888-8895', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop', 4.9, 20, 0.00, 35.00),
('Dicos', 'Chinese Local Fast Food Brand', 'Wanda Plaza, Tongzhou District, Beijing', '400-888-8896', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop', 4.4, 25, 3.00, 18.00),
('HeyTea', 'Pioneer of New Style Tea Drinks', 'Sanlitun Taikoo Li, Chaoyang District, Beijing', '400-888-8897', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop', 4.8, 30, 2.00, 25.00),
('Haidilao', 'Best Service Hot Pot', 'Wangjing Street 88, Chaoyang District, Beijing', '400-888-8898', 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop', 4.9, 45, 5.00, 50.00),
('Xibei Youmian Village', 'Northwest Cuisine Chain', 'Xizhiwai Street 1, Haidian District, Beijing', '400-888-8899', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 4.6, 35, 4.00, 40.00),
('Luckin Coffee', 'Chinese Local Coffee Brand', 'Jianguomennei Street 8, Dongcheng District, Beijing', '400-888-8900', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', 4.5, 20, 0.00, 20.00),
('Nayuki Tea', 'Premium Tea Brand', 'Financial Street Shopping Center, Xicheng District, Beijing', '400-888-8901', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop', 4.7, 35, 3.00, 30.00),
('Kung Fu Catering', 'Chinese Fast Food Chain', 'Fangzhuang Road 2, Fengtai District, Beijing', '400-888-8902', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop', 4.3, 25, 2.00, 15.00),
('Xiabu Xiabu', 'Taiwanese Mini Hot Pot', 'Huilongguan West Street, Changping District, Beijing', '400-888-8903', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', 4.4, 30, 3.00, 35.00),
('Yonghe King', 'Chinese Breakfast Chain', 'Liyuan Road 10, Tongzhou District, Beijing', '400-888-8904', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', 4.2, 20, 1.00, 12.00),
('Mixue Ice Cream', 'Affordable Tea Brand', 'Huangcun West Street, Daxing District, Beijing', '400-888-8905', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop', 4.5, 25, 0.00, 10.00),
('Lao Xiang Ji', 'Chinese Fast Food Brand', 'Tianzhu Road 5, Shunyi District, Beijing', '400-888-8906', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', 4.3, 28, 2.00, 18.00),
('Hefu Noodles', 'Healthy Noodles in Study Room', 'Wangjing SOHO, Chaoyang District, Beijing', '400-888-8907', 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=300&fit=crop', 4.6, 30, 3.00, 25.00),
('Zhang Liang Malatang', 'Famous Malatang Chain', 'Wudaokou, Haidian District, Beijing', '400-888-8908', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', 4.4, 25, 1.00, 15.00);

-- 8.3 Customers (password is bcrypt hashed 'admin')
INSERT INTO customers (username, password, email, phone, nickname) VALUES
('admin', '$2a$10$YourHashedPasswordHere', 'admin@shop.com', '13800138000', 'Administrator'),
('user1', '$2a$10$YourHashedPasswordHere', 'user1@example.com', '13800138001', 'Foodie'),
('user2', '$2a$10$YourHashedPasswordHere', 'user2@example.com', '13800138002', 'Delivery Prince'),
('zhangsan', '$2a$10$YourHashedPasswordHere', 'zhangsan@example.com', '13900139001', 'Zhang San'),
('lisi', '$2a$10$YourHashedPasswordHere', 'lisi@example.com', '13900139002', 'Li Si');

-- 8.4 Addresses
INSERT INTO addresses (customer_id, name, phone, province, city, district, detail, is_default) VALUES
(1, 'Admin', '13800138000', 'Beijing', 'Beijing', 'Chaoyang', 'Wangjing SOHO T1 1001', 1),
(1, 'Admin', '13800138000', 'Beijing', 'Beijing', 'Haidian', 'Zhongguancun Street 1', 0),
(2, 'Zhang San', '13800138001', 'Beijing', 'Beijing', 'Chaoyang', 'Wangjing Street 88', 1),
(3, 'Wang Wu', '13800138002', 'Beijing', 'Beijing', 'Dongcheng', 'Wangfujing Street 100', 1),
(4, 'Zhang San', '13900139001', 'Beijing', 'Beijing', 'Xicheng', 'Xidan North Street 50', 1),
(5, 'Li Si', '13900139002', 'Beijing', 'Beijing', 'Fengtai', 'Fangzhuang Road 20', 1);

-- 8.5 Products (8 products per shop)
-- KFC Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(1, 1, 'Original Recipe Chicken', 'Classic crispy fried chicken', 28.00, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop', 100, 1),
(1, 1, 'Spicy Chicken Wings', '6 pieces of spicy chicken wings', 32.00, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&h=400&fit=crop', 80, 1),
(1, 2, 'Beijing Chicken Wrap', 'Classic Beijing flavor chicken wrap', 25.00, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop', 70, 0),
(1, 2, 'Orleans Roasted Chicken Burger', 'Tender Orleans roasted chicken', 28.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 90, 0),
(1, 3, 'Colonel Nuggets', '10 pieces of golden nuggets', 26.00, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&h=400&fit=crop', 85, 0),
(1, 3, 'French Fries (Medium)', 'Golden crispy fries', 15.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop', 120, 0),
(1, 4, 'Nine Treasures Juice', 'Refreshing nine-fruit blend', 12.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', 100, 0),
(1, 5, 'Egg Tart (6pcs)', 'Sweet Portuguese egg tart', 22.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', 60, 0);

-- McDonald's Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(2, 1, 'Big Mac', 'Double beef burger', 35.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 120, 1),
(2, 1, 'McSpicy Chicken Burger', 'Spicy chicken burger', 28.00, 'https://images.unsplash.com/photo-1619250907682-6625547d6905?w=400&h=400&fit=crop', 100, 1),
(2, 2, 'Grilled Chicken Burger', 'Tender grilled chicken', 30.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 90, 0),
(2, 2, 'McChicken', 'Classic chicken burger', 22.00, 'https://images.unsplash.com/photo-1619250907682-6625547d6905?w=400&h=400&fit=crop', 110, 0),
(2, 3, 'French Fries (Large)', 'Extra large fries', 18.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop', 150, 0),
(2, 3, 'Chicken Nuggets (6pcs)', 'Golden nuggets', 22.00, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&h=400&fit=crop', 100, 0),
(2, 4, 'Coke (Medium)', 'Iced cola', 10.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', 200, 0),
(2, 5, 'McFlurry', 'Oreo ice cream', 22.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 80, 1);

-- Pizza Hut Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(3, 1, 'Super Supreme Pizza', 'Multi-topping classic pizza', 88.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop', 50, 1),
(3, 1, 'Hawaiian Pizza', 'Pineapple and ham flavor', 78.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop', 60, 1),
(3, 2, 'Cheese Pizza', 'Rich cheese pull', 68.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop', 70, 0),
(3, 2, 'Spaghetti Bolognese', 'Classic Italian meat sauce pasta', 38.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 80, 0),
(3, 3, 'Garlic Bread', 'Fragrant garlic bread', 22.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', 90, 0),
(3, 3, 'Wings Platter', '12 pieces of wings', 48.00, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&h=400&fit=crop', 55, 0),
(3, 4, 'Americano', 'Rich black coffee', 18.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', 100, 0),
(3, 5, 'Tiramisu', 'Classic Italian dessert', 28.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 40, 0);

-- Burger King Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(4, 1, 'Whopper', 'Flame-grilled beef burger', 38.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 100, 1),
(4, 1, 'Double Whopper', 'Double beef flame-grilled', 48.00, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop', 70, 1),
(4, 2, 'Bacon Cheese Burger', 'Bacon cheese beef burger', 42.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 85, 0),
(4, 2, 'Chicken Sandwich', 'Crispy chicken sandwich', 32.00, 'https://images.unsplash.com/photo-1619250907682-6625547d6905?w=400&h=400&fit=crop', 90, 0),
(4, 3, 'Chicken Fries', '10 pieces of crispy chicken fries', 25.00, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&h=400&fit=crop', 150, 0),
(4, 3, 'Onion Rings', 'Golden onion rings', 18.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop', 80, 0),
(4, 4, 'Vanilla Milkshake', 'Creamy vanilla milkshake', 24.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', 60, 0),
(4, 4, 'Chocolate Milkshake', 'Rich chocolate milkshake', 24.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=400&fit=crop', 60, 0);

-- Starbucks Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(5, 1, 'Caramel Macchiato', 'Sweet caramel coffee', 38.00, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop', 100, 1),
(5, 1, 'Matcha Latte', 'Japanese matcha latte', 36.00, 'https://images.unsplash.com/photo-1515823664972-6d66e79bc394?w=400&h=400&fit=crop', 80, 1),
(5, 4, 'Americano', 'Classic black coffee', 26.00, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop', 120, 0),
(5, 4, 'Latte', 'Classic latte', 32.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop', 110, 0),
(5, 4, 'Mocha Frappuccino', 'Iced mocha coffee', 42.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 70, 0),
(5, 5, 'Blueberry Muffin', 'Fresh blueberry cake', 22.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', 60, 0),
(5, 5, 'Cheesecake', 'Classic cheesecake', 32.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop', 50, 0),
(5, 4, 'Hot Chocolate', 'Rich hot cocoa', 30.00, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop', 90, 0);

-- Dicos Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(6, 1, 'Crispy Fried Chicken', 'Dicos signature fried chicken', 26.00, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop', 100, 1),
(6, 1, 'Spicy Chicken Wings', '4 pieces of spicy chicken wings', 20.00, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=400&h=400&fit=crop', 80, 1),
(6, 2, 'Super Chicken Burger', 'Extra large chicken burger', 28.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', 90, 0),
(6, 2, 'Curry Chicken Rice', 'Japanese curry rice', 28.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 60, 0),
(6, 3, 'French Fries (Large)', 'Golden crispy fries', 15.00, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop', 120, 0),
(6, 3, 'Corn Soup', 'Creamy corn soup', 15.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', 70, 0),
(6, 4, 'Pepsi', 'Iced Pepsi', 10.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop', 200, 0),
(6, 5, 'Pineapple Pie', 'Sweet pineapple pie', 12.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 80, 0);

-- HeyTea Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(7, 9, 'Very Grape', 'Fresh grape + cheese foam', 32.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 100, 1),
(7, 9, 'Very Strawberry', 'Fresh strawberry + cheese', 36.00, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', 80, 1),
(7, 9, 'Brown Sugar Bubble Milk', 'Brown sugar pearls + fresh milk', 28.00, 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', 90, 0),
(7, 9, 'Grapefruit Tea', 'Grapefruit fruit tea', 25.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop', 85, 0),
(7, 9, 'Taro Bubble Tea', 'Taro + bubble', 26.00, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 70, 0),
(7, 5, 'Taro Cake', 'Taro cream cake', 22.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', 50, 0),
(7, 9, 'Pure Green Tea', 'Jasmine green tea', 18.00, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop', 120, 0),
(7, 9, 'Coconut Pudding Milk', 'Coconut milk + pudding', 29.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop', 75, 0);

-- Haidilao Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(8, 7, 'Signature Shrimp Paste', 'Handmade fresh shrimp paste', 48.00, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', 60, 1),
(8, 7, 'Beef Tripe', 'Seven-up eight-down fresh tripe', 58.00, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', 50, 1),
(8, 7, 'Tender Beef', 'Selected tender beef slices', 52.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 55, 1),
(8, 7, 'Duck Intestine', 'Crispy duck intestine', 38.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 45, 0),
(8, 7, 'Beef Throat', 'Beef throat', 42.00, 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=400&fit=crop', 40, 0),
(8, 7, 'Enoki Mushroom', 'Fresh enoki mushroom', 18.00, 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=400&fit=crop', 100, 0),
(8, 7, 'Potato Slices', 'Thin-cut potato slices', 12.00, 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', 120, 0),
(8, 7, 'Yin-Yang Hot Pot Base', 'Spicy + Clear soup', 68.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', 40, 1);

-- Xibei Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(9, 2, 'Youmian Fish Fish', 'Handmade youmian', 32.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 70, 1),
(9, 2, 'Roasted Lamb Ribs', 'Inner Mongolia roasted lamb ribs', 128.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 30, 1),
(9, 2, 'Yellow Rice Cake', 'Shanxi specialty cold cake', 28.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop', 50, 0),
(9, 2, 'Cold Noodles', 'Northwest flavor cold noodles', 22.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 80, 0),
(9, 2, 'Roujiamo', 'Shaanxi roujiamo', 18.00, 'https://images.unsplash.com/photo-1626200419199-391b6a87d7b3?w=400&h=400&fit=crop', 100, 0),
(9, 2, 'Lamb Skewers', '5 pieces of roasted lamb skewers', 35.00, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', 60, 0),
(9, 2, 'Sour Soup Fish', 'Guizhou sour soup fish', 88.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', 35, 0),
(9, 2, 'Big Plate Chicken', 'Xinjiang big plate chicken', 78.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 40, 0);

-- Luckin Coffee Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(10, 4, 'Coconut Latte', 'Coconut milk + espresso', 29.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', 150, 1),
(10, 4, 'Thick Milk Latte', 'Thick milk + coffee', 26.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', 120, 1),
(10, 4, 'Velvet Latte', 'Velvet milk + coffee', 28.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 100, 0),
(10, 4, 'Americano', 'Classic Americano', 21.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop', 200, 0),
(10, 4, 'Meteorite Latte', 'Brown sugar pearls + coffee', 32.00, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop', 80, 0),
(10, 5, 'Tiramisu Mochi', 'Tiramisu flavor', 16.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 60, 0),
(10, 5, 'Half-baked Cheesecake', 'Light cheesecake', 18.00, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop', 50, 0),
(10, 4, 'Coconut Cloud Latte', 'Coconut cloud foam + coffee', 32.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', 90, 1);

-- Nayuki Tea Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(11, 9, 'Supreme Cheese Strawberry', 'Strawberry + cheese foam', 36.00, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', 80, 1),
(11, 9, 'Supreme Orange', 'Full cup of fresh orange', 28.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', 90, 0),
(11, 9, 'Supreme Grape', 'Kyoho grape', 32.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 70, 0),
(11, 5, 'Strawberry Magic Stick', 'Strawberry bread', 22.00, 'https://images.unsplash.com/photo-1585476263060-b7a6b710f2a1?w=400&h=400&fit=crop', 50, 0),
(11, 5, 'Dudu Bun', 'Salted egg yolk dudu', 18.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', 60, 0),
(11, 9, 'Coconut Latte', 'Coconut milk coffee', 32.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', 85, 0),
(11, 9, 'Golden Mountain', 'Pure tea series', 22.00, 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&h=400&fit=crop', 100, 0),
(11, 5, 'Oreo Brulee', 'Brulee dessert', 25.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 45, 0);

-- Kung Fu Catering Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(12, 2, 'Braised Pork Ribs Rice', 'Signature ribs rice', 28.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 80, 1),
(12, 2, 'Mushroom Chicken Rice', 'Mushroom steamed chicken', 26.00, 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=400&fit=crop', 70, 1),
(12, 2, 'Pickled Vegetable Pork Rice', 'Taiwanese braised pork rice', 24.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 75, 0),
(12, 3, 'Steamed Egg', 'Smooth steamed egg', 8.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0),
(12, 3, 'Stewed Soup', 'Daily stewed soup', 15.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', 80, 0),
(12, 4, 'Soy Milk', 'Fresh soy milk', 6.00, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 150, 0),
(12, 2, 'Three Cup Chicken Rice', 'Three cup chicken set', 30.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 60, 0),
(12, 6, 'Double Set Meal', 'Two mains + soup + vegetable', 58.00, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop', 40, 1);

-- Xiabu Xiabu Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(13, 7, 'Single Set', 'Hot pot base + meat + vegetable', 48.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop', 60, 1),
(13, 7, 'Beef Slices', 'Selected beef slices', 38.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 70, 1),
(13, 7, 'Lamb Slices', 'New Zealand lamb', 42.00, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', 55, 0),
(13, 7, 'Vegetable Platter', 'Seasonal vegetable platter', 22.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', 80, 0),
(13, 7, 'Tofu', 'Soft tofu', 12.00, 'https://images.unsplash.com/photo-1628689469838-391b6a87d7b3?w=400&h=400&fit=crop', 90, 0),
(13, 7, 'Vermicelli', 'Sweet potato vermicelli', 10.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 100, 0),
(13, 4, 'Sour Plum Drink', 'Homemade sour plum drink', 12.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 120, 0),
(13, 7, 'Shrimp Paste', 'Handmade shrimp paste', 35.00, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', 50, 0);

-- Yonghe King Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(14, 2, 'Braised Pork Rice', 'Taiwanese braised pork rice', 22.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 80, 1),
(14, 2, 'Three Cup Chicken Rice', 'Taiwanese three cup chicken', 26.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 70, 0),
(14, 2, 'Kung Pao Chicken Rice', 'Classic kung pao chicken', 24.00, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', 75, 0),
(14, 3, 'Fried Dough Stick', 'Freshly fried dough stick', 6.00, 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=400&fit=crop', 150, 0),
(14, 3, 'Soy Milk', 'Fresh soy milk', 5.00, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&h=400&fit=crop', 200, 0),
(14, 3, 'Egg Pancake', 'Scallion egg pancake', 10.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0),
(14, 2, 'Beef Noodles', 'Braised beef noodles', 28.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 60, 0),
(14, 3, 'Xiao Long Bao', 'Fresh meat xiao long bao', 18.00, 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop', 80, 0);

-- Mixue Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(15, 9, 'Sky High Crispy', 'Ice cream cone', 3.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', 200, 1),
(15, 9, 'Lemon Water', 'Fresh lemon water', 4.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 300, 1),
(15, 9, 'Bubble Milk Tea', 'Classic bubble milk tea', 8.00, 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', 150, 0),
(15, 9, 'Strawberry Shake', 'Strawberry milkshake', 10.00, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop', 100, 0),
(15, 9, 'Passion Fruit Tea', 'Passion fruit tea', 9.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', 120, 0),
(15, 9, 'Fresh Orange Tea', 'Fresh orange fruit tea', 8.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=400&fit=crop', 130, 0),
(15, 9, 'Taro Grape', 'Taro + grape', 10.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 90, 0),
(15, 9, 'Cheese Foam Tea', 'Cheese foam green tea', 10.00, 'https://images.unsplash.com/photo-1558855410-3112e273353c?w=400&h=400&fit=crop', 100, 0);

-- Lao Xiang Ji Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(16, 2, 'Old Hen Soup', 'Signature old hen soup', 38.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop', 60, 1),
(16, 2, 'Scallion Oil Chicken', 'Tender scallion oil chicken', 32.00, 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=400&fit=crop', 50, 1),
(16, 2, 'Farmhouse Stir-fried Pork', 'Hunan stir-fried pork', 28.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop', 70, 0),
(16, 2, 'Braised Pork with Preserved', 'Classic braised pork', 35.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 45, 0),
(16, 2, 'Tomato Scrambled Eggs', 'Homestyle tomato scrambled eggs', 18.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 80, 0),
(16, 2, 'Braised Fish', 'Homestyle braised fish', 32.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=400&fit=crop', 40, 0),
(16, 3, 'Steamed Egg', 'Smooth steamed egg', 8.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0),
(16, 2, 'Farmhouse Bowl', 'Egg pork stir-fried with chili', 26.00, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop', 60, 0);

-- Hefu Noodles Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(17, 2, 'Herbal Pork Cartilage Noodles', 'Signature pork bone noodles', 38.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 60, 1),
(17, 2, 'Sour Soup Beef Noodles', 'Sour soup beef noodles', 42.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 50, 1),
(17, 2, 'Tomato Pork Cartilage Noodles', 'Tomato pork bone noodles', 38.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 55, 0),
(17, 2, 'Herbal Bamboo Noodles', 'Vegetarian noodles', 28.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 60, 0),
(17, 3, 'Soft-boiled Egg', 'Japanese soft-boiled egg', 8.00, 'https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400&h=400&fit=crop', 100, 0),
(17, 3, 'Braised Beef', 'Sliced braised beef', 22.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop', 50, 0),
(17, 3, 'Smashed Cucumber', 'Cold cucumber salad', 12.00, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop', 80, 0),
(17, 2, 'Mixed Noodles', 'Scallion oil mixed noodles', 22.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 70, 0);

-- Zhang Liang Malatang Products
INSERT INTO products (shop_id, category_id, name, description, price, image_url, stock, is_featured) VALUES
(18, 7, 'Classic Malatang', 'Self-select malatang', 25.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 100, 1),
(18, 7, 'Spicy Mix', 'Dry mix malatang', 25.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 80, 1),
(18, 7, 'Sour Spicy Noodles', 'Chongqing sour spicy noodles', 18.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 90, 0),
(18, 7, 'Potato Noodles', 'Clay pot potato noodles', 20.00, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop', 70, 0),
(18, 7, 'Rice Noodles', 'Crossing bridge rice noodles', 22.00, 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=400&h=400&fit=crop', 75, 0),
(18, 4, 'Sour Plum Drink', 'Homemade sour plum drink', 8.00, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&h=400&fit=crop', 120, 0),
(18, 3, 'Fried Skewers', 'Fried skewers platter', 20.00, 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop', 60, 0),
(18, 7, 'Mao Cai', 'Chengdu mao cai', 30.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', 50, 0);

-- 8.6 Cart Data
INSERT INTO cart (customer_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 5, 1),
(2, 10, 3),
(2, 15, 1),
(3, 20, 2),
(4, 25, 1),
(5, 30, 2);

-- 8.7 Orders Data
INSERT INTO orders (customer_id, shop_id, address_id, total_amount, delivery_fee, status, order_no, remark) VALUES
(1, 1, 1, 89.00, 3.00, 'completed', 'ORD202401150001', 'Extra spicy please'),
(1, 2, 1, 56.00, 3.00, 'completed', 'ORD202401150002', ''),
(2, 3, 3, 158.00, 5.00, 'completed', 'ORD202401160001', 'Birthday party'),
(2, 1, 3, 45.00, 3.00, 'returned', 'ORD202401160002', 'Taste not suitable'),
(3, 5, 4, 68.00, 0.00, 'completed', 'ORD202401170001', ''),
(3, 8, 4, 288.00, 5.00, 'completed', 'ORD202401170002', 'Four people dinner'),
(4, 7, 5, 64.00, 2.00, 'pending', 'ORD202401180001', ''),
(5, 10, 6, 55.00, 0.00, 'completed', 'ORD202401180002', ''),
(1, 9, 1, 128.00, 4.00, 'completed', 'ORD202401190001', ''),
(2, 11, 3, 72.00, 3.00, 'cancelled', 'ORD202401190002', 'Something came up');

-- 8.8 Order Items Data
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 2, 28.00),
(1, 3, 1, 25.00),
(1, 7, 2, 12.00),
(2, 10, 1, 35.00),
(2, 13, 1, 22.00),
(3, 17, 1, 88.00),
(3, 20, 1, 38.00),
(4, 1, 1, 28.00),
(4, 6, 1, 15.00),
(5, 41, 2, 38.00),
(6, 57, 1, 48.00),
(6, 58, 1, 58.00),
(6, 60, 1, 38.00),
(7, 49, 2, 32.00),
(8, 73, 2, 29.00),
(9, 65, 1, 128.00),
(10, 81, 2, 36.00);

-- 9. Update Return Reason
UPDATE orders SET return_reason = 'Taste not suitable, requesting return' WHERE id = 4;

SELECT 'Database initialization complete!' AS message;
