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
                <input v-model="searchQuery" placeholder="搜索美食..." class="search-input" @keyup.enter="useAiSearch ? doAiSearch() : null" />
                <button class="ai-search-btn" :class="{ active: useAiSearch }" @click="toggleAiSearch" title="AI智能搜索">
                    🤖
                </button>
            </div>
        </div>

        <div v-if="aiSearchIntent" class="ai-search-banner">
            <span class="ai-search-icon">🤖</span>
            <span class="ai-search-text">{{ aiSearchIntent }}</span>
            <span class="ai-search-close" @click="clearAiSearch">✕</span>
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

        <div class="sort-bar" v-if="!loading && products.length > 0">
            <div class="sort-item" :class="{ active: sortBy === 'default' }" @click="sortBy = 'default'">综合</div>
            <div class="sort-item" :class="{ active: sortBy === 'price-asc' }" @click="sortBy = 'price-asc'">价格↑</div>
            <div class="sort-item" :class="{ active: sortBy === 'price-desc' }" @click="sortBy = 'price-desc'">价格↓</div>
            <div class="sort-item" :class="{ active: sortBy === 'newest' }" @click="sortBy = 'newest'">最新</div>
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
                        <img :src="product.image_url" :alt="product.name" class="product-image" @error="handleImageError($event, 'product')" />
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
import { toast } from '../utils/toast'

const products = ref([])
const shops = ref([])
const categories = ref([])
const searchQuery = ref('')
const activeCategory = ref(0)
const loading = ref(true)
const sortBy = ref('default')
const useAiSearch = ref(false)
const aiSearchIntent = ref('')
const aiSearchProducts = ref([])
const aiSearching = ref(false)

const toggleAiSearch = () => {
    useAiSearch.value = !useAiSearch.value
    if (!useAiSearch.value) clearAiSearch()
}

const clearAiSearch = () => {
    aiSearchIntent.value = ''
    aiSearchProducts.value = []
    useAiSearch.value = false
}

const doAiSearch = async () => {
    if (!searchQuery.value.trim()) return
    aiSearching.value = true
    try {
        const res = await axios.post('/api/ai/semantic-search', { query: searchQuery.value.trim() })
        aiSearchIntent.value = res.data.intent || ''
        aiSearchProducts.value = res.data.products || []
    } catch (e) {
        aiSearchIntent.value = '搜索出错，请重试'
        aiSearchProducts.value = []
    }
    aiSearching.value = false
}

const filteredProducts = computed(() => {
    if (useAiSearch.value && aiSearchProducts.value.length > 0) {
        return aiSearchProducts.value
    }
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

    if (sortBy.value === 'price-asc') result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy.value === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy.value === 'newest') result = [...result].sort((a, b) => b.id - a.id)

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
        const shop = shops.value.find(s => s.id === product.shop_id)
        cart.push({
            ...product,
            shop_name: shop ? shop.name : '',
            shop_delivery_fee: shop ? Number(shop.delivery_fee) : 5,
            quantity: 1
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success(`${product.name} 已加入购物车`)
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
    background: linear-gradient(180deg, #FFF5F5 0%, #F8F9FA 300px);
    padding-bottom: 80px;
}

.header-section {
    background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
    padding: 30px 15px 24px;
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

.ai-search-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none; font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0;
}
.ai-search-btn:hover { transform: scale(1.1); }
.ai-search-btn.active { box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3); }

.ai-search-banner {
    display: flex; align-items: center; gap: 8px;
    margin: 8px 16px 0; padding: 10px 14px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
    border-radius: 10px; font-size: 13px; color: #667eea;
    border: 1px solid rgba(102, 126, 234, 0.15);
}
.ai-search-icon { font-size: 16px; }
.ai-search-text { flex: 1; font-weight: 500; }
.ai-search-close { cursor: pointer; opacity: 0.6; }
.ai-search-close:hover { opacity: 1; }

.search-bar {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 12px;
    padding: 12px 20px;
    box-shadow: 0 4px 16px rgba(255,71,87,0.12);
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
    color: #333;
}

.search-input::placeholder {
    color: #bbb;
}

.category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 16px 15px;
    gap: 10px;
    scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
    display: none;
}

.sort-bar {
    display: flex;
    gap: 8px;
    padding: 12px 20px;
    background: white;
    margin: 0 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.sort-item {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    transition: all 0.2s;
}

.sort-item.active {
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white;
}

.sort-item:hover:not(.active) {
    background: #f0f0f0;
}

.category-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: white;
    border-radius: 12px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.category-tab.active {
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 16px rgba(255,71,87,0.3);
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
    background: rgba(0,0,0,0.08);
    padding: 2px 8px;
    border-radius: 10px;
}

.category-tab.active .cat-count {
    background: rgba(255,255,255,0.3);
}

.products-container {
    padding: 16px 15px;
    max-width: 900px;
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
    border-top-color: #FF4757;
    border-radius: 50%;
    animation: spin 1s linear infinite, shimmer 1.5s ease-in-out infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

.empty {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.empty-icon {
    font-size: 72px;
    margin-bottom: 20px;
    display: block;
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

.products-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.product-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    position: relative;
}

.product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(255,71,87,0.15);
}

.product-image-wrapper {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.product-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 10px;
    font-weight: 600;
}

.product-info {
    padding: 12px 12px 48px 12px;
}

.product-info h3 {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 700;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-desc {
    margin: 0 0 6px;
    font-size: 12px;
    color: #aaa;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-shop {
    margin: 0 0 6px;
    font-size: 12px;
    color: #999;
    cursor: pointer;
    font-weight: 400;
}

.product-shop:hover {
    color: #FF4757;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    font-size: 18px;
    font-weight: 700;
    color: #FF4757;
}

.add-btn {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px rgba(255,71,87,0.35);
    padding: 0;
}

.add-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255,71,87,0.45);
}

.add-btn span:last-child {
    display: none;
}

.cart-icon {
    font-size: 18px;
}

@media (max-width: 767px) {
    .products-grid {
        grid-template-columns: 1fr;
        gap: 14px;
    }

    .product-info {
        padding: 10px 10px 44px 10px;
    }

    .product-image-wrapper {
        height: 200px;
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>
