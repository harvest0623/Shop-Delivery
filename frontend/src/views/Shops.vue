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
                        <img :src="shop.image_url" :alt="shop.name" class="shop-image" @error="handleImageError($event, 'shop')" />
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
    background: linear-gradient(180deg, #FFF5F5 0%, #F8F9FA 300px, #F8F9FA 100%);
    padding-bottom: 80px;
}

.header-section {
    background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
    padding: 30px 15px 28px;
    position: sticky;
    top: 0;
    z-index: 100;
    border-radius: 0 0 24px 24px;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 15px;
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
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
}

.search-bar {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 30px;
    padding: 12px 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    margin: 0 auto;
    transition: box-shadow 0.3s ease;
}

.search-bar:focus-within {
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3), 0 0 0 3px rgba(255, 107, 129, 0.2);
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
    max-width: 1100px;
    margin: 0 auto;
}

.stats-bar {
    display: flex;
    justify-content: space-around;
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-item {
    text-align: center;
}

.stat-num {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #FF4757;
}

.stat-label {
    font-size: 12px;
    color: #888;
    margin-top: 4px;
}

.loading {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0;
}

.loading .loading-spinner,
.loading p {
    display: none;
}

.loading::before,
.loading::after {
    content: '';
    display: block;
    height: 300px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
    background-size: 800px 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: 16px;
}

@keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
}

.empty {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.empty-icon {
    font-size: 64px;
    margin-bottom: 20px;
}

.empty h3 {
    margin: 0 0 8px;
    color: #333;
    font-size: 18px;
}

.empty p {
    margin: 0;
    color: #999;
    font-size: 14px;
}

.shops-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

.shop-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.shop-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.shop-image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.shop-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.shop-card:hover .shop-image {
    transform: scale(1.05);
}

.shop-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
    color: white;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 600;
}

.delivery-time {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    color: white;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 10px;
    font-weight: 500;
}

.shop-info {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.shop-header h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
}

.rating {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}

.star {
    font-size: 14px;
}

.score {
    font-size: 15px;
    font-weight: 700;
    color: #FF9500;
}

.shop-desc {
    margin: 0;
    font-size: 13px;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shop-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.tag {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 10px;
    font-weight: 500;
}

.tag:nth-child(1) {
    background: #FFF0F0;
    color: #FF4757;
}

.tag:nth-child(2) {
    background: #FFF8E6;
    color: #FF9500;
}

.tag:nth-child(3) {
    background: #E8F8EE;
    color: #2ED573;
}

.shop-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #f5f5f5;
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

    .loading {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .shops-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .loading {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>
