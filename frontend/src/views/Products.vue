<template>
    <div class="products-page">
        <div class="header-section">
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input v-model="searchQuery" placeholder="搜索商品..." class="search-input" />
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

        <div class="products-container">
            <div class="section-title">
                <h2>🍽️ 全部商品 ({{ products.length }})</h2>
            </div>
            
            <div v-if="loading" class="loading">加载中...</div>
            
            <div v-else-if="filteredProducts.length === 0" class="empty">
                暂无商品
            </div>
            
            <div v-else class="products-list">
                <div 
                    v-for="product in filteredProducts" 
                    :key="product.id"
                    class="product-item"
                >
                    <img :src="product.image_url" :alt="product.name" class="product-image" />
                    <div class="product-info">
                        <h3>{{ product.name }}</h3>
                        <p class="product-desc">{{ product.description }}</p>
                        <p class="product-shop">{{ getShopName(product.shop_id) }}</p>
                        <div class="product-meta">
                            <span class="price">¥{{ Number(product.price).toFixed(2) }}</span>
                            <button class="shop-link" @click="goToShop(product.shop_id)">商家</button>
                        </div>
                    </div>
                    <button class="add-btn" @click="addToCart(product)">+</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const shops = ref([])
const categories = ref([{ id: 0, name: '全部', icon: '📦' }])
const searchQuery = ref('')
const activeCategory = ref(0)
const loading = ref(true)

const filteredProducts = computed(() => {
    let result = products.value
    
    if (activeCategory.value !== 0) {
        result = result.filter(p => p.category_id === activeCategory.value)
    }
    
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        )
    }
    
    return result
})

const getShopName = (shopId) => {
    const shop = shops.value.find(s => s.id === shopId)
    return shop ? shop.name : ''
}

const goToShop = (shopId) => {
    window.location.href = `/shop/${shopId}`
}

const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
        existing.quantity++
    } else {
        cart.push({ ...product, quantity: 1 })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('已添加到购物车')
}

onMounted(async () => {
    try {
        const [productsRes, shopsRes, catsRes] = await Promise.all([
            axios.get('/api/products'),
            axios.get('/api/shops'),
            axios.get('/api/categories')
        ])
        
        products.value = productsRes.data
        shops.value = shopsRes.data
        categories.value = [...categories.value, ...catsRes.data]
        
        console.log('商品数据:', products.value.length)
        console.log('商家数据:', shops.value.length)
        console.log('分类数据:', catsRes.data.length)
    } catch (error) {
        console.error('加载失败:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.products-page {
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

.products-container {
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

.products-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.product-item {
    display: flex;
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: relative;
}

.product-image {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
}

.product-info {
    flex: 1;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
}

.product-info h3 {
    margin: 0 0 5px;
    font-size: 16px;
    font-weight: 600;
}

.product-desc {
    margin: 0 0 5px;
    font-size: 13px;
    color: #999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-shop {
    margin: 0 0 5px;
    font-size: 12px;
    color: #666;
}

.product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.price {
    font-size: 18px;
    font-weight: 700;
    color: #ff6b6b;
}

.shop-link {
    padding: 6px 12px;
    background: #f0f0f0;
    border: none;
    border-radius: 15px;
    font-size: 12px;
    color: #667eea;
    cursor: pointer;
}

.add-btn {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(255,107,107,0.4);
}
</style>