<template>
    <div class="shop-detail-page">
        <div class="shop-header">
            <div class="header-bg"></div>
            <div class="header-content">
                <button class="back-btn" @click="goBack">←</button>
                <div class="shop-info">
                    <img :src="shop.image_url" :alt="shop.name" class="shop-logo" />
                    <div class="shop-meta">
                        <h1>{{ shop.name }}</h1>
                        <div class="meta-row">
                            <span class="rating">⭐ {{ shop.rating }}</span>
                            <span class="delivery-time">🚀 {{ shop.delivery_time }}分钟</span>
                            <span class="delivery-fee">¥{{ Number(shop.delivery_fee).toFixed(0) }}配送费</span>
                        </div>
                        <div class="rating-detail">
                            <div class="rating-big">
                                <span class="rating-number">{{ shop.rating || '4.8' }}</span>
                                <div class="rating-stars">
                                    <span class="stars">{{ renderStars(shop.rating || 4.8) }}</span>
                                    <span class="rating-count">{{ Math.floor(Math.random() * 200 + 80) }}人评价</span>
                                </div>
                            </div>
                            <div class="rating-subs">
                                <div class="rating-sub-item">
                                    <span class="sub-label">配送</span>
                                    <span class="sub-score">{{ (Number(shop.rating || 4.8) + 0.1).toFixed(1) }}</span>
                                </div>
                                <div class="rating-sub-item">
                                    <span class="sub-label">服务</span>
                                    <span class="sub-score">{{ (Number(shop.rating || 4.8) - 0.1).toFixed(1) }}</span>
                                </div>
                                <div class="rating-sub-item">
                                    <span class="sub-label">口味</span>
                                    <span class="sub-score">{{ (Number(shop.rating || 4.8) + 0.05).toFixed(1) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="business-hours">
                            <span class="hours-text">营业时间：09:00-22:00</span>
                            <span class="shop-status" :class="{ open: isShopOpen }">
                                {{ isShopOpen ? '🟢 营业中' : '🔴 已休息' }}
                            </span>
                        </div>
                        <p class="shop-desc">{{ shop.description }}</p>
                    </div>
                </div>
                <div class="shop-announcement">
                    <span class="announcement-icon">📢</span>
                    <span class="announcement-text">店铺公告：满30元免配送费，新用户首单立减5元</span>
                </div>
            </div>
        </div>

        <div class="review-summary" @click="goToReviews">
            <span class="review-score">⭐ 4.8分</span>
            <span class="review-divider">·</span>
            <span class="review-count">128条评价</span>
            <span class="review-divider">·</span>
            <span class="review-rate">好评率96%</span>
            <span class="review-arrow">›</span>
        </div>

        <div class="ai-analysis-card" v-if="!showAiAnalysis" @click="loadAiAnalysis">
            <span class="ai-icon">🤖</span>
            <span class="ai-text">AI智能分析评价</span>
            <span class="ai-arrow">→</span>
        </div>

        <div v-if="showAiAnalysis" class="ai-analysis-panel">
            <div class="ai-panel-header">
                <span>🤖 AI评价分析（基于LangChain RAG）</span>
                <span class="close-btn" @click="showAiAnalysis = false">✕</span>
            </div>
            <div v-if="aiLoading" class="ai-loading">
                <div class="ai-spinner"></div>
                <span>AI正在分析评价数据...</span>
            </div>
            <div v-else-if="aiAnalysis" class="ai-content">
                <div class="ai-stat-row">
                    <div class="ai-stat">
                        <span class="ai-stat-num positive">{{ aiAnalysis.sentiment?.positive || 0 }}</span>
                        <span class="ai-stat-label">👍 好评</span>
                    </div>
                    <div class="ai-stat">
                        <span class="ai-stat-num negative">{{ aiAnalysis.sentiment?.negative || 0 }}</span>
                        <span class="ai-stat-label">👎 差评</span>
                    </div>
                    <div class="ai-stat">
                        <span class="ai-stat-num">{{ aiAnalysis.total_reviews || 0 }}</span>
                        <span class="ai-stat-label">📝 总评价</span>
                    </div>
                </div>
                <div class="ai-keywords" v-if="aiAnalysis.hot_keywords?.length">
                    <span class="kw-label">🔥 热门关键词：</span>
                    <span v-for="kw in aiAnalysis.hot_keywords.slice(0, 6)" :key="kw.word" class="kw-tag">
                        {{ kw.word }} <span class="kw-count">{{ kw.count }}</span>
                    </span>
                </div>
                <div class="ai-summary" v-if="aiAnalysis.summary">
                    <span>📊 {{ aiAnalysis.summary }}</span>
                </div>
                <div class="ai-suggestions" v-if="aiAnalysis.suggestions?.length">
                    <div v-for="(s, i) in aiAnalysis.suggestions" :key="i" class="ai-sug-item">💡 {{ s }}</div>
                </div>
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

        <div v-if="loading" class="loading">加载中...</div>
        
        <div v-else-if="filteredProducts.length === 0" class="empty">
            暂无商品
        </div>
        
        <div v-else class="products-list">
            <div 
                v-for="product in filteredProducts" 
                :key="product.id"
                class="product-card"
            >
                <img :src="product.image_url" :alt="product.name" class="product-image" />
                <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <p class="product-desc">{{ product.description }}</p>
                    <div class="product-bottom">
                        <span class="price">¥{{ Number(product.price).toFixed(2) }}</span>
                        <span class="stock" v-if="product.stock < 10">仅剩{{ product.stock }}件</span>
                    </div>
                </div>
                <div class="quantity-control">
                    <button 
                        class="qty-btn minus" 
                        @click="decreaseQty(product)"
                        :class="{ disabled: getQty(product) <= 0 }"
                    >-</button>
                    <span class="qty" v-if="getQty(product) > 0">{{ getQty(product) }}</span>
                    <button class="qty-btn plus" @click="increaseQty(product)">+</button>
                </div>
            </div>
        </div>

        <div class="bottom-bar">
            <div class="cart-info" @click="goToCart">
                <div class="cart-icon-wrapper">
                    <span>🛒</span>
                    <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
                </div>
                <div class="cart-text">
                    <span class="total">¥{{ totalPrice.toFixed(2) }}</span>
                    <span class="hint">已选{{ cartCount }}件</span>
                </div>
            </div>
            <button class="checkout-btn" @click="checkout" :disabled="cartCount === 0">去结算</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { toast } from '../utils/toast'

const shop = ref({})
const products = ref([])
const categories = ref([{ id: 0, name: '全部', icon: '📦' }])
const activeCategory = ref(0)
const cart = ref([])
const loading = ref(true)

const shopId = window.location.pathname.split('/')[2]

const showAiAnalysis = ref(false)
const aiLoading = ref(false)
const aiAnalysis = ref(null)

const filteredProducts = computed(() => {
    if (activeCategory.value === 0) return products.value
    return products.value.filter(p => p.category_id === activeCategory.value)
})

const getQty = (product) => {
    const cartItem = cart.value.find(item => item.id === product.id)
    return cartItem ? cartItem.quantity : 0
}

const increaseQty = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    if (existingItem) {
        existingItem.quantity++
    } else {
        cart.value.push({
            id: product.id,
            shop_id: product.shop_id,
            shop_name: shop.value.name,
            shop_delivery_fee: Number(shop.value.delivery_fee),
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            quantity: 1
        })
    }
    saveCart()
    toast.success('已加入购物车')
}

const decreaseQty = (product) => {
    const index = cart.value.findIndex(item => item.id === product.id)
    if (index !== -1) {
        if (cart.value[index].quantity > 1) {
            cart.value[index].quantity--
        } else {
            cart.value.splice(index, 1)
        }
    }
    saveCart()
}

const cartCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const loadCart = () => {
    cart.value = JSON.parse(localStorage.getItem('cart') || '[]')
}

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
}

