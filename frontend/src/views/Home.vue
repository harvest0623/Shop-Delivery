<template>
    <div class="home-page">
        <div class="header-section">
            <div class="header-content">
                <div class="logo-area">
                    <span class="logo-icon">🍔</span>
                    <span class="logo-text">外卖商城</span>
                </div>
                <div class="search-box" @click="goToSearch">
                    <span class="search-icon">🔍</span>
                    <span class="search-placeholder">搜索美食...</span>
                </div>
            </div>
        </div>

        <div class="banner-section">
            <div class="banner-content">
                <h1>美食送到家</h1>
                <p>精选优质商家，新鲜美味即时享用</p>
                <button class="banner-btn" @click="goToShops">立即点餐</button>
            </div>
            <div class="banner-image">🍕🍔🍟</div>
        </div>

        <div class="quick-entries">
            <div class="entry-item" @click="goToShops">
                <span class="entry-icon">🏪</span>
                <span class="entry-text">商家</span>
            </div>
            <div class="entry-item" @click="goToProducts">
                <span class="entry-icon">🍽️</span>
                <span class="entry-text">商品</span>
            </div>
            <div class="entry-item" @click="goToOrders">
                <span class="entry-icon">📋</span>
                <span class="entry-text">订单</span>
            </div>
            <div class="entry-item" @click="goToProfile">
                <span class="entry-icon">👤</span>
                <span class="entry-text">我的</span>
            </div>
        </div>

        <div class="container">
            <section class="popular-shops">
                <div class="section-header">
                    <h2>🔥 热门商家</h2>
                    <a href="/shops" class="view-more">更多 →</a>
                </div>
                <div class="shops-scroll">
                    <div class="shops-list">
                        <div 
                            v-for="shop in shops.slice(0, 6)" 
                            :key="shop.id"
                            class="shop-item"
                            @click="goToShop(shop.id)"
                        >
                            <img :src="shop.image_url" :alt="shop.name" class="shop-avatar" />
                            <div class="shop-info">
                                <h4>{{ shop.name }}</h4>
                                <div class="shop-meta">
                                    <span>⭐ {{ shop.rating }}</span>
                                    <span class="dot">·</span>
                                    <span>{{ shop.delivery_time }}分钟</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="featured-section">
                <div class="section-header">
                    <h2>✨ 招牌推荐</h2>
                    <a href="/products" class="view-more">更多 →</a>
                </div>
                <div class="featured-list">
                    <div 
                        v-for="product in featuredProducts" 
                        :key="product.id"
                        class="featured-item"
                    >
                        <img :src="product.image_url" :alt="product.name" class="product-pic" />
                        <div class="product-detail">
                            <h4>{{ product.name }}</h4>
                            <p>{{ getShopName(product.shop_id) }}</p>
                            <div class="price-row">
                                <span class="price">¥{{ product.price.toFixed(2) }}</span>
                                <button class="add-btn" @click="addToCart(product)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="stats-section">
                <div class="stats-card">
                    <div class="stat-item">
                        <span class="stat-num">{{ shops.length }}+</span>
                        <span class="stat-label">精选商家</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-num">{{ products.length }}+</span>
                        <span class="stat-label">美味商品</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-num">30分钟</span>
                        <span class="stat-label">极速配送</span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const shops = ref([])
const products = ref([])

const featuredProducts = () => {
    return products.value.filter(p => p.is_featured).slice(0, 4)
}

const getShopName = (shopId) => {
    const shop = shops.value.find(s => s.id === shopId)
    return shop ? shop.name : ''
}

const goToSearch = () => window.location.href = '/shops'
const goToShops = () => window.location.href = '/shops'
const goToProducts = () => window.location.href = '/products'
const goToOrders = () => window.location.href = '/orders'
const goToProfile = () => window.location.href = '/profile'
const goToShop = (id) => window.location.href = `/shop/${id}`

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
    const [shopsRes, productsRes] = await Promise.all([
        axios.get('/api/shops'),
        axios.get('/api/products')
    ])
    shops.value = shopsRes.data
    products.value = productsRes.data
})
</script>

<style scoped>
.home-page {
    min-height: 100vh;
    background: #f5f5f5;
}

.header-section {
    background: white;
    padding: 12px 15px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 8px;
}

.logo-icon {
    font-size: 28px;
}

.logo-text {
    font-size: 20px;
    font-weight: 700;
    color: #ff6b6b;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    padding: 10px 15px;
    border-radius: 25px;
    cursor: pointer;
}

.search-icon {
    margin-right: 10px;
    color: #999;
}

.search-placeholder {
    color: #999;
    font-size: 14px;
}

.banner-section {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    margin: 10px;
    border-radius: 16px;
    padding: 30px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.banner-content {
    color: white;
}

.banner-content h1 {
    font-size: 28px;
    margin: 0 0 10px;
}

.banner-content p {
    font-size: 14px;
    opacity: 0.9;
    margin: 0 0 20px;
}

.banner-btn {
    background: white;
    color: #ff6b6b;
    border: none;
    padding: 10px 25px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.banner-image {
    font-size: 60px;
}

.quick-entries {
    display: flex;
    background: white;
    margin: 0 10px 10px;
    border-radius: 12px;
    padding: 20px 0;
}

.entry-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.entry-icon {
    font-size: 32px;
}

.entry-text {
    font-size: 13px;
    color: #666;
}

.container {
    padding: 0 10px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.section-header h2 {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

.view-more {
    font-size: 13px;
    color: #999;
    text-decoration: none;
}

.shops-scroll {
    overflow-x: auto;
}

.shops-list {
    display: flex;
    gap: 15px;
    padding-bottom: 10px;
}

.shop-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100px;
    cursor: pointer;
}

.shop-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 8px;
    border: 3px solid #ff6b6b;
}

.shop-info h4 {
    font-size: 13px;
    margin: 0 0 4px;
    text-align: center;
}

.shop-meta {
    font-size: 11px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;
}

.dot {
    color: #ddd;
}

.featured-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.featured-item {
    display: flex;
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.product-pic {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    object-fit: cover;
}

.product-detail {
    flex: 1;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-detail h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.product-detail p {
    margin: 4px 0;
    font-size: 13px;
    color: #999;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    font-size: 18px;
    font-weight: 700;
    color: #ff6b6b;
}

.add-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #ff6b6b;
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.stats-section {
    margin-top: 20px;
}

.stats-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    justify-content: space-around;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-num {
    font-size: 24px;
    font-weight: 700;
    color: #ff6b6b;
}

.stat-label {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
}

.stat-divider {
    width: 1px;
    background: #eee;
}
</style>