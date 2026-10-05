<template>
  <div class="deals-page">
    <header class="deals-header">
      <div class="header-left">
        <span class="back-btn" @click="goBack">←</span>
        <h1 class="header-title">🔥 限时优惠</h1>
      </div>
      <div class="countdown-header">
        <span class="countdown-label">距结束</span>
        <span class="countdown-time">{{ countdown.hours }}:{{ countdown.minutes }}:{{ countdown.seconds }}</span>
      </div>
    </header>

    <section class="countdown-banner">
      <div class="countdown-inner">
        <div class="countdown-text">限时特惠，手慢无！</div>
        <div class="countdown-digits">
          <span class="digit-block">{{ countdown.hours }}</span>
          <span class="digit-sep">:</span>
          <span class="digit-block">{{ countdown.minutes }}</span>
          <span class="digit-sep">:</span>
          <span class="digit-block">{{ countdown.seconds }}</span>
        </div>
      </div>
    </section>

    <section class="deals-list">
      <div
        v-for="deal in deals"
        :key="deal.id"
        class="deal-card"
      >
        <div class="deal-image-wrap">
          <span class="deal-badge">限时</span>
          <img
            :src="deal.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop'"
            :alt="deal.name"
            class="deal-image"
            @error="handleImageError"
          />
        </div>
        <div class="deal-info">
          <h3 class="deal-name">{{ deal.name }}</h3>
          <p class="deal-shop">{{ deal.shop_name }}</p>
          <div class="deal-price-row">
            <span class="deal-original-price">¥{{ deal.originalPrice }}</span>
            <span class="deal-sale-price">¥{{ deal.salePrice }}</span>
          </div>
          <div class="deal-progress-wrap">
            <div class="deal-progress-bar">
              <div class="deal-progress-fill" :style="{ width: deal.percent + '%' }"></div>
            </div>
            <span class="deal-progress-text">已抢{{ deal.percent }}%</span>
          </div>
          <div class="deal-bottom-row">
            <span class="deal-sold">已抢购 {{ deal.soldCount }}件</span>
            <button class="deal-buy-btn" @click="addToCart(deal)">立即抢购</button>
          </div>
        </div>
      </div>
    </section>

    <section class="deals-footer">
      <p class="deals-footer-text">更多优惠即将开始</p>
      <a href="/products" class="deals-footer-link">查看全部商品</a>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const products = ref([])
const cartCount = ref(0)
let timer = null

const countdown = ref({
  hours: '02',
  minutes: '35',
  seconds: '48'
})

const deals = computed(() => {
  return products.value.slice(0, 8).map((p, i) => {
    const original = (Number(p.price) * 1.4).toFixed(2)
    const sale = Number(p.price).toFixed(2)
    const percent = 60 + Math.floor(Math.random() * 36)
    const soldCount = 100 + Math.floor(Math.random() * 900)
    return {
      ...p,
      originalPrice: original,
      salePrice: sale,
      percent,
      soldCount
    }
  })
})

const getShopName = (shopId) => {
  const shop = products.value.find(s => s.id === shopId)
  return shop ? shop.name : ''
}

const getShopDeliveryFee = (shopId) => {
  return 5
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
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
    cart.push({
      id: product.id,
      shop_id: product.shop_id,
      shop_name: product.shop_name || '',
      shop_delivery_fee: getShopDeliveryFee(product.shop_id),
      name: product.name,
      price: Number(product.salePrice),
      image_url: product.image_url,
      quantity: 1
    })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0)

  const btn = event.target.closest('.deal-buy-btn')
  if (btn) {
    btn.classList.add('clicked')
    setTimeout(() => btn.classList.remove('clicked'), 300)
  }
}

