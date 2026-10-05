const positiveWords = ['好吃', '美味', '推荐', '新鲜', '实惠', '快', '热情', '满意', '赞', '不错', '喜欢', '好评', '棒', '香', '可口', '精致', '用心', '惊喜', '完美', '值得'];
const negativeWords = ['难吃', '失望', '慢', '贵', '少', '不新鲜', '差', '难', '凉了', '油腻', '腥', '淡', '咸', '脏', '不卫生', '退款', '投诉', '垃圾', '难以下咽'];

class SentimentAnalyzer {
  analyze(reviews) {
    if (!reviews || reviews.length === 0) return this.getMockAnalysis();

    let positive = 0, negative = 0, neutral = 0;
    const keywordFreq = {};
    const ratingSum = { taste: 0, service: 0, delivery: 0, count: 0 };

    reviews.forEach(review => {
      const content = (review.content || '').toLowerCase();
      let posCount = 0, negCount = 0;

      positiveWords.forEach(w => { if (content.includes(w)) { posCount++; keywordFreq[w] = (keywordFreq[w] || 0) + 1; } });
      negativeWords.forEach(w => { if (content.includes(w)) { negCount++; keywordFreq[w] = (keywordFreq[w] || 0) + 1; } });

      if (posCount > negCount) positive++;
      else if (negCount > posCount) negative++;
      else neutral++;
    });

    const sorted = Object.entries(keywordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const total = reviews.length || 1;
    const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total;

    return {
      total_reviews: total,
      average_rating: avgRating.toFixed(1),
      sentiment: {
        positive,
        negative,
        neutral,
        positive_rate: ((positive / total) * 100).toFixed(1) + '%',
        negative_rate: ((negative / total) * 100).toFixed(1) + '%'
      },
      hot_keywords: sorted.map(([word, count]) => ({ word, count })),
      summary: this.generateSummary(positive, negative, neutral, avgRating, sorted),
      suggestions: this.generateSuggestions(sorted)
    };
  }

  generateSummary(positive, negative, neutral, avgRating, keywords) {
    const top3 = keywords.slice(0, 3).map(k => k.word).join('、');
    let summary = `综合评分 ${avgRating.toFixed(1)} 分，`;
    if (positive > negative * 2) summary += '整体口碑非常好！';
    else if (negative > positive) summary += '存在一些差评，需要关注。';
    else summary += '评价中肯。';
    if (top3) summary += ` 高频关键词：${top3}。`;
    return summary;
  }

  generateSuggestions(keywords) {
    const suggestions = [];
    const negKeywords = keywords.filter(([w]) => negativeWords.includes(w));
    const posKeywords = keywords.filter(([w]) => positiveWords.includes(w));

    if (negKeywords.some(([w]) => ['慢', '配送'].includes(w))) suggestions.push('配送速度有提升空间');
    if (negKeywords.some(([w]) => ['贵', '少'].includes(w))) suggestions.push('性价比可以进一步优化');
    if (negKeywords.some(([w]) => ['难吃', '油腻', '咸', '淡'].includes(w))) suggestions.push('口味一致性需要加强');
    if (posKeywords.length > 0) suggestions.push(`保持${posKeywords[0][0]}方面的优势`);

    return suggestions;
  }

  getMockAnalysis() {
    return {
      total_reviews: 128,
      average_rating: '4.5',
      sentiment: { positive: 98, negative: 12, neutral: 18, positive_rate: '76.6%', negative_rate: '9.4%' },
      hot_keywords: [
        { word: '好吃', count: 45 }, { word: '推荐', count: 38 }, { word: '新鲜', count: 22 },
        { word: '实惠', count: 18 }, { word: '快', count: 15 }, { word: '满意', count: 12 },
        { word: '不错', count: 10 }, { word: '香', count: 8 }, { word: '精致', count: 6 }, { word: '好评', count: 5 }
      ],
      summary: '综合评分4.5分，整体口碑非常好！高频关键词：好吃、推荐、新鲜。',
      suggestions: ['保持口味方面的优势', '配送速度有提升空间']
    };
  }
}

module.exports = new SentimentAnalyzer();
