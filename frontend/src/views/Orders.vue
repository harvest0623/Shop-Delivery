<template>
    <div class="orders-page">
        <div class="page-header">
            <h1>📋 我的订单</h1>
        </div>

        <div class="orders-tabs">
            <div 
                v-for="tab in statusTabs" 
                :key="tab.value"
                class="tab-item"
                :class="{ active: activeTab === tab.value }"
                @click="activeTab = tab.value"
            >
                {{ tab.label }}
            </div>
        </div>

        <div v-if="loading" class="loading">加载中...</div>
        
        <div v-else-if="filteredOrders.length === 0" class="empty">
            <div class="empty-icon">📦</div>
            <h2>暂无订单</h2>
            <p>快去选购心仪的商品吧</p>
            <button class="go-shopping-btn" @click="goShopping">去购物</button>
        </div>

        <div v-else class="orders-list">
            <div 
                v-for="order in filteredOrders" 
                :key="order.id"
                class="order-card"
            >
                <div class="order-header">
                    <div class="order-info">
                        <span class="order-id">订单号：{{ order.order_number }}</span>
                        <span class="order-time">{{ formatTime(order.created_at) }}</span>
                    </div>
                    <span class="order-status" :class="order.status">
                        {{ getStatusText(order.status) }}
                    </span>
                </div>

                <div class="order-items">
                    <div 
                        v-for="item in order.items" 
                        :key="item.id"
                        class="order-item"
                    >
                        <div class="item-image">
                            <img :src="item.image_url || 'https://via.placeholder.com/60'" :alt="item.product_name" />
                        </div>
                        <div class="item-info">
                            <h4>{{ item.product_name }}</h4>
                            <p class="item-shop">{{ item.shop_name || '官方店铺' }}</p>
                            <div class="item-bottom">
                                <span class="item-price">¥{{ Number(item.price).toFixed(2) }}</span>
                                <span class="item-qty">x{{ item.quantity }}</span>
                            </div>
                        </div>
                        <div class="item-subtotal">
                            ¥{{ Number(item.subtotal).toFixed(2) }}
                        </div>
                    </div>
                </div>

                <div class="order-footer">
                    <div class="order-total">
                        共{{ getTotalQty(order.items) }}件商品
                        合计：<span class="total-price">¥{{ Number(order.total_amount).toFixed(2) }}</span>
                    </div>
                    <div class="order-actions">
                        <button 
                            v-if="order.status === 'completed'" 
                            class="btn-refund"
                            @click="handleRefund(order)"
                        >
                            申请退货
                        </button>
                        <button 
                            v-if="order.status === 'pending'"
                            class="btn-cancel"
                            @click="handleCancel(order)"
                        >
                            取消订单
                        </button>
                        <button 
                            v-if="order.status === 'returned'"
                            class="btn-detail"
                            @click="viewReturnDetail(order)"
                        >
                            查看详情
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 退货确认弹窗 -->
        <div v-if="showRefundModal" class="modal-overlay" @click="closeRefundModal">
            <div class="modal-content" @click.stop>
                <h2>申请退货</h2>
                <p class="refund-order-id">订单号：{{ currentOrder?.order_number }}</p>
                <div class="form-group">
                    <label>退货原因：</label>
                    <textarea 
                        v-model="refundReason" 
                        placeholder="请输入退货原因..."
                        rows="3"
                    ></textarea>
                </div>
                <div class="modal-buttons">
                    <button class="btn-secondary" @click="closeRefundModal">取消</button>
                    <button class="btn-primary" @click="confirmRefund" :disabled="!refundReason">
                        确认退货
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const loading = ref(true)
const activeTab = ref('all')
const showRefundModal = ref(false)
const currentOrder = ref(null)
const refundReason = ref('')

const statusTabs = [
    { label: '全部', value: 'all' },
    { label: '待处理', value: 'pending' },
    { label: '已完成', value: 'completed' },
    { label: '已退货', value: 'returned' },
    { label: '已取消', value: 'cancelled' }
]

const filteredOrders = computed(() => {
    if (activeTab.value === 'all') return orders.value
    return orders.value.filter(o => o.status === activeTab.value)
})

const formatTime = (time) => {
    if (!time) return ''
    const date = new Date(time)
    return date.toLocaleString('zh-CN')
}

