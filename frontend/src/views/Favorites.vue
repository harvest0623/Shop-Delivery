<template>
    <div class="favorites-page">
        <div class="page-header">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <h1>❤️ 我的收藏</h1>
        </div>

        <div class="tab-bar">
            <div
                class="tab-item"
                :class="{ active: activeTab === 'shop' }"
                @click="activeTab = 'shop'"
            >
                <span class="tab-icon">🏪</span>
                <span>商家收藏</span>
            </div>
            <div
                class="tab-item"
                :class="{ active: activeTab === 'product' }"
                @click="activeTab = 'product'"
            >
                <span class="tab-icon">🍔</span>
                <span>商品收藏</span>
            </div>
            <div class="tab-indicator" :class="activeTab"></div>
        </div>

        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
        </div>

        <template v-else>
            <div v-if="activeTab === 'shop'">
                <div v-if="shopFavorites.length > 0" class="favorites-list">
                    <div
                        v-for="item in shopFavorites"
                        :key="item.id"
                        class="shop-card"
                    >
                        <div class="card-remove" @click="removeFavorite(item)">❤️</div>
                        <div class="shop-card-body" @click="goToShop(item.target_id)">
                            <div class="shop-image">
                                <img
                                    :src="item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'"
                                    :alt="item.name"
                                />
                            </div>
                            <div class="shop-info">
                                <h3 class="shop-name">{{ item.name }}</h3>
                                <div class="shop-meta">
                                    <span class="rating">⭐ {{ item.rating || '4.8' }}</span>
                                    <span class="divider">|</span>
                                    <span class="delivery-fee">🚀 配送费 ¥{{ Number(item.delivery_fee || 0).toFixed(0) }}</span>
                                </div>
                            </div>
                            <button class="enter-btn" @click.stop="goToShop(item.target_id)">进入商家</button>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <div class="empty-icon">🏪</div>
                    <h2>还没有收藏商家哦</h2>
                    <p>去逛逛发现心仪商家吧</p>
                    <button class="go-btn" @click="goToShops">去逛逛</button>
                </div>
            </div>

            <div v-if="activeTab === 'product'">
                <div v-if="productFavorites.length > 0" class="favorites-list">
                    <div
                        v-for="item in productFavorites"
                        :key="item.id"
                        class="product-card"
                    >
                        <div class="card-remove" @click="removeFavorite(item)">❤️</div>
                        <div class="product-card-body">
                            <div class="product-image">
                                <img
                                    :src="item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop'"
                                    :alt="item.name"
                                />
                            </div>
                            <div class="product-info">
                                <h3 class="product-name">{{ item.name }}</h3>
                                <p class="product-shop">{{ item.shop_name || '未知商家' }}</p>
                                <div class="product-bottom">
                                    <span class="price">¥{{ Number(item.price || 0).toFixed(2) }}</span>
                                    <button class="cart-btn" @click="addToCart(item)">加入购物车</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <div class="empty-icon">🍔</div>
                    <h2>还没有收藏商品哦</h2>
                    <p>去逛逛发现心仪商品吧</p>
                    <button class="go-btn" @click="goToShops">去逛逛</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const activeTab = ref('shop')
const loading = ref(true)
const shopFavorites = ref([])
const productFavorites = ref([])

const getUser = () => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
}

const loadFavorites = async () => {
    const user = getUser()
    if (!user) {
        loading.value = false
        return
    }

    try {
        const response = await axios.get(`/api/favorites/customer/${user.id}`)
        const all = response.data || []
        shopFavorites.value = all.filter(f => f.type === 'shop' || f.target_type === 'shop')
        productFavorites.value = all.filter(f => f.type === 'product' || f.target_type === 'product')
    } catch (error) {
        console.error('加载收藏失败:', error)
    } finally {
        loading.value = false
    }
}

const removeFavorite = async (item) => {
    if (!confirm('确定要取消收藏吗？')) return

    try {
        await axios.delete(`/api/favorites/${item.id}`)
        shopFavorites.value = shopFavorites.value.filter(f => f.id !== item.id)
        productFavorites.value = productFavorites.value.filter(f => f.id !== item.id)
    } catch (error) {
        console.error('取消收藏失败:', error)
        alert('操作失败，请重试')
    }
}

