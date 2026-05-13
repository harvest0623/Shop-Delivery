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
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'admin@shop.com', '13800138000', 'Beijing');

-- 插入商家
INSERT INTO shops (name, description, address, phone, image_url) VALUES
('KFC', 'Original fried chicken restaurant', 'Dongcheng District', '400-888-8890', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20restaurant%20logo%20chicken%20bucket&image_size=square'),
('McDonalds', 'Fast food hamburger restaurant', 'Xicheng District', '400-888-8891', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McDonalds%20logo%20golden%20arches&image_size=square'),
('Pizza Hut', 'Italian pizza delivery', 'Chaoyang District', '400-888-8892', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Pizza%20Hut%20logo%20pizza%20slice&image_size=square'),
('Burger King', 'Flame grilled burgers', 'Haidian District', '400-888-8893', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Burger%20King%20logo%20burger&image_size=square'),
('Starbucks', 'Premium coffee drinks', 'Shijingshan District', '400-888-8895', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Starbucks%20logo%20coffee%20cup&image_size=square'),
('Subway', 'Fresh submarine sandwiches', 'Fengtai District', '400-888-8894', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Subway%20logo%20sandwich&image_size=square'),
('Dicos', 'Chinese fast food chain', 'Tongzhou District', '400-888-8896', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20fast%20food%20chicken%20logo&image_size=square'),
('Jollibee', 'Filipino fried chicken', 'Changping District', '400-888-8897', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Filipino%20fried%20chicken%20bee%20logo&image_size=square');

-- KFC (shop_id=1)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(1, 'Original Fried Chicken', 'Crispy outside tender inside', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20original%20fried%20chicken&image_size=square', 100),
(1, 'Spicy Chicken Wings', 'Hot and spicy wings', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20spicy%20chicken%20wings&image_size=square', 80),
(1, 'Hamburger Combo', 'Hamburger + fries + drink', 45.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20burger%20meal%20combo&image_size=square', 60),
(1, 'Colonel Chicken Bucket', '10 pieces fried chicken', 88.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20chicken%20bucket&image_size=square', 40),
(1, 'Mashed Potato', 'Creamy mashed potato', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mashed%20potato%20bowl&image_size=square', 90);

-- McDonalds (shop_id=2)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(2, 'Big Mac', 'Double beef burger with special sauce', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Big%20Mac%20hamburger&image_size=square', 120),
(2, 'French Fries', 'Golden crispy fries', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McDonalds%20french%20fries&image_size=square', 200),
(2, 'McFlurry', 'Ice cream with Oreo', 20.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McFlurry%20ice%20cream&image_size=square', 80),
(2, 'Cheeseburger', 'Classic cheese burger', 25.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheeseburger%20hamburger&image_size=square', 150),
(2, 'Chicken McNuggets', '6 pieces nuggets', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20nuggets%206%20pieces&image_size=square', 100);

-- Pizza Hut (shop_id=3)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(3, 'Pepperoni Pizza', 'Classic pepperoni pizza', 68.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pepperoni%20pizza%20cheese&image_size=square', 50),
(3, 'Cheese Pizza', 'Four cheese pizza', 58.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=four%20cheese%20pizza&image_size=square', 50),
(3, 'Supreme Pizza', 'All toppings pizza', 78.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=supreme%20pizza%20all%20toppings&image_size=square', 40),
(3, 'Garlic Bread', 'Cheese garlic bread', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=garlic%20bread%20cheese&image_size=square', 80),
(3, 'Chicken Wings', 'Buffalo style wings', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=buffalo%20chicken%20wings&image_size=square', 60);

-- Burger King (shop_id=4)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(4, 'Whopper', 'Flame grilled beef burger', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Whopper%20burger%20flame%20grilled&image_size=square', 100),
(4, 'Chicken Fries', 'Crispy chicken strips', 25.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20fries%20strips&image_size=square', 150),
(4, 'Onion Rings', 'Golden onion rings', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20onion%20rings&image_size=square', 80),
(4, 'Double Whopper', 'Double patty burger', 48.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=double%20whopper%20burger&image_size=square', 60),
(4, 'Chicken Sandwich', 'Crispy chicken filet', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=crispy%20chicken%20sandwich&image_size=square', 90);

-- Starbucks (shop_id=5)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(5, 'Caramel Macchiato', 'Hot coffee with caramel', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=caramel%20macchiato%20coffee%20cup&image_size=square', 100),
(5, 'Matcha Latte', 'Green tea latte', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=matcha%20green%20tea%20latte&image_size=square', 80),
(5, 'Blueberry Muffin', 'Fresh baked muffin', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=blueberry%20muffin&image_size=square', 60),
(5, 'Mocha Frappuccino', 'Iced blended mocha', 42.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mocha%20frappuccino%20iced%20coffee&image_size=square', 70),
(5, 'Cheesecake Slice', 'Classic cheesecake', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=classic%20cheesecake%20slice&image_size=square', 50);

-- Subway (shop_id=6)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(6, 'Turkey Sub', 'Fresh turkey sandwich', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=turkey%20submarine%20sandwich&image_size=square', 60),
(6, 'Veggie Delight', 'Vegetarian sandwich', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=vegetarian%20sandwich%20veggies&image_size=square', 70),
(6, 'Chicken Caesar Salad', 'Fresh salad with chicken', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=caesar%20salad%20chicken&image_size=square', 50),
(6, 'Italian BMT', 'Salami pepperoni sandwich', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Italian%20BMT%20sandwich&image_size=square', 80),
(6, 'Tuna Sub', 'Tuna fish sandwich', 30.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=tuna%20fish%20sandwich&image_size=square', 90);

-- Dicos (shop_id=7)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(7, 'Crispy Chicken', 'Chinese style fried chicken', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20crispy%20fried%20chicken&image_size=square', 100),
(7, 'Beef Burger', 'Juicy beef patty burger', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=juicy%20beef%20burger&image_size=square', 80),
(7, 'Corn Soup', 'Creamy corn soup', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=creamy%20corn%20soup&image_size=square', 50),
(7, 'Spicy Chicken Burger', 'Hot and spicy chicken', 30.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20chicken%20burger&image_size=square', 70),
(7, 'Fried Rice', 'Yangzhou fried rice', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Yangzhou%20fried%20rice&image_size=square', 60);

-- Jollibee (shop_id=8)
INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(8, 'Chickenjoy', 'Filipino style fried chicken', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Filipino%20fried%20chicken%20crispy&image_size=square', 80),
(8, 'Jolly Spaghetti', 'Sweet spaghetti with meatballs', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Filipino%20sweet%20spaghetti%20meatballs&image_size=square', 60),
(8, 'Peach Mango Pie', 'Sweet fruit pie', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=peach%20mango%20pie&image_size=square', 40),
(8, 'Yumburger', 'Filipino hamburger', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Filipino%20hamburger&image_size=square', 90),
(8, 'Chicken Burger Steak', 'With mushroom gravy', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20burger%20steak%20gravy&image_size=square', 50);

-- 验证插入
SELECT 
    s.id as shop_id, 
    s.name as shop_name, 
    COUNT(p.id) as product_count 
FROM shops s 
LEFT JOIN products p ON s.id = p.shop_id 
GROUP BY s.id, s.name;

SELECT 'Data initialized successfully!' AS message;
