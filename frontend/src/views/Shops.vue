<template>
    <div class="shops-page">
        <div class="header-section">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <div class="header-content">
                <h1>🏪 发现好店</h1>
                <p>全城优质商家，30分钟送达</p>
            </div>
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input v-model="searchQuery" placeholder="搜索商家..." class="search-input" />
            </div>
        </div>

        <div class="shops-container">
            <div class="stats-bar">
                <div class="stat-item">
                    <span class="stat-num">{{ shops.length }}</span>
                    <span class="stat-label">优质商家</span>
                </div>
                <div class="stat-item">
                    <span class="stat-num">30</span>
                    <span class="stat-label">分钟送达</span>
                </div>
                <div class="stat-item">
                    <span class="stat-num">4.5+</span>
                    <span class="stat-label">平均评分</span>
                </div>
            </div>

            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>正在加载商家...</p>
            </div>

            <div v-else-if="filteredShops.length === 0" class="empty">
                <div class="empty-icon">🔍</div>
                <h3>没有找到商家</h3>
                <p>试试其他关键词</p>
            </div>

            <div v-else class="shops-grid">
                <div
                    v-for="shop in filteredShops"
                    :key="shop.id"
                    class="shop-card"
                    @click="goToShop(shop.id)"
                >
                    <div class="shop-image-wrapper">
                        <img :src="shop.image_url" :alt="shop.name" class="shop-image" />
                        <div class="shop-badge" v-if="shop.rating >= 4.8">🔥 热门</div>
                        <div class="delivery-time">🚀 {{ shop.delivery_time }}分钟</div>
                    </div>
                    <div class="shop-info">
                        <div class="shop-header">
                            <h3>{{ shop.name }}</h3>
                            <div class="rating">
                                <span class="star">⭐</span>
                                <span class="score">{{ shop.rating }}</span>
                            </div>
                        </div>
                        <p class="shop-desc">{{ shop.description }}</p>
                        <div class="shop-tags">
                            <span class="tag" v-if="shop.delivery_fee === 0">免配送费</span>
                            <span class="tag" v-else>配送¥{{ shop.delivery_fee }}</span>
                            <span class="tag">起送¥{{ shop.min_order }}</span>
                        </div>
                        <div class="shop-footer">
                            <span class="address">📍 {{ shop.address }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const shops = ref([])
const searchQuery = ref('')
const loading = ref(true)

const filteredShops = computed(() => {
    let result = shops.value
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(s =>
            s.name.toLowerCase().includes(query) ||
            (s.description && s.description.toLowerCase().includes(query))
        )
    }
    return result
})

const goToShop = (id) => {
    window.location.href = `/shop/${id}`
}

const goBack = () => {
    window.history.back()
}

onMounted(async () => {
    try {
        const shopsRes = await axios.get('/api/shops')
        shops.value = shopsRes.data
    } catch (error) {
        console.error('加载失败:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.shops-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding-bottom: 80px;
}

.header-section {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    padding: 30px 15px 20px;
    position: sticky;
    top: 0;
    z-index: 100;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 15px;
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
    transform: scale(1.1);
}

.back-btn span {
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.header-content {
    text-align: center;
    margin-bottom: 20px;
}

.header-content h1 {
    margin: 0 0 8px;
    font-size: 24px;
    color: white;
    font-weight: 700;
}

.header-content p {
    margin: 0;
    color: rgba(255,255,255,0.9);
    font-size: 14px;
}

.search-bar {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 30px;
    padding: 12px 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    max-width: 500px;
    margin: 0 auto;
}

.search-icon {
    margin-right: 10px;
    font-size: 18px;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
    background: transparent;
}

.shops-container {
    padding: 20px 15px;
    max-width: 800px;
    margin: 0 auto;
}

.stats-bar {
    display: flex;
    justify-content: space-around;
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.stat-item {
    text-align: center;
}

.stat-num {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #ff6b6b;
}

.stat-label {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
}

.loading {
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f0f0f0;
    border-top-color: #ff6b6b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.empty {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.empty h3 {
    margin: 0 0 8px;
    color: #333;
}

.empty p {
    margin: 0;
    color: #888;
}

.shops-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.shop-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: all 0.3s ease;
}

.shop-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.shop-image-wrapper {
    position: relative;
    width: 130px;
    height: 130px;
    flex-shrink: 0;
}

.shop-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.shop-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 600;
}

.delivery-time {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0,0,0,0.7);
    color: white;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 8px;
}

.shop-info {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.shop-header h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: #333;
}

.rating {
    display: flex;
    align-items: center;
    gap: 4px;
}

.star {
    font-size: 14px;
}

.score {
    font-size: 15px;
    font-weight: 700;
    color: #ff9500;
}

.shop-desc {
    margin: 0 0 8px;
    font-size: 13px;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shop-tags {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
}

.tag {
    padding: 4px 10px;
    background: #fff5f5;
    color: #ff6b6b;
    font-size: 12px;
    border-radius: 10px;
    font-weight: 500;
}

.shop-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.address {
    font-size: 12px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (min-width: 768px) {
    .shops-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