const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find(item => item.id === product.target_id || item.id === product.product_id)
    if (existing) {
        existing.quantity++
    } else {
        cart.push({
            id: product.target_id || product.product_id,
            shop_id: product.shop_id,
            shop_name: product.shop_name || '',
            name: product.name,
            price: Number(product.price),
            image_url: product.image_url,
            quantity: 1
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('已加入购物车')
}

const goToShop = (shopId) => {
    window.location.href = `/shop/${shopId}`
}

const goToShops = () => {
    window.location.href = '/shops'
}

const goBack = () => {
    window.history.back()
}

onMounted(() => {
    const user = getUser()
    if (!user) {
        alert('请先登录')
        window.location.href = '/login'
        return
    }
    loadFavorites()
})
</script>

<style scoped>
.favorites-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 40px;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 20px;
    position: relative;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    border-radius: 0 0 24px 24px;
}

.page-header h1 {
    font-size: 22px;
    color: #ffffff;
    margin: 0;
}

.back-btn {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-50%) scale(1.1);
}

.back-btn span {
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
}

.tab-bar {
    display: flex;
    margin: 20px 20px 20px;
    background: #eef1f5;
    border-radius: 50px;
    padding: 4px;
    position: relative;
}

.tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 11px 0;
    font-size: 15px;
    font-weight: 600;
    color: #999;
    cursor: pointer;
    transition: color 0.3s ease;
    position: relative;
    z-index: 1;
    border-radius: 50px;
}

.tab-item.active {
    color: #ffffff;
}

.tab-icon {
    font-size: 18px;
}

.tab-indicator {
    position: absolute;
    top: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    border-radius: 50px;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.tab-indicator.shop {
    transform: translateX(0);
}

.tab-indicator.product {
    transform: translateX(100%);
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 16px;
    color: #999;
}

.loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #eef1f5;
    border-top-color: #FF4757;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.favorites-list {
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.shop-card {
    position: relative;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.5s ease both;
}

.shop-card:nth-child(1) { animation-delay: 0.05s; }
.shop-card:nth-child(2) { animation-delay: 0.1s; }
.shop-card:nth-child(3) { animation-delay: 0.15s; }
.shop-card:nth-child(4) { animation-delay: 0.2s; }
.shop-card:nth-child(5) { animation-delay: 0.25s; }
.shop-card:nth-child(6) { animation-delay: 0.3s; }

.shop-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.shop-card-body {
    display: flex;
    flex-direction: column;
    cursor: pointer;
}

.shop-image {
    width: 100%;
    height: 160px;
    overflow: hidden;
}

.shop-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.shop-card:hover .shop-image img {
    transform: scale(1.05);
}

.shop-info {
    padding: 12px 14px 8px;
}

.shop-name {
    font-size: 15px;
    font-weight: 700;
    color: #333;
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.shop-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
}

.rating {
    color: #FFB800;
    font-weight: 600;
}

.divider {
    color: #e0e0e0;
}

.delivery-fee {
    color: #888;
}

.enter-btn {
    margin: 0 14px 14px;
    padding: 9px 0;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: #ffffff;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
    width: calc(100% - 28px);
}

.enter-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 18px rgba(255, 71, 87, 0.4);
}

.card-remove {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    z-index: 2;
}

.card-remove:hover {
    transform: scale(1.3);
    box-shadow: 0 4px 14px rgba(255, 71, 87, 0.35);
}

.product-card {
    position: relative;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.5s ease both;
}

.product-card:nth-child(1) { animation-delay: 0.05s; }
.product-card:nth-child(2) { animation-delay: 0.1s; }
.product-card:nth-child(3) { animation-delay: 0.15s; }
.product-card:nth-child(4) { animation-delay: 0.2s; }
.product-card:nth-child(5) { animation-delay: 0.25s; }
.product-card:nth-child(6) { animation-delay: 0.3s; }

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-card-body {
    display: flex;
    flex-direction: column;
}

.product-image {
    width: 100%;
    height: 160px;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
    transform: scale(1.05);
}

.product-info {
    padding: 12px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.product-name {
    font-size: 15px;
    font-weight: 700;
    color: #333;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-shop {
    font-size: 12px;
    color: #999;
    margin: 0 0 8px;
}

.product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price {
    font-size: 18px;
    font-weight: 800;
    color: #FF4757;
}

.cart-btn {
    padding: 7px 14px;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: #ffffff;
    border: none;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
}

.cart-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 18px rgba(255, 71, 87, 0.4);
}

.empty-state {
    text-align: center;
    padding: 80px 20px;
    animation: fadeInUp 0.5s ease both;
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
}

.empty-state h2 {
    font-size: 20px;
    color: #333;
    margin: 0 0 8px;
}

.empty-state p {
    color: #999;
    font-size: 14px;
    margin: 0 0 32px;
}

.go-btn {
    padding: 14px 48px;
    border: none;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: #ffffff;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(255, 71, 87, 0.35);
}

.go-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(255, 71, 87, 0.45);
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

@media (max-width: 768px) {
    .favorites-list {
        grid-template-columns: 1fr;
    }

    .shop-image,
    .product-image {
        height: 180px;
    }
}
</style>
