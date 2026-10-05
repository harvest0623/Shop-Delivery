-- ============================================
-- Shop Delivery System - 数据库扩展
-- 新增功能表：评价、收藏、积分、任务、通知、签到、浏览历史
-- ============================================

-- 使用shop_delivery数据库
USE shop_delivery;

-- 禁用外键检查，以便按任意顺序删除表
SET FOREIGN_KEY_CHECKS = 0;

-- 删除已存在的表（如果存在）
DROP TABLE IF EXISTS shopping_history;
DROP TABLE IF EXISTS user_checkin;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS user_tasks;
DROP TABLE IF EXISTS daily_tasks;
DROP TABLE IF EXISTS points_log;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;

-- 启用外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. 评价表 (reviews)
-- 存储用户对商品的评价信息
-- ============================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL COMMENT '用户ID，关联customers表',
    product_id INT NOT NULL COMMENT '商品ID，关联products表',
    order_id INT NULL COMMENT '订单ID，关联orders表',
    rating INT NOT NULL COMMENT '评分，范围1-5',
    content TEXT COMMENT '评价内容',
    images JSON COMMENT '评价图片，JSON格式存储图片URL数组',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 外键约束
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    -- 检查评分范围
    CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价表';

-- ============================================
-- 2. 收藏表 (favorites)
-- 存储用户收藏的商家和商品
-- ============================================
CREATE TABLE favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL COMMENT '用户ID，关联customers表',
    shop_id INT NOT NULL COMMENT '商家ID，关联shops表',
    product_id INT COMMENT '商品ID，关联products表（可为空，表示收藏整个商家）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 唯一约束：同一用户不能重复收藏同一商家的同一商品
    UNIQUE KEY uk_customer_shop_product (customer_id, shop_id, product_id),
    -- 外键约束
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- ============================================
-- 3. 积分记录表 (points_log)
-- 记录用户积分的变动历史
-- ============================================
CREATE TABLE points_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL COMMENT '用户ID，关联customers表',
    amount INT NOT NULL COMMENT '积分变动数量（正数为增加，负数为减少）',
    type VARCHAR(20) NOT NULL COMMENT '变动类型：checkin(签到)/order(订单)/redeem(兑换)',
    description VARCHAR(255) COMMENT '变动描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 外键约束
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    -- 检查变动类型
    CHECK (type IN ('checkin', 'order', 'redeem'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='积分记录表';

-- ============================================
-- 4. 每日任务表 (daily_tasks)
-- 定义系统中的每日任务
-- ============================================
CREATE TABLE daily_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL COMMENT '任务名称',
    description VARCHAR(255) COMMENT '任务描述',
    task_type VARCHAR(20) NOT NULL COMMENT '任务类型：checkin(签到)/browse(浏览)/order(下单)/share(分享)',
    target_count INT NOT NULL COMMENT '任务目标数量',
    points_reward INT NOT NULL COMMENT '完成任务奖励的积分',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 检查任务类型
    CHECK (task_type IN ('checkin', 'browse', 'order', 'share'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='每日任务表';

-- ============================================
-- 5. 用户任务完成表 (user_tasks)
-- 记录用户每日任务的完成情况
-- ============================================
CREATE TABLE user_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL COMMENT '用户ID，关联customers表',
    task_id INT NOT NULL COMMENT '任务ID，关联daily_tasks表',
    progress INT DEFAULT 0 COMMENT '任务进度，当前完成数量',
    is_completed TINYINT(1) DEFAULT 0 COMMENT '是否已完成：0(未完成)/1(已完成)',
    completed_at TIMESTAMP NULL COMMENT '完成时间，未完成则为NULL',
    date DATE NOT NULL COMMENT '任务日期',
    -- 唯一约束：同一用户同一天不能重复完成同一任务
    UNIQUE KEY uk_customer_task_date (customer_id, task_id, date),
    -- 外键约束
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES daily_tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户任务完成表';

-- ============================================
-- 6. 通知表 (notifications)
-- 存储系统发送给用户的通知消息
-- ============================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL COMMENT '用户ID，关联customers表',
    title VARCHAR(100) NOT NULL COMMENT '通知标题',
    content TEXT COMMENT '通知内容',
    type VARCHAR(20) NOT NULL COMMENT '通知类型：order(订单)/system(系统)/promotion(促销)',
    is_read TINYINT(1) DEFAULT 0 COMMENT '是否已读：0(未读)/1(已读)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    -- 外键约束
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    -- 检查通知类型
    CHECK (type IN ('order', 'system', 'promotion'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- ============================================
-- 7. 签到表 (user_checkin)
-- 记录用户每日签到信息
-- ============================================
CREATE TABLE user_checkin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL COMMENT '用户ID，关联customers表',
    checkin_date DATE NOT NULL COMMENT '签到日期',
    points INT DEFAULT 10 COMMENT '签到获得的积分',
    -- 唯一约束：同一用户同一天只能签到一次
    UNIQUE KEY uk_customer_checkin_date (customer_id, checkin_date),
    -- 外键约束
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='签到表';

-- ============================================
-- 8. 浏览历史表 (shopping_history)
-- 记录用户浏览商品的历史
-- ============================================
CREATE TABLE shopping_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL COMMENT '用户ID，关联customers表',
    product_id INT NOT NULL COMMENT '商品ID，关联products表',
    view_count INT DEFAULT 1 COMMENT '浏览次数',
    last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后浏览时间',
    -- 唯一约束：同一用户同一商品只保留一条记录
    UNIQUE KEY uk_customer_product (customer_id, product_id),
    -- 外键约束
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='浏览历史表';

-- ============================================
-- 初始数据插入
-- ============================================

-- 1. 每日任务数据 (5个任务)
INSERT INTO daily_tasks (name, description, task_type, target_count, points_reward) VALUES
('每日签到', '每日签到获得积分', 'checkin', 1, 10),
('浏览商品', '浏览5个不同商品', 'browse', 5, 20),
('完成订单', '完成1个订单', 'order', 1, 50),
('分享商品', '分享1次商品', 'share', 1, 10),
('商品评价', '评价1个商品', 'browse', 1, 15);

-- 2. 评价数据 (10条评价，随机分配给不同商品，评分3-5)
INSERT INTO reviews (customer_id, product_id, order_id, rating, content, images) VALUES
(1, 1, 1, 5, '非常好吃，鸡肉很嫩，配送也很快！', '["https://example.com/review1_1.jpg"]'),
(2, 10, 3, 4, '大份薯条很脆，但有点咸', NULL),
(3, 17, 3, 5, '披萨味道很棒，芝士拉丝很长', '["https://example.com/review3_1.jpg", "https://example.com/review3_2.jpg"]'),
(4, 25, 4, 4, '汉堡不错，牛肉很新鲜', NULL),
(5, 41, 5, 5, '咖啡很香，拉花很漂亮', '["https://example.com/review5_1.jpg"]'),
(1, 57, 6, 4, '火锅底料很正宗，服务态度也好', NULL),
(2, 65, 6, 5, '羊肉很嫩，烤得恰到好处', '["https://example.com/review7_1.jpg"]'),
(3, 73, 8, 3, '奶茶一般，糖分有点高', NULL),
(4, 81, 9, 4, '草莓很新鲜，奶盖不错', NULL),
(5, 89, 10, 5, '排骨米饭很入味，汤也好喝', '["https://example.com/review10_1.jpg"]');

-- 3. 积分记录数据 (5条)
INSERT INTO points_log (customer_id, amount, type, description) VALUES
(1, 10, 'checkin', '每日签到奖励'),
(2, 20, 'order', '完成订单奖励'),
(3, 50, 'order', '大额订单奖励'),
(4, -30, 'redeem', '积分兑换优惠券'),
(5, 15, 'checkin', '连续签到奖励');

-- 4. 签到记录数据 (3条)
INSERT INTO user_checkin (customer_id, checkin_date, points) VALUES
(1, '2026-05-30', 10),
(2, '2026-05-30', 10),
(3, '2026-05-31', 10);

-- 5. 通知数据 (5条)
INSERT INTO notifications (customer_id, title, content, type, is_read) VALUES
(1, '订单发货通知', '您的订单ORD202401150001已发货，请注意查收', 'order', 0),
(2, '系统维护通知', '系统将于今晚22:00-23:00进行维护升级', 'system', 1),
(3, '促销活动通知', '全场满100减20，限时优惠中！', 'promotion', 0),
(4, '签到提醒', '今日签到可获得10积分，记得签到哦', 'system', 0),
(5, '订单完成通知', '您的订单ORD202401180002已完成，感谢您的购买', 'order', 1);

-- 6. 收藏数据 (5条)
INSERT INTO favorites (customer_id, shop_id, product_id) VALUES
(1, 1, 1),
(1, 5, 41),
(2, 3, 17),
(3, 8, 57),
(4, 10, 73);

-- 启用外键检查（确保数据插入时约束生效）
SET FOREIGN_KEY_CHECKS = 1;

SELECT '数据库扩展完成！已创建8个新表并插入初始数据。' AS message;