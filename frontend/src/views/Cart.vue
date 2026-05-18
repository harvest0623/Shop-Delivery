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
                        <span>配送费</span>
                        <span>¥{{ deliveryFee.toFixed(2) }}</span>
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

            <div v-else class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h2>购物车是空的</h2>
                <p>快去挑选心仪的商品吧</p>
                <button class="go-shopping-btn" @click="goShopping">去购物</button>
            </div>
        </div>

        <!-- 结算成功弹窗 -->
        <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="success-icon">✅</div>
                <h2>订单提交成功！</h2>
                <p class="order-number">订单号：{{ lastOrderNo }}</p>
                <p class="order-info">商品数量：{{ totalQuantity }} 件</p>
                <p class="order-info">应付金额：¥{{ totalAmount.toFixed(2) }}</p>
                <div class="modal-buttons">
                    <button class="btn-secondary" @click="goOrders">查看订单</button>
                    <button class="btn-primary" @click="goShopping">继续购物</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const cart = ref([])
const processing = ref(false)
const showSuccessModal = ref(false)
const lastOrderNo = ref('')

const totalQuantity = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

const totalPrice = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const deliveryFee = computed(() => {
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
        const orderData = {
            customer_id: user.id,
            shop_id: shopId,
            total_amount: totalAmount.value,
            delivery_fee: deliveryFee.value,
            items: cart.value.map(item => ({
                product_id: item.id,
                price: item.price,
                quantity: item.quantity
            }))
        }

        const response = await axios.post('/api/orders', orderData)

        if (response.data.success) {
            lastOrderNo.value = response.data.order_no
            cart.value = []
            saveCart()
            showSuccessModal.value = true
        }
    } catch (error) {
        console.error('创建订单失败:', error)
        alert('订单提交失败，请重试')
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
    background: #f5f5f5;
    padding: 40px 0 100px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    position: relative;
}

.back-btn {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: #e0e0e0;
    transform: translateY(-50%) scale(1.1);
}

.back-btn span {
    color: #666;
    font-size: 18px;
    font-weight: bold;
}

.page-header h1 {
    margin: 0 auto;
}

.page-header h1 {
    font-size: 32px;
    color: #333;
}

.clear-btn {
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
}

.clear-btn:hover {
    background: #f5f5f5;
    color: #333;
}

.cart-content {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
}

.cart-items {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cart-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
}

.cart-item:last-child {
    border-bottom: none;
}

.item-image {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    margin-right: 20px;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-info {
    flex: 1;
}

.item-info h3 {
    font-size: 16px;
    margin-bottom: 5px;
    color: #333;
}

.item-shop {
    font-size: 12px;
    color: #667eea;
    margin-bottom: 8px;
}

.item-price {
    font-size: 18px;
    font-weight: 700;
    color: #e74c3c;
}

.item-quantity {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 0 20px;
}

.qty-btn {
    width: 32px;
    height: 32px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.qty-btn:hover {
    background: #f5f5f5;
}

.qty {
    min-width: 30px;
    text-align: center;
    font-size: 16px;
}

.item-total {
    min-width: 80px;
    text-align: right;
    font-size: 18px;
    font-weight: 700;
    color: #333;
}

.remove-btn {
    margin-left: 20px;
    padding: 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.2s ease;
}

.remove-btn:hover {
    transform: scale(1.2);
}

.cart-summary {
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 100px;
}

.summary-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.summary-header h2 {
    font-size: 20px;
    color: #333;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 15px;
}

.summary-row.delivery {
    color: #666;
}

.summary-row.total {
    font-size: 18px;
    font-weight: 700;
    color: #e74c3c;
    padding-top: 20px;
    margin-top: 10px;
    border-top: 1px solid #f0f0f0;
}

.checkout-btn {
    width: 100%;
    margin-top: 20px;
    padding: 15px;
    border: none;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.checkout-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.empty-cart {
    text-align: center;
    padding: 80px 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
}

.empty-cart h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
}

.empty-cart p {
    color: #888;
    margin-bottom: 30px;
}

.go-shopping-btn {
    padding: 15px 40px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.go-shopping-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Modal styles */
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
}

.modal-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.success-icon {
    font-size: 60px;
    margin-bottom: 20px;
}

.modal-content h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

.order-number {
    font-size: 16px;
    color: #667eea;
    font-weight: 600;
    margin-bottom: 10px;
}

.order-info {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
}

.modal-buttons {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.btn-secondary {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 25px;
    background: white;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    flex: 1;
    padding: 12px;
    border: none;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .cart-content {
        grid-template-columns: 1fr;
    }

    .cart-item {
        flex-wrap: wrap;
        gap: 15px;
    }

    .item-total {
        text-align: left;
    }
}
</style>
