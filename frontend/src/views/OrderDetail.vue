<template>
    <div class="detail-page">
        <div class="status-header" :class="order.status">
            <div class="header-top">
                <div class="back-btn" @click="goBack">←</div>
                <h2>订单详情</h2>
            </div>
            <div class="status-info">
                <div class="status-icon">{{ getStatusIcon(order.status) }}</div>
                <div class="status-text">
                    <h3>{{ getStatusText(order.status) }}</h3>
                    <p>{{ getStatusDesc(order.status) }}</p>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-step" :class="{ active: isStepActive('pending') }">
                    <div class="step-dot"></div>
                    <span>下单</span>
                </div>
                <div class="progress-line" :class="{ active: isStepActive('paid') }"></div>
                <div class="progress-step" :class="{ active: isStepActive('paid') }">
                    <div class="step-dot"></div>
                    <span>付款</span>
                </div>
                <div class="progress-line" :class="{ active: isStepActive('shipping') }"></div>
                <div class="progress-step" :class="{ active: isStepActive('shipping') }">
                    <div class="step-dot"></div>
                    <span>配送</span>
                </div>
                <div class="progress-line" :class="{ active: isStepActive('completed') }"></div>
                <div class="progress-step" :class="{ active: isStepActive('completed') }">
                    <div class="step-dot"></div>
                    <span>完成</span>
                </div>
            </div>
        </div>

        <div class="section-card">
            <div class="section-title">📦 商品信息</div>
            <div v-for="item in order.items" :key="item.id" class="detail-item">
                <img :src="item.image_url || 'https://via.placeholder.com/80'" class="item-img" />
                <div class="item-info">
                    <span class="item-name">{{ item.product_name || item.name }}</span>
                    <span class="item-price">¥{{ Number(item.price).toFixed(2) }}</span>
                </div>
                <span class="item-qty">x{{ item.quantity }}</span>
            </div>
            <div class="price-summary">
                <div class="price-row">
                    <span>商品小计</span>
                    <span>¥{{ itemsTotal.toFixed(2) }}</span>
                </div>
                <div class="price-row">
                    <span>配送费</span>
                    <span>¥{{ Number(order.delivery_fee || 0).toFixed(2) }}</span>
                </div>
                <div class="price-row total">
                    <span>实付金额</span>
                    <span class="total-price">¥{{ Number(order.total_amount).toFixed(2) }}</span>
                </div>
            </div>
        </div>

        <div class="section-card">
            <div class="section-title">📋 订单信息</div>
            <div class="info-row">
                <span class="info-label">订单编号</span>
                <span class="info-value">{{ order.order_no }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">下单时间</span>
                <span class="info-value">{{ formatTime(order.created_at) }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">支付方式</span>
                <span class="info-value">在线支付</span>
            </div>
            <div class="info-row" v-if="order.remark">
                <span class="info-label">备注</span>
                <span class="info-value">{{ order.remark }}</span>
            </div>
            <div class="info-row" v-if="order.return_reason">
                <span class="info-label">退货原因</span>
                <span class="info-value text-danger">{{ order.return_reason }}</span>
            </div>
        </div>

        <div class="action-bar" v-if="showActions">
            <button v-if="order.status === 'pending'" class="btn-action btn-outline" @click="handleCancel">取消订单</button>
            <button v-if="order.status === 'pending'" class="btn-action btn-primary" @click="handlePay">去支付</button>
            <button v-if="order.status === 'completed'" class="btn-action btn-outline" @click="reorder">再来一单</button>
            <button v-if="order.status === 'completed'" class="btn-action btn-primary" @click="openRating">⭐ 去评价</button>
            <button v-if="order.status === 'completed' || order.status === 'paid'" class="btn-action btn-outline text-danger" @click="handleRefund">申请退货</button>
        </div>

        <div v-if="showRatingModal" class="modal-overlay" @click="showRatingModal = false">
            <div class="modal-card" @click.stop>
                <div class="modal-header">
                    <h3>⭐ 评价订单</h3>
                    <span class="modal-close" @click="showRatingModal = false">✕</span>
                </div>
                <div class="modal-body">
                    <div class="rating-stars">
                        <span v-for="s in 5" :key="s" class="star" :class="{ active: ratingForm.rating >= s }" @click="ratingForm.rating = s">
                            {{ ratingForm.rating >= s ? '★' : '☆' }}
                        </span>
                        <span class="rating-text">{{ ['很差', '较差', '一般', '满意', '非常满意'][ratingForm.rating - 1] || '请评分' }}</span>
                    </div>
                    <textarea v-model="ratingForm.content" placeholder="分享你的用餐体验..." rows="4"></textarea>
                    <div class="image-upload">
                        <div v-for="(img, idx) in ratingForm.images" :key="idx" class="upload-preview">
                            <img :src="img" />
                            <span class="remove-img" @click="ratingForm.images.splice(idx, 1)">✕</span>
                        </div>
                        <div v-if="ratingForm.images.length < 9" class="upload-btn" @click="addImage">📷</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-action btn-outline" @click="showRatingModal = false">取消</button>
                    <button class="btn-action btn-primary" @click="submitRating" :disabled="ratingForm.rating === 0">提交</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const order = ref({
    status: '',
    items: [],
    total_amount: 0,
    delivery_fee: 0,
    order_no: '',
    created_at: '',
    remark: '',
    return_reason: ''
})
const loading = ref(true)
const showRatingModal = ref(false)
const ratingForm = ref({ rating: 0, content: '', images: [] })

const itemsTotal = computed(() => {
    if (!order.value.items) return 0
    return order.value.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
})

const showActions = computed(() => {
    return ['pending', 'completed', 'paid'].includes(order.value.status)
})

const statusStepMap = {
    pending: ['pending'],
    paid: ['pending', 'paid'],
    shipping: ['pending', 'paid', 'shipping'],
    preparing: ['pending', 'paid', 'shipping'],
    delivering: ['pending', 'paid', 'shipping'],
    completed: ['pending', 'paid', 'shipping', 'completed'],
    returned: ['pending', 'paid', 'shipping', 'completed'],
    cancelled: ['pending']
}

const isStepActive = (step) => {
    const steps = statusStepMap[order.value.status] || []
    return steps.includes(step)
}

const getStatusIcon = (status) => {
    const iconMap = {
        pending: '⏳',
        paid: '💰',
        shipping: '🚚',
        preparing: '👨‍🍳',
        delivering: '🛵',
        completed: '✅',
        returned: '🔄',
        cancelled: '❌'
    }
    return iconMap[status] || '📦'
}

const getStatusText = (status) => {
    const textMap = {
        pending: '待付款',
        paid: '已付款',
        shipping: '配送中',
        preparing: '准备中',
        delivering: '配送中',
        completed: '已完成',
        returned: '已退货',
        cancelled: '已取消'
    }
    return textMap[status] || '未知状态'
}

const getStatusDesc = (status) => {
    const descMap = {
        pending: '订单已提交，等待付款',
        paid: '支付成功，商家正在接单',
        shipping: '骑手正在配送中，请耐心等待',
        preparing: '商家正在准备您的餐品',
        delivering: '骑手正在配送中，请耐心等待',
        completed: '订单已完成，感谢您的光临',
        returned: '订单已退货，款项将原路退回',
        cancelled: '订单已取消'
    }
    return descMap[status] || ''
}

const formatTime = (time) => {
    if (!time) return ''
    const date = new Date(time)
    return date.toLocaleString('zh-CN')
}

const goBack = () => {
    window.history.back()
}

const handlePay = async () => {
    if (!confirm('确认支付 ¥' + Number(order.value.total_amount).toFixed(2) + '？')) return
    try {
        await axios.put(`/api/orders/${order.value.id}/pay`)
        alert('支付成功！')
        loadOrder()
    } catch (error) {
        console.error('支付失败:', error)
        alert('支付失败，请重试')
    }
}

const handleCancel = async () => {
    if (!confirm('确定要取消该订单吗？')) return
    try {
        await axios.put(`/api/orders/${order.value.id}/cancel`)
        alert('订单已取消')
        loadOrder()
    } catch (error) {
        console.error('取消订单失败:', error)
        alert('取消失败，请重试')
    }
}

const handleRefund = async () => {
    const reason = prompt('请输入退货原因：')
    if (!reason) return
    try {
        await axios.put(`/api/orders/${order.value.id}/return`, { reason })
        alert('退货申请已提交')
        loadOrder()
    } catch (error) {
        console.error('退货申请失败:', error)
        alert('退货申请失败，请重试')
    }
}

const reorder = () => {
    const items = order.value.items || []
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    items.forEach(item => {
        const existing = cart.find(c => c.id === item.product_id || c.id === item.id)
        if (existing) {
            existing.quantity += item.quantity
        } else {
            cart.push({
                id: item.product_id || item.id,
                name: item.product_name || item.name,
                price: Number(item.price),
                image_url: item.image_url,
                quantity: item.quantity
            })
        }
    })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('已加入购物车')
    window.location.href = '/cart'
}

const openRating = () => {
    ratingForm.value = { rating: 0, content: '', images: [] }
    showRatingModal.value = true
}

const addImage = () => {
    const url = prompt('请输入图片URL：')
    if (url && url.trim()) {
        ratingForm.value.images.push(url.trim())
    }
}

const submitRating = async () => {
    if (ratingForm.value.rating === 0) return
    try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const firstItem = (order.value.items || [])[0];
        await axios.post('/api/reviews', {
            customer_id: storedUser.id,
            product_id: firstItem?.product_id,
            order_id: order.value.id,
            rating: ratingForm.value.rating,
            content: ratingForm.value.content,
            images: ratingForm.value.images
        })
        alert('评价提交成功！')
        showRatingModal.value = false
    } catch (error) {
        console.error('评价提交失败:', error)
        alert('评价提交失败，请重试')
    }
}

const loadOrder = async () => {
    loading.value = true
    try {
        const orderId = route.params.id
        if (orderId) {
            const response = await axios.get(`/api/orders/${orderId}`)
            order.value = response.data
        } else {
            const stored = localStorage.getItem('currentOrder')
            if (stored) {
                order.value = JSON.parse(stored)
            }
        }
    } catch (error) {
        console.error('加载订单详情失败:', error)
        const stored = localStorage.getItem('currentOrder')
        if (stored) {
            order.value = JSON.parse(stored)
        }
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadOrder()
})
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.detail-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 100px;
}

