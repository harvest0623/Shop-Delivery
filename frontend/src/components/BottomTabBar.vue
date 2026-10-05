<template>
  <div class="bottom-tabbar" v-if="isVisible">
    <div 
      v-for="tab in tabs" 
      :key="tab.path"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
      @click="goTo(tab.path)"
    >
      <div class="tab-icon-wrap" v-if="tab.isCenter">
        <span class="tab-icon center-icon">{{ tab.icon }}</span>
        <span class="center-badge" v-if="tab.badge">{{ tab.badge }}</span>
      </div>
      <template v-else>
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-badge" v-if="tab.badge">{{ tab.badge }}</span>
      </template>
      <span class="tab-label">{{ tab.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const tabs = computed(() => {
  let badge = 0
  try {
    badge = parseInt(localStorage.getItem('cart_count') || '0', 10)
  } catch (e) {
    badge = 0
  }
  return [
    { icon: '🏠', label: '首页', path: '/' },
    { icon: '🎯', label: '分类', path: '/categories' },
    { icon: '🛒', label: '购物车', path: '/cart', isCenter: true, badge: badge > 0 ? badge : 0 },
    { icon: '📋', label: '订单', path: '/orders' },
    { icon: '👤', label: '我的', path: '/profile' }
  ]
})

const currentPath = computed(() => {
  return window.location.pathname
})

const isVisible = computed(() => {
  const hiddenPaths = ['/', '/login', '/register']
  return !hiddenPaths.includes(currentPath.value)
})

const isActive = (path) => {
  return currentPath.value === path
}

const goTo = (path) => {
  window.location.href = path
}
</script>

<style scoped>
@media (max-width: 768px) {
  .bottom-tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-around;
    padding: 6px 0;
    z-index: 999;
  }

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    position: relative;
  }

  .tab-icon {
    font-size: 22px;
  }

  .tab-label {
    font-size: 10px;
    color: #999;
    margin-top: 2px;
  }

  .tab-item.active .tab-label {
    color: #FF4757;
    font-weight: 600;
  }

  .center-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    border-radius: 50%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-top: -20px;
    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
  }

  .tab-badge,
  .center-badge {
    position: absolute;
    top: -4px;
    right: 50%;
    transform: translateX(14px);
    background: #FF4757;
    color: white;
    font-size: 10px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 8px;
    padding: 0 4px;
  }

  .center-badge {
    top: -24px;
    right: 50%;
    transform: translateX(14px);
  }
}

@media (min-width: 769px) {
  .bottom-tabbar {
    display: none;
  }
}
</style>
