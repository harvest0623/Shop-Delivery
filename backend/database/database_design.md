# 某商店外卖系统 - 数据库设计文档

## 1. 数据库概述

- **数据库名称**: shop_delivery
- **数据库用户**: shop_admin
- **用户密码**: shop123456
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci

## 2. E-R图设计

```
+----------------+       +----------------+       +----------------+
|    shops       |       |   categories   |       |   customers    |
+----------------+       +----------------+       +----------------+
| PK: id         |       | PK: id         |       | PK: id         |
| name           |       | name           |       | username       |
| description    |       | icon           |       | password       |
| address        |       | sort_order     |       | email          |
| phone          |       +----------------+       | phone          |
| image_url      |              |                 | nickname       |
| rating         |              |                 | avatar_url     |
| delivery_time  |              |                 +----------------+
| delivery_fee   |              |                        |
| min_order      |              |                        |
| status         |              |                        |
+----------------+              |                        |
       |                        |                        |
       | 1:N                    | 1:N                    | 1:N
       |                        |                        |
       v                        v                        v
+----------------+       +----------------+       +----------------+
|    products    |       |     cart       |       |   addresses    |
+----------------+       +----------------+       +----------------+
| PK: id         |       | PK: id         |       | PK: id         |
| FK: shop_id    |       | FK: customer_id|       | FK: customer_id|
| FK: category_id|       | FK: product_id |       | name           |
| name           |       | quantity       |       | phone          |
| description    |       +----------------+       | province       |
| price          |                                | city           |
| image_url      |                                | district       |
| stock          |                                | detail         |
| is_featured    |                                | is_default     |
+----------------+                                +----------------+
       |                                                 |
       | 1:N                                             | 1:N
       |                                                 |
       v                                                 v
+----------------+       +----------------+       +----------------+
|  order_items   |       |    orders      |       |  (关联)        |
+----------------+       +----------------+       +----------------+
| PK: id         |       | PK: id         |
| FK: order_id   |<------| FK: customer_id|
| FK: product_id |       | FK: shop_id    |
| quantity       |       | FK: address_id |
| price          |       | total_amount   |
+----------------+       | delivery_fee   |
                         | status         |
                         | order_no       |
                         | remark         |
                         | return_reason  |
                         +----------------+
```

## 3. 关系模式

### 3.1 商家表 (shops)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 商家ID |
| name | VARCHAR(100) | NOT NULL | 商家名称 |
| description | TEXT | | 商家描述 |
| address | VARCHAR(255) | | 商家地址 |
| phone | VARCHAR(20) | | 联系电话 |
| image_url | VARCHAR(500) | | 商家图片 |
| rating | DECIMAL(2,1) | DEFAULT 4.5 | 评分 |
| delivery_time | INT | DEFAULT 30 | 配送时间(分钟) |
| delivery_fee | DECIMAL(5,2) | DEFAULT 3.00 | 配送费 |
| min_order | DECIMAL(5,2) | DEFAULT 20.00 | 起送价 |
| status | VARCHAR(20) | DEFAULT 'open' | 营业状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 3.2 商品分类表 (categories)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 分类ID |
| name | VARCHAR(50) | NOT NULL | 分类名称 |
| icon | VARCHAR(100) | | 图标 |
| sort_order | INT | DEFAULT 0 | 排序 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 3.3 商品表 (products)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 商品ID |
| shop_id | INT | NOT NULL, FK -> shops.id | 商家ID |
| category_id | INT | FK -> categories.id | 分类ID |
| name | VARCHAR(100) | NOT NULL | 商品名称 |
| description | TEXT | | 商品描述 |
| price | DECIMAL(10,2) | NOT NULL | 价格 |
| image_url | VARCHAR(500) | | 商品图片 |
| stock | INT | DEFAULT 100 | 库存 |
| is_featured | TINYINT(1) | DEFAULT 0 | 是否招牌 |
| sort_order | INT | DEFAULT 0 | 排序 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 3.4 顾客表 (customers)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 顾客ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| password | VARCHAR(255) | NOT NULL | 密码(哈希) |
| email | VARCHAR(100) | | 邮箱 |
| phone | VARCHAR(20) | | 电话 |
| nickname | VARCHAR(50) | | 昵称 |
| avatar_url | VARCHAR(500) | | 头像 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 3.5 地址表 (addresses)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 地址ID |
| customer_id | INT | NOT NULL, FK -> customers.id | 顾客ID |
| name | VARCHAR(50) | | 收货人姓名 |
| phone | VARCHAR(20) | | 收货人电话 |
| province | VARCHAR(50) | | 省 |
| city | VARCHAR(50) | | 市 |
| district | VARCHAR(50) | | 区 |
| detail | VARCHAR(255) | | 详细地址 |
| is_default | TINYINT(1) | DEFAULT 0 | 是否默认 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