.status-header {
    padding: 20px 20px 28px;
    border-radius: 0 0 24px 24px;
    position: relative;
    overflow: hidden;
}

.status-header.pending {
    background: linear-gradient(135deg, #ff9500 0%, #ff6a00 100%);
}

.status-header.paid {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.status-header.shipping,
.status-header.preparing,
.status-header.delivering {
    background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
}

.status-header.completed {
    background: linear-gradient(135deg, #34c759 0%, #30b350 100%);
}

.status-header.returned {
    background: linear-gradient(135deg, #ff3b30 0%, #d32f2f 100%);
}

.status-header.cancelled {
    background: linear-gradient(135deg, #8e8e93 0%, #636366 100%);
}

.header-top {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.back-btn {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #ffffff;
    font-size: 18px;
    font-weight: bold;
    flex-shrink: 0;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: scale(1.1);
}

.header-top h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.5px;
}

.status-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
}

.status-icon {
    font-size: 44px;
    line-height: 1;
}

.status-text h3 {
    margin: 0 0 4px;
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
}

.status-text p {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
}

.progress-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
}

.progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    z-index: 1;
}

.step-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
    border: 2px solid rgba(255, 255, 255, 0.5);
    transition: all 0.4s ease;
}

.progress-step.active .step-dot {
    background: #ffffff;
    border-color: #ffffff;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
}

.progress-step span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
    transition: color 0.3s ease;
}

