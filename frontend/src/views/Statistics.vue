<template>
    <div class="statistics-page">
        <div class="page-header">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <h1>📊 销售统计</h1>
            <p class="subtitle">全方位数据分析，助力经营决策</p>
        </div>

        <div class="container">
            <!-- 时间筛选 -->
            <div class="time-filter">
                <button
                    v-for="range in timeRanges"
                    :key="range.value"
                    class="filter-btn"
                    :class="{ active: selectedRange === range.value }"
                    @click="changeRange(range.value)"
                >
                    {{ range.label }}
                </button>
            </div>

            <!-- 核心指标卡片 -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📦</div>
                    <div class="stat-info">
                        <div class="stat-value">{{ statistics.totalOrders }}</div>
                        <div class="stat-label">订单总数</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <div class="stat-value">¥{{ formatNumber(statistics.totalSales) }}</div>
                        <div class="stat-label">销售总额</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-info">
                        <div class="stat-value">¥{{ formatNumber(statistics.netSales) }}</div>
                        <div class="stat-label">净销售额</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">↩️</div>
                    <div class="stat-info">
                        <div class="stat-value">¥{{ formatNumber(statistics.totalRefunds) }}</div>
                        <div class="stat-label">退货金额</div>
                    </div>
                </div>
            </div>

            <!-- 订单状态分布 -->
            <div class="section">
                <h2 class="section-title">订单状态分布</h2>
                <div class="status-grid">
                    <div class="status-card pending">
                        <div class="status-count">{{ statistics.pendingOrders }}</div>
                        <div class="status-label">待处理</div>
                    </div>
                    <div class="status-card completed">
                        <div class="status-count">{{ statistics.completedOrders }}</div>
                        <div class="status-label">已完成</div>
                    </div>
                    <div class="status-card returned">
                        <div class="status-count">{{ statistics.returnedOrders }}</div>
                        <div class="status-label">已退货</div>
                    </div>
                    <div class="status-card cancelled">
                        <div class="status-count">{{ statistics.cancelledOrders }}</div>
                        <div class="status-label">已取消</div>
                    </div>
                </div>
            </div>

            <!-- 热销商品 -->
            <div class="section">
                <h2 class="section-title">🔥 热销商品 TOP10</h2>
                <div class="products-list">
                    <div
                        v-for="(product, index) in statistics.topProducts"
                        :key="product.id"
                        class="product-item"
                    >
                        <div class="product-rank">{{ index + 1 }}</div>
                        <div class="product-image">
                            <img :src="product.image_url" :alt="product.name" />
                        </div>
                        <div class="product-info">
                            <h4>{{ product.name }}</h4>
                            <p class="product-shop">{{ product.shop_name }}</p>
                        </div>
                        <div class="product-stats">
                            <div class="product-qty">销量：{{ product.total_quantity }}</div>
                            <div class="product-amount">¥{{ formatNumber(product.total_amount) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 热门商家 -->
            <div class="section">
                <h2 class="section-title">🏪 热门商家 TOP10</h2>
                <div class="shops-list">
                    <div
                        v-for="(shop, index) in statistics.topShops"
                        :key="shop.id"
                        class="shop-item"
                    >
                        <div class="shop-rank">{{ index + 1 }}</div>
                        <div class="shop-image">
                            <img :src="shop.image_url" :alt="shop.name" />
                        </div>
                        <div class="shop-info">
                            <h4>{{ shop.name }}</h4>
                        </div>
                        <div class="shop-stats">
                            <div class="shop-orders">{{ shop.order_count }} 单</div>
                            <div class="shop-amount">¥{{ formatNumber(shop.total_amount) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 销售趋势 -->
            <div class="section">
                <h2 class="section-title">📈 销售趋势</h2>
                <div class="trend-chart">
                    <div class="chart-header">
                        <span>日期</span>
                        <span>订单数</span>
                        <span>销售额</span>
                    </div>
                    <div
                        v-for="day in statistics.dailyTrend"
                        :key="day.date"
                        class="trend-row"
                    >
                        <span class="trend-date">{{ day.date }}</span>
                        <span class="trend-orders">{{ day.order_count }} 单</span>
                        <span class="trend-amount">¥{{ formatNumber(day.amount) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const selectedRange = ref('all')
const statistics = ref({
    totalOrders: 0,
    totalSales: 0,
    totalRefunds: 0,
    netSales: 0,
    pendingOrders: 0,
    completedOrders: 0,
    returnedOrders: 0,
    cancelledOrders: 0,
    topProducts: [],
    topShops: [],
    dailyTrend: []
})

const timeRanges = [
    { label: '今日', value: 'today' },
    { label: '近7天', value: 'week' },
    { label: '近30天', value: 'month' },
    { label: '全部', value: 'all' }
]

const formatNumber = (num) => {
    if (!num) return '0.00'
    return Number(num).toFixed(2)
}

const loadStatistics = async () => {
    try {
        const response = await axios.get(`/api/statistics?range=${selectedRange.value}`)
        statistics.value = response.data
    } catch (error) {
        console.error('加载统计数据失败:', error)
    }
}

const changeRange = (range) => {
    selectedRange.value = range
    loadStatistics()
}

const goBack = () => {
    window.history.back()
}

onMounted(() => {
    loadStatistics()
})
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes countUp {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }
    60% {
        transform: scale(1.06);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.statistics-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 80px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 48px 20px 42px;
    text-align: center;
    position: relative;
    border-radius: 0 0 24px 24px;
    box-shadow: 0 4px 24px rgba(102, 126, 234, 0.3);
}

.back-btn {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-50%) scale(1.1);
}

.back-btn span {
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.page-header h1 {
    margin: 0 0 10px;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
    font-weight: 300;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px 20px;
}

.time-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    overflow-x: auto;
    padding: 5px 0;
    justify-content: center;
}

.filter-btn {
    padding: 10px 24px;
    border: none;
    background: white;
    border-radius: 50px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    color: #666;
    font-weight: 500;
}

.filter-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
}

.filter-btn:hover:not(.active) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    border-radius: 16px;
    padding: 24px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
}

.stat-card:nth-child(1) {
    animation-delay: 0.1s;
}

.stat-card:nth-child(2) {
    animation-delay: 0.2s;
}

.stat-card:nth-child(3) {
    animation-delay: 0.3s;
}

.stat-card:nth-child(4) {
    animation-delay: 0.4s;
}

.stat-card::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 0 4px 4px 0;
}

.stat-card:nth-child(1)::before {
    background: linear-gradient(180deg, #4facfe, #00f2fe);
}

.stat-card:nth-child(2)::before {
    background: linear-gradient(180deg, #43e97b, #38f9d7);
}

.stat-card:nth-child(3)::before {
    background: linear-gradient(180deg, #f7971e, #ffd200);
}

.stat-card:nth-child(4)::before {
    background: linear-gradient(180deg, #a18cd1, #fbc2eb);
}

.stat-card:nth-child(1) .stat-icon {
    background: linear-gradient(135deg, #eef5ff, #dbeafe);
}

.stat-card:nth-child(2) .stat-icon {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.stat-card:nth-child(3) .stat-icon {
    background: linear-gradient(135deg, #fff7ed, #fed7aa);
}

.stat-card:nth-child(4) .stat-icon {
    background: linear-gradient(135deg, #faf5ff, #e9d5ff);
}

.stat-card:nth-child(1) .stat-value {
    color: #3b82f6;
}

.stat-card:nth-child(2) .stat-value {
    color: #10b981;
}

.stat-card:nth-child(3) .stat-value {
    color: #f59e0b;
}

.stat-card:nth-child(4) .stat-value {
    color: #8b5cf6;
}

.stat-icon {
    font-size: 28px;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fe;
    border-radius: 14px;
    flex-shrink: 0;
}

.stat-info {
    min-width: 0;
}

.stat-value {
    font-size: 24px;
    font-weight: 800;
    line-height: 1.2;
    animation: countUp 0.8s ease forwards;
}

.stat-label {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
    font-weight: 400;
}

.section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
    animation-delay: 0.5s;
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 20px;
    color: #333;
    padding-left: 12px;
    border-left: 3px solid #667eea;
    line-height: 1;
}

.status-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.status-card {
    text-align: center;
    padding: 20px 15px;
    border-radius: 14px;
    transition: all 0.3s ease;
}

.status-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.status-card.pending {
    background: linear-gradient(135deg, #fff8e1, #ffecb3);
    color: #ef6c00;
}

.status-card.completed {
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    color: #2e7d32;
}

.status-card.returned {
    background: linear-gradient(135deg, #fce4ec, #f8bbd0);
    color: #c62828;
}

.status-card.cancelled {
    background: linear-gradient(135deg, #eceff1, #cfd8dc);
    color: #546e7a;
}

.status-count {
    font-size: 30px;
    font-weight: 800;
    margin-bottom: 6px;
    animation: countUp 0.8s ease forwards;
}

.status-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.products-list,
.shops-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.product-item,
.shop-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: #f8f9fc;
    border-radius: 14px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.product-item::before,
.shop-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(102, 126, 234, 0.08), rgba(102, 126, 234, 0.01));
    border-radius: 14px;
    z-index: 0;
    transition: width 0.6s ease;
}

.product-item:nth-child(1)::before,
.shop-item:nth-child(1)::before {
    width: 100%;
}

.product-item:nth-child(2)::before,
.shop-item:nth-child(2)::before {
    width: 90%;
}

.product-item:nth-child(3)::before,
.shop-item:nth-child(3)::before {
    width: 80%;
}

.product-item:nth-child(4)::before,
.shop-item:nth-child(4)::before {
    width: 70%;
}

.product-item:nth-child(5)::before,
.shop-item:nth-child(5)::before {
    width: 60%;
}

.product-item:nth-child(6)::before,
.shop-item:nth-child(6)::before {
    width: 50%;
}

.product-item:nth-child(7)::before,
.shop-item:nth-child(7)::before {
    width: 40%;
}

.product-item:nth-child(8)::before,
.shop-item:nth-child(8)::before {
    width: 30%;
}

.product-item:nth-child(9)::before,
.shop-item:nth-child(9)::before {
    width: 25%;
}

.product-item:nth-child(10)::before,
.shop-item:nth-child(10)::before {
    width: 20%;
}

.product-item:hover,
.shop-item:hover {
    background: #eef1f8;
    transform: translateX(4px);
}

.product-rank,
.shop-rank {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
    color: white;
    position: relative;
    z-index: 1;
}

.product-item:nth-child(1) .product-rank,
.shop-item:nth-child(1) .shop-rank {
    background: linear-gradient(135deg, #f6d365, #fda085);
    box-shadow: 0 3px 12px rgba(246, 211, 101, 0.45);
    width: 36px;
    height: 36px;
    font-size: 14px;
}

.product-item:nth-child(2) .product-rank,
.shop-item:nth-child(2) .shop-rank {
    background: linear-gradient(135deg, #cfd9df, #e2ebf0);
    box-shadow: 0 3px 10px rgba(180, 190, 200, 0.4);
    color: #666;
    width: 34px;
    height: 34px;
}

.product-item:nth-child(3) .product-rank,
.shop-item:nth-child(3) .shop-rank {
    background: linear-gradient(135deg, #cd7f32, #daa06d);
    box-shadow: 0 3px 10px rgba(205, 127, 50, 0.4);
    width: 34px;
    height: 34px;
}

.product-item:nth-child(n+4) .product-rank,
.shop-item:nth-child(n+4) .shop-rank {
    background: linear-gradient(135deg, #667eea, #764ba2);
}

.product-image,
.shop-image {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 1;
}

.product-image img,
.shop-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info,
.shop-info {
    flex: 1;
    min-width: 0;
    position: relative;
    z-index: 1;
}

.product-info h4,
.shop-info h4 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-shop {
    margin: 0;
    font-size: 12px;
    color: #999;
}

.product-stats,
.shop-stats {
    text-align: right;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}

.product-qty,
.shop-orders {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
}

.product-amount,
.shop-amount {
    font-size: 16px;
    font-weight: 700;
    color: #667eea;
}

.trend-chart {
    border: 1px solid #f0f2f8;
    border-radius: 12px;
    overflow: hidden;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    padding: 14px 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    font-weight: 600;
    font-size: 13px;
}

.trend-row {
    display: flex;
    justify-content: space-between;
    padding: 13px 16px;
    font-size: 14px;
    border-bottom: 1px solid #f5f7fa;
    transition: background 0.2s ease;
}

.trend-row:last-child {
    border-bottom: none;
}

.trend-row:nth-child(even) {
    background: #fafbfe;
}

.trend-row:hover {
    background: #f0f2f8;
}

.trend-date {
    flex: 1;
    color: #555;
    font-weight: 500;
}

.trend-orders {
    flex: 1;
    text-align: center;
    color: #666;
}

.trend-amount {
    flex: 1;
    text-align: right;
    font-weight: 700;
    color: #667eea;
}

@media (max-width: 767px) {
    .page-header {
        padding: 36px 16px 32px;
    }

    .page-header h1 {
        font-size: 22px;
    }

    .time-filter {
        justify-content: flex-start;
    }

    .filter-btn {
        padding: 8px 18px;
        font-size: 13px;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .stat-card {
        padding: 16px 14px;
        gap: 12px;
    }

    .stat-icon {
        width: 44px;
        height: 44px;
        font-size: 22px;
    }

    .stat-value {
        font-size: 18px;
    }

    .status-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .section {
        padding: 18px 16px;
    }

    .product-image,
    .shop-image {
        width: 42px;
        height: 42px;
    }
}

@media (min-width: 768px) and (max-width: 1024px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