### 3.6 购物车表 (cart)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 购物车ID |
| customer_id | INT | NOT NULL, FK -> customers.id | 顾客ID |
| product_id | INT | NOT NULL, FK -> products.id | 商品ID |
| quantity | INT | DEFAULT 1 | 数量 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 3.7 订单表 (orders)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 订单ID |
| customer_id | INT | NOT NULL, FK -> customers.id | 顾客ID |
| shop_id | INT | NOT NULL, FK -> shops.id | 商家ID |
| address_id | INT | FK -> addresses.id | 地址ID |
| total_amount | DECIMAL(10,2) | NOT NULL | 总金额 |
| delivery_fee | DECIMAL(5,2) | DEFAULT 0.00 | 配送费 |
| status | VARCHAR(20) | DEFAULT 'pending' | 订单状态 |
| order_no | VARCHAR(50) | UNIQUE | 订单编号 |
| remark | TEXT | | 备注 |
| return_reason | VARCHAR(255) | | 退货原因 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 3.8 订单商品表 (order_items)
| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | ID |
| order_id | INT | NOT NULL, FK -> orders.id | 订单ID |
| product_id | INT | NOT NULL, FK -> products.id | 商品ID |
| quantity | INT | DEFAULT 1 | 数量 |
| price | DECIMAL(10,2) | NOT NULL | 单价 |

## 4. 视图设计

### 4.1 订单详情视图 (order_detail_view)
```sql
CREATE VIEW order_detail_view AS
SELECT 
    o.id AS order_id, o.order_no, o.total_amount, o.delivery_fee,
    o.status, o.remark, o.return_reason, o.created_at,
    c.username, c.phone AS customer_phone, c.nickname,
    s.name AS shop_name, s.image_url AS shop_image,
    CONCAT(a.province, a.city, a.district, a.detail) AS address_detail,
    a.name AS receiver_name, a.phone AS receiver_phone
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN shops s ON o.shop_id = s.id
LEFT JOIN addresses a ON o.address_id = a.id;
```

### 4.2 商家商品视图 (shop_product_view)
```sql
CREATE VIEW shop_product_view AS
SELECT 
    p.id AS product_id, p.name AS product_name, p.description AS product_desc,
    p.price, p.image_url AS product_image, p.stock, p.is_featured,
    s.id AS shop_id, s.name AS shop_name, s.image_url AS shop_image,
    s.rating, s.delivery_time, s.delivery_fee,
    c.name AS category_name, c.icon AS category_icon
FROM products p
JOIN shops s ON p.shop_id = s.id
LEFT JOIN categories c ON p.category_id = c.id;
```

### 4.3 销售汇总视图 (sales_summary_view)
```sql
CREATE VIEW sales_summary_view AS
SELECT 
    s.id AS shop_id, s.name AS shop_name,
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
```

### 4.4 顾客订单视图 (customer_order_view)
```sql
CREATE VIEW customer_order_view AS
SELECT 
    c.id AS customer_id, c.username, c.nickname,
    COUNT(o.id) AS total_orders,
    SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) AS total_spent,
    MAX(o.created_at) AS last_order_date
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.username, c.nickname;
```

## 5. 存储过程设计

### 5.1 创建订单 (CreateOrder)
```sql
CREATE PROCEDURE CreateOrder(
    IN p_customer_id INT, IN p_shop_id INT, IN p_address_id INT,
    IN p_total_amount DECIMAL(10,2), IN p_delivery_fee DECIMAL(5,2), IN p_remark TEXT
)
BEGIN
    DECLARE v_order_no VARCHAR(50);
    DECLARE v_order_id INT;
    SET v_order_no = CONCAT('ORD', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 10000), 4, '0'));
    INSERT INTO orders (customer_id, shop_id, address_id, total_amount, delivery_fee, status, order_no, remark)
    VALUES (p_customer_id, p_shop_id, p_address_id, p_total_amount, p_delivery_fee, 'pending', v_order_no, p_remark);
    SET v_order_id = LAST_INSERT_ID();
    SELECT v_order_id AS order_id, v_order_no AS order_no;
END
```

### 5.2 处理退货 (ProcessReturn)
```sql
CREATE PROCEDURE ProcessReturn(IN p_order_id INT, IN p_reason VARCHAR(255))
BEGIN
    DECLARE v_status VARCHAR(20);
    SELECT status INTO v_status FROM orders WHERE id = p_order_id;
    IF v_status = 'completed' THEN
        UPDATE orders SET status = 'returned', return_reason = p_reason WHERE id = p_order_id;
        SELECT 'Return Success' AS message, p_order_id AS order_id;
    ELSE
        SELECT 'Order status does not allow return' AS message, p_order_id AS order_id;
    END IF;
END
```

