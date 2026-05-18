<template>
    <div class="home-page">
        <!-- 顶部导航栏 -->
        <header class="top-header" :class="{ scrolled: isScrolled }">
            <div class="header-inner">
                <div class="logo-area">
                    <div class="logo-box">
                        <span class="logo-icon">🍔</span>
                    </div>
                    <span class="logo-text">外卖商城</span>
                </div>
                <nav class="main-nav">
                    <a href="/" class="nav-link active">首页</a>
                    <a href="/shops" class="nav-link">商家</a>
                    <a href="/products" class="nav-link">商品</a>
                    <a href="/orders" class="nav-link">订单</a>
                </nav>
                <div class="header-actions">
                    <div class="search-box" @click="goToSearch">
                        <span class="search-icon">🔍</span>
                        <span class="search-text">搜索美食...</span>
                    </div>
                    <div class="action-btns">
                        <span class="action-btn cart-btn" @click="goToCart">
                            🛒
                            <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
                        </span>
                        <span class="action-btn" @click="goToProfile">👤</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- 主横幅Banner -->
        <section class="hero-banner">
            <div class="banner-bg">
                <div class="gradient-orb orb-1"></div>
                <div class="gradient-orb orb-2"></div>
                <div class="gradient-orb orb-3"></div>
                <div class="gradient-orb orb-4"></div>
                <div class="grid-pattern"></div>
            </div>
            <div class="banner-content">
                <div class="banner-left">
                    <div class="location-bar">
                        <span class="loc-icon">📍</span>
                        <span class="loc-text">北京市朝阳区</span>
                        <span class="loc-arrow">▾</span>
                    </div>
                    <h1 class="banner-title">
                        <span class="title-line">发现身边</span>
                        <span class="title-line highlight">
                            <span class="typing-text">美味</span>
                            <span class="cursor">|</span>
                        </span>
                    </h1>
                    <p class="banner-desc">汇聚全城优质商家，30分钟极速送达，让美食触手可及</p>
                    <div class="banner-tags">
                        <span class="tag">
                            <span class="tag-icon">⚡</span>
                            <span>30分钟达</span>
                        </span>
                        <span class="tag">
                            <span class="tag-icon">🎁</span>
                            <span>满减优惠</span>
                        </span>
                        <span class="tag">
                            <span class="tag-icon">🌟</span>
                            <span>品质保证</span>
                        </span>
                    </div>
                    <div class="banner-actions">
                        <button class="cta-btn primary" @click="goToShops">
                            <span>立即点餐</span>
                            <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                        <button class="cta-btn secondary" @click="goToProducts">
                            <span>浏览商品</span>
                        </button>
                    </div>
                </div>
                <div class="banner-right">
                    <div class="food-showcase">
                        <div class="food-item food-1">
                            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=300&fit=crop" alt="披萨" />
                            <div class="food-glow"></div>
                        </div>
                        <div class="food-item food-2">
                            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop" alt="汉堡" />
                            <div class="food-glow"></div>
                        </div>
                        <div class="food-item food-3">
                            <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=300&h=300&fit=crop" alt="炸鸡" />
                            <div class="food-glow"></div>
                        </div>
                        <div class="food-item food-4">
                            <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop" alt="咖啡" />
                            <div class="food-glow"></div>
                        </div>
                        <div class="food-item food-5">
                            <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop" alt="甜点" />
                            <div class="food-glow"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scroll-indicator">
                <div class="mouse">
                    <div class="wheel"></div>
                </div>
                <span>向下滚动</span>
            </div>
        </section>

        <!-- 快捷入口 -->
        <section class="quick-access scroll-animate">
            <div class="access-grid">
                <div class="access-item" @click="goToShops">
                    <div class="access-icon-wrap" style="--icon-color: #FF6B6B; --icon-bg: linear-gradient(135deg, #FFF0F0 0%, #FFE0E0 100%);">
                        <span class="access-icon">🏪</span>
                    </div>
                    <span class="access-text">全部商家</span>
                </div>
                <div class="access-item" @click="goToProducts">
                    <div class="access-icon-wrap" style="--icon-color: #4ECDC4; --icon-bg: linear-gradient(135deg, #E8F8F7 0%, #D0F0EE 100%);">
                        <span class="access-icon">🍽️</span>
                    </div>
                    <span class="access-text">精选商品</span>
                </div>
                <div class="access-item" @click="goToOrders">
                    <div class="access-icon-wrap" style="--icon-color: #45B7D1; --icon-bg: linear-gradient(135deg, #E8F4F8 0%, #D0E8F0 100%);">
                        <span class="access-icon">📋</span>
                    </div>
                    <span class="access-text">我的订单</span>
                </div>
                <div class="access-item" @click="goToProfile">
                    <div class="access-icon-wrap" style="--icon-color: #96CEB4; --icon-bg: linear-gradient(135deg, #F0F7F4 0%, #E0F0E8 100%);">
                        <span class="access-icon">👤</span>
                    </div>
                    <span class="access-text">个人中心</span>
                </div>
                <div class="access-item">
                    <div class="access-icon-wrap" style="--icon-color: #FFEAA7; --icon-bg: linear-gradient(135deg, #FFFBF0 0%, #FFF5D0 100%);">
                        <span class="access-icon">🎫</span>
                    </div>
                    <span class="access-text">优惠券</span>
                </div>
                <div class="access-item">
                    <div class="access-icon-wrap" style="--icon-color: #DDA0DD; --icon-bg: linear-gradient(135deg, #F8F0F8 0%, #F0E0F0 100%);">
                        <span class="access-icon">❤️</span>
                    </div>
                    <span class="access-text">我的收藏</span>
                </div>
                <div class="access-item">
                    <div class="access-icon-wrap" style="--icon-color: #98D8C8; --icon-bg: linear-gradient(135deg, #F0F8F5 0%, #E0F0E8 100%);">
                        <span class="access-icon">📍</span>
                    </div>
                    <span class="access-text">收货地址</span>
                </div>
                <div class="access-item">
                    <div class="access-icon-wrap" style="--icon-color: #F7DC6F; --icon-bg: linear-gradient(135deg, #FEF9E7 0%, #FEF3C7 100%);">
                        <span class="access-icon">💬</span>
                    </div>
                    <span class="access-text">客服中心</span>
                </div>
            </div>
        </section>

        <!-- 热门分类 -->
        <section class="category-section scroll-animate delay-1">
            <div class="section-header">
                <div class="section-title">
                    <div class="title-line-bar"></div>
                    <h2>热门分类</h2>
                </div>
                <a href="/products" class="view-more">
                    查看全部
                    <svg class="more-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            <div class="category-grid">
                <div 
                    v-for="cat in categories" 
                    :key="cat.id"
                    class="category-card"
                    @click="goToProducts"
                >
                    <div class="category-icon">{{ cat.icon }}</div>
                    <span class="category-name">{{ cat.name }}</span>
                    <div class="category-shine"></div>
                </div>
            </div>
        </section>

        <!-- 热门商家 -->
        <section class="shops-section scroll-animate delay-2">
            <div class="section-header">
                <div class="section-title">
                    <div class="title-line-bar"></div>
                    <h2>热门商家</h2>
                </div>
                <a href="/shops" class="view-more">
                    全部商家
                    <svg class="more-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            <div class="shops-grid">
                <div 
                    v-for="shop in shops.slice(0, 6)" 
                    :key="shop.id"
                    class="shop-card"
                    @click="goToShop(shop.id)"
                >
                    <div class="shop-image-wrap">
                        <img 
                            :src="shop.image_url" 
                            :alt="shop.name" 
                            class="shop-image"
                            @error="handleImageError"
                        />
                        <div class="shop-overlay">
                            <span class="delivery-badge">
                                <span class="badge-icon">🚀</span>
                                {{ shop.delivery_time }}分钟
                            </span>
                        </div>
                        <div class="recommend-badge" v-if="shop.rating >= 4.8">
                            <span class="badge-star">★</span>
                            <span>推荐</span>
                        </div>
                    </div>
                    <div class="shop-info">
                        <h3 class="shop-name">{{ shop.name }}</h3>
                        <div class="shop-meta">
                            <div class="rating-wrap">
                                <span class="rating-score">{{ shop.rating }}</span>
                                <div class="stars">
                                    <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(shop.rating) }">★</span>
                                </div>
                            </div>
                            <span class="monthly-sales">月售1000+</span>
                        </div>
                        <div class="shop-delivery">
                            <span class="fee-tag" :class="{ free: shop.delivery_fee === 0 }">
                                {{ shop.delivery_fee > 0 ? `配送¥${shop.delivery_fee}` : '免配送费' }}
                            </span>
                            <span class="min-tag">起送¥{{ shop.min_order }}</span>
                        </div>
                        <div class="shop-tags">
                            <span class="tag-item">品质联盟</span>
                            <span class="tag-item">准时达</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 招牌推荐 -->
        <section class="featured-section scroll-animate delay-3">
            <div class="section-header">
                <div class="section-title">
                    <div class="title-line-bar"></div>
                    <h2>招牌推荐</h2>
                </div>
                <a href="/products" class="view-more">
                    查看更多
                    <svg class="more-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            <div class="featured-grid">
                <div 
                    v-for="product in featuredProducts" 
                    :key="product.id"
                    class="product-card"
                >
                    <div class="product-image-wrap">
                        <img 
                            :src="product.image_url" 
                            :alt="product.name" 
                            class="product-image"
                            @error="handleImageError"
                        />
                        <div class="featured-badge" v-if="product.is_featured">
                            <span class="badge-fire">🔥</span>
                            <span>招牌</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <h4 class="product-name">{{ product.name }}</h4>
                        <p class="product-shop">{{ getShopName(product.shop_id) }}</p>
                        <div class="product-bottom">
                            <div class="price-wrap">
                                <span class="price-symbol">¥</span>
                                <span class="price-num">{{ Math.floor(product.price) }}</span>
                                <span class="price-dec">.{{ (product.price % 1 * 100).toFixed(0).padStart(2, '0') }}</span>
                            </div>
                            <button class="add-btn" @click.stop="addToCart(product)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                    <path d="M12 5v14M5 12h14"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 底部统计 -->
        <section class="stats-bar scroll-animate delay-4">
            <div class="stats-inner">
                <div class="stat-item">
                    <div class="stat-icon-wrap">
                        <span class="stat-icon">🏪</span>
                    </div>
                    <div class="stat-data">
                        <span class="stat-num">{{ shops.length }}+</span>
                        <span class="stat-label">优质商家</span>
                    </div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <div class="stat-icon-wrap">
                        <span class="stat-icon">🍔</span>
                    </div>
                    <div class="stat-data">
                        <span class="stat-num">{{ products.length }}+</span>
                        <span class="stat-label">精选美食</span>
                    </div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <div class="stat-icon-wrap">
                        <span class="stat-icon">⚡</span>
                    </div>
                    <div class="stat-data">
                        <span class="stat-num">30</span>
                        <span class="stat-label">分钟送达</span>
                    </div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                    <div class="stat-icon-wrap">
                        <span class="stat-icon">😊</span>
                    </div>
                    <div class="stat-data">
                        <span class="stat-num">99%</span>
                        <span class="stat-label">好评率</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const shops = ref([])
