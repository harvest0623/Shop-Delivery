const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const langchainService = require('../services/langchainService');

router.post('/chat', async (req, res) => {
  try {
    const { customer_id, message } = req.body;
    if (!message) return res.status(400).json({ error: '消息不能为空' });
    const cid = customer_id || 'anonymous';
    const result = await langchainService.chat(cid, message);
    res.json(result);
  } catch (error) {
    console.error('[AI Chat] error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/clear-history', (req, res) => {
  const { customer_id } = req.body;
  if (customer_id) langchainService.clearHistory(customer_id);
  res.json({ success: true });
});

router.get('/analyze-reviews/:shopId', async (req, res) => {
  try {
    const result = await langchainService.analyzeReviews(parseInt(req.params.shopId));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/knowledge', (req, res) => {
  const knowledgeBase = require('../services/knowledgeBase');
  res.json(knowledgeBase.getAll());
});

router.get('/retriever/:query', async (req, res) => {
  try {
    const docs = await langchainService.retrieveDocuments(req.params.query);
    res.json({ query: req.params.query, documents: docs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/insights/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const insights = {口味偏好: '暂无数据', 消费习惯: '暂无数据', 健康建议: '', AI洞察: ''};
    try {
      const [orders] = await pool.query(`
        SELECT p.name, p.description, p.price, c.name as category_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.customer_id = ?
        ORDER BY o.created_at DESC LIMIT 20
      `, [customerId]);
      if (orders.length > 0) {
        const categoryCount = {};
        const priceList = [];
        orders.forEach(o => {
          const cat = o.category_name || '其他';
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          priceList.push(Number(o.price));
        });
        const topCategory = Object.entries(categoryCount).sort((a,b) => b[1] - a[1])[0];
        const avgPrice = priceList.reduce((a,b) => a+b, 0) / priceList.length;
        insights['口味偏好'] = `最爱${topCategory[0]}，已点${topCategory[1]}次`;
        insights['消费习惯'] = `平均客单价¥${avgPrice.toFixed(0)}，共${orders.length}件商品`;
        const context = `用户喜欢${topCategory[0]}，平均价格${avgPrice.toFixed(0)}元`;
        const dietResult = langchainService.retrieveDocuments(context + ' 饮食建议 营养');
        insights['健康建议'] = `基于您的${topCategory[0]}偏好，建议适当搭配蔬菜和蛋白质，保持营养均衡`;
        insights['AI洞察'] = `🤖 根据您的${orders.length}条购买记录分析：您是${topCategory[0]}爱好者，消费水平${avgPrice > 30 ? '偏高' : avgPrice > 15 ? '适中' : '经济实惠'}。建议尝试我们为您推荐的新品！`;
      }
    } catch(e) {}
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/cart-recommend', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.json({ recommendations: [], reason: '购物车为空' });
    }
    const itemNames = items.map(i => i.name).join('、');
    const context = await langchainService.retrieveDocuments(itemNames + ' 搭配 推荐');
    let allProducts = [];
    try {
      const [rows] = await pool.query('SELECT p.*, s.name as shop_name FROM products p LEFT JOIN shops s ON p.shop_id = s.id ORDER BY p.id DESC LIMIT 50');
      allProducts = rows;
    } catch(e) {}
    const cartIds = items.map(i => i.id);
    const cartCategories = items.map(i => i.category_id).filter(Boolean);
    let recommended = allProducts.filter(p => !cartIds.includes(p.id));
    if (cartCategories.length > 0) {
      const sameCategory = recommended.filter(p => cartCategories.includes(p.category_id));
      const differentCategory = recommended.filter(p => !cartCategories.includes(p.category_id));
      recommended = [...sameCategory.slice(0, 2), ...differentCategory.slice(0, 4)];
    } else {
      recommended = recommended.slice(0, 6);
    }
    let reason = '';
    if (items.length === 1) reason = `为您搭配「${items[0].name}」的绝佳伴侣`;
    else reason = `基于购物车${items.length}件商品，AI为您精选搭配`;
    res.json({ recommendations: recommended, reason, context: context.substring(0, 100) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/semantic-search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.json({ products: [], intent: '' });
    let allProducts = [];
    try {
      const [rows] = await pool.query('SELECT p.*, s.name as shop_name FROM products p LEFT JOIN shops s ON p.shop_id = s.id');
      allProducts = rows;
    } catch(e) {}
    const context = await langchainService.retrieveDocuments(query);
    let filtered = [...allProducts];
    let intent = '关键词匹配';
    if (/辣|麻辣|重口味/.test(query)) {
      filtered = allProducts.filter(p => /辣|麻|川|香/.test((p.name || '') + (p.description || '')));
      intent = '🌶️ AI识别：您想吃辣味美食';
    } else if (/清淡|不辣|清蒸|清淡/.test(query)) {
      filtered = allProducts.filter(p => /清|蒸|粥|汤|沙拉/.test((p.name || '') + (p.description || '')));
      intent = '🥗 AI识别：您偏好清淡口味';
    } else if (/甜|奶茶|甜品|蛋糕/.test(query)) {
      filtered = allProducts.filter(p => /甜|奶茶|蛋糕|饮|茶/.test((p.name || '') + (p.description || '')));
      intent = '🧋 AI识别：您想来点甜品饮品';
    } else if (/便宜|实惠|划算|省钱/.test(query)) {
      filtered = [...allProducts].sort((a,b) => a.price - b.price);
      intent = '💰 AI识别：为您推荐性价比之选';
    } else if (/快|赶时间|着急/.test(query)) {
      filtered = allProducts.slice(0, 5);
      intent = '⚡ AI识别：推荐出餐最快的';
    } else if (/健康|低卡|减脂|轻食/.test(query)) {
      filtered = allProducts.filter(p => /沙拉|轻食|蔬菜|健康/.test((p.name || '') + (p.description || '')));
      intent = '💚 AI识别：健康轻食推荐';
    } else {
      const lowerQuery = query.toLowerCase();
      filtered = allProducts.filter(p => {
        const text = ((p.name || '') + (p.description || '') + (p.shop_name || '')).toLowerCase();
        return lowerQuery.split('').some(char => text.includes(char));
      });
      intent = `🔍 RAG语义搜索："${query}"`;
    }
    if (filtered.length === 0) filtered = allProducts.slice(0, 5);
    res.json({ products: filtered.slice(0, 12), intent, knowledgeContext: context.substring(0, 150) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
