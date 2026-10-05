const knowledgeBase = require('./knowledgeBase');
const sentimentAnalyzer = require('./sentimentAnalyzer');
const pool = require('../config/database');

class AiService {
  constructor() {
    this.conversationHistory = new Map();
  }

  getHistory(customerId) {
    if (!this.conversationHistory.has(customerId)) {
      this.conversationHistory.set(customerId, []);
    }
    return this.conversationHistory.get(customerId);
  }

  clearHistory(customerId) {
    this.conversationHistory.set(customerId, []);
  }

  async chat(customerId, message) {
    const history = this.getHistory(customerId);
    history.push({ role: 'user', content: message });
    if (history.length > 20) history.splice(0, history.length - 20);

    const intent = this.detectIntent(message);
    let response;

    switch (intent.type) {
      case 'recommend':
        response = await this.handleRecommendation(customerId, intent, message);
        break;
      case 'knowledge':
        response = this.handleKnowledgeQuery(message);
        break;
      case 'order_help':
        response = await this.handleOrderHelp(customerId, message);
        break;
      case 'health':
        response = this.handleHealthQuery(message);
        break;
      case 'compare':
        response = this.handleCompareQuery(message);
        break;
      case 'greeting':
        response = this.handleGreeting(customerId);
        break;
      case 'diet':
        response = this.handleDietAdvice(message);
        break;
      default:
        response = this.handleGeneral(message);
    }

    history.push({ role: 'assistant', content: response.text });
    return {
      text: response.text,
      suggestions: response.suggestions || [],
      products: response.products || [],
      intent: intent.type
    };
  }

  detectIntent(message) {
    const msg = message.toLowerCase();

    if (/推荐|吃什么|吃啥|不知道|选择困难|随便|推荐下/.test(msg)) return { type: 'recommend' };
    if (/营养|热量|卡路里|蛋白质|脂肪|维生素|成分|材料|做法|配方|食材/.test(msg)) return { type: 'health' };
    if (/订单|配送|物流|什么时候到|送到哪|下单|取消订单/.test(msg)) return { type: 'order_help' };
    if (/对比|比较|哪个好|区别|vs|还是/.test(msg)) return { type: 'compare' };
    if (/你好|hi|hello|嗨|在吗|你是谁|介绍下/.test(msg)) return { type: 'greeting' };
    if (/减肥|低卡|低脂|健康餐|轻食|沙拉|增肌|健身|素食|清真|忌口|过敏/.test(msg)) return { type: 'diet' };
    if (/知识|是什么|怎么|为什么|哪里|哪里有|怎么样/.test(msg)) return { type: 'knowledge' };

    return { type: 'general' };
  }

  async handleRecommendation(customerId, intent, message) {
    let products = [];
    try {
      const [rows] = await pool.query(`
        SELECT p.*, s.name as shop_name, s.rating as shop_rating
        FROM products p LEFT JOIN shops s ON p.shop_id = s.id
        ORDER BY p.id DESC LIMIT 50
      `);
      products = rows;
    } catch (e) {
      products = this.getFallbackProducts();
    }

    let filtered = [...products];
    let reason = '';

    if (/辣|麻辣|重口味/.test(message)) {
      filtered = products.filter(p => /辣|麻|川|香/.test(p.name + (p.description || '')));
      reason = '根据您对辣味的偏好';
    } else if (/清淡|不辣|清蒸/.test(message)) {
      filtered = products.filter(p => /清|蒸|粥|汤|沙拉/.test(p.name + (p.description || '')));
      reason = '为您推荐清淡口味';
    } else if (/甜|奶茶|甜品|蛋糕/.test(message)) {
      filtered = products.filter(p => /甜|奶茶|蛋糕|甜品|饮/.test(p.name + (p.description || '')));
      reason = '发现这些甜蜜好物';
    } else if (/便宜|实惠|划算|省钱/.test(message)) {
      filtered = [...products].sort((a, b) => a.price - b.price);
      reason = '为您挑选性价比最高的';
    } else if (/快|赶时间|着急/.test(message)) {
      filtered = products.slice(0, 5);
      reason = '推荐出餐最快的商品';
    } else {
      filtered = products.sort(() => Math.random() - 0.5).slice(0, 5);
      reason = '根据今日热销和您的口味';
    }

    if (filtered.length === 0) filtered = products.slice(0, 3);

    const topPicks = filtered.slice(0, 3);
    let text = `🤖 为您智能推荐以下美食：\n\n`;
    topPicks.forEach((p, i) => {
      text += `${i + 1}. **${p.name}** - ¥${Number(p.price).toFixed(2)}`;
      if (p.shop_name) text += ` (${p.shop_name})`;
      text += '\n';
    });
    text += `\n💡 ${reason}，点击商品即可加入购物车！`;
    if (filtered.length > 3) text += `\n还有${filtered.length - 3}个推荐等你发现～`;

    return {
      text,
      products: topPicks.map(p => ({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, shop_name: p.shop_name })),
      suggestions: ['换个口味', '推荐便宜的', '推荐辣的', '推荐甜品']
    };
  }