const products = ref([])
const categories = ref([])
const cartCount = ref(0)
const isScrolled = ref(false)

const featuredProducts = computed(() => {
    return products.value.filter(p => p.is_featured).slice(0, 8)
})

const getShopName = (shopId) => {
    const shop = shops.value.find(s => s.id === shopId)
    return shop ? shop.name : ''
}

const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
}

const goToSearch = () => window.location.href = '/shops'
const goToShops = () => window.location.href = '/shops'
const goToProducts = () => window.location.href = '/products'
const goToOrders = () => window.location.href = '/orders'
const goToProfile = () => window.location.href = '/profile'
const goToCart = () => window.location.href = '/cart'
const goToShop = (id) => window.location.href = `/shop/${id}`

const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
        existing.quantity++
    } else {
        cart.push({
            id: product.id,
            shop_id: product.shop_id,
            shop_name: getShopName(product.shop_id),
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            quantity: 1
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0)
    
    const btn = event.target.closest('.add-btn')
    btn.classList.add('clicked')
    setTimeout(() => btn.classList.remove('clicked'), 300)
}

// 滚动监听
const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

// 滚动动画
const initScrollAnimation = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in')
            }
        })
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    })

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el)
    })
}

onMounted(async () => {
    window.addEventListener('scroll', handleScroll)
    
    const [shopsRes, productsRes, catsRes] = await Promise.all([
        axios.get('/api/shops'),
        axios.get('/api/products'),
        axios.get('/api/categories')
    ])
    shops.value = shopsRes.data
    products.value = productsRes.data
    categories.value = catsRes.data
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0)
    
    setTimeout(initScrollAnimation, 100)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home-page {
    min-height: 100vh;
    background: #f8f9fa;
}

/* ===== 顶部导航栏 ===== */
.top-header {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

.top-header.scrolled {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 30px rgba(0,0,0,0.08);
}

.header-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 14px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.logo-box {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.logo-icon {
    font-size: 24px;
}

.logo-text {
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.main-nav {
    display: flex;
    gap: 8px;
}

.nav-link {
    text-decoration: none;
    color: #666;
    font-size: 15px;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 12px;
    position: relative;
    transition: all 0.3s;
}

.nav-link:hover {
    color: #FF6B6B;
    background: rgba(255, 107, 107, 0.08);
}

.nav-link.active {
    color: #FF6B6B;
    background: rgba(255, 107, 107, 0.1);
    font-weight: 600;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
}

.search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f0f0f0;
    padding: 12px 20px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.search-box:hover {
    background: #e8e8e8;
    border-color: rgba(255, 107, 107, 0.2);
    transform: translateY(-1px);
}

.search-icon {
    font-size: 16px;
    opacity: 0.6;
}

.search-text {
    font-size: 14px;
    color: #999;
}

.action-btns {
    display: flex;
    gap: 10px;
}

.action-btn {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 14px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    border: 2px solid transparent;
}

.action-btn:hover {
    background: #e8e8e8;
    transform: scale(1.08);
    border-color: rgba(255, 107, 107, 0.2);
}

.cart-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%);
    color: white;
    font-size: 11px;
    font-weight: 700;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
}

/* ===== 主横幅Banner ===== */
.hero-banner {
    position: relative;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 100%);
    padding: 80px 32px 120px;
    overflow: hidden;
    min-height: 600px;
    display: flex;
    align-items: center;
}

.banner-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}

.gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.3;
}

.orb-1 {
    width: 500px;
    height: 500px;
    background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
    top: -150px;
    right: -100px;
    animation: orbFloat 10s infinite ease-in-out;
}

.orb-2 {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #533483 0%, #7c3aed 100%);
    bottom: -100px;
    left: 5%;
    animation: orbFloat 12s infinite ease-in-out;
    animation-delay: -3s;
}

.orb-3 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #0f3460 0%, #2563eb 100%);
    top: 40%;
    left: 40%;
    animation: orbFloat 8s infinite ease-in-out;
    animation-delay: -5s;
}

.orb-4 {
    width: 250px;
    height: 250px;
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    top: 10%;
    left: 30%;
    animation: orbFloat 15s infinite ease-in-out;
    animation-delay: -2s;
    opacity: 0.15;
}

@keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(40px, -30px) scale(1.1); }
    50% { transform: translate(-20px, 40px) scale(0.9); }
    75% { transform: translate(30px, 20px) scale(1.05); }
}

.grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
}

.banner-content {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
    width: 100%;
}

.banner-left {
    color: white;
    max-width: 520px;
}

.location-bar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.08);
    padding: 10px 20px;
    border-radius: 24px;
    margin-bottom: 32px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    cursor: pointer;
}

.location-bar:hover {
    background: rgba(255,255,255,0.12);
    transform: translateY(-2px);
}

