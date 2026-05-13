<template>
    <div class="shops-page">
        <div class="header-section">
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input v-model="searchQuery" placeholder="搜索商家..." class="search-input" />
            </div>
        </div>

        <div class="category-tabs">
            <div 
                v-for="cat in categories" 
                :key="cat.id"
                class="category-tab"
                :class="{ active: activeCategory === cat.id }"
                @click="activeCategory = cat.id"
            >
                {{ cat.icon }} {{ cat.name }}
            </div>
        </div>

        <div class="shops-container">
            <div class="section-title">
                <h2>🏪 全部商家 ({{ shops.length }})</h2>
            </div>
            
            <div v-if="loading" class="loading">加载中...</div>
            
            <div v-else-if="filteredShops.length === 0" class="empty">
                暂无商家
            </div>
            
            <div v-else class="shops-list">
                <div 
                    v-for="shop in filteredShops" 
                    :key="shop.id"
                    class="shop-card"
                    @click="goToShop(shop.id)"
                >
                    <div class="shop-image-wrapper">
                        <img :src="shop.image_url" :alt="shop.name" class="shop-image" />
                        <div class="delivery-tag">🚀 {{ shop.delivery_time }}分钟</div>
                    </div>
                    <div class="shop-info">
                        <div class="shop-header">
                            <h3>{{ shop.name }}</h3>
                            <span class="rating">⭐ {{ shop.rating }}</span>
                        </div>
                        <p class="shop-desc">{{ shop.description }}</p>
                        <div class="shop-footer">
                            <span class="address">📍 {{ shop.address }}</span>
                            <span class="delivery-fee">¥{{ Number(shop.delivery_fee).toFixed(0) }}配送费</span>
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
const categories = ref([{ id: 0, name: '全部', icon: '🏪' }])
const searchQuery = ref('')
const activeCategory = ref(0)
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

onMounted(async () => {
    try {
        const [shopsRes, catsRes] = await Promise.all([
            axios.get('/api/shops'),
            axios.get('/api/categories')
        ])
        shops.value = shopsRes.data
        categories.value = [...categories.value, ...catsRes.data]
        
        console.log('商家数量:', shops.value.length)
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
    background: #f5f5f5;
    padding-bottom: 80px;
}

.header-section {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    padding: 20px 15px;
    position: sticky;
    top: 0;
    z-index: 100;
}

.search-bar {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 30px;
    padding: 12px 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.search-icon {
    margin-right: 10px;
    color: #999;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 15px;
}

.category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 15px;
    background: white;
    gap: 10px;
    border-bottom: 1px solid #eee;
}

.category-tab {
    padding: 8px 16px;
    background: #f5f5f5;
    border-radius: 20px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
}

.category-tab.active {
    background: #ff6b6b;
    color: white;
}

.shops-container {
    padding: 15px;
}

.section-title {
    margin-bottom: 15px;
}

.section-title h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #333;
}

.loading, .empty {
    text-align: center;
    padding: 50px;
    color: #999;
    font-size: 16px;
}

.shops-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.shop-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.3s;
}

.shop-card:hover {
    transform: translateY(-2px);
}

.shop-image-wrapper {
    position: relative;
    width: 140px;
    height: 120px;
    flex-shrink: 0;
}

.shop-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.delivery-tag {
    position: absolute;
    bottom: 8px;
    left: 8px;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 4px;
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
}

.shop-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.rating {
    color: #ff9500;
    font-weight: 500;
}

.shop-desc {
    margin: 8px 0;
    font-size: 13px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shop-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.address {
    font-size: 12px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

.delivery-fee {
    font-size: 12px;
    color: #ff6b6b;
    font-weight: 500;
}
</style>