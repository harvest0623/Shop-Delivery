<template>
    <div class="cart-page">
        <div class="container">
            <div class="page-header">
                <div class="back-btn" @click="goBack">
                    <span>←</span>
                </div>
                <h1>🛒 购物车</h1>
                <button v-if="cart.length > 0" class="clear-btn" @click="clearCart">清空购物车</button>
            </div>

            <div v-if="cart.length > 0" class="cart-content">
                <div class="cart-items">
                    <div
                        v-for="item in cart"
                        :key="item.id"
                        class="cart-item"
                    >
                        <div class="item-image">
                            <img :src="item.image_url" :alt="item.name" />
                        </div>
                        <div class="item-info">
                            <h3>{{ item.name }}</h3>
                            <p class="item-shop">{{ item.shop_name }}</p>
                            <div class="item-price">¥{{ Number(item.price).toFixed(2) }}</div>
                        </div>
                        <div class="item-quantity">
                            <button
                                class="qty-btn"
                                @click="decreaseQty(item)"
                            >-</button>
                            <span class="qty">{{ item.quantity }}</span>
                            <button
                                class="qty-btn"
                                @click="increaseQty(item)"
                            >+</button>
                        </div>
                        <div class="item-total">
                            ¥{{ (item.price * item.quantity).toFixed(2) }}
                        </div>
                        <button class="remove-btn" @click="removeItem(item.id)">
                            <span>🗑️</span>
                        </button>
                    </div>
                </div>

                <div class="ai-pair-section" v-if="cart.length > 0">
  <div class="ai-pair-header">
    <span class="ai-pair-icon">🤖</span>
    <span class="ai-pair-title">AI智能搭配</span>
    <span class="ai-pair-tag">LangChain RAG</span>
  </div>
  <div v-if="aiPairLoading" class="ai-pair-loading">
    <div class="ai-pair-spinner"></div>
    <span>AI正在为您搭配...</span>
  </div>
  <div v-else-if="aiPairReason" class="ai-pair-reason">{{ aiPairReason }}</div>
  <div v-if="aiPairItems.length > 0" class="ai-pair-list">
    <div v-for="item in aiPairItems" :key="item.id" class="ai-pair-item">
      <img :src="item.image_url || 'https://via.placeholder.com/60'" class="pair-img" />
      <div class="pair-info">
        <span class="pair-name">{{ item.name }}</span>
        <span class="pair-price">¥{{ Number(item.price).toFixed(2) }}</span>
      </div>
      <button class="pair-add" @click="addAiPairItem(item)">+</button>
    </div>
  </div>