### 5.3 获取销售统计 (GetSalesStatistics)
```sql
CREATE PROCEDURE GetSalesStatistics(IN p_start_date DATE, IN p_end_date DATE)
BEGIN
    SELECT 
        COUNT(*) AS total_orders, SUM(total_amount) AS total_amount,
        SUM(delivery_fee) AS total_delivery_fee,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed_count,
        COUNT(CASE WHEN status = 'returned' THEN 1 END) AS returned_count,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_count
    FROM orders
    WHERE DATE(created_at) BETWEEN p_start_date AND p_end_date;
END
```

### 5.4 添加到购物车 (AddToCart)
```sql
CREATE PROCEDURE AddToCart(IN p_customer_id INT, IN p_product_id INT, IN p_quantity INT)
BEGIN
    DECLARE v_stock INT; DECLARE v_exists INT;
    SELECT stock INTO v_stock FROM products WHERE id = p_product_id;
    IF v_stock < p_quantity THEN
        SELECT 'Insufficient stock' AS message;
    ELSE
        SELECT COUNT(*) INTO v_exists FROM cart WHERE customer_id = p_customer_id AND product_id = p_product_id;
        IF v_exists > 0 THEN
            UPDATE cart SET quantity = quantity + p_quantity WHERE customer_id = p_customer_id AND product_id = p_product_id;
        ELSE
            INSERT INTO cart (customer_id, product_id, quantity) VALUES (p_customer_id, p_product_id, p_quantity);
        END IF;
        SELECT 'Added successfully' AS message;
    END IF;
END
```

## 6. 触发器设计

### 6.1 下单减库存触发器 (trg_after_order_insert)
```sql
CREATE TRIGGER trg_after_order_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
END
```

### 6.2 退货恢复库存触发器 (trg_after_order_return)
```sql
CREATE TRIGGER trg_after_order_return
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != 'returned' AND NEW.status = 'returned' THEN
        UPDATE products p JOIN order_items oi ON p.id = oi.product_id
        SET p.stock = p.stock + oi.quantity WHERE oi.order_id = NEW.id;
    END IF;
END
```

### 6.3 取消恢复库存触发器 (trg_after_order_cancel)
```sql
CREATE TRIGGER trg_after_order_cancel
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
        UPDATE products p JOIN order_items oi ON p.id = oi.product_id
        SET p.stock = p.stock + oi.quantity WHERE oi.order_id = NEW.id;
    END IF;
END
```

## 7. 初始数据说明

### 7.1 分类数据 (10条)
热菜、主食、小吃、饮品、甜点、套餐、烧烤、日料、奶茶、川菜

### 7.2 商家数据 (18条)
KFC、麦当劳、必胜客、汉堡王、星巴克、德克士、喜茶、海底捞、西贝莜面村、瑞幸咖啡、奈雪的茶、真功夫、呷哺呷哺、永和大王、蜜雪冰城、老乡鸡、和府捞面、张亮麻辣烫

### 7.3 商品数据 (144条)
每个商家8个商品，共144个商品

### 7.4 顾客数据 (5条)
admin、user1、user2、zhangsan、lisi

### 7.5 地址数据 (6条)
5个顾客的收货地址

### 7.6 购物车数据 (7条)
各顾客的购物车商品

### 7.7 订单数据 (10条)
包含各种状态的订单示例

### 7.8 订单商品数据 (17条)
订单中的商品明细

## 8. 主要业务功能

### 8.1 下单流程
1. 用户浏览商品并添加到购物车
2. 购物车中点击"去结算"
3. 系统创建订单并扣减库存(触发器自动执行)
4. 订单状态为"pending"

### 8.2 退货流程
1. 用户在订单列表中找到"已完成"订单
2. 点击"申请退货"按钮
3. 填写退货原因并提交
4. 系统更新订单状态为"returned"
5. 触发器自动恢复库存

### 8.3 销售统计查询
1. 支持按时间范围筛选(今日/近7天/近30天/全部)
2. 显示订单总数、销售总额、净销售额、退货金额
3. 显示订单状态分布
4. 显示热销商品TOP10
5. 显示热门商家TOP10
6. 显示销售趋势

## 9. 技术栈

- **后端**: Node.js + Express.js
- **数据库**: MySQL 8.0
- **前端**: Vue 3 + Vue Router + Axios
- **连接池**: mysql2/promise
- **密码加密**: bcryptjs
- **身份验证**: JWT