.loc-icon {
    font-size: 14px;
}

.loc-arrow {
    font-size: 10px;
    opacity: 0.6;
    margin-left: 4px;
}

.banner-title {
    margin: 0 0 20px;
}

.title-line {
    display: block;
    font-size: 56px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -1px;
}

.title-line.highlight {
    display: flex;
    align-items: center;
    gap: 8px;
}

.typing-text {
    background: linear-gradient(135deg, #FF6B6B 0%, #FFD93D 50%, #FF6B6B 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
}

.cursor {
    color: #FF6B6B;
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}

.banner-desc {
    font-size: 18px;
    opacity: 0.7;
    margin: 0 0 32px;
    line-height: 1.7;
    font-weight: 400;
}

.banner-tags {
    display: flex;
    gap: 12px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.tag {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.06);
    padding: 10px 18px;
    border-radius: 24px;
    font-size: 14px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.3s;
}

.tag:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
}

.tag-icon {
    font-size: 16px;
}

.banner-actions {
    display: flex;
    gap: 16px;
}

.cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: none;
    padding: 16px 32px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-family: inherit;
}

.cta-btn.primary {
    background: linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%);
    color: white;
    box-shadow: 0 8px 30px rgba(255, 107, 107, 0.4);
}

.cta-btn.primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.5);
}