.progress-step.active span {
    color: #ffffff;
    font-weight: 600;
}

.progress-line {
    flex: 1;
    height: 3px;
    background: rgba(255, 255, 255, 0.25);
    margin: 0 4px;
    margin-bottom: 20px;
    border-radius: 2px;
    transition: background 0.4s ease;
    position: relative;
}

.progress-line.active {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.section-card {
    background: #ffffff;
    margin: 16px;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    animation: fadeInUp 0.4s ease forwards;
}

.section-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    padding-left: 12px;
    border-left: 3px solid #667eea;
    margin-bottom: 16px;
    line-height: 1.4;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f8;
}

.detail-item:last-of-type {
    border-bottom: none;
}

.item-img {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    object-fit: cover;
    background: #f5f7fa;
    flex-shrink: 0;
}

.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

.item-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-price {
    font-size: 14px;
    color: #ff6b6b;
    font-weight: 600;
}

.item-qty {
    font-size: 13px;
    color: #aaa;
    font-weight: 500;
    flex-shrink: 0;
}

.price-summary {
    margin-top: 12px;
    padding-top: 16px;
    border-top: 1px dashed #e8ecf1;
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 14px;
    color: #666;
}

.price-row.total {
    padding-top: 12px;
    margin-top: 4px;
    border-top: 1px solid #f0f0f0;
    font-weight: 600;
    color: #333;
}