</div>

                <div class="recommend-section" v-if="cart.length > 0 && totalAmount < 50">
                    <div class="recommend-header">
                        <span>🔥 凑单推荐</span>
                        <span class="recommend-hint">再买¥{{ (50 - totalAmount).toFixed(2) }}免配送费</span>
                    </div>
                    <div class="recommend-list">
                        <div v-for="item in recommendItems" :key="item.id" class="recommend-item">
                            <img :src="item.image_url || 'https://via.placeholder.com/80'" />
                            <div class="recommend-info">
                                <span class="recommend-name">{{ item.name }}</span>
                                <span class="recommend-price">¥{{ Number(item.price).toFixed(2) }}</span>
                            </div>
                            <button class="recommend-add" @click="addRecommendItem(item)">+</button>
                        </div>
                    </div>
                </div>

                <div class="cart-summary">
                    <div class="summary-header">
                        <h2>订单摘要</h2>
                    </div>
                    <div class="summary-row">
                        <span>商品数量</span>
                        <span>{{ totalQuantity }} 件</span>
                    </div>
                    <div class="summary-row">
                        <span>商品总价</span>
                        <span>¥{{ totalPrice.toFixed(2) }}</span>
                    </div>
                    <div class="summary-row delivery">
                        <span v-if="deliveryFee === 0">配送费 ¥0.00 ✨</span>
                        <span v-else>配送费 ¥5.00（满50元免配送费）</span>
                        <span></span>
                    </div>
                    <div class="summary-row total">
                        <span>应付金额</span>
                        <span>¥{{ totalAmount.toFixed(2) }}</span>
                    </div>
                    <button class="checkout-btn" @click="handleCheckout" :disabled="processing">
                        {{ processing ? '提交中...' : '去结算' }}
                    </button>
                </div>
            </div>

            <div class="promo-bar" v-show="cart.length > 0">
                <div v-if="totalPrice < 30" class="promo-tip promo-orange">
                    还差¥{{ (30 - totalPrice).toFixed(2) }}起送，去凑单 →
                </div>
                <div v-else class="promo-tip promo-green">
                    ✅ 已满起送价，可放心下单
                </div>
                <div v-if="totalPrice >= 50" class="promo-tip promo-purple">
                    🎉 满50元免配送费
                </div>
            </div>

            <div v-else class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h2>购物车是空的</h2>
                <p>快去挑选心仪的商品吧</p>
                <button class="go-shopping-btn" @click="goShopping">去购物</button>
            </div>
        </div>

        <!-- 支付弹窗 -->
        <div v-if="showPaymentModal" class="modal-overlay" @click="showPaymentModal = false">
            <div class="modal-content payment-modal" @click.stop>
                <div class="payment-header">
                    <h2>💳 确认支付</h2>
                    <span class="close-btn" @click="showPaymentModal = false">✕</span>
                </div>
                <div class="payment-amount">
                    <span class="amount-label">支付金额</span>
                    <span class="amount-value">¥{{ totalAmount.toFixed(2) }}</span>
                </div>
                <div class="payment-methods">
                    <div class="payment-method" :class="{ active: selectedPayment === 'wechat' }" @click="selectedPayment = 'wechat'">
                        <span class="method-icon">💚</span>
                        <span class="method-name">微信支付</span>
                        <span class="method-check" v-if="selectedPayment === 'wechat'">✓</span>
                    </div>
                    <div class="payment-method" :class="{ active: selectedPayment === 'alipay' }" @click="selectedPayment = 'alipay'">
                        <span class="method-icon">💙</span>
                        <span class="method-name">支付宝</span>
                        <span class="method-check" v-if="selectedPayment === 'alipay'">✓</span>
                    </div>
                    <div class="payment-method" :class="{ active: selectedPayment === 'card' }" @click="selectedPayment = 'card'">
                        <span class="method-icon">💳</span>
                        <span class="method-name">银行卡支付</span>
                        <span class="method-check" v-if="selectedPayment === 'card'">✓</span>
                    </div>
                </div>
                <div class="remark-row">
                    <label>📝 订单备注</label>
                    <input v-model="orderRemark" placeholder="如：不要辣、多加醋等" maxlength="50" />
                </div>
                <button class="pay-btn" @click="confirmPayment" :disabled="processing">
                    {{ processing ? '支付中...' : '确认支付' }}
                </button>
                <p class="payment-tip">* 这是模拟支付，不会产生真实交易</p>
            </div>
        </div>

        <!-- 结算成功弹窗 -->
        <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="success-icon">✅</div>
                <h2>订单提交成功！</h2>
                <p class="order-number">订单号：{{ lastOrderNo }}</p>
                <p class="order-info">商品数量：{{ lastOrderQuantity }} 件</p>
                <p class="order-info">应付金额：¥{{ lastOrderAmount.toFixed(2) }}</p>
                <div class="modal-buttons">
                    <button class="btn-secondary" @click="goOrders">查看订单</button>
                    <button class="btn-primary" @click="goShopping">继续购物</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { toast } from '../utils/toast'

const cart = ref([])
const processing = ref(false)
const showSuccessModal = ref(false)
const showPaymentModal = ref(false)
const selectedPayment = ref('wechat')
const orderRemark = ref('')
const lastOrderNo = ref('')
const lastOrderAmount = ref(0)
const lastOrderQuantity = ref(0)
const recommendItems = ref([])
const aiPairLoading = ref(false)
const aiPairItems = ref([])
const aiPairReason = ref('')