.cta-btn.secondary {
    background: rgba(255,255,255,0.08);
    color: white;
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(10px);
}

.cta-btn.secondary:hover {
    background: rgba(255,255,255,0.12);
    transform: translateY(-3px);
}

.btn-arrow {
    width: 18px;
    height: 18px;
    transition: transform 0.3s;
}

.cta-btn:hover .btn-arrow {
    transform: translateX(4px);
}

/* 右侧食物展示 */
.banner-right {
    position: relative;
    width: 480px;
    height: 480px;
}

.food-showcase {
    position: relative;
    width: 100%;
    height: 100%;
}

.food-item {
    position: absolute;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 25px 80px rgba(0,0,0,0.4);
    animation: foodFloat 5s infinite ease-in-out;
    border: 2px solid rgba(255,255,255,0.1);
}

.food-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.food-glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: inherit;
    filter: blur(40px);
    opacity: 0.3;
    z-index: -1;
    border-radius: 30px;
}

.food-1 {
    width: 180px;
    height: 180px;
    top: 0;
    right: 15%;
    animation-delay: 0s;
    z-index: 3;
}

.food-2 {
    width: 160px;
    height: 160px;
    top: 35%;
    right: 0;
    animation-delay: -1.2s;
    z-index: 2;
}

.food-3 {
    width: 140px;
    height: 140px;
    bottom: 5%;
    right: 20%;
    animation-delay: -2.4s;
    z-index: 4;
}

.food-4 {
    width: 130px;
    height: 130px;
    top: 15%;
    left: 5%;
    animation-delay: -3.6s;
    z-index: 1;
}

.food-5 {
    width: 120px;
    height: 120px;
    bottom: 25%;
    left: 15%;
    animation-delay: -4.8s;
    z-index: 2;
}

@keyframes foodFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(2deg); }
    66% { transform: translateY(-10px) rotate(-1deg); }
}

/* 滚动指示器 */
.scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.5);
    font-size: 12px;
    animation: fadeInUp 1s ease 1s both;
}

