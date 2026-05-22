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
                        <p class="shop-desc">{{ shop.description }}</p>
                    </div>
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

const shop = ref({})
const products = ref([])
const categories = ref([{ id: 0, name: '全部', icon: '📦' }])
const activeCategory = ref(0)
const cart = ref([])
const loading = ref(true)

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
    height: 180px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.header-content {
    position: relative;
    padding: 0 15px;
    margin-top: -100px;
}

.back-btn {
    position: absolute;
    top: -60px;
    left: 15px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0,0,0,0.3);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
}

.shop-info {
    display: flex;
    gap: 15px;
    background: white;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.shop-logo {
    width: 100px;
    height: 100px;
    border-radius: 12px;
    object-fit: cover;
}

.shop-meta {
    flex: 1;
}

.shop-meta h1 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
}

.meta-row {
    display: flex;
    gap: 10px;
    font-size: 13px;
    margin-bottom: 8px;
}

.rating {
    color: #ff9500;
}

.delivery-time, .delivery-fee {
    color: #666;
}

.shop-desc {
    margin: 0;
    font-size: 13px;
    color: #999;
}

.category-tabs {
    display: flex;
    overflow-x: auto;
    padding: 15px;
    background: white;
    gap: 10px;
    border-bottom: 1px solid #eee;
    margin-top: 15px;
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

.loading, .empty {
    text-align: center;
    padding: 50px;
    color: #999;
}

.products-list {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.product-card {
    display: flex;
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.product-image {
    width: 90px;
    height: 90px;
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
}

.product-bottom {
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

.stock {
    font-size: 12px;
    color: #ff6b6b;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 10px;
    align-self: flex-end;
}

.qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    font-size: 16px;
    cursor: pointer;
}

.qty-btn.minus {
    background: #f5f5f5;
    color: #666;
}

.qty-btn.plus {
    background: #ff6b6b;
    color: white;
}

.qty-btn.disabled {
    opacity: 0.3;
}

.qty {
    font-size: 16px;
    font-weight: 600;
    min-width: 20px;
    text-align: center;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.cart-info {
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
}

.cart-icon-wrapper {
    position: relative;
    font-size: 28px;
}

.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff6b6b;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
}

.cart-text {
    display: flex;
    flex-direction: column;
}

.total {
    font-size: 18px;
    font-weight: 700;
    color: #ff6b6b;
}

.hint {
    font-size: 12px;
    color: #999;
}

.checkout-btn {
    padding: 12px 30px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}

.checkout-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>