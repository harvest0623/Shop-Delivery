<template>
  <div class="categories-page">
    <header class="top-bar">
      <button class="back-btn" @click="goBack">←</button>
      <h1 class="page-title">🎯 全部分类</h1>
    </header>

    <div class="main-content">
      <aside class="category-sidebar">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="category-item"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <span class="category-icon">{{ cat.icon }}</span>
          <span class="category-name">{{ cat.name }}</span>
        </div>
      </aside>

      <main class="product-area">
        <div class="product-header" v-if="selectedCategory">
          <span class="current-category">{{ currentCategoryName }}</span>
          <span class="product-count">{{ filteredProducts.length }}件商品</span>
        </div>

        <div class="product-grid" v-if="filteredProducts.length">
          <div
            v-for="product in filteredProducts"
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
              <div class="product-badge" v-if="product.is_featured">
                <span>🔥 招牌</span>
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-shop">{{ getShopName(product.shop_id) }}</p>
              <div class="product-meta">
                <span class="product-sales">月售{{ product.monthly_sales || 100 }}+</span>
              </div>
              <div class="product-bottom">
                <div class="price-wrap">
                  <span class="price-symbol">¥</span>
                  <span class="price-num">{{ Math.floor(product.price) }}</span>
                  <span class="price-dec">.{{ (product.price % 1 * 100).toFixed(0).padStart(2, '0') }}</span>
                </div>
                <button class="add-cart-btn" @click.stop="addToCart(product)">
                  加入购物车
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <div class="empty-icon">📦</div>
          <p class="empty-text">该分类暂无商品</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])
const products = ref([])
const selectedCategory = ref(null)
const shops = ref([])

const currentCategoryName = computed(() => {
  const cat = categories.value.find(c => c.id === selectedCategory.value)
  return cat ? cat.name : ''
})

const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value.filter(p => p.category_id === selectedCategory.value)
})

const getShopName = (shopId) => {
  const shop = shops.value.find(s => s.id === shopId)
  return shop ? shop.name : ''
}

const handleImageError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
}

const goBack = () => {
  window.history.back()
}

const selectCategory = (id) => {
  selectedCategory.value = id
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
      shop_name: getShopName(product.shop_id),
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      quantity: 1
    })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
}

onMounted(async () => {
  const [catsRes, productsRes, shopsRes] = await Promise.all([
    axios.get('/api/categories'),
    axios.get('/api/products'),
    axios.get('/api/shops')
  ])
  categories.value = catsRes.data
  products.value = productsRes.data
  shops.value = shopsRes.data
  if (categories.value.length) {
    selectedCategory.value = categories.value[0].id
  }
})
</script>

<style scoped>
.categories-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.top-bar {
  background: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #eee;
  transform: scale(1.05);
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
}

.main-content {
  display: flex;
  gap: 12px;
  padding: 12px;
  max-width: 1400px;
  margin: 0 auto;
}

.category-sidebar {
  width: 120px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  position: sticky;
  top: 84px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  position: relative;
}

.category-item:hover {
  background: #f0f0f0;
}

.category-item.active {
  background: white;
  border-left: 3px solid #FF4757;
}

.category-item.active .category-name {
  color: #FF4757;
  font-weight: 600;
}

.category-icon {
  font-size: 24px;
}

.category-name {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.3;
}

.product-area {
  flex: 1;
  min-width: 0;
}

.product-header {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.current-category {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.product-count {
  font-size: 13px;
  color: #999;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.product-image-wrap {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.product-info {
  padding: 12px;
}

.product-name {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-shop {
  margin: 0 0 6px;
  font-size: 12px;
  color: #999;
}

.product-meta {
  margin-bottom: 10px;
}

.product-sales {
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
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
  font-size: 12px;
  color: #FF4757;
  font-weight: 700;
}

.price-num {
  font-size: 20px;
  font-weight: 800;
  color: #FF4757;
  line-height: 1;
}

.price-dec {
  font-size: 12px;
  color: #FF4757;
  font-weight: 600;
}

.add-cart-btn {
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.add-cart-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
}

.empty-state {
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  margin: 0;
  font-size: 16px;
  color: #999;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    padding: 8px;
  }

  .category-sidebar {
    width: 100%;
    max-height: none;
    position: static;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 8px;
    padding: 8px;
  }

  .category-item {
    flex-shrink: 0;
    padding: 12px 16px;
    border-left: none;
    border-bottom: 3px solid transparent;
    min-width: 70px;
  }

  .category-item.active {
    border-left: none;
    border-bottom: 3px solid #FF4757;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .product-image-wrap {
    height: 120px;
  }

  .product-info {
    padding: 10px;
  }

  .product-name {
    font-size: 13px;
  }

  .price-num {
    font-size: 18px;
  }

  .add-cart-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .product-image-wrap {
    height: 180px;
  }
}
</style>