.mouse {
    width: 24px;
    height: 36px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 12px;
    display: flex;
    justify-content: center;
    padding-top: 8px;
}

.wheel {
    width: 4px;
    height: 8px;
    background: rgba(255,255,255,0.5);
    border-radius: 2px;
    animation: scrollWheel 2s infinite;
}

@keyframes scrollWheel {
    0% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(12px); opacity: 0; }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* ===== 快捷入口 ===== */
.quick-access {
    max-width: 1280px;
    margin: -50px auto 50px;
    padding: 0 32px;
    position: relative;
    z-index: 10;
}

.access-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 16px;
    background: white;
    padding: 32px;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    border: 1px solid rgba(0,0,0,0.04);
}

.access-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 16px 12px;
    border-radius: 20px;
    transition: all 0.3s;
}

.access-item:hover {
    transform: translateY(-6px);
    background: #f8f9fa;
}

.access-icon-wrap {
    width: 60px;
    height: 60px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: var(--icon-bg);
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
}

.access-item:hover .access-icon-wrap {
    transform: scale(1.1) rotate(-5deg);
    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
}

.access-text {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

/* ===== 分类区域 ===== */
.category-section {
    max-width: 1280px;
    margin: 0 auto 50px;
    padding: 0 32px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.title-line-bar {
    width: 4px;
    height: 28px;
    background: linear-gradient(180deg, #FF6B6B 0%, #EE5A24 100%);
    border-radius: 2px;
}

.section-title h2 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
}

.view-more {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #FF6B6B;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    padding: 8px 16px;
    border-radius: 12px;
}

.view-more:hover {
    gap: 10px;
    background: rgba(255, 107, 107, 0.08);
}

.more-arrow {
    width: 16px;
    height: 16px;
    transition: transform 0.3s;
}

.view-more:hover .more-arrow {
    transform: translateX(4px);
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
}

.category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 28px 20px;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.04);
    position: relative;
    overflow: hidden;
}

.category-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.1);
    border-color: transparent;
}

.category-card:hover .category-name {
    color: #FF6B6B;
}

.category-icon {
    font-size: 40px;
    transition: transform 0.3s;
}

.category-card:hover .category-icon {
    transform: scale(1.15);
}

.category-name {
    font-size: 14px;
    color: #333;
    font-weight: 600;
    transition: color 0.3s;
}

.category-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
}

.category-card:hover .category-shine {
    left: 100%;
}

/* ===== 热门商家 ===== */
.shops-section {
    max-width: 1280px;
    margin: 0 auto 50px;
    padding: 0 32px;
}

.shops-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.shop-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.04);
}

.shop-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.12);
    border-color: transparent;
}

.shop-image-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.shop-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.shop-card:hover .shop-image {
    transform: scale(1.1);
}

.shop-overlay {
    position: absolute;
    bottom: 16px;
    right: 16px;
}

.delivery-badge {
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 8px 14px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: 6px;
}

.badge-icon {
    font-size: 14px;
}

.recommend-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%);
    color: white;
    padding: 8px 14px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.badge-star {
    font-size: 14px;
}

.shop-info {
    padding: 24px;
}

.shop-name {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 14px;
}

.shop-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
}

.rating-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rating-score {
    font-size: 18px;
    font-weight: 800;
    color: #FF9500;
}

.stars {
    display: flex;
    gap: 2px;
}

.star {
    font-size: 14px;
    color: #e0e0e0;
}

.star.filled {
    color: #FF9500;
}

.monthly-sales {
    font-size: 13px;
    color: #999;
}

.shop-delivery {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
}

.fee-tag,
.min-tag {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 10px;
    background: #f5f5f5;
    color: #666;
    font-weight: 500;
}

.fee-tag.free {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    color: #2e7d32;
    font-weight: 600;
}

.shop-tags {
    display: flex;
    gap: 8px;
}