  handleKnowledgeQuery(message) {
    const result = knowledgeBase.search(message);
    if (result) {
      return {
        text: `📚 ${result.answer}\n\n💡 小贴士：${result.tip || ''}`,
        suggestions: result.followUp || ['了解更多', '推荐相关商品']
      };
    }
    const generalAnswers = [
      { q: /怎么下单/, a: '下单流程：选择商品加入购物车 → 去结算 → 选择支付方式 → 确认支付。简单三步即可完成！' },
      { q: /配送费/, a: '配送费说明：订单满50元免配送费，不满50元收取5元配送费。起送价为30元哦～' },
      { q: /退款|退货/, a: '退款流程：在订单详情页点击"申请退货"，填写退货原因后提交。审核通过后会在3个工作日内退款。' },
    ];
    for (const item of generalAnswers) {
      if (item.q.test(message)) return { text: item.a, suggestions: ['还有其他问题吗'] };
    }
    return {
      text: '🤔 这个问题我还在学习中～你可以试试问我：\n• 今天吃什么\n• 推荐辣的食物\n• 什么是宫保鸡丁\n• 减肥适合吃什么',
      suggestions: ['推荐美食', '营养知识', '减肥餐推荐', '下单帮助']
    };
  }

  async handleOrderHelp(customerId, message) {
    try {
      const [orders] = await pool.query(
        'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 3', [customerId]
      );
      if (orders.length === 0) {
        return { text: '📋 您还没有订单记录哦～去看看有什么好吃的吧！', suggestions: ['推荐美食', '浏览商家'] };
      }
      const latest = orders[0];
      const statusMap = { pending: '待付款', paid: '已付款', shipping: '配送中', completed: '已完成', cancelled: '已取消' };
      let text = `📋 您最近的订单状态：\n\n`;
      text += `最新订单：${latest.order_no}\n`;
      text += `状态：${statusMap[latest.status] || latest.status}\n`;
      text += `金额：¥${Number(latest.total_amount).toFixed(2)}\n`;
      text += `下单时间：${new Date(latest.created_at).toLocaleString('zh-CN')}`;
      return { text, suggestions: ['查看全部订单', '再来一单'] };
    } catch (e) {
      return { text: '📋 订单查询暂时不可用，请稍后再试', suggestions: ['推荐美食'] };
    }
  }

  handleHealthQuery(message) {
    const knowledge = knowledgeBase.search(message);
    if (knowledge) {
      return { text: `🥗 ${knowledge.answer}\n\n${knowledge.tip || ''}`, suggestions: knowledge.followUp || [] };
    }
    return {
      text: '🥗 营养小贴士：\n• 均衡饮食很重要，建议荤素搭配\n• 外卖可以选择少油少盐的商家\n• 多喝水，每天建议8杯水\n• 蔬菜水果不能少～\n\n你可以问我具体食材的营养信息哦！',
      suggestions: ['蛋白质含量', '低卡食物', '推荐健康餐']
    };
  }

  handleCompareQuery(message) {
    return {
      text: '🔍 对比功能需要选择具体商品哦！你可以在商品列表中对比不同商品的价格和评价。\n\n💡 小技巧：看看评分高的商家，品质更有保障！',
      suggestions: ['推荐高评分商品', '推荐便宜的', '推荐好吃的']
    };
  }

