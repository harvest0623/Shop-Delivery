const { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate, HumanMessagePromptTemplate } = require('@langchain/core/prompts');
const { Document } = require('@langchain/core/documents');
const { RunnableSequence, RunnableLambda, RunnablePassthrough } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { BaseRetriever } = require('@langchain/core/retrievers');
const { InMemoryStore } = require('langchain');
const sentimentAnalyzer = require('./sentimentAnalyzer');
const knowledgeBase = require('./knowledgeBase');
const pool = require('../config/database');

const foodDocuments = [
  new Document({ pageContent: '宫保鸡丁是四川传统名菜，以鸡胸肉丁、干辣椒、花生米为主料，口味麻辣鲜香。蛋白质丰富，热量约350kcal/份。', metadata: { source: 'knowledge', category: '川菜', keywords: '宫保鸡丁 川菜 辣 鸡肉' } }),
  new Document({ pageContent: '麻婆豆腐是四川名菜，嫩豆腐配肉末、花椒、豆瓣酱烹制。豆腐含丰富植物蛋白和钙质。热量约200kcal/份。', metadata: { source: 'knowledge', category: '川菜', keywords: '麻婆豆腐 豆腐 四川 花椒' } }),
  new Document({ pageContent: '珍珠奶茶热量约300-500kcal/杯，含糖量较高。一杯奶茶相当于2-3碗米饭的热量。建议选择少糖或无糖。', metadata: { source: 'knowledge', category: '饮品', keywords: '奶茶 珍珠奶茶 热量 饮品' } }),
  new Document({ pageContent: '蔬菜沙拉是健康饮食的代表，富含膳食纤维、维生素和矿物质。一份蔬菜沙拉约100-200kcal。可搭配鸡胸肉增加蛋白质。', metadata: { source: 'knowledge', category: '轻食', keywords: '沙拉 蔬菜 健康 减肥 低卡' } }),
  new Document({ pageContent: '鸡肉汉堡约400-600kcal，含蛋白质、碳水化合物和脂肪。选择烤制而非油炸可减少约30%热量。', metadata: { source: 'knowledge', category: '快餐', keywords: '汉堡 鸡肉 快餐 热量' } }),
  new Document({ pageContent: '披萨源自意大利，以面饼、番茄酱、芝士和配料制成。薄底披萨比厚底热量低约20%。一片芝士披萨约200-300kcal。', metadata: { source: 'knowledge', category: '西餐', keywords: '披萨 比萨 意大利 芝士' } }),
  new Document({ pageContent: '日式寿司热量较低，一个握寿司约40-60kcal。三文鱼刺身富含Omega-3脂肪酸，对心脑血管有益。', metadata: { source: 'knowledge', category: '日料', keywords: '寿司 刺身 日本 三文鱼' } }),
  new Document({ pageContent: '蛋白质是人体必需营养素，推荐每日摄入量为每公斤体重0.8-1.2g。优质蛋白来源：鸡胸肉、鱼、蛋、豆腐、牛奶。', metadata: { source: 'knowledge', category: '营养', keywords: '蛋白质 营养 健身 鸡胸肉' } }),
  new Document({ pageContent: '成人每日推荐热量摄入：男性2000-2500kcal，女性1500-2000kcal。外卖一餐通常在500-1000kcal之间。', metadata: { source: 'knowledge', category: '营养', keywords: '热量 卡路里 营养 饮食' } }),
  new Document({ pageContent: '川菜以麻辣鲜香著称，代表菜：宫保鸡丁、麻婆豆腐、回锅肉、水煮鱼。特点是一菜一格，百菜百味。', metadata: { source: 'knowledge', category: '川菜', keywords: '川菜 四川 麻辣 川味' } }),
  new Document({ pageContent: '粤菜以清淡鲜美著称，注重食材原味。代表菜：白切鸡、烧鹅、蒸鱼、煲仔饭。烹饪方式以蒸、炒、煲为主。', metadata: { source: 'knowledge', category: '粤菜', keywords: '粤菜 广东 清淡 蒸' } }),
  new Document({ pageContent: '本平台起送价30元，配送费5元（满50元免配送费）。凑单技巧：加一份小食或饮品即可达到起送价。', metadata: { source: 'platform', category: '规则', keywords: '起送价 配送费 凑单 免配送' } }),
  new Document({ pageContent: '减肥饮食建议：选择轻食沙拉、鸡胸肉、蔬菜汤。避免油炸食品和含糖饮料。先喝汤增加饱腹感，主食减半。', metadata: { source: 'knowledge', category: '饮食', keywords: '减肥 减脂 低卡 健康餐 轻食' } }),
  new Document({ pageContent: '增肌饮食建议：选择牛肉、鸡胸肉、鸡蛋、鱼肉等高蛋白食物。蛋白质摄入建议每公斤体重1.5-2g。', metadata: { source: 'knowledge', category: '饮食', keywords: '增肌 健身 蛋白质 高蛋白' } }),
];