const fetchAiPairRecommendations = async () => {
  if (cart.value.length === 0) { aiPairItems.value = []; return }
  aiPairLoading.value = true
  try {
    const items = cart.value.map(c => ({ id: c.id, name: c.name, category_id: c.category_id || null }))
    const res = await axios.post('/api/ai/cart-recommend', { items })
    aiPairItems.value = res.data.recommendations || []
    aiPairReason.value = res.data.reason || ''
  } catch (e) {
    aiPairItems.value = []
  }
  aiPairLoading.value = false
}

const addAiPairItem = (item) => {
  const existing = cart.value.find(c => c.id === item.id)
  if (existing) { existing.quantity++ }
  else {
    cart.value.push({ id: item.id, name: item.name, price: item.price, quantity: 1, image_url: item.image_url, shop_name: item.shop_name })
  }
  saveCart()
  toast.success('已加入购物车')
  fetchAiPairRecommendations()
}

const fetchRecommendations = async () => {
  try {
    const res = await axios.get('/api/products')
    const cartIds = cart.value.map(c => c.id)
    recommendItems.value = res.data
      .filter(p => !cartIds.includes(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
  } catch (e) {}
}

const addRecommendItem = (item) => {
  const existing = cart.value.find(c => c.id === item.id)
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      id: item.id, name: item.name, price: item.price,
      quantity: 1, image_url: item.image_url
    })
  }
  saveCart()
  toast.success('已加入购物车')
}

watch(cart, () => { fetchRecommendations() }, { deep: true })
watch(cart, () => { fetchAiPairRecommendations() }, { deep: true })

const totalQuantity = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const deliveryFee = computed(() => {
    // 获取购物车中第一个商品的商家配送费
    const shopDeliveryFee = cart.value[0]?.shop_delivery_fee
    if (shopDeliveryFee !== undefined) {
        return Number(shopDeliveryFee)
    }
    // 兼容旧数据：如果购物车中没有商家配送费信息，使用默认规则
    return totalPrice.value >= 50 ? 0 : 5
})

const totalAmount = computed(() => {
    return totalPrice.value + deliveryFee.value
})

const loadCart = () => {
    cart.value = JSON.parse(localStorage.getItem('cart') || '[]')
}

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart.value))
}

const increaseQty = (item) => {
    item.quantity++
    saveCart()
}

const decreaseQty = (item) => {
    if (item.quantity > 1) {
        item.quantity--
        saveCart()
    } else {
        removeItem(item.id)
    }
}

const removeItem = (id) => {
    cart.value = cart.value.filter(item => item.id !== id)
    saveCart()
}

const clearCart = () => {
    if (confirm('确定要清空购物车吗？')) {
        cart.value = []
        saveCart()
        toast.info('购物车已清空')
    }
}

const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) {
        alert('请先登录')
        window.location.href = '/login'
        return
    }

    // Get shop_id from first item (all items should be from same shop)
    const shopId = cart.value[0]?.shop_id
    if (!shopId) {
        alert('购物车数据异常')
        return
    }

    processing.value = true

    try {
        showPaymentModal.value = true
    } catch (error) {
        console.error('创建订单失败:', error)
        alert('订单提交失败，请重试')
    } finally {
        processing.value = false
    }
}

const confirmPayment = async () => {
    processing.value = true
    showPaymentModal.value = false
    
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        const shopId = cart.value[0]?.shop_id
        
        const orderData = {
            customer_id: user.id,
            shop_id: shopId,
            total_amount: totalAmount.value,
            delivery_fee: deliveryFee.value,
            remark: orderRemark.value,
            items: cart.value.map(item => ({
                product_id: item.id,
                price: item.price,
                quantity: item.quantity
            }))
        }

        const response = await axios.post('/api/orders', orderData)

        if (response.data.success) {
            lastOrderNo.value = response.data.order_no
            lastOrderAmount.value = totalAmount.value
            lastOrderQuantity.value = totalQuantity.value
            cart.value = []
            saveCart()
            showSuccessModal.value = true
            toast.success('支付成功！')
        }
    } catch (error) {
        console.error('支付失败:', error)
        alert('支付失败，请重试')
    } finally {
        processing.value = false
    }
}

const closeModal = () => {
    showSuccessModal.value = false
}

