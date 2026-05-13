<template>
    <div class="statistics-page">
        <div class="page-header">
            <h1>📊 销售统计</h1>
            <div class="time-filter">
                <select v-model="timeRange" @change="loadStatistics">
                    <option value="today">今日</option>
                    <option value="week">本周</option>
                    <option value="month">本月</option>
                    <option value="all">全部</option>
                </select>
            </div>
        </div>

        <div v-if="loading" class="loading">加载中...</div>

        <div v-else class="statistics-content">
            <!-- 概览卡片 -->
            <div class="overview-cards">
                <div class="card total-orders">
                    <div class="card-icon">📦</div>
                    <div class="card-content">
                        <div class="card-value">{{ statistics.totalOrders }}</div>
                        <div class="card-label">总订单数</div>
                    </div>
                </div>

                <div class="card total-sales">
                    <div class="card-icon">💰</div>
                    <div class="card-content">
                        <div class="card-value">¥{{ Number(statistics.totalSales).toFixed(2) }}</div>
                        <div class="card-label">总销售额</div>
                    </div>
                </div>

                <div class="card total-refunds">
                    <div class="card-icon">🔙</div>
                    <div class="card-content">
                        <div class="card-value">¥{{ Number(statistics.totalRefunds).toFixed(2) }}</div>
                        <div class="card-label">总退货金额</div>
                    </div>
                </div>

                <div class="card net-sales">
                    <div class="card-icon">📈</div>
                    <div class="card-content">
                        <div class="card-value">¥{{ Number(statistics.netSales).toFixed(2) }}</div>
                        <div class="card-label">净销售额</div>
                    </div>
                </div>
            </div>

            <!-- 订单状态分布 -->
            <div class="chart-section">
                <h2>📊 订单状态分布</h2>
                <div class="status-chart">
                    <div class="status-item">
                        <span class="status-dot pending"></span>
                        <span class="status-label">待处理</span>
                        <span class="status-value">{{ statistics.pendingOrders }}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-dot processing"></span>
                        <span class="status-label">已完成</span>
                        <span class="status-value">{{ statistics.completedOrders }}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-dot returned"></span>
                        <span class="status-label">已退货</span>
                        <span class="status-value">{{ statistics.returnedOrders }}</span>
                    </div>
                    <div class="status-item">
                        <span class="status-dot cancelled"></span>
                        <span class="status-label">已取消</span>
                        <span class="status-value">{{ statistics.cancelledOrders }}</span>
                    </div>
                </div>
            </div>

            <!-- 热门商品 TOP 10 -->
            <div class="chart-section">
                <h2>🔥 热门商品 TOP 10</h2>
                <div class="product-ranking">
                    <div 
                        v-for="(item, index) in statistics.topProducts" 
                        :key="item.id"
                        class="ranking-item"
                    >
                        <div class="rank-number" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                        <img :src="item.image_url" :alt="item.name" class="product-image" />
                        <div class="product-info">
                            <h4>{{ item.name }}</h4>
                            <p class="shop-name">{{ item.shop_name }}</p>
                        </div>
                        <div class="product-stats">
                            <span class="sales-count">销量 {{ item.total_quantity }}</span>
                            <span class="sales-amount">¥{{ Number(item.total_amount).toFixed(0) }}</span>
                        </div>
                    </div>
                    <div v-if="statistics.topProducts.length === 0" class="no-data">
                        暂无销售数据
                    </div>
                </div>
            </div>

            <!-- 商家销售排行 -->
            <div class="chart-section">
                <h2>🏪 商家销售排行</h2>
                <div class="shop-ranking">
                    <div 
                        v-for="(shop, index) in statistics.topShops" 
                        :key="shop.id"
                        class="ranking-item"
                    >
                        <div class="rank-number" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                        <img :src="shop.image_url" :alt="shop.name" class="shop-image" />
                        <div class="shop-info">
                            <h4>{{ shop.name }}</h4>
                            <p class="order-count">订单数 {{ shop.order_count }}</p>
                        </div>
                        <div class="shop-sales">
                            <span class="sales-amount">¥{{ Number(shop.total_amount).toFixed(0) }}</span>
                        </div>
                    </div>
                    <div v-if="statistics.topShops.length === 0" class="no-data">
                        暂无销售数据
                    </div>
                </div>
            </div>

            <!-- 每日销售趋势 -->
            <div class="chart-section">
                <h2>📈 每日销售趋势</h2>
                <div class="trend-chart">
                    <div 
                        v-for="day in statistics.dailyTrend" 
                        :key="day.date"
                        class="trend-item"
                    >
                        <div class="trend-bar">
                            <div 
                                class="bar-fill" 
                                :style="{ height: getBarHeight(day.amount) + '%' }"
                            ></div>
                        </div>
                        <div class="trend-info">
                            <span class="trend-date">{{ formatDate(day.date) }}</span>
                            <span class="trend-amount">¥{{ Number(day.amount).toFixed(0) }}</span>
                        </div>
                    </div>
                    <div v-if="statistics.dailyTrend.length === 0" class="no-data">
                        暂无销售数据
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const timeRange = ref('month')
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