class FoodRetriever extends BaseRetriever {
  lc_namespace = ['langchain', 'retrievers', 'food'];
  
  constructor(store) {
    super({ store });
    this.store = store;
  }

  async _getRelevantDocuments(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    for (const doc of this.store) {
      let score = 0;
      const content = doc.pageContent.toLowerCase();
      const keywords = (doc.metadata.keywords || '').toLowerCase();
      const words = lowerQuery.split(/\s+/);
      for (const word of words) {
        if (word.length < 1) continue;
        if (content.includes(word)) score += 2;
        if (keywords.includes(word)) score += 3;
      }
      if (score > 0) results.push({ doc, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 3).map(r => r.doc);
  }
}

const documentStore = [...foodDocuments];
const retriever = new FoodRetriever(documentStore);

const systemPrompt = `你是一个专业的AI美食助手，为外卖平台的用户提供服务。

你的能力：
1. 根据用户口味偏好推荐美食
2. 解答美食知识（菜品介绍、营养成分、烹饪方法）
3. 提供健康饮食建议（减肥、增肌、素食等）
4. 查询订单状态
5. 分析商家评价

回复规则：
- 使用emoji让回复更生动
- 推荐商品时附带价格和商家名
- 语言亲切友好，像一个懂美食的朋友
- 如果用户提到了具体口味偏好（辣、甜、清淡等），优先推荐匹配的商品
- 回复简洁有用，不超过200字`;

const recommendPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(systemPrompt + '\n\n当前时间：{time}\n用户历史偏好：{preferences}'),
  new MessagesPlaceholder('chat_history'),
  HumanMessagePromptTemplate.fromTemplate('{input}\n\n相关知识参考：\n{context}'),
]);

class LangChainService {
  constructor() {
    this.chatHistories = new Map();
  }

  getHistory(customerId) {
    if (!this.chatHistories.has(customerId)) {
      this.chatHistories.set(customerId, []);
    }
    return this.chatHistories.get(customerId);
  }

  clearHistory(customerId) {
    this.chatHistories.set(customerId, []);
  }

  async retrieveDocuments(query) {
    const docs = await retriever.invoke(query);
    return docs.map(d => d.pageContent).join('\n') || '暂无相关知识';
  }

  formatChatHistory(history) {
    return history.slice(-10).map(msg => {
      if (msg.role === 'user') return { _getType: () => 'human', content: msg.content };
      return { _getType: () => 'ai', content: msg.content };
    });
  }

  async getPreferences(customerId) {
    try {
      const [orders] = await pool.query(
        'SELECT p.name, p.description FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE o.customer_id = ? LIMIT 10',
        [customerId]
      );
      if (orders.length === 0) return '暂无历史订单';
      return orders.map(o => o.name).join('、');
    } catch (e) {
      return '暂无历史数据';
    }
  }

  detectIntent(message) {
    const msg = message.toLowerCase();
    if (/推荐|吃什么|吃啥|不知道|选择困难|随便|推荐下/.test(msg)) return 'recommend';
    if (/营养|热量|卡路里|蛋白质|脂肪|维生素|成分|做法|食材/.test(msg)) return 'knowledge';
    if (/订单|配送|物流|什么时候到|下单|取消/.test(msg)) return 'order';
    if (/减肥|低卡|低脂|健康餐|轻食|增肌|健身|素食|忌口/.test(msg)) return 'diet';
    if (/你好|hi|hello|嗨|在吗|你是谁/.test(msg)) return 'greeting';
    return 'general';
  }

  async chat(customerId, message) {
    const intent = this.detectIntent(message);
    const history = this.getHistory(customerId);
    history.push({ role: 'user', content: message });

    let result;
    switch (intent) {
      case 'recommend': result = await this.handleRecommend(customerId, message, history); break;
      case 'knowledge': result = await this.handleKnowledge(customerId, message, history); break;
      case 'order': result = await this.handleOrder(customerId, message, history); break;
      case 'diet': result = await this.handleDiet(customerId, message, history); break;
      case 'greeting': result = this.handleGreeting(); break;
      default: result = await this.handleGeneral(customerId, message, history);
    }

    history.push({ role: 'assistant', content: result.text });
    if (history.length > 20) history.splice(0, history.length - 20);

    return { ...result, intent };
  }