const goOrders = () => {
    showSuccessModal.value = false
    window.location.href = '/orders'
}

const goShopping = () => {
    showSuccessModal.value = false
    window.location.href = '/shops'
}

const goBack = () => {
    window.history.back()
}

onMounted(() => {
    loadCart()
})
</script>

<style scoped>
.cart-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 0 0 160px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 16px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 20px 56px;
    margin: 0 -16px 24px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    border-radius: 0 0 20px 20px;
    position: relative;
}

.back-btn {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-50%) scale(1.1);
}

.back-btn span {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
}

.page-header h1 {
    margin: 0 auto;
    font-size: 22px;
    color: #fff;
    font-weight: 700;
    letter-spacing: 1px;
}

.clear-btn {
    padding: 6px 14px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
    white-space: nowrap;
}

.clear-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.7);
}

.cart-content {
    display: block;
}

.cart-items {
    background: transparent;
    border-radius: 0;
    padding: 0;
    box-shadow: none;
}

.cart-item {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-bottom: 12px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    position: relative;
    transition: all 0.3s ease;
    animation: cardSlideIn 0.4s ease both;
}

.cart-item:nth-child(1) { animation-delay: 0.05s; }
.cart-item:nth-child(2) { animation-delay: 0.1s; }
.cart-item:nth-child(3) { animation-delay: 0.15s; }
.cart-item:nth-child(4) { animation-delay: 0.2s; }
.cart-item:nth-child(5) { animation-delay: 0.25s; }

@keyframes cardSlideIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cart-item:last-child {
    margin-bottom: 0;
}

.item-image {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    margin-right: 14px;
    flex-shrink: 0;
    background: #f0f0f0;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-info {
    flex: 1;
    min-width: 0;
}

.item-info h3 {
    font-size: 15px;
    margin: 0 0 4px;
    color: #1a1a1a;
    font-weight: 700;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-shop {
    font-size: 12px;
    color: #999;
    margin-bottom: 6px;
}

.item-price {
    font-size: 15px;
    font-weight: 700;
    color: #FF6B35;
}

.item-quantity {
    display: flex;
    align-items: center;
    margin: 0 14px;
    flex-shrink: 0;
}

.qty-btn {
    width: 28px;
    height: 28px;
    border: 1.5px solid #e0e0e0;
    border-radius: 50%;
    background: #fff;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
}

.qty-btn:hover {
    border-color: #FF6B35;
    color: #FF6B35;
    background: #fff5f0;
}

.qty {
    min-width: 36px;
    text-align: center;
    font-size: 15px;
    font-weight: 700;
    color: #1a1a1a;
    animation: qtyBounce 0.25s ease;
}

@keyframes qtyBounce {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

.item-total {
    min-width: 70px;
    text-align: right;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    flex-shrink: 0;
}

.remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 22px;
    height: 22px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    color: #ccc;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 0;
    line-height: 1;
}

.remove-btn:hover {
    color: #ff4757;
    background: #fff0f0;
    transform: scale(1.15);
}

.summary-header,
.cart-summary .summary-header {
    display: none;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
}

.summary-row.delivery {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #999;
    padding: 2px 0;
}

.summary-row.total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #666;
    padding: 2px 0;
}

.summary-qty {
    font-size: 13px;
    color: #999;
    margin-bottom: 2px;
}

.summary-total {
    font-size: 20px;
    font-weight: 800;
    color: #FF6B35;
}

.summary-total span {
    font-size: 13px;
    font-weight: 500;
    color: #999;
    margin-right: 2px;
}

.checkout-btn {
    padding: 12px 36px;
    border: none;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: #fff;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.35);
    white-space: nowrap;
}

.checkout-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 107, 53, 0.5);
}

.checkout-btn:active:not(:disabled) {
    transform: translateY(0);
}

.checkout-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.promo-bar {
    position: fixed;
    bottom: 76px;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    pointer-events: none;
}

.promo-tip {
    padding: 10px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    pointer-events: auto;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    animation: promoSlideIn 0.3s ease both;
}

.promo-orange {
    background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
    color: #E65100;
}

