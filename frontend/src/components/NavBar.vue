<template>
  <div class="top-header">
    <div class="header-inner">
      <a href="/" class="logo">
        <span class="logo-icon">🍔</span>
        <span class="logo-text">外卖商城</span>
      </a>

      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索商家、商品..."
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">🔍</button>
      </div>

      <div class="header-actions">
        <a href="/notifications" class="action-item">
          <span class="action-icon">🔔</span>
          <span class="action-label">消息</span>
          <span class="action-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </a>
        <a href="/cart" class="action-item">
          <span class="action-icon">🛒</span>
          <span class="action-label">购物车</span>
          <span class="action-badge" v-if="cartCount > 0">{{ cartCount }}</span>
        </a>
        <div class="user-area" v-if="user" @click="toggleUserMenu">
          <span class="action-icon">👤</span>
          <span class="action-label">{{ user.username }}</span>
        </div>
        <a href="/login" class="login-link" v-else>登录/注册</a>
      </div>
    </div>
  </div>

  <div class="category-nav">
    <div class="category-inner">
      <a href="/" class="cat-link" :class="{ active: isActive('/') }">首页</a>
      <a href="/categories" class="cat-link" :class="{ active: isActive('/categories') }">🎯 分类</a>
      <a href="/shops" class="cat-link" :class="{ active: isActive('/shops') }">🏪 商家</a>
      <a href="/products" class="cat-link" :class="{ active: isActive('/products') }">🍜 美食</a>
      <a href="/deals" class="cat-link" :class="{ active: isActive('/deals') }">🔥 限时优惠</a>
      <a href="/recommendations" class="cat-link" :class="{ active: isActive('/recommendations') }">🤖 AI推荐</a>
      <a href="/favorites" class="cat-link" :class="{ active: isActive('/favorites') }">❤️ 收藏</a>
      <a href="/orders" class="cat-link" :class="{ active: isActive('/orders') }">📋 订单</a>
      <a href="/points" class="cat-link" :class="{ active: isActive('/points') }">🎯 积分</a>
      <a href="/vip" class="cat-link" :class="{ active: isActive('/vip') }">👑 会员</a>
      <a href="/statistics" class="cat-link" :class="{ active: isActive('/statistics') }">📊 统计</a>
    </div>
  </div>

  <div v-if="showUserMenu" class="user-dropdown">
    <a href="/profile">👤 个人中心</a>
    <a href="/orders">📋 我的订单</a>
    <a href="/favorites">❤️ 我的收藏</a>
    <a href="/points">🎯 积分中心</a>
    <a href="/vip">👑 会员中心</a>
    <a href="/notifications">🔔 消息通知</a>
    <a href="/admin" v-if="user?.is_admin">⚙️ 管理后台</a>
    <div class="dropdown-divider"></div>
    <a href="#" @click.prevent="logout" class="logout-link">🚪 退出登录</a>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const user = ref(null)
const searchQuery = ref('')
const showUserMenu = ref(false)
const unreadCount = ref(0)

const cartCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  return cart.reduce((sum, item) => sum + item.quantity, 0)
})

const isActive = (path) => {
  return window.location.pathname === path
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    window.location.href = `/shops?search=${encodeURIComponent(searchQuery.value.trim())}`
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  user.value = null
  showUserMenu.value = false
  window.location.href = '/'
}

const fetchUnreadCount = async () => {
  if (!user.value) return
  try {
    const res = await fetch(`/api/notifications/unread-count/${user.value.id}`)
    if (res.ok) {
      const data = await res.json()
      unreadCount.value = data.count || 0
    }
  } catch {
    unreadCount.value = 0
  }
}

const handleDocumentClick = (e) => {
  const dropdown = document.querySelector('.user-dropdown')
  const userArea = document.querySelector('.user-area')
  if (dropdown && !dropdown.contains(e.target) && userArea && !userArea.contains(e.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('user') || 'null')
  fetchUnreadCount()
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.top-header {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-box {
  flex: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 30px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.search-box:focus-within {
  box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.2);
  background: #fff;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px 18px;
  font-size: 14px;
  color: #333;
}

.search-box input::placeholder {
  color: #999;
}

.search-btn {
  border: none;
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  color: #fff;
  padding: 10px 18px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.search-btn:hover {
  opacity: 0.9;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.action-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  gap: 2px;
  transition: color 0.2s;
}

.action-item:hover {
  color: #FF4757;
}

.action-icon {
  font-size: 22px;
}

.action-label {
  font-size: 12px;
}

.action-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  background: #FF4757;
  color: #fff;
  font-size: 11px;
  min-width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  padding: 0 5px;
  font-weight: 600;
}

.user-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.user-area:hover {
  color: #FF4757;
}

.login-link {
  text-decoration: none;
  color: #FF4757;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 20px;
  border: 1px solid #FF4757;
  border-radius: 20px;
  transition: all 0.2s;
}

.login-link:hover {
  background: #FF4757;
  color: #fff;
}

.category-nav {
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.category-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-inner::-webkit-scrollbar {
  display: none;
}

.cat-link {
  padding: 10px 16px;
  text-decoration: none;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.2s;
  border-bottom: 2px solid transparent;
}

.cat-link:hover {
  color: #FF4757;
}

.cat-link.active {
  color: #FF4757;
  font-weight: 700;
  border-bottom-color: #FF4757;
}

.user-dropdown {
  position: fixed;
  top: 95px;
  right: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.12);
  padding: 8px 0;
  min-width: 180px;
  z-index: 1001;
}

.user-dropdown a {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  transition: background 0.15s;
}

.user-dropdown a:hover {
  background: #f8f8f8;
}

.dropdown-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 6px 0;
}

.logout-link {
  color: #999 !important;
}

.logout-link:hover {
  color: #FF4757 !important;
  background: #fff5f5 !important;
}

@media (max-width: 768px) {
  .header-inner {
    padding: 10px 12px;
    gap: 12px;
  }

  .logo-text {
    font-size: 18px;
  }

  .search-box {
    max-width: 240px;
  }

  .search-box input {
    padding: 8px 12px;
    font-size: 13px;
  }

  .search-btn {
    padding: 8px 12px;
  }

  .action-label {
    display: none;
  }

  .category-inner {
    padding: 0 8px;
  }

  .cat-link {
    padding: 8px 10px;
    font-size: 13px;
  }

  .user-dropdown {
    right: 12px;
  }
}
</style>
