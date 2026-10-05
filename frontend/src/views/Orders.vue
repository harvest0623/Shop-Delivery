<template>
  <div class="orders-page">
    <div class="page-header">
      <div class="header-content">
        <h1>📋 我的订单</h1>
        <p>共 {{ orders.length }} 个订单</p>
      </div>
    </div>

    <div class="order-shortcuts">
      <div class="shortcut-item" @click="activeTab = 'pending'">
        <div class="shortcut-icon">⏳</div>
        <span>待付款</span>
        <div class="shortcut-badge" v-if="getStatusCount('pending')">{{ getStatusCount('pending') }}</div>
      </div>
      <div class="shortcut-item" @click="activeTab = 'paid'">
        <div class="shortcut-icon">📦</div>
        <span>待配送</span>
      </div>
      <div class="shortcut-item" @click="activeTab = 'shipping'">
        <div class="shortcut-icon">🚚</div>
        <span>配送中</span>
      </div>
      <div class="shortcut-item" @click="activeTab = 'completed'">
        <div class="shortcut-icon">✅</div>
        <span>已完成</span>
      </div>
      <div class="shortcut-item" @click="activeTab = 'returned'">
        <div class="shortcut-icon">↩️</div>
        <span>退换/售后</span>
      </div>
    </div>

    <div class="filter-tabs">
      <div v-for="tab in statusTabs" :key="tab.value" class="filter-tab" :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
        {{ tab.label }}
      </div>
    </div>

    <div class="search-bar" v-if="!loading">
      <input v-model="searchQuery" placeholder="🔍 搜索订单商家/订单号" class="order-search" />
    </div>

    <div v-if="loading" class="loading-state">
      <div class="skeleton-card" v-for="i in 3" :key="i">
        <div class="skeleton-header"></div>
        <div class="skeleton-body"></div>
        <div class="skeleton-footer"></div>
      </div>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>暂无相关订单</h3>
      <p>快去选购心仪的商品吧</p>
      <button class="empty-btn" @click="goShopping">去逛逛</button>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="card-header">
          <div class="header-left">
            <img :src="order.shop_image || 'https://via.placeholder.com/40'" class="shop-avatar" />
            <div class="shop-info">
              <span class="shop-name">{{ order.shop_name }}</span>
              <span class="order-time">{{ formatTime(order.created_at) }}</span>
            </div>
          </div>
          <span class="status-tag" :class="order.status">{{ getStatusText(order.status) }}</span>
        </div>

        <div class="card-items" @click="viewOrderDetail(order)">
          <div v-for="item in (order.items || []).slice(0, 3)" :key="item.id" class="item-row">
            <img :src="item.image_url || 'https://via.placeholder.com/60'" class="item-img" />
            <div class="item-info">
              <span class="item-name">{{ item.product_name || item.name }}</span>
              <span class="item-spec">x{{ item.quantity }}</span>
            </div>
            <span class="item-price">¥{{ Number(item.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div v-if="(order.items || []).length > 3" class="more-items">
            等共 {{ order.items.length }} 件商品
          </div>
        </div>

        <div class="order-timeline" v-if="order.status === 'shipping' || order.status === 'paid'">
          <div class="timeline-step done">
            <div class="step-dot"></div>
            <span>已下单</span>
          </div>
          <div class="timeline-line" :class="{ done: order.status !== 'pending' }"></div>
          <div class="timeline-step" :class="{ done: order.status === 'shipping' || order.status === 'completed' }">
            <div class="step-dot"></div>
            <span>配送中</span>
          </div>
          <div class="timeline-line"></div>
          <div class="timeline-step" :class="{ done: order.status === 'completed' }">
            <div class="step-dot"></div>
            <span>已完成</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="footer-left">
            <span class="total-label">共{{ getTotalQty(order.items) }}件</span>
            <span class="total-text">合计：</span>
            <span class="total-price">¥{{ Number(order.total_amount).toFixed(2) }}</span>
          </div>
          <div class="footer-actions">
            <template v-if="order.status === 'pending'">
              <button class="btn-action btn-outline" @click.stop="handleCancel(order)">取消</button>
              <button class="btn-action btn-primary" @click.stop="handlePay(order)">去支付</button>
            </template>
            <template v-else-if="order.status === 'completed'">
              <button class="btn-action btn-outline" @click.stop="reorder(order)">再来一单</button>
              <button class="btn-action btn-primary" @click.stop="openRating(order)">⭐ 去评价</button>
            </template>
            <template v-else-if="order.status === 'returned'">
              <button class="btn-action btn-outline" @click.stop="viewReturnDetail(order)">退货详情</button>
            </template>
            <template v-else>
              <button class="btn-action btn-outline" @click.stop="viewOrderDetail(order)">查看详情</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRefundModal" class="modal-overlay" @click="closeRefundModal">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3>申请退货</h3>
          <span class="modal-close" @click="closeRefundModal">✕</span>
        </div>
        <div class="modal-body">
          <p class="refund-order-no">订单号：{{ currentOrder?.order_no }}</p>
          <div class="form-group">
            <label>退货原因</label>
            <textarea v-model="refundReason" placeholder="请详细描述退货原因..." rows="4"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-action btn-outline" @click="closeRefundModal">取消</button>
          <button class="btn-action btn-danger" @click="submitRefund" :disabled="!refundReason.trim()">确认退货</button>
        </div>
      </div>
    </div>

    <div v-if="showRatingModal" class="modal-overlay" @click="closeRatingModal">
      <div class="modal-card rating-modal" @click.stop>
        <div class="modal-header">
          <h3>⭐ 评价订单</h3>
          <span class="modal-close" @click="closeRatingModal">✕</span>
        </div>
        <div class="modal-body">
          <div class="rating-stars">
            <span v-for="s in 5" :key="s" class="star" :class="{ active: ratingForm.rating >= s }" @click="ratingForm.rating = s" @mouseenter="hoverStar = s" @mouseleave="hoverStar = 0">
              {{ (hoverStar || ratingForm.rating) >= s ? '★' : '☆' }}
            </span>
            <span class="rating-text">{{ ratingTexts[ratingForm.rating - 1] || '请评分' }}</span>
          </div>
          <div class="form-group">
            <textarea v-model="ratingForm.content" placeholder="分享你的用餐体验，帮助其他小伙伴做出选择~" rows="4"></textarea>
            <div class="char-count">{{ ratingForm.content.length }}/500</div>
          </div>
          <div class="image-upload">
            <div class="uploaded-images">
              <div v-for="(img, idx) in ratingForm.images" :key="idx" class="upload-preview">
                <img :src="img" />
                <span class="remove-img" @click="ratingForm.images.splice(idx, 1)">✕</span>
              </div>
              <div v-if="ratingForm.images.length < 9" class="upload-btn" @click="addImage">
                <span>📷</span>
                <span class="upload-text">添加图片</span>
              </div>
            </div>
            <p class="upload-tip">最多上传9张图片</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-action btn-outline" @click="closeRatingModal">取消</button>
          <button class="btn-action btn-primary" @click="submitRating" :disabled="ratingForm.rating === 0">提交评价</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const orders = ref([])
const loading = ref(true)
const activeTab = ref('all')
const showRefundModal = ref(false)
const showRatingModal = ref(false)
const currentOrder = ref(null)
const refundReason = ref('')
const hoverStar = ref(0)
const searchQuery = ref('')

const ratingForm = ref({ rating: 0, content: '', images: [] })
const ratingTexts = ['很差', '较差', '一般', '满意', '非常满意']

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '待配送', value: 'paid' },
  { label: '配送中', value: 'shipping' },
  { label: '已完成', value: 'completed' },
  { label: '退换/售后', value: 'returned' }
]

const filteredOrders = computed(() => {
  let result = activeTab.value === 'all' ? orders.value : orders.value.filter(o => o.status === activeTab.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(o =>
      (o.shop_name && o.shop_name.toLowerCase().includes(q)) ||
      (o.order_no && o.order_no.toLowerCase().includes(q))
    )
  }
  return result
})

const getStatusCount = (status) => {
  return orders.value.filter(o => o.status === status).length
}

const getTotalQty = (items) => {
  if (!items) return 0
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

const getStatusText = (status) => {
  const map = {
    pending: '待付款',
    paid: '待配送',
    shipping: '配送中',
    completed: '已完成',
    returned: '已退货',
    cancelled: '已取消'
  }
  return map[status] || status
}

const formatTime = (time) => {
  if (!time) return ''
  const d = new Date(time)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const goBack = () => {
  history.back()
}

const goShopping = () => {
  window.location.href = '/shops'
}

const viewOrderDetail = (order) => {
  window.location.href = `/orders/${order.id}`
}

const handlePay = async (order) => {
  try {
    await axios.put(`/api/orders/${order.id}/pay`)
    alert('支付成功！')
    loadOrders()
  } catch (error) {
    console.error('支付失败:', error)
    alert('支付失败，请重试')
  }
}

const handleCancel = async (order) => {
  if (!confirm('确定要取消该订单吗？')) return
  try {
    await axios.put(`/api/orders/${order.id}/cancel`)
    alert('订单已取消')
    loadOrders()
  } catch (error) {
    console.error('取消订单失败:', error)
    alert('取消失败，请重试')
  }
}

const openRating = (order) => {
  currentOrder.value = order
  ratingForm.value = { rating: 0, content: '', images: [] }
  hoverStar.value = 0
  showRatingModal.value = true
}

const closeRatingModal = () => {
  showRatingModal.value = false
  currentOrder.value = null
}

const addImage = () => {
  const url = prompt('请输入图片URL地址：')
  if (url && url.trim()) {
    ratingForm.value.images.push(url.trim())
  }
}

const submitRating = async () => {
  if (!currentOrder.value || ratingForm.value.rating === 0) return
  try {
    const item = (currentOrder.value.items || [])[0]
    await axios.post('/api/reviews', {
      customer_id: user.value?.id,
      product_id: item?.product_id,
      order_id: currentOrder.value.id,
      rating: ratingForm.value.rating,
      content: ratingForm.value.content,
      images: ratingForm.value.images
    })
    alert('评价提交成功！')
    closeRatingModal()
  } catch (error) {
    console.error('评价提交失败:', error)
    alert('评价提交失败，请重试')
  }
}

const submitRefund = async () => {
  if (!currentOrder.value || !refundReason.value.trim()) return
  try {
    await axios.put(`/api/orders/${currentOrder.value.id}/return`, {
      reason: refundReason.value
    })
    alert('退货申请已提交')
    closeRefundModal()
    loadOrders()
  } catch (error) {
    console.error('退货申请失败:', error)
    alert('退货申请失败，请重试')
  }
}

const closeRefundModal = () => {
  showRefundModal.value = false
  currentOrder.value = null
  refundReason.value = ''
}

const viewReturnDetail = (order) => {
  alert(`退货原因：${order.return_reason || '无'}\n订单金额：¥${Number(order.total_amount).toFixed(2)}`)
}

const reorder = (order) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  for (const item of (order.items || [])) {
    const existing = cart.find(c => c.id === (item.product_id || item.id))
    if (existing) {
      existing.quantity += item.quantity
    } else {
      cart.push({
        id: item.product_id || item.id,
        shop_id: order.shop_id,
        shop_name: order.shop_name,
        name: item.product_name || item.name,
        price: Number(item.price),
        image_url: item.image_url,
        quantity: item.quantity
      })
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  window.location.href = '/cart'
}

const loadOrders = async () => {
  loading.value = true
  try {
    if (!user.value) {
      loading.value = false
      return
    }
    const res = await axios.get(`/api/orders/customer/${user.value.id}`)
    orders.value = res.data
  } catch (error) {
    console.error('加载订单失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const statusParam = urlParams.get('status');
  if (statusParam) {
      activeTab.value = statusParam;
  }
  loadOrders()
})
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.orders-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 80px;
}

.page-header {
  background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
  padding: 32px 24px 40px;
  text-align: center;
  border-radius: 0 0 24px 24px;
  position: relative;
}

.header-content h1 {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
}

.header-content p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.order-shortcuts {
  display: flex;
  background: #ffffff;
  margin: -16px 16px 0;
  border-radius: 16px;
  padding: 20px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
}

.shortcut-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s ease;
}

.shortcut-item:hover {
  transform: translateY(-2px);
}

.shortcut-icon {
  font-size: 28px;
}

.shortcut-item span {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.shortcut-badge {
  position: absolute;
  top: -4px;
  right: 50%;
  transform: translateX(16px);
  background: #FF4757;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 20px 16px 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter-tabs::-webkit-scrollbar {
  display: none;
}

.filter-tab {
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  color: #888;
  background: #fff;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  color: #FF4757;
  border-color: #FF4757;
}

.filter-tab.active {
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.35);
}

.search-bar {
  padding: 12px 16px 0;
}

.order-search {
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: 24px;
  background: white;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  outline: none;
  transition: box-shadow 0.2s;
}

.order-search:focus {
  box-shadow: 0 2px 12px rgba(255,71,87,0.15);
}

.loading-state {
  padding: 16px;
}

.skeleton-card {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
}

.skeleton-header,
.skeleton-body,
.skeleton-footer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-header {
  height: 60px;
}

.skeleton-body {
  height: 100px;
}

.skeleton-footer {
  height: 50px;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 20px;
  display: block;
}

.empty-state h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px;
  font-weight: 600;
}

.empty-state p {
  font-size: 14px;
  color: #999;
  margin: 0 0 28px;
}

.empty-btn {
  padding: 12px 40px;
  border: none;
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  color: #fff;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(255, 71, 87, 0.4);
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(255, 71, 87, 0.5);
}

.orders-list {
  padding: 16px;
}

.order-card {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
}

.order-card:nth-child(1) { animation-delay: 0.05s; }
.order-card:nth-child(2) { animation-delay: 0.1s; }
.order-card:nth-child(3) { animation-delay: 0.15s; }
.order-card:nth-child(4) { animation-delay: 0.2s; }
.order-card:nth-child(5) { animation-delay: 0.25s; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shop-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

.shop-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.shop-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.order-time {
  font-size: 12px;
  color: #aaa;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-tag.pending {
  background: #fff4e6;
  color: #ff9500;
}

.status-tag.paid {
  background: #e8f4fd;
  color: #2196f3;
}

.status-tag.shipping {
  background: #e0f7fa;
  color: #00bcd4;
}

.status-tag.completed {
  background: #e8f8ee;
  color: #34c759;
}

.status-tag.returned {
  background: #ffeaea;
  color: #ff3b30;
}

.status-tag.cancelled {
  background: #f2f2f7;
  color: #8e8e93;
}

.card-items {
  padding: 0 20px;
  cursor: pointer;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f8;
}

.item-row:last-child {
  border-bottom: none;
}

.item-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  background: #f5f7fa;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-spec {
  font-size: 12px;
  color: #aaa;
}

.item-price {
  font-size: 14px;
  font-weight: 600;
  color: #FF4757;
  white-space: nowrap;
}

.more-items {
  text-align: center;
  padding: 10px 0;
  font-size: 12px;
  color: #999;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px 16px;
  border-top: 1px solid #f5f5f8;
}

.footer-left {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-label {
  font-size: 12px;
  color: #aaa;
  margin-right: 6px;
}

.total-text {
  font-size: 13px;
  color: #666;
}

.total-price {
  font-size: 18px;
  font-weight: 700;
  color: #FF4757;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 4px 16px rgba(255, 71, 87, 0.45);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-outline {
  background: #fff;
  color: #888;
  border: 1px solid #ddd;
}

.btn-outline:hover {
  border-color: #aaa;
  color: #555;
}

.btn-danger {
  background: linear-gradient(135deg, #ff3b30, #ff6b6b);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 59, 48, 0.3);
}

.btn-danger:hover {
  box-shadow: 0 4px 16px rgba(255, 59, 48, 0.45);
  transform: translateY(-1px);
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeInUp 0.2s ease;
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  color: #888;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e0e0e0;
  color: #333;
}

.modal-body {
  padding: 20px 24px;
}

.refund-order-no {
  font-size: 14px;
  color: #FF4757;
  font-weight: 600;
  margin: 0 0 16px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e4ea;
  border-radius: 12px;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group textarea:focus {
  outline: none;
  border-color: #FF4757;
  box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.1);
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 20px;
}

.modal-footer .btn-action {
  flex: 1;
  padding: 10px;
  text-align: center;
}

.rating-modal .modal-body {
  padding-bottom: 12px;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}

.star {
  font-size: 32px;
  cursor: pointer;
  color: #ddd;
  transition: all 0.15s ease;
  line-height: 1;
}

.star.active {
  color: #ffc107;
}

.star:hover {
  transform: scale(1.2);
}

.rating-text {
  font-size: 14px;
  color: #FF4757;
  font-weight: 500;
  margin-left: 8px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #bbb;
  margin-top: 6px;
}

.image-upload {
  margin-top: 16px;
}

.uploaded-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.upload-preview {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 1;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-img {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  cursor: pointer;
}

.upload-btn {
  aspect-ratio: 1;
  border: 2px dashed #ddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover {
  border-color: #FF4757;
  color: #FF4757;
}

.upload-btn span:first-child {
  font-size: 24px;
}

.upload-text {
  font-size: 11px;
  color: #999;
}

.upload-tip {
  font-size: 12px;
  color: #bbb;
  margin: 8px 0 0;
}

.order-timeline {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0 4px;
  gap: 0;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.timeline-step .step-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #ddd;
  transition: all 0.3s;
}

.timeline-step.done .step-dot {
  background: linear-gradient(135deg, #FF4757, #FF6B81);
  box-shadow: 0 0 6px rgba(255,71,87,0.4);
}

.timeline-step span { font-size: 11px; color: #999; }
.timeline-step.done span { color: #FF4757; font-weight: 500; }

.timeline-line {
  width: 40px; height: 2px;
  background: #ddd;
  margin: 0 4px;
  margin-bottom: 16px;
}

.timeline-line.done {
  background: linear-gradient(90deg, #FF4757, #FF6B81);
}

@media (max-width: 768px) {
  .orders-list {
    padding: 12px;
  }

  .order-card {
    margin-bottom: 12px;
  }

  .card-header {
    padding: 14px 16px 10px;
  }

  .card-items {
    padding: 0 16px;
  }

  .card-footer {
    padding: 12px 16px 14px;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
  }

  .footer-left {
    width: 100%;
    justify-content: flex-end;
  }

  .footer-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .item-img {
    width: 48px;
    height: 48px;
  }

  .order-shortcuts {
    margin: -16px 12px 0;
    padding: 16px 0;
  }

  .shortcut-icon {
    font-size: 24px;
  }

  .page-header h1 {
    font-size: 20px;
  }

  .filter-tabs {
    padding: 16px 12px 8px;
  }

  .star {
    font-size: 26px;
  }

  .uploaded-images {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
}
</style>
