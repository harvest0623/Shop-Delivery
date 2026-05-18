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
.statistics-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 80px;
}

.page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 20px;
    text-align: center;
    position: relative;
}

.back-btn {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.back-btn:hover {
    background: rgba(255,255,255,0.3);
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
}

.subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.time-filter {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding: 5px 0;
}

.filter-btn {
    padding: 8px 20px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
}

.filter-btn.active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-color: transparent;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-icon {
    font-size: 32px;
}

.stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #333;
}

.stat-label {
    font-size: 13px;
    color: #888;
    margin-top: 4px;
}

.section {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 20px;
    color: #333;
}

.status-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.status-card {
    text-align: center;
    padding: 15px;
    border-radius: 12px;
}

.status-card.pending {
    background: #fff3e0;
    color: #ff9800;
}

.status-card.completed {
    background: #e8f5e9;
    color: #4caf50;
}

.status-card.returned {
    background: #fce4ec;
    color: #e91e63;
}

.status-card.cancelled {
    background: #eceff1;
    color: #9e9e9e;
}

.status-count {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
}

.status-label {
    font-size: 12px;
}

.products-list, .shops-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-item, .shop-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #fafafa;
    border-radius: 12px;
}

.product-rank, .shop-rank {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-radius: 50%;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
}

.product-image, .shop-image {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.product-image img, .shop-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info, .shop-info {
    flex: 1;
}

.product-info h4, .shop-info h4 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 600;
}

.product-shop {
    margin: 0;
    font-size: 12px;
    color: #888;
}

.product-stats, .shop-stats {
    text-align: right;
}

.product-qty, .shop-orders {
    font-size: 12px;
    color: #888;
    margin-bottom: 4px;
}

.product-amount, .shop-amount {
    font-size: 16px;
    font-weight: 700;
    color: #ff6b6b;
}

.trend-chart {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
}

.trend-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 10px;
    background: #fafafa;
    border-radius: 8px;
    font-size: 14px;
}

.trend-date {
    flex: 1;
}

.trend-orders {
    flex: 1;
    text-align: center;
}

.trend-amount {
    flex: 1;
    text-align: right;
    font-weight: 600;
    color: #ff6b6b;
}

@media (min-width: 768px) {
    .stats-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
</style>
