<template>
    <div class="profile-page">
        <div class="profile-header">
            <div class="avatar-section">
                <div class="avatar">
                    <span>👤</span>
                </div>
                <div class="user-info">
                    <h2>{{ user.username }}</h2>
                    <p>{{ user.email }}</p>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="menu-section">
                <div class="menu-item" @click="goToOrders">
                    <span class="menu-icon">📋</span>
                    <span class="menu-text">我的订单</span>
                    <span class="menu-arrow">→</span>
                </div>
                <div class="menu-item" @click="goToCart">
                    <span class="menu-icon">🛒</span>
                    <span class="menu-text">购物车</span>
                    <span class="menu-arrow">→</span>
                </div>
                <div class="menu-item" @click="showAddress = !showAddress">
                    <span class="menu-icon">📍</span>
                    <span class="menu-text">收货地址</span>
                    <span class="menu-arrow">{{ showAddress ? '↑' : '→' }}</span>
                </div>
                <div v-if="showAddress" class="address-section">
                    <div class="address-card" v-if="user.address">
                        <p>{{ user.address }}</p>
                    </div>
                    <div class="add-address-btn">
                        <span>+ 添加收货地址</span>
                    </div>
                </div>
                <div class="menu-item" @click="showPhone = !showPhone">
                    <span class="menu-icon">📞</span>
                    <span class="menu-text">联系电话</span>
                    <span class="menu-arrow">{{ showPhone ? '↑' : '→' }}</span>
                </div>
                <div v-if="showPhone" class="phone-section">
                    <p>{{ user.phone || '未设置' }}</p>
                </div>
                <div class="menu-item" @click="goToAdmin" v-if="user.username === 'admin'">
                    <span class="menu-icon">⚙️</span>
                    <span class="menu-text">管理后台</span>
                    <span class="menu-arrow">→</span>
                </div>
            </div>

            <div class="logout-section">
                <button class="logout-btn" @click="logout">退出登录</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref({})
const showAddress = ref(false)
const showPhone = ref(false)

const goToOrders = () => {
    window.location.href = '/orders'
}

const goToCart = () => {
    window.location.href = '/cart'
}

const goToAdmin = () => {
    window.location.href = '/admin'
}

const logout = () => {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('user')
        window.location.href = '/login'
    }
}

onMounted(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
        window.location.href = '/login'
        return
    }
    user.value = JSON.parse(storedUser)
})
</script>

<style scoped>
.profile-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 100px;
}

.profile-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60px 40px 40px;
    color: white;
}

.avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
}

.user-info h2 {
    font-size: 28px;
    margin-bottom: 8px;
}

.user-info p {
    font-size: 16px;
    opacity: 0.9;
}

.container {
    max-width: 600px;
    margin: -30px auto 0;
    padding: 0 20px;
    position: relative;
    z-index: 1;
}

.menu-section {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    transition: background 0.2s ease;
    border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item:hover {
    background: #f8f9fa;
}

.menu-icon {
    font-size: 24px;
    margin-right: 15px;
}

.menu-text {
    flex: 1;
    font-size: 16px;
    color: #333;
}

.menu-arrow {
    color: #ccc;
    font-size: 16px;
}

.address-section,
.phone-section {
    padding: 0 20px 20px;
}

.address-card {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
}

.address-card p {
    margin: 0;
    color: #333;
}

.add-address-btn {
    padding: 15px;
    border: 2px dashed #ddd;
    border-radius: 10px;
    text-align: center;
    color: #667eea;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-address-btn:hover {
    border-color: #667eea;
    background: #f0f4ff;
}

.phone-section p {
    margin: 0;
    color: #333;
}

.logout-section {
    margin-top: 20px;
    padding: 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.logout-btn {
    width: 100%;
    padding: 15px;
    border: none;
    background: #f5f5f5;
    color: #666;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: #e8e8e8;
    color: #333;
}
</style>
