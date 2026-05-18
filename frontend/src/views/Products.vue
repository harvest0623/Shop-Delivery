<template>
    <div class="products-page">
        <div class="header-section">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <div class="header-content">
                <h1>🍽️ 精选美食</h1>
                <p>144道美味，等你品尝</p>
            </div>
            <div class="search-bar">
                <span class="search-icon">🔍</span>
                <input v-model="searchQuery" placeholder="搜索美食..." class="search-input" />
            </div>
        </div>

        <div class="category-tabs">
            <div
                v-for="cat in categoriesWithCount"
                :key="cat.id"
                class="category-tab"
                :class="{ active: activeCategory === cat.id }"
                @click="activeCategory = cat.id"
            >
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-count">{{ cat.count }}</span>
            </div>
        </div>

        <div class="products-container">
            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>正在加载美食...</p>
            </div>

            <div v-else-if="filteredProducts.length === 0" class="empty">
                <div class="empty-icon">🔍</div>
                <h3>没有找到商品</h3>
                <p>试试其他关键词或分类</p>
            </div>

            <div v-else class="products-grid">
                <div
                    v-for="product in filteredProducts"
                    :key="product.id"
                    class="product-card"
                >
                    <div class="product-image-wrapper">
                        <img :src="product.image_url" :alt="product.name" class="product-image" />
                        <div class="product-badge" v-if="product.is_featured">🔥 招牌</div>
                    </div>
                    <div class="product-info">
                        <h3>{{ product.name }}</h3>
                        <p class="product-desc">{{ product.description }}</p>
                        <div class="product-shop" @click.stop="goToShop(product.shop_id)">
                            🏪 {{ getShopName(product.shop_id) }}
                        </div>
                        <div class="product-footer">
                            <span class="price">¥{{ Number(product.price).toFixed(2) }}</span>
                            <button class="add-btn" @click.stop="addToCart(product)">
                                <span class="cart-icon">🛒</span>
                                <span>加入购物车</span>
                            </button>
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

const products = ref([])
const shops = ref([])
const categories = ref([])
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

const categoriesWithCount = computed(() => {
    const allCount = products.value.length
    const result = [{ id: 0, name: '全部', icon: '📦', count: allCount }]

    categories.value.forEach(cat => {
        const count = products.value.filter(p => p.category_id === cat.id).length
        result.push({ ...cat, count })
    })

    return result
})

const getShopName = (shopId) => {
    const shop = shops.value.find(s => s.id === shopId)
    return shop ? shop.name : ''
}

const goToShop = (shopId) => {
    window.location.href = `/shop/${shopId}`
}

const goBack = () => {
    window.history.back()
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
    alert(`✅ ${product.name} 已添加到购物车`)
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
        categories.value = catsRes.data
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

.category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 15px;
    background: white;
    gap: 10px;
    border-bottom: 1px solid #eee;
    scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
    display: none;
}

.category-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: #f5f5f5;
    border-radius: 20px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.category-tab.active {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 15px rgba(255,107,107,0.3);
}

.cat-icon {
    font-size: 18px;
}

.cat-name {
    font-weight: 500;
}

.cat-count {
    font-size: 12px;
    opacity: 0.8;
    background: rgba(0,0,0,0.1);
    padding: 2px 8px;
    border-radius: 10px;
}

.category-tab.active .cat-count {
    background: rgba(255,255,255,0.3);
}

.products-container {
    padding: 20px 15px;
    max-width: 800px;
    margin: 0 auto;
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

.products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.product-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
}

.product-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.product-image-wrapper {
    position: relative;
    width: 120px;
    height: 120px;
    flex-shrink: 0;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-badge {
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

.product-info {
    flex: 1;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-info h3 {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 700;
    color: #333;
}

.product-desc {
    margin: 0 0 8px;
    font-size: 13px;
    color: #888;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-shop {
    margin: 0 0 10px;
    font-size: 12px;
    color: #667eea;
    cursor: pointer;
    font-weight: 500;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    font-size: 20px;
    font-weight: 700;
    color: #ff6b6b;
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255,107,107,0.3);
}

.add-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255,107,107,0.4);
}

.cart-icon {
    font-size: 14px;
}

@media (min-width: 768px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
