USE shop_delivery;

INSERT INTO shops (name, description, address, phone, image_url) VALUES
('KFC', 'Original fried chicken restaurant', 'Dongcheng District', '400-888-8890', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=KFC%20restaurant%20exterior%20modern%20signage&image_size=square'),
('McDonalds', 'Fast food hamburger restaurant', 'Xicheng District', '400-888-8891', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McDonalds%20restaurant%20exterior%20golden%20arches&image_size=square'),
('Pizza Hut', 'Italian pizza delivery', 'Chaoyang District', '400-888-8892', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Pizza%20Hut%20restaurant%20exterior%20pizza%20sign&image_size=square'),
('Burger King', 'Flame grilled burgers', 'Haidian District', '400-888-8893', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Burger%20King%20restaurant%20exterior%20logo&image_size=square'),
('Subway', 'Fresh submarine sandwiches', 'Fengtai District', '400-888-8894', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Subway%20restaurant%20exterior%20sandwich%20logo&image_size=square'),
('Starbucks', 'Premium coffee drinks', 'Shijingshan District', '400-888-8895', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Starbucks%20coffee%20shop%20exterior%20green%20logo&image_size=square'),
('Dicos', 'Chinese fast food chain', 'Tongzhou District', '400-888-8896', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Dicos%20restaurant%20exterior%20Chinese%20fast%20food&image_size=square'),
('Jollibee', 'Filipino fried chicken', 'Changping District', '400-888-8897', 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Jollibee%20restaurant%20exterior%20bee%20logo&image_size=square');

INSERT INTO products (shop_id, name, description, price, image_url, stock) VALUES
(1, 'Original Fried Chicken', 'Crispy outside tender inside', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=crispy%20fried%20chicken%20pieces%20golden&image_size=square', 100),
(1, 'Spicy Chicken Wings', 'Hot and spicy wings', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spicy%20fried%20chicken%20wings&image_size=square', 80),
(1, 'Hamburger Combo', 'Hamburger + fries + drink', 45.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=hamburger%20meal%20combo%20fries%20drink&image_size=square', 60),
(2, 'Big Mac', 'Double beef burger with special sauce', 35.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Big%20Mac%20hamburger%20double%20patty&image_size=square', 120),
(2, 'French Fries', 'Golden crispy fries', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20french%20fries%20crispy&image_size=square', 200),
(2, 'McFlurry', 'Ice cream with Oreo cookies', 20.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=McFlurry%20ice%20cream%20Oreo%20chocolate&image_size=square', 80),
(3, 'Pepperoni Pizza', 'Classic pepperoni pizza', 58.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pepperoni%20pizza%20cheese%20melted&image_size=square', 50),
(3, 'Cheese Pizza', 'Four cheese pizza', 48.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cheese%20pizza%20four%20cheeses&image_size=square', 50),
(3, 'Supreme Pizza', 'All toppings pizza', 68.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=supreme%20pizza%20all%20vegetables%20meat&image_size=square', 40),
(4, 'Whopper', 'Flame grilled beef burger', 38.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Whopper%20burger%20flame%20grilled&image_size=square', 100),
(4, 'Chicken Fries', 'Crispy chicken strips', 22.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=chicken%20fries%20crispy%20strips&image_size=square', 150),
(4, 'Onion Rings', 'Golden onion rings', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20onion%20rings%20fried&image_size=square', 80),
(5, 'Turkey Sandwich', 'Fresh turkey sub', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=turkey%20submarine%20sandwich%20fresh%20vegetables&image_size=square', 60),
(5, 'Veggie Delight', 'Vegetarian sandwich', 25.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=vegetarian%20sandwich%20fresh%20vegetables&image_size=square', 70),
(5, 'Chicken Caesar Salad', 'Fresh salad with chicken', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Caesar%20salad%20chicken%20lettuce&image_size=square', 50),
(6, 'Caramel Macchiato', 'Coffee with caramel', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=caramel%20macchiato%20coffee%20latte&image_size=square', 100),
(6, 'Matcha Latte', 'Green tea latte', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=matcha%20latte%20green%20tea%20milk&image_size=square', 80),
(6, 'Blueberry Muffin', 'Fresh baked muffin', 15.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=blueberry%20muffin%20fresh%20baked&image_size=square', 60),
(7, 'Crispy Chicken', 'Chinese style fried chicken', 26.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Chinese%20crispy%20fried%20chicken&image_size=square', 100),
(7, 'Beef Burger', 'Juicy beef patty burger', 32.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=juicy%20beef%20burger%20lettuce%20tomato&image_size=square', 80),
(7, 'Corn Soup', 'Creamy corn soup', 12.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=creamy%20corn%20soup%20bowl&image_size=square', 50),
(8, 'Chickenjoy', 'Filipino fried chicken', 29.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Filipino%20fried%20chicken%20crispy&image_size=square', 80),
(8, 'Jolly Spaghetti', 'Sweet spaghetti with meatballs', 28.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=Filipino%20spaghetti%20sweet%20sauce%20meatballs&image_size=square', 60),
(8, 'Peach Mango Pie', 'Sweet fruit pie', 18.00, 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=peach%20mango%20pie%20pastry&image_size=square', 40);

SELECT 'Data inserted successfully!' AS message;