const getStatusText = (status) => {
    const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已完成',
        'returned': '已退货',
        'cancelled': '已取消'
    }
    return statusMap[status] || status
}

const getTotalQty = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
}

const loadOrders = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        if (!user) {
            alert('请先登录')
            window.location.href = '/login'
            return
        }

        const response = await axios.get(`/api/orders/customer/${user.id}`)
        orders.value = response.data
        console.log('订单数据:', orders.value.length)
    } catch (error) {
        console.error('加载订单失败:', error)
    } finally {
        loading.value = false
    }
}

const handleRefund = (order) => {
    currentOrder.value = order
    showRefundModal.value = true
}

const confirmRefund = async () => {
    if (!refundReason.value.trim()) {
        alert('请输入退货原因')
        return
    }

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

const viewReturnDetail = (order) => {
    alert(`退货原因：${order.refund_reason || '无'}\n退货时间：${order.refund_time || '无'}`)
}

const goShopping = () => {
    window.location.href = '/shops'
}

onMounted(() => {
    loadOrders()
})
</script>

<style scoped>
.orders-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding-bottom: 80px;
}

.page-header {
    background: white;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.page-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}

.orders-tabs {
    display: flex;
    overflow-x: auto;
    padding: 15px;
    background: white;
    gap: 10px;
    border-bottom: 1px solid #eee;
}

.tab-item {
    padding: 8px 16px;
    background: #f5f5f5;
    border-radius: 20px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
}

.tab-item.active {
    background: #ff6b6b;
    color: white;
}

.loading, .empty {
    text-align: center;
    padding: 80px 20px;
}

.empty-icon {
    font-size: 60px;
    margin-bottom: 20px;
}

.empty h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 10px;
}

.empty p {
    color: #888;
    margin-bottom: 20px;
}

.go-shopping-btn {
    padding: 12px 30px;
    border: none;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-radius: 25px;
    font-size: 14px;
    cursor: pointer;
}

.orders-list {
    padding: 15px;
}

.order-card {
    background: white;
    border-radius: 16px;
    margin-bottom: 15px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.order-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.order-id {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.order-time {
    font-size: 12px;
    color: #999;
}

.order-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.order-status.pending {
    background: #fff3e0;
    color: #ff9800;
}

.order-status.completed {
    background: #e8f5e9;
    color: #4caf50;
}

.order-status.returned {
    background: #fce4ec;
    color: #e91e63;
}

.order-status.cancelled {
    background: #eceff1;
    color: #9e9e9e;
}

.order-items {
    padding: 15px;
}

.order-item {
    display: flex;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
}

.order-item:last-child {
    border-bottom: none;
}

.item-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-info {
    flex: 1;
}

.item-info h4 {
    margin: 0 0 5px;
    font-size: 14px;
    font-weight: 600;
}

.item-shop {
    margin: 0 0 5px;
    font-size: 12px;
    color: #667eea;
}

.item-bottom {
    display: flex;
    gap: 10px;
}

.item-price {
    font-size: 14px;
    color: #ff6b6b;
    font-weight: 600;
}

.item-qty {
    font-size: 12px;
    color: #999;
}

.item-subtotal {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #fafafa;
    border-top: 1px solid #f0f0f0;
}

.order-total {
    font-size: 14px;
    color: #666;
}

.total-price {
    font-size: 18px;
    font-weight: 700;
    color: #ff6b6b;
}

.order-actions {
    display: flex;
    gap: 10px;
}

.btn-refund, .btn-cancel, .btn-detail {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    cursor: pointer;
    border: none;
}

.btn-refund {
    background: #fce4ec;
    color: #e91e63;
}

.btn-cancel {
    background: #fff3e0;
    color: #ff9800;
}

.btn-detail {
    background: #e3f2fd;
    color: #2196f3;
}

/* 弹窗样式 */
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
    border-radius: 16px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
}

.modal-content h2 {
    font-size: 20px;
    margin-bottom: 10px;
    text-align: center;
}

.refund-order-id {
    text-align: center;
    color: #667eea;
    font-weight: 600;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
}

.form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    resize: none;
}

.modal-buttons {
    display: flex;
    gap: 15px;
}

.btn-secondary {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 25px;
    background: white;
    color: #666;
    cursor: pointer;
}

.btn-primary {
    flex: 1;
    padding: 12px;
    border: none;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-radius: 25px;
    cursor: pointer;
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>