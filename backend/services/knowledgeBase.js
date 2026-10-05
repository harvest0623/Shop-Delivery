const knowledgeEntries = [
  { keywords: ['宫保鸡丁', '宫保'], answer: '宫保鸡丁是四川传统名菜，以鸡胸肉丁、干辣椒、花生米为主料，口味麻辣鲜香。主要营养：蛋白质丰富，花生含有不饱和脂肪酸。热量约350kcal/份。', tip: '宫保鸡丁配米饭是经典搭配，但注意花生热量较高。', followUp: ['推荐宫保鸡丁', '川菜推荐'] },
  { keywords: ['麻婆豆腐', '麻婆'], answer: '麻婆豆腐是四川名菜，嫩豆腐配肉末、花椒、豆瓣酱烹制。营养：豆腐含丰富植物蛋白和钙质。热量约200kcal/份。', tip: '豆腐是优质植物蛋白来源，适合素食者。', followUp: ['推荐豆腐菜品', '素食推荐'] },
  { keywords: ['沙拉', '蔬菜沙拉'], answer: '蔬菜沙拉是健康饮食的代表，富含膳食纤维、维生素和矿物质。一份蔬菜沙拉约100-200kcal。可搭配鸡胸肉增加蛋白质。', tip: '注意沙拉酱的热量，建议选油醋汁而非千岛酱。', followUp: ['推荐轻食', '低卡食物'] },
  { keywords: ['奶茶', '珍珠奶茶'], answer: '珍珠奶茶热量约300-500kcal/杯，含糖量较高。一杯奶茶相当于2-3碗米饭的热量。建议选择少糖或无糖。', tip: '想喝奶茶又怕胖？试试无糖+少冰+椰果替代珍珠。', followUp: ['推荐低卡饮品', '健康饮品'] },
  { keywords: ['汉堡', '鸡肉汉堡'], answer: '一个鸡肉汉堡约400-600kcal，含蛋白质、碳水化合物和脂肪。搭配蔬菜和酱料营养更均衡。', tip: '选择烤制而非油炸的汉堡可以减少约30%的热量。', followUp: ['推荐汉堡', '快餐推荐'] },
  { keywords: ['披萨', '比萨'], answer: '披萨源自意大利，以面饼、番茄酱、芝士和各种配料制成。一片芝士披萨约200-300kcal。', tip: '薄底披萨比厚底热量低约20%，蔬菜配料比肉料更健康。', followUp: ['推荐披萨', '西餐推荐'] },
  { keywords: ['寿司', '刺身'], answer: '日式寿司热量较低，一个握寿司约40-60kcal。三文鱼刺身富含Omega-3脂肪酸，对心脑血管有益。', tip: '寿司虽好但芥末和酱油含钠量高，注意适量。', followUp: ['推荐日料', '清淡食物'] },
  { keywords: ['粥', '皮蛋瘦肉粥'], answer: '粥是易消化的主食，皮蛋瘦肉粥约150-200kcal/碗。富含碳水化合物，瘦肉提供优质蛋白。', tip: '粥适合肠胃不适时食用，清淡好消化。', followUp: ['推荐粥类', '养胃食物'] },
  { keywords: ['蛋白质', '蛋白'], answer: '蛋白质是人体必需的营养素，推荐每日摄入量为每公斤体重0.8-1.2g。优质蛋白来源：鸡胸肉、鱼、蛋、豆腐、牛奶。', tip: '运动后30分钟内补充蛋白质效果最佳。', followUp: ['高蛋白食物推荐', '健身餐推荐'] },
  { keywords: ['热量', '卡路里', '卡'], answer: '成人每日推荐热量摄入：男性2000-2500kcal，女性1500-2000kcal。外卖一餐通常在500-1000kcal之间。', tip: '控制热量不等于节食，关键是营养均衡。', followUp: ['低卡食物推荐', '营养搭配'] },
  { keywords: ['维生素', '维C', '维c'], answer: '维生素C：柑橘类水果、猕猴桃、西兰花含量丰富。维生素A：胡萝卜、菠菜。B族维生素：全谷物、瘦肉。', tip: '维生素C可以促进铁的吸收，建议蔬果搭配肉类食用。', followUp: ['推荐水果', '营养搭配'] },
  { keywords: ['川菜', '四川菜'], answer: '川菜是中国八大菜系之一，以"一菜一格，百菜百味"著称。代表菜：宫保鸡丁、麻婆豆腐、回锅肉、水煮鱼。特点是麻辣鲜香。', tip: '川菜虽然美味，但辣度较高，肠胃敏感者适量食用。', followUp: ['推荐川菜', '推荐辣的'] },
  { keywords: ['粤菜', '广东菜'], answer: '粤菜以清淡鲜美著称，注重食材原味。代表菜：白切鸡、烧鹅、蒸鱼、煲仔饭。烹饪方式以蒸、炒、煲为主。', tip: '粤菜口味清淡，适合不太能吃辣的朋友。', followUp: ['推荐粤菜', '清淡食物'] },
  { keywords: ['起送', '起送价', '最低消费'], answer: '本平台起送价为30元，配送费5元（满50元免配送费）。凑单小技巧：加一份小食或饮品即可达到起送价。', tip: '加入购物车后系统会自动提示还差多少起送～', followUp: ['推荐便宜商品', '凑单攻略'] },
  { keywords: ['配送', '外卖', '送到'], answer: '配送范围：一般3-5公里内。配送时间：通常30-60分钟。恶劣天气可能延迟，请耐心等待。', tip: '高峰期下单可能需要更长时间，建议提前下单。', followUp: ['查看订单状态', '联系商家'] },
];

class KnowledgeBase {
  search(query) {
    const lowerQuery = query.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of knowledgeEntries) {
      let score = 0;
      for (const keyword of entry.keywords) {
        if (lowerQuery.includes(keyword)) {
          score += keyword.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }
    return bestScore > 0 ? bestMatch : null;
  }

  getAll() {
    return knowledgeEntries;
  }
}

module.exports = new KnowledgeBase();