.tag-item {
    font-size: 11px;
    color: #FF6B6B;
    background: rgba(255, 107, 107, 0.08);
    padding: 6px 12px;
    border-radius: 10px;
    font-weight: 600;
}

/* ===== 招牌推荐 ===== */
.featured-section {
    max-width: 1280px;
    margin: 0 auto 50px;
    padding: 0 32px;
}

.featured-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.product-card {
    background: white;
    border-radius: 24px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.04);
}

.product-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.12);
    border-color: transparent;
}

.product-image-wrap {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image {
    transform: scale(1.1);
}

.featured-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    background: linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.badge-fire {
    font-size: 14px;
}

.product-info {
    padding: 20px;
}

.product-name {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-shop {
    font-size: 13px;
    color: #999;
    margin: 0 0 16px;
}

.product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price-wrap {
    display: flex;
    align-items: baseline;
}

.price-symbol {
    font-size: 14px;
    color: #FF6B6B;
    font-weight: 700;
}

.price-num {
    font-size: 26px;
    font-weight: 800;
    color: #FF6B6B;
    line-height: 1;
}

.price-dec {
    font-size: 14px;
    color: #FF6B6B;
    font-weight: 600;
}

.add-btn {
    width: 40px;
    height: 40px;
    border-radius: 14px;
    background: linear-gradient(135deg, #FF6B6B 0%, #EE5A24 100%);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.add-btn svg {
    width: 20px;
    height: 20px;
}

.add-btn:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
}

.add-btn.clicked {
    animation: btnClick 0.3s ease;
}

@keyframes btnClick {
    0% { transform: scale(1); }
    50% { transform: scale(0.85); }
    100% { transform: scale(1); }
}

/* ===== 底部统计 ===== */
.stats-bar {
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
    padding: 50px 32px;
    position: relative;
    overflow: hidden;
}

.stats-bar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 50%, rgba(124, 58, 237, 0.05) 0%, transparent 50%);
}

.stats-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    z-index: 1;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 16px;
}

.stat-icon-wrap {
    width: 56px;
    height: 56px;
    background: rgba(255,255,255,0.08);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    border: 1px solid rgba(255,255,255,0.1);
}

.stat-data {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-num {
    font-size: 32px;
    font-weight: 800;
    color: white;
    line-height: 1;
}

.stat-label {
    font-size: 14px;
    color: rgba(255,255,255,0.5);
    font-weight: 500;
}

.stat-divider {
    width: 1px;
    height: 60px;
    background: rgba(255,255,255,0.08);
}

/* ===== 滚动动画 ===== */
.scroll-animate {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-animate.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.delay-1 { transition-delay: 0.1s; }
.delay-2 { transition-delay: 0.2s; }
.delay-3 { transition-delay: 0.3s; }
.delay-4 { transition-delay: 0.4s; }

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
    .access-grid {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .shops-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .featured-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .category-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .banner-right {
        display: none;
    }
}

@media (max-width: 768px) {
    .header-inner {
        padding: 12px 16px;
        gap: 16px;
    }
    
    .main-nav {
        display: none;
    }
    
    .search-text {
        display: none;
    }
    
    .hero-banner {
        padding: 60px 16px 100px;
        min-height: auto;
    }
    
    .title-line {
        font-size: 36px;
    }
    
    .banner-desc {
        font-size: 16px;
    }
    
    .banner-actions {
        flex-direction: column;
    }
    
    .cta-btn {
        width: 100%;
        justify-content: center;
    }
    
    .access-grid {
        grid-template-columns: repeat(4, 1fr);
        padding: 20px;
        gap: 12px;
    }
    
    .access-icon-wrap {
        width: 52px;
        height: 52px;
        font-size: 24px;
    }
    
    .shops-grid,
    .featured-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
    
    .category-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .stats-inner {
        flex-wrap: wrap;
        gap: 24px;
    }
    
    .stat-divider {
        display: none;
    }
    
    .stat-item {
        flex: 1 1 40%;
        justify-content: center;
    }
}
</style>