const goToCart = () => {
    window.location.href = '/cart'
}

const checkout = () => {
    if (cartCount.value === 0) return
    window.location.href = '/cart'
}

const goBack = () => window.history.back()

const isShopOpen = computed(() => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const current = hours * 60 + minutes
    return current >= 9 * 60 && current < 22 * 60
})

const renderStars = (rating) => {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5 ? 1 : 0
    const empty = 5 - full - half
    return '⭐'.repeat(full) + (half ? '🌟' : '') + '☆'.repeat(empty)
}

const goToReviews = () => {
    window.location.href = `/shop/${shopId}/reviews`
}

const loadAiAnalysis = async () => {
    showAiAnalysis.value = true
    aiLoading.value = true
    try {
        const res = await axios.get(`/api/ai/analyze-reviews/${shopId}`)
        aiAnalysis.value = res.data
    } catch (e) {
        aiAnalysis.value = { sentiment: { positive: 0, negative: 0 }, hot_keywords: [], summary: '暂无分析数据', suggestions: [] }
    }
    aiLoading.value = false
}

onMounted(async () => {
    try {
        const shopId = window.location.pathname.split('/')[2]
        
        const [shopRes, productsRes, catsRes] = await Promise.all([
            axios.get(`/api/shops/${shopId}`),
            axios.get(`/api/products/shop/${shopId}`),
            axios.get('/api/categories')
        ])
        
        shop.value = shopRes.data
        products.value = productsRes.data
        categories.value = [...categories.value, ...catsRes.data]
        
        loadCart()
        
        console.log('商家:', shop.value.name)
        console.log('商品数量:', products.value.length)
        console.log('购物车数量:', cart.value.length)
    } catch (error) {
        console.error('加载失败:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.shop-detail-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 100px;
}

.shop-header {
    position: relative;
}

.header-bg {
    height: 260px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #d63031 100%);
    position: relative;
}

.header-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 50%);
    z-index: 1;
}

.header-content {
    position: relative;
    z-index: 2;
    padding: 0 16px;
}

.back-btn {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    transition: background 0.2s;
}

.back-btn:active {
    background: rgba(255,255,255,0.35);
}

.shop-info {
    display: flex;
    gap: 16px;
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    margin-top: -60px;
    position: relative;
    z-index: 3;
    align-items: center;
}

.shop-logo {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    flex-shrink: 0;
}

.shop-meta {
    flex: 1;
    min-width: 0;
}

.shop-meta h1 {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    margin-bottom: 6px;
    flex-wrap: wrap;
}

.rating {
    color: #f5a623;
    font-weight: 700;
}

.delivery-time, .delivery-fee {
    color: #999;
}

.meta-row span + span::before {
    content: '|';
    margin-right: 6px;
    color: #e0e0e0;
}

.shop-desc {
    margin: 0;
    font-size: 12px;
    color: #bbb;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.rating-detail {
    margin: 12px 0 8px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #fff9f0, #fff5eb);
    border-radius: 12px;
    border: 1px solid #ffecd2;
}

.rating-big {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.rating-number {
    font-size: 32px;
    font-weight: 800;
    color: #f5a623;
    line-height: 1;
}

.rating-stars {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.stars {
    font-size: 14px;
    letter-spacing: 1px;
}

.rating-count {
    font-size: 11px;
    color: #bbb;
}

.rating-subs {
    display: flex;
    gap: 16px;
}

.rating-sub-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

.sub-label {
    font-size: 12px;
    color: #999;
}

.sub-score {
    font-size: 13px;
    font-weight: 700;
    color: #f5a623;
}

.business-hours {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 8px 0;
    padding: 6px 0;
}

.hours-text {
    font-size: 12px;
    color: #999;
}

.shop-status {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
    color: #e74c3c;
    background: #fdeaea;
}

.shop-status.open {
    color: #27ae60;
    background: #e8f8f0;
}

.shop-announcement {
    margin: 12px 0 0;
    padding: 12px 16px;
    background: #fffbe6;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #fff3b0;
    animation: fadeInUp 0.4s ease both;
}

.announcement-icon {
    font-size: 18px;
    flex-shrink: 0;
}

.announcement-text {
    font-size: 13px;
    color: #8a7a2b;
    line-height: 1.4;
}

.review-summary {
    margin: 0 16px 12px;
    padding: 14px 18px;
    background: white;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: fadeInUp 0.4s ease both;
}

.review-summary:active {
    transform: scale(0.98);
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
}

.review-score {
    font-size: 15px;
    font-weight: 700;
    color: #f5a623;
}

.review-count {
    font-size: 13px;
    color: #666;
}

.review-rate {
    font-size: 13px;
    color: #27ae60;
    font-weight: 600;
}

.review-divider {
    color: #ddd;
    font-size: 14px;
}

.review-arrow {
    margin-left: auto;
    font-size: 18px;
    color: #ccc;
    font-weight: 300;
}

.category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 16px;
    gap: 10px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.category-tabs::-webkit-scrollbar {
    display: none;
}

.category-tab {
    padding: 8px 20px;
    background: white;
    border-radius: 20px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    color: #666;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.25s ease;
    flex-shrink: 0;
}

.category-tab:active {
    transform: scale(0.95);
}

.category-tab.active {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    box-shadow: 0 4px 14px rgba(255,107,107,0.35);
}

.loading, .empty {
    text-align: center;
    padding: 60px 20px;
    color: #ccc;
    font-size: 15px;
}

.products-list {
    padding: 0 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.product-card {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    animation: fadeInUp 0.4s ease both;
}

.product-card:nth-child(1) { animation-delay: 0.05s; }
.product-card:nth-child(2) { animation-delay: 0.1s; }
.product-card:nth-child(3) { animation-delay: 0.15s; }
.product-card:nth-child(4) { animation-delay: 0.2s; }
.product-card:nth-child(5) { animation-delay: 0.25s; }
.product-card:nth-child(6) { animation-delay: 0.3s; }
.product-card:nth-child(7) { animation-delay: 0.35s; }
.product-card:nth-child(8) { animation-delay: 0.4s; }

.product-card:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.1);
}

.product-image {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
    background: #f5f5f5;
    animation: lazyLoad 0.6s ease both;
}

.product-info {
    flex: 1;
    padding: 0 14px;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.product-info h3 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-desc {
    margin: 0 0 8px;
    font-size: 12px;
    color: #bbb;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-bottom {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto;
}

.price {
    font-size: 20px;
    font-weight: 800;
    color: #ff4757;
}

.stock {
    font-size: 11px;
    color: #ff6b6b;
    background: #fff0f0;
    padding: 2px 8px;
    border-radius: 10px;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.qty-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.qty-btn.minus {
    background: #f5f5f5;
    color: #999;
}

.qty-btn.minus:active {
    background: #eee;
}

.qty-btn.plus {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    box-shadow: 0 4px 12px rgba(255,107,107,0.35);
}

.qty-btn.plus:active {
    transform: scale(0.9);
}

.qty-btn.disabled {
    opacity: 0.3;
    pointer-events: none;
}

.qty {
    font-size: 16px;
    font-weight: 700;
    min-width: 22px;
    text-align: center;
    color: #333;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 12px 16px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
    border-radius: 20px 20px 0 0;
    z-index: 100;
}

.cart-info {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.cart-icon-wrapper {
    position: relative;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 12px rgba(255,107,107,0.35);
}

.cart-count {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #333;
    color: white;
    font-size: 11px;
    font-weight: 700;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cart-text {
    display: flex;
    flex-direction: column;
}

.total {
    font-size: 20px;
    font-weight: 800;
    color: #1a1a1a;
}

.hint {
    font-size: 12px;
    color: #bbb;
    margin-top: 2px;
}

.checkout-btn {
    padding: 14px 32px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255,107,107,0.35);
    transition: all 0.25s ease;
}

.checkout-btn:active {
    transform: scale(0.95);
}

.checkout-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes lazyLoad {
    from {
        opacity: 0;
        filter: blur(6px);
    }
    to {
        opacity: 1;
        filter: blur(0);
    }
}

.ai-analysis-card {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 12px 16px;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 12px;
    color: white;
    cursor: pointer;
    transition: transform 0.2s;
}

.ai-analysis-card:hover { transform: translateY(-2px); }
.ai-icon { font-size: 20px; }
.ai-text { flex: 1; font-size: 14px; font-weight: 600; }
.ai-arrow { font-size: 16px; }

.ai-analysis-panel {
    margin: 12px 16px;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.ai-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    font-size: 13px;
    font-weight: 600;
}

.close-btn { cursor: pointer; font-size: 16px; opacity: 0.8; }
.close-btn:hover { opacity: 1; }

.ai-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px;
    color: #667eea;
    font-size: 13px;
}

.ai-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(102, 126, 234, 0.2);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: aiSpin 0.8s linear infinite;
}

@keyframes aiSpin { to { transform: rotate(360deg); } }

.ai-content { padding: 16px; }
.ai-stat-row { display: flex; justify-content: space-around; margin-bottom: 14px; }
.ai-stat { text-align: center; }
.ai-stat-num { display: block; font-size: 22px; font-weight: 700; color: #333; }
.ai-stat-num.positive { color: #2ed573; }
.ai-stat-num.negative { color: #ff4757; }
.ai-stat-label { font-size: 12px; color: #999; }

.ai-keywords { margin-bottom: 12px; }
.kw-label { font-size: 12px; color: #666; margin-right: 6px; }
.kw-tag {
    display: inline-block;
    padding: 3px 10px;
    margin: 3px;
    background: rgba(102, 126, 234, 0.08);
    border-radius: 12px;
    font-size: 12px;
    color: #667eea;
}
.kw-count { opacity: 0.6; margin-left: 2px; }

.ai-summary {
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 13px;
    color: #555;
    margin-bottom: 10px;
}

.ai-sug-item {
    padding: 6px 0;
    font-size: 12px;
    color: #888;
}

@media (max-width: 480px) {
    .header-bg {
        height: 200px;
    }

    .shop-info {
        margin-top: -50px;
        padding: 16px;
        border-radius: 16px;
    }

    .shop-logo {
        width: 60px;
        height: 60px;
    }

    .shop-meta h1 {
        font-size: 18px;
    }

    .product-image {
        width: 80px;
        height: 80px;
    }

    .product-info h3 {
        font-size: 15px;
    }

    .price {
        font-size: 18px;
    }

    .bottom-bar {
        padding: 10px 12px;
    }

    .checkout-btn {
        padding: 12px 24px;
        font-size: 15px;
    }
}
</style>