.total-price {
    font-size: 20px;
    font-weight: 700;
    color: #ff3b30;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #f8f8f8;
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 14px;
    color: #999;
    flex-shrink: 0;
}

.info-value {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    text-align: right;
    word-break: break-all;
}

.text-danger {
    color: #ff3b30 !important;
}

.action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    padding: 12px 20px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
    z-index: 100;
    animation: fadeInUp 0.3s ease;
}

.btn-action {
    padding: 10px 24px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
}

.btn-action.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.btn-action.btn-primary:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    transform: translateY(-1px);
}

.btn-action.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.btn-action.btn-outline {
    background: #ffffff;
    color: #666;
    border: 1px solid #e0e4ea;
}

.btn-action.btn-outline:hover {
    background: #f5f7fa;
    border-color: #ccc;
}

.btn-action.btn-outline.text-danger {
    color: #ff3b30;
    border-color: #ffccc7;
}

.btn-action.btn-outline.text-danger:hover {
    background: #fff1f0;
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
    backdrop-filter: blur(4px);
}

.modal-card {
    background: #ffffff;
    border-radius: 20px;
    max-width: 420px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: fadeInUp 0.3s ease;
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
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    color: #999;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f5f5f5;
    color: #333;
}

.modal-body {
    padding: 20px 24px;
}

.rating-stars {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.star {
    font-size: 32px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #ddd;
}

.star.active {
    color: #ffc107;
    transform: scale(1.1);
}

.star:hover {
    transform: scale(1.15);
}

.rating-text {
    font-size: 14px;
    color: #999;
    margin-left: 8px;
}

.modal-body textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e4ea;
    border-radius: 12px;
    font-size: 14px;
    resize: none;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    font-family: inherit;
}

.modal-body textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
}

.image-upload {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 12px;
}

.upload-preview {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.upload-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-img {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 20px;
    height: 20px;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
}

.upload-btn {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    border: 2px dashed #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #ccc;
}

.upload-btn:hover {
    border-color: #667eea;
    color: #667eea;
    background: rgba(102, 126, 234, 0.05);
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 0 24px 20px;
}

.modal-footer .btn-action {
    flex: 1;
    padding: 12px;
}

@media (max-width: 768px) {
    .status-header {
        padding: 16px 16px 24px;
    }

    .header-top h2 {
        font-size: 20px;
    }

    .status-icon {
        font-size: 36px;
    }

    .status-text h3 {
        font-size: 18px;
    }

    .section-card {
        margin: 12px;
        padding: 16px;
    }

    .item-img {
        width: 56px;
        height: 56px;
    }

    .progress-step span {
        font-size: 11px;
    }

    .action-bar {
        padding: 10px 16px;
        padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    }

    .btn-action {
        padding: 9px 18px;
        font-size: 13px;
    }

    .total-price {
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .progress-bar {
        padding: 0 4px;
    }

    .progress-step span {
        font-size: 10px;
    }

    .step-dot {
        width: 12px;
        height: 12px;
    }

    .status-info {
        gap: 12px;
    }

    .modal-card {
        width: 95%;
    }
}
</style>