  handleGreeting(customerId) {
    const hour = new Date().getHours();
    let timeGreeting = '';
    if (hour >= 6 && hour < 10) timeGreeting = '早上好！';
    else if (hour >= 11 && hour < 14) timeGreeting = '中午好！';
    else if (hour >= 17 && hour < 20) timeGreeting = '晚上好！';
    else if (hour >= 20 || hour < 2) timeGreeting = '夜宵时间到了！';
    else timeGreeting = '你好！';

    return {
      text: `${timeGreeting} 🤖 我是您的AI美食助手！\n\n我可以帮你：\n🎯 智能推荐美食\n📚 解答美食知识\n🥗 提供营养建议\n📋 查询订单状态\n🎲 今天吃什么（选择困难？）\n\n有什么我可以帮你的吗？`,
      suggestions: ['今天吃什么', '推荐辣的', '营养知识', '查看订单']
    };
  }

  handleDietAdvice(message) {
    let text = '';
    let suggestions = [];

    if (/减肥|减脂|低卡|低热量/.test(message)) {
      text = '🥗 减肥饮食建议：\n\n推荐选择：\n• 轻食沙拉（热量约200-400kcal）\n• 鸡胸肉沙拉（高蛋白低脂）\n• 蔬菜汤/清汤面\n• 蒸菜/白灼菜\n\n⚠️ 避免：油炸食品、含糖饮料、高淀粉主食\n\n💡 技巧：先喝汤增加饱腹感，主食减半，多吃蔬菜～';
      suggestions = ['推荐轻食', '低卡食物推荐', '蛋白质补充'];
    } else if (/增肌|健身|蛋白/.test(message)) {
      text = '💪 增肌饮食建议：\n\n推荐选择：\n• 牛肉/鸡胸肉（高蛋白）\n• 鸡蛋类菜品\n• 鱼肉/虾（优质蛋白）\n• 豆腐/豆制品\n\n💡 蛋白质摄入建议：每公斤体重1.5-2g蛋白质量';
      suggestions = ['高蛋白食物', '推荐牛肉', '推荐鸡胸肉'];
    } else if (/素食|素/.test(message)) {
      text = '🥬 素食推荐：\n• 蔬菜沙拉\n• 豆腐煲\n• 时蔬炒菜\n• 素炒面/素炒饭\n• 菌菇汤';
      suggestions = ['推荐素食商家', '豆腐推荐'];
    } else {
      text = '🍽️ 饮食建议：\n• 均衡饮食是关键\n• 每餐有蛋白质+碳水+蔬菜\n• 少油少盐更健康\n• 适量饮水\n\n告诉我你的具体需求，我可以给更精准的建议！';
      suggestions = ['减肥建议', '增肌建议', '素食推荐'];
    }
    return { text, suggestions };
  }

  handleGeneral(message) {
    return {
      text: '🤖 我理解你的意思，但让我更好地帮助你：\n\n试试这些指令：\n• "推荐美食" - 智能推荐\n• "今天吃什么" - 随机推荐\n• "什么是宫保鸡丁" - 美食知识\n• "减肥适合吃什么" - 饮食建议\n• "查看订单" - 订单查询',
      suggestions: ['推荐美食', '美食知识', '饮食建议', '查看订单']
    };
  }

  getFallbackProducts() {
    return [
      { id: 1, name: '麻辣烫经典套餐', price: 28, shop_name: '川味坊', description: '麻辣鲜香' },
      { id: 2, name: '珍珠奶茶大杯', price: 12, shop_name: '茶百道', description: '香甜可口' },
      { id: 3, name: '鸡肉汉堡套餐', price: 32, shop_name: '麦当劳', description: '经典美味' },
    ];
  }

  async analyzeReviews(shopId) {
    let reviews = [];
    try {
      const [rows] = await pool.query(
        'SELECT r.*, c.username FROM reviews r LEFT JOIN customers c ON r.customer_id = c.id WHERE r.product_id IN (SELECT id FROM products WHERE shop_id = ?) ORDER BY r.created_at DESC LIMIT 50',
        [shopId]
      );
      reviews = rows;
    } catch (e) {
      return sentimentAnalyzer.getMockAnalysis();
    }
    return sentimentAnalyzer.analyze(reviews);
  }
}

module.exports = new AiService();
