const pool = require('./config/database');

async function check() {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log('=== 数据库表 ===');
    tables.forEach(t => console.log(Object.values(t)[0]));
    
    console.log('\n=== 各表数据量 ===');
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [count] = await pool.query('SELECT COUNT(*) as cnt FROM ' + tableName);
      console.log(tableName + ': ' + count[0].cnt + ' 条');
    }
    
    console.log('\n=== 顾客信息 ===');
    const [customers] = await pool.query('SELECT id, username, nickname, phone, email FROM customers');
    console.log(JSON.stringify(customers, null, 2));
    
    console.log('\n=== 地址信息 ===');
    const [addresses] = await pool.query('SELECT id, customer_id, name, province, city, district, detail, is_default FROM addresses');
    console.log(JSON.stringify(addresses, null, 2));
    
    console.log('\n=== 订单信息 ===');
    const [orders] = await pool.query('SELECT id, order_no, customer_id, shop_id, total_amount, status, return_reason FROM orders');
    console.log(JSON.stringify(orders, null, 2));
    
    console.log('\n=== 购物车信息 ===');
    const [cart] = await pool.query('SELECT c.id, c.customer_id, c.quantity, p.name as product_name FROM cart c JOIN products p ON c.product_id = p.id');
    console.log(JSON.stringify(cart, null, 2));
    
    console.log('\n=== 商品分类 ===');
    const [cats] = await pool.query('SELECT * FROM categories');
    console.log(JSON.stringify(cats, null, 2));
    
    console.log('\n=== 商品信息（前5条）===');
    const [products] = await pool.query('SELECT id, name, price, stock, shop_id, category_id FROM products LIMIT 5');
    console.log(JSON.stringify(products, null, 2));
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