.promo-green {
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    color: #2E7D32;
}

.promo-purple {
    background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
    color: #7B1FA2;
}

@keyframes promoSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.cart-summary {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 20px 20px 0 0;
    padding: 14px 20px;
    padding-bottom: max(14px, env(safe-area-inset-bottom));
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 101;
}

.summary-info {
    display: flex;
    flex-direction: column;
}

.empty-cart {
    text-align: center;
    padding: 100px 30px 80px;
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    margin-top: 10px;
}

.empty-icon {
    font-size: 90px;
    margin-bottom: 24px;
    display: block;
    animation: emptyFloat 3s ease-in-out infinite;
}

@keyframes emptyFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.empty-cart h2 {
    font-size: 20px;
    color: #1a1a1a;
    margin-bottom: 8px;
    font-weight: 700;
}

.empty-cart p {
    color: #aaa;
    margin-bottom: 32px;
    font-size: 14px;
}

.go-shopping-btn {
    padding: 14px 48px;
    border: none;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: #fff;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(255, 107, 53, 0.35);
}

.go-shopping-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(255, 107, 53, 0.5);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
}

.modal-content {
    background: #fff;
    border-radius: 24px;
    padding: 40px 32px;
    max-width: 380px;
    width: 88%;
    text-align: center;
    animation: modalPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

@keyframes modalPop {
    from {
        opacity: 0;
        transform: scale(0.85) translateY(20px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.success-icon {
    font-size: 72px;
    margin-bottom: 16px;
    display: block;
    animation: successBounce 0.6s ease 0.2s both;
}

@keyframes successBounce {
    0% { transform: scale(0); }
    60% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

.modal-content h2 {
    font-size: 22px;
    color: #1a1a1a;
    margin-bottom: 20px;
    font-weight: 700;
}

.order-number {
    font-size: 14px;
    color: #FF6B35;
    font-weight: 600;
    margin-bottom: 8px;
    padding: 6px 16px;
    background: #fff5f0;
    border-radius: 20px;
    display: inline-block;
}

.order-info {
    font-size: 14px;
    color: #666;
    margin-bottom: 6px;
}

.modal-buttons {
    display: flex;
    gap: 12px;
    margin-top: 28px;
}

.btn-secondary {
    flex: 1;
    padding: 12px;
    border: 1.5px solid #e0e0e0;
    border-radius: 25px;
    background: #fff;
    color: #666;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    border-color: #ccc;
    background: #f9f9f9;
}

.btn-primary {
    flex: 1;
    padding: 12px;
    border: none;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: #fff;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.45);
}

.payment-modal {
    max-width: 400px;
    width: 90%;
    padding: 0;
    overflow: hidden;
    border-radius: 20px;
}

.payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.payment-header h2 {
    margin: 0;
    font-size: 17px;
    color: #1a1a1a;
    font-weight: 700;
}

.close-btn {
    cursor: pointer;
    font-size: 18px;
    color: #bbb;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #f5f5f5;
    color: #333;
}

.payment-amount {
    text-align: center;
    padding: 28px 20px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: #fff;
}

.amount-label {
    display: block;
    font-size: 13px;
    opacity: 0.9;
    margin-bottom: 6px;
}

.amount-value {
    font-size: 34px;
    font-weight: 800;
}

.payment-methods {
    padding: 14px 20px;
}

.payment-method {
    display: flex;
    align-items: center;
    padding: 13px 14px;
    border: 2px solid #f0f0f0;
    border-radius: 12px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.payment-method:last-child {
    margin-bottom: 0;
}

.payment-method:hover {
    border-color: #FF6B35;
}

.payment-method.active {
    border-color: #FF6B35;
    background: #fff8f5;
}

.method-icon {
    font-size: 22px;
    margin-right: 12px;
}

.method-name {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    color: #1a1a1a;
}

.method-check {
    width: 20px;
    height: 20px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
}

.pay-btn {
    width: calc(100% - 40px);
    margin: 10px 20px 14px;
    padding: 13px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 14px rgba(255, 107, 53, 0.3);
}

.pay-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.45);
}

.pay-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.payment-tip {
    text-align: center;
    font-size: 11px;
    color: #bbb;
    padding: 0 20px 14px;
    margin: 0;
}

.ai-pair-section {
    margin: 12px 16px;
    background: white;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(102, 126, 234, 0.15);
}
.ai-pair-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.ai-pair-icon { font-size: 20px; }
.ai-pair-title { font-size: 14px; font-weight: 700; color: #333; }
.ai-pair-tag {
    font-size: 10px; padding: 2px 8px; border-radius: 10px;
    background: linear-gradient(135deg, #667eea, #764ba2); color: white;
}
.ai-pair-loading {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 20px; color: #667eea; font-size: 13px;
}
.ai-pair-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(102,126,234,0.2);
    border-top-color: #667eea; border-radius: 50%;
    animation: aiSpin2 0.8s linear infinite;
}
@keyframes aiSpin2 { to { transform: rotate(360deg); } }
.ai-pair-reason { font-size: 12px; color: #888; margin-bottom: 10px; font-style: italic; }
.ai-pair-list { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; }
.ai-pair-item {
    flex-shrink: 0; width: 110px; text-align: center;
    background: #f8f9fa; border-radius: 10px; padding: 8px;
}
.pair-img { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; }
.pair-name { display: block; font-size: 11px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pair-price { color: #FF4757; font-size: 13px; font-weight: 600; }
.pair-add {
    margin-top: 4px; width: 26px; height: 26px; border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; border: none; font-size: 16px; cursor: pointer;
}

.recommend-section {
    margin: 12px 16px;
    background: white;
    border-radius: 12px;
    padding: 16px;
}

.recommend-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-weight: 600;
}

.recommend-hint { color: #FF6B35; font-size: 13px; }

.recommend-list { display: flex; gap: 12px; overflow-x: auto; }

.recommend-item {
    flex-shrink: 0;
    width: 120px;
    text-align: center;
}

.recommend-item img { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }

.recommend-name { display: block; font-size: 12px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.recommend-price { color: #FF4757; font-size: 14px; font-weight: 600; }

.recommend-add {
    margin-top: 4px;
    width: 28px; height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white; border: none; font-size: 18px;
    cursor: pointer;
}

.remark-row {
    padding: 12px 0;
    border-top: 1px solid #f0f0f0;
}

.remark-row label { font-size: 14px; color: #333; display: block; margin-bottom: 8px; }

.remark-row input {
    width: 100%; padding: 10px 12px;
    border: 1px solid #e0e0e0; border-radius: 8px;
    font-size: 14px; outline: none;
}

.remark-row input:focus { border-color: #FF6B81; }

@media (max-width: 768px) {
    .container {
        padding: 0 12px;
    }

    .page-header {
        margin: 0 -12px 16px;
        padding: 16px 16px 16px 48px;
        border-radius: 0 0 16px 16px;
    }

    .page-header h1 {
        font-size: 18px;
    }

    .cart-item {
        padding: 12px;
        margin-bottom: 10px;
        border-radius: 12px;
        flex-wrap: wrap;
        gap: 10px;
    }

    .item-image {
        width: 70px;
        height: 70px;
        margin-right: 10px;
    }

    .item-quantity {
        margin: 0 0 0 auto;
    }

    .item-total {
        min-width: auto;
        text-align: right;
        font-size: 15px;
    }

    .cart-summary {
        padding: 12px 16px;
        padding-bottom: max(12px, env(safe-area-inset-bottom));
    }

    .promo-bar {
        padding: 0 12px;
        bottom: 64px;
    }

    .promo-tip {
        padding: 8px 12px;
        font-size: 12px;
        border-radius: 10px;
    }

    .summary-total {
        font-size: 18px;
    }

    .checkout-btn {
        padding: 11px 28px;
        font-size: 15px;
    }

    .empty-cart {
        padding: 80px 24px 60px;
        border-radius: 16px;
    }

    .empty-icon {
        font-size: 72px;
    }

    .modal-content {
        padding: 32px 24px;
        width: 90%;
    }

    .success-icon {
        font-size: 60px;
    }
}
</style>