  async handleRecommend(customerId, message, history) {
    const context = await this.retrieveDocuments(message);
    const preferences = await this.getPreferences(customerId);
    const time = new Date().toLocaleString('zh-CN', { hour: 'numeric', minute: 'numeric', hour12: false });
    const chatHistory = this.formatChatHistory(history.slice(0, -1));

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
    if (/辣|麻辣/.test(message)) filtered = products.filter(p => /辣|麻|川/.test(p.name + (p.description || '')));
    else if (/甜|奶茶|甜品/.test(message)) filtered = products.filter(p => /甜|奶茶|蛋糕|饮/.test(p.name + (p.description || '')));
    else if (/便宜|实惠/.test(message)) filtered = [...products].sort((a, b) => a.price - b.price);
    else filtered = products.sort(() => Math.random() - 0.5);
    if (filtered.length === 0) filtered = products.slice(0, 5);
    const topPicks = filtered.slice(0, 3);

    let text = '🤖 为您智能推荐：\n\n';
    topPicks.forEach((p, i) => {
      text += `${i + 1}. ${p.name} - ¥${Number(p.price).toFixed(2)}`;
      if (p.shop_name) text += ` (${p.shop_name})`;
      text += '\n';
    });
    text += `\n💡 结合您的口味偏好和当前时间为您推荐`;

    return {
      text,
      products: topPicks.map(p => ({ id: p.id, name: p.name, price: p.price, image_url: p.image_url, shop_name: p.shop_name })),
      suggestions: ['换个口味', '推荐辣的', '推荐甜品', '推荐便宜的']
    };
  }

  async handleKnowledge(customerId, message, history) {
    const context = await this.retrieveDocuments(message);
    const chatHistory = this.formatChatHistory(history.slice(0, -1));

    let text;
    if (context && context !== '暂无相关知识') {
      text = `📚 ${context}\n\n💡 如需了解更多，可以继续问我！`;
    } else {
      const kbResult = knowledgeBase.search(message);
      if (kbResult) {
        text = `📚 ${kbResult.answer}\n\n💡 ${kbResult.tip || ''}`;
      } else {
        text = '🤔 这个问题我还在学习中～你可以问我关于菜品、营养、饮食建议等问题。';
      }
    }

    return { text, suggestions: ['推荐相关美食', '了解更多营养知识', '推荐健康餐'] };
  }

  async handleOrder(customerId, message, history) {
    try {
      const [orders] = await pool.query(
        'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 3', [customerId]
      );
      if (orders.length === 0) {
        return { text: '📋 您还没有订单记录哦～去看看有什么好吃的吧！', suggestions: ['推荐美食', '浏览商家'] };
      }
      const latest = orders[0];
      const statusMap = { pending: '待付款', paid: '已付款', shipping: '配送中', completed: '已完成', cancelled: '已取消' };
      let text = `📋 您最近的订单：\n\n`;
      text += `订单号：${latest.order_no}\n`;
      text += `状态：${statusMap[latest.status] || latest.status}\n`;
      text += `金额：¥${Number(latest.total_amount).toFixed(2)}\n`;
      text += `时间：${new Date(latest.created_at).toLocaleString('zh-CN')}`;
      return { text, suggestions: ['查看全部订单', '再来一单'] };
    } catch (e) {
      return { text: '📋 订单查询暂时不可用，请稍后再试', suggestions: ['推荐美食'] };
    }
  }

  async handleDiet(customerId, message, history) {
    const context = await this.retrieveDocuments(message);
    let text;
    if (/减肥|减脂|低卡/.test(message)) {
      text = '🥗 减肥饮食建议：\n\n推荐选择：\n• 轻食沙拉（200-400kcal）\n• 鸡胸肉沙拉（高蛋白低脂）\n• 蔬菜汤/清汤面\n\n⚠️ 避免：油炸食品、含糖饮料\n\n💡 先喝汤增加饱腹感，主食减半～';
    } else if (/增肌|健身|蛋白/.test(message)) {
      text = '💪 增肌饮食建议：\n\n推荐选择：\n• 牛肉/鸡胸肉（高蛋白）\n• 鸡蛋类菜品\n• 鱼肉/虾（优质蛋白）\n\n💡 蛋白质建议：每公斤体重1.5-2g';
    } else {
      text = '🍽️ 饮食建议：均衡饮食是关键，每餐有蛋白质+碳水+蔬菜。\n\n告诉我你的具体需求，我可以给更精准的建议！';
    }
    return { text, suggestions: ['推荐轻食', '高蛋白食物', '低卡食物推荐'] };
  }

  handleGreeting() {
    const hour = new Date().getHours();
    let timeGreeting = hour >= 6 && hour < 10 ? '早上好！' : hour >= 11 && hour < 14 ? '中午好！' : hour >= 17 && hour < 20 ? '晚上好！' : hour >= 20 || hour < 2 ? '夜宵时间！' : '你好！';
    return {
      text: `${timeGreeting} 🤖 我是您的AI美食助手！\n\n我可以帮你：\n🎯 智能推荐美食\n📚 解答美食知识\n🥗 提供营养建议\n📋 查询订单状态\n\n有什么我可以帮你的吗？`,
      suggestions: ['今天吃什么', '推荐辣的', '营养知识', '查看订单']
    };
  }

  async handleGeneral(customerId, message, history) {
    const context = await this.retrieveDocuments(message);
    return {
      text: '🤖 我理解你的意思～试试这些指令：\n• "推荐美食" - 智能推荐\n• "今天吃什么" - 随机推荐\n• "什么是宫保鸡丁" - 美食知识\n• "减肥适合吃什么" - 饮食建议',
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

module.exports = new LangChainService();