const startCountdown = () => {
  let totalSeconds = 2 * 3600 + 35 * 60 + 48

  const pad = (n) => String(n).padStart(2, '0')

  timer = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(timer)
      countdown.value = { hours: '00', minutes: '00', seconds: '00' }
      return
    }
    totalSeconds--
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    countdown.value = {
      hours: pad(h),
      minutes: pad(m),
      seconds: pad(s)
    }
  }, 1000)
}

onMounted(async () => {
  try {
    const res = await axios.get('/api/products')
    products.value = res.data
  } catch (e) {
    console.error('获取商品失败', e)
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0)

  startCountdown()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.deals-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 40px;
}

.deals-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-btn {
  font-size: 22px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: #f0f0f0;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.countdown-header {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #FF4757;
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
}

.countdown-label {
  font-size: 12px;
  opacity: 0.9;
}

.countdown-time {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-family: 'Courier New', monospace;
}

.countdown-banner {
  margin: 12px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 6px 20px rgba(255, 71, 87, 0.35);
}

.countdown-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.countdown-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.countdown-digits {
  display: flex;
  align-items: center;
  gap: 6px;
}

.digit-block {
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 32px;
  font-weight: 800;
  font-family: 'Courier New', monospace;
  padding: 8px 14px;
  border-radius: 10px;
  min-width: 56px;
  text-align: center;
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
}

.digit-sep {
  color: #fff;
  font-size: 28px;
  font-weight: 800;
}

.deals-list {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deal-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.deal-card:active {
  transform: scale(0.985);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.deal-image-wrap {
  position: relative;
  width: 130px;
  min-width: 130px;
  height: 130px;
  flex-shrink: 0;
}

.deal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.deal-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: #FF4757;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 0 0 10px 0;
  z-index: 2;
}

.deal-info {
  flex: 1;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.deal-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.deal-shop {
  font-size: 12px;
  color: #999;
  margin: 4px 0 0;
}

.deal-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 6px;
}

.deal-original-price {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}

.deal-sale-price {
  font-size: 18px;
  font-weight: 700;
  color: #FF4757;
}

.deal-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.deal-progress-bar {
  flex: 1;
  height: 6px;
  background: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.deal-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF4757, #FF6B81);
  border-radius: 3px;
  transition: width 0.3s;
}

.deal-progress-text {
  font-size: 11px;
  color: #FF4757;
  font-weight: 600;
  white-space: nowrap;
}

.deal-bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.deal-sold {
  font-size: 11px;
  color: #999;
}

.deal-buy-btn {
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}

.deal-buy-btn:active {
  transform: scale(0.95);
}

.deal-buy-btn.clicked {
  transform: scale(0.9);
}

.deals-footer {
  text-align: center;
  margin-top: 28px;
  padding: 0 16px;
}

.deals-footer-text {
  font-size: 14px;
  color: #999;
  margin: 0 0 10px;
}

.deals-footer-link {
  display: inline-block;
  font-size: 14px;
  color: #FF4757;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 24px;
  border: 1px solid #FF4757;
  border-radius: 20px;
  transition: background 0.2s, color 0.2s;
}

.deals-footer-link:hover {
  background: #FF4757;
  color: #fff;
}

@media (max-width: 768px) {
  .deals-header {
    padding: 10px 12px;
  }

  .header-title {
    font-size: 16px;
  }

  .countdown-banner {
    margin: 10px 12px;
    padding: 22px 16px;
  }

  .digit-block {
    font-size: 26px;
    padding: 6px 10px;
    min-width: 48px;
  }

  .deals-list {
    padding: 0 12px;
  }

  .deal-image-wrap {
    width: 110px;
    min-width: 110px;
    height: 110px;
  }
}

@media (max-width: 480px) {
  .deal-image-wrap {
    width: 100px;
    min-width: 100px;
    height: 100px;
  }

  .deal-name {
    font-size: 14px;
  }

  .deal-sale-price {
    font-size: 16px;
  }

  .deal-buy-btn {
    padding: 5px 12px;
    font-size: 12px;
  }
}
</style>
