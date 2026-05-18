<template>
    <nav class="navbar">
        <div class="navbar-content">
            <a href="/" class="logo">
                <span>🍔</span>
                <span class="logo-text">外卖商城</span>
            </a>

            <div class="nav-items">
                <a href="/" class="nav-link" :class="{ active: currentPage === 'home' }">首页</a>
                <a href="/shops" class="nav-link" :class="{ active: currentPage === 'shops' }">商家</a>
                <a href="/products" class="nav-link" :class="{ active: currentPage === 'products' }">商品</a>
                <a href="/statistics" class="nav-link" :class="{ active: currentPage === 'statistics' }">销售统计</a>
            </div>

            <div class="nav-actions">
                <button class="cart-btn" @click="goToCart">
                    <span>🛒</span>
                    <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
                </button>

                <div v-if="user" class="user-btn" @click="toggleMenu">
                    <span>👤</span>
                </div>

                <button v-else class="login-btn" @click="goToLogin">登录</button>
            </div>
        </div>

        <div v-if="showMenu" class="dropdown-menu">
            <a href="/profile">个人中心</a>
            <a href="/orders">我的订单</a>
            <a href="/statistics">销售统计</a>
            <a href="/admin" v-if="user?.is_admin">管理后台</a>
            <a href="#" @click="logout">退出登录</a>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const user = ref(null)
const showMenu = ref(false)

const currentPage = computed(() => {
    const path = window.location.pathname
    if (path === '/') return 'home'
    if (path.startsWith('/shop/')) return 'shops'
    return path.slice(1)
})

const cartCount = computed(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    return cart.reduce((sum, item) => sum + item.quantity, 0)
})

const goToCart = () => {
    window.location.href = '/cart'
}

const goToLogin = () => {
    window.location.href = '/login'
}

const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const logout = () => {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        user.value = null
        showMenu.value = false
        window.location.href = '/'
    }
}

const updateUser = () => {
    user.value = JSON.parse(localStorage.getItem('user') || null)
}

onMounted(() => {
    updateUser()
})
</script>

<style scoped>
.navbar {
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 10px 15px;
}

.navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #333;
}

.logo span:first-child {
    font-size: 26px;
}

.logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #ff6b6b;
}

.nav-items {
    display: none;
}

.nav-link {
    text-decoration: none;
    color: #666;
    font-size: 15px;
    margin: 0 15px;
}

.nav-link.active {
    color: #ff6b6b;
    font-weight: 600;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.cart-btn {
    position: relative;
    font-size: 22px;
    background: none;
    border: none;
    cursor: pointer;
}

.cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff6b6b;
    color: white;
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 10px;
}

.user-btn {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
}

.login-btn {
    padding: 8px 16px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 15px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    padding: 10px 0;
    min-width: 140px;
}

.dropdown-menu a {
    display: block;
    padding: 12px 20px;
    text-decoration: none;
    color: #333;
    font-size: 14px;
}

.dropdown-menu a:hover {
    background: #f5f5f5;
}

@media (min-width: 768px) {
    .navbar-content {
        padding: 15px 0;
    }

    .nav-items {
        display: flex;
    }

    .logo-text {
        font-size: 22px;
    }
}
</style>