const maxDailyAmount = () => {
    if (statistics.value.dailyTrend.length === 0) return 0
    return Math.max(...statistics.value.dailyTrend.map(d => d.amount))
}

const getBarHeight = (amount) => {
    const max = maxDailyAmount()
    if (max === 0) return 0
    return Math.round((amount / max) * 100)
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
}

const loadStatistics = async () => {
    loading.value = true
    try {
        const response = await axios.get(`/api/statistics?range=${timeRange.value}`)
        statistics.value = response.data
        console.log('统计数据:', statistics.value)
    } catch (error) {
        console.error('加载统计数据失败:', error)
    } finally {
        loading.value = false
    }
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
    background: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.page-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}

.time-filter select {
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
}

.loading {
    text-align: center;
    padding: 80px;
    color: #999;
}

.statistics-content {
    padding: 20px;
}

.overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}

.card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.card-icon {
    font-size: 40px;
}

.card-content {
    flex: 1;
}

.card-value {
    font-size: 28px;
    font-weight: 700;
    color: #333;
}

.card-label {
    font-size: 14px;
    color: #999;
    margin-top: 5px;
}

.total-orders .card-icon { color: #667eea; }
.total-sales .card-icon { color: #4caf50; }
.total-refunds .card-icon { color: #f44336; }
.net-sales .card-icon { color: #ff9800; }

.chart-section {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.chart-section h2 {
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: 600;
}

.status-chart {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    background: #f8f9fa;
    border-radius: 12px;
    flex: 1;
    min-width: 150px;
}

.status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.status-dot.pending { background: #ff9800; }
.status-dot.processing { background: #4caf50; }
.status-dot.returned { background: #f44336; }
.status-dot.cancelled { background: #9e9e9e; }

.status-label {
    font-size: 14px;
    color: #666;
    flex: 1;
}

.status-value {
    font-size: 18px;
    font-weight: 700;
    color: #333;
}

.product-ranking, .shop-ranking {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ranking-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 12px;
}

.rank-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    background: #ddd;
    color: white;
}

.rank-number.rank-1 { background: #ffd700; }
.rank-number.rank-2 { background: #c0c0c0; }
.rank-number.rank-3 { background: #cd7f32; }

.product-image, .shop-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
}

.product-info, .shop-info {
    flex: 1;
}

.product-info h4, .shop-info h4 {
    margin: 0 0 5px;
    font-size: 16px;
    font-weight: 600;
}

.shop-name, .order-count {
    margin: 0;
    font-size: 13px;
    color: #667eea;
}

.product-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.sales-count {
    font-size: 13px;
    color: #666;
}

.sales-amount {
    font-size: 18px;
    font-weight: 700;
    color: #ff6b6b;
}

.shop-sales {
    font-size: 18px;
    font-weight: 700;
    color: #ff6b6b;
}

.trend-chart {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    height: 200px;
    overflow-x: auto;
}

.trend-item {
    flex: 1;
    min-width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.trend-bar {
    width: 100%;
    height: 150px;
    background: #f0f0f0;
    border-radius: 8px 8px 0 0;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.bar-fill {
    background: linear-gradient(180deg, #ff6b6b 0%, #ee5a24 100%);
    border-radius: 8px 8px 0 0;
    min-height: 5px;
    transition: height 0.3s ease;
}

.trend-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
}

.trend-date {
    font-size: 11px;
    color: #999;
}

.trend-amount {
    font-size: 12px;
    font-weight: 600;
    color: #333;
}

.no-data {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 14px;
}

@media (max-width: 768px) {
    .overview-cards {
        grid-template-columns: 1fr 1fr;
    }
    
    .status-chart {
        flex-direction: column;
    }
    
    .ranking-item {
        flex-wrap: wrap;
    }
}
</style>