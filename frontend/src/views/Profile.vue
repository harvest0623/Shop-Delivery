<template>
    <div class="profile-page">
        <!-- 顶部用户信息卡片 -->
        <div class="profile-header">
            <div class="header-bg"></div>
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <div class="user-card">
                <div class="avatar-wrapper">
                    <div class="avatar">
                        <span v-if="!user.avatar">{{ user.nickname ? user.nickname[0] : user.username ? user.username[0] : '👤' }}</span>
                        <img v-else :src="user.avatar" alt="avatar" />
                    </div>
                    <div class="avatar-edit" @click="showEditProfile = true">
                        <span>📷</span>
                    </div>
                </div>
                <div class="user-info">
                    <h2>{{ user.nickname || user.username }}</h2>
                    <p class="user-id">ID: {{ user.id || '--' }}</p>
                    <div class="user-tags">
                        <span class="tag vip" v-if="user.username === 'admin'">👑 管理员</span>
                        <span class="tag member">🥉 普通会员</span>
                    </div>
                </div>
                <div class="vip-progress">
                    <div class="vip-progress-info">
                        <span class="vip-label">🏅 {{ vipLevel.name }}</span>
                        <span class="vip-level">Lv.{{ vipLevel.level }}</span>
                    </div>
                    <div class="vip-progress-bar">
                        <div class="vip-progress-fill" :style="{ width: vipLevel.progress + '%', background: 'linear-gradient(90deg, ' + vipLevel.color + ' 0%, ' + vipLevel.color + ' 100%)' }"></div>
                    </div>
                    <div class="vip-progress-text">
                        <span>{{ vipLevel.next || '已满级' }}</span>
                    </div>
                </div>
                <div class="user-stats">
                    <div class="stat-item">
                        <span class="stat-num">{{ orderCount }}</span>
                        <span class="stat-label">订单</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-num">{{ cartCount }}</span>
                        <span class="stat-label">购物车</span>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <span class="stat-num">{{ addressCount }}</span>
                        <span class="stat-label">地址</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="stats-row">
            <div class="stat-item">
                <span class="stat-num">¥{{ totalSpent.toFixed(0) }}</span>
                <span class="stat-label">总消费</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-num">¥{{ monthSpent.toFixed(0) }}</span>
                <span class="stat-label">本月消费</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-num">{{ orderCount }}</span>
                <span class="stat-label">累计订单</span>
            </div>
        </div>

        <!-- 快捷功能入口 -->
        <div class="quick-actions">
            <div class="action-item" @click="goToOrders">
                <div class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <span>📋</span>
                </div>
                <span class="action-text">我的订单</span>
            </div>
            <div class="action-item" @click="goToCart">
                <div class="action-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <span>🛒</span>
                </div>
                <span class="action-text">购物车</span>
            </div>
            <div class="action-item" @click="goToFavorites">
                <div class="action-icon" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);">
                    <span>❤️</span>
                </div>
                <span class="action-text">我的收藏</span>
            </div>
            <div class="action-item" @click="goToPoints">
                <div class="action-icon" style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);">
                    <span>🎯</span>
                </div>
                <span class="action-text">积分中心</span>
            </div>
            <div class="action-item" @click="goToRecommendations">
                <div class="action-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <span>🤖</span>
                </div>
                <span class="action-text">AI推荐</span>
            </div>
            <div class="action-item" @click="goToNotifications">
                <div class="action-icon" style="background: linear-gradient(135deg, #4A90D9 0%, #357ABD 100%);">
                    <span>🔔</span>
                </div>
                <span class="action-text">消息通知</span>
            </div>
            <div class="action-item" @click="showAddressModal = true">
                <div class="action-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <span>📍</span>
                </div>
                <span class="action-text">收货地址</span>
            </div>
            <div class="action-item" @click="showEditProfile = true">
                <div class="action-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <span>✏️</span>
                </div>
                <span class="action-text">编辑资料</span>
            </div>
        </div>

        <!-- 订单状态追踪 -->
        <div class="section">
            <div class="section-header">
                <h3>📦 订单状态</h3>
                <span class="view-all" @click="goToOrders">查看全部 ›</span>
            </div>
            <div class="order-status">
                <div class="status-item" @click="goToOrdersWithFilter('pending')">
                    <div class="status-icon pending">⏳</div>
                    <span class="status-text">待处理</span>
                    <span class="status-badge" v-if="pendingCount > 0">{{ pendingCount }}</span>
                </div>
                <div class="status-item" @click="goToOrdersWithFilter('paid')">
                    <div class="status-icon paid">💳</div>
                    <span class="status-text">已付款</span>
                    <span class="status-badge" v-if="paidCount > 0">{{ paidCount }}</span>
                </div>
                <div class="status-item" @click="goToOrdersWithFilter('delivering')">
                    <div class="status-icon delivering">🚚</div>
                    <span class="status-text">配送中</span>
                    <span class="status-badge" v-if="deliveringCount > 0">{{ deliveringCount }}</span>
                </div>
                <div class="status-item" @click="goToOrdersWithFilter('completed')">
                    <div class="status-icon completed">✅</div>
                    <span class="status-text">已完成</span>
                    <span class="status-badge" v-if="completedCount > 0">{{ completedCount }}</span>
                </div>
                <div class="status-item" @click="goToOrdersWithFilter('returned')">
                    <div class="status-icon returned">↩️</div>
                    <span class="status-text">退货/售后</span>
                    <span class="status-badge" v-if="returnedCount > 0">{{ returnedCount }}</span>
                </div>
            </div>
        </div>

        <!-- 设置菜单 -->
        <div class="section">
            <div class="section-header">
                <h3>⚙️ 设置</h3>
            </div>
            <div class="menu-list">
                <div class="menu-group-title"><span class="group-bar"></span>个人管理</div>
                <div class="menu-item" @click="showEditProfile = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #e3f2fd;">👤</span>
                        <span class="menu-text">个人资料</span>
                    </div>
                    <span class="menu-arrow">›</span>
                </div>
                <div class="menu-item" @click="showAddressModal = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #fce4ec;">🏠</span>
                        <span class="menu-text">地址管理</span>
                    </div>
                    <span class="menu-arrow">›</span>
                </div>
                <div class="menu-item" @click="showPasswordModal = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #f3e5f5;">🔐</span>
                        <span class="menu-text">修改密码</span>
                    </div>
                    <span class="menu-arrow">›</span>
                </div>
                <div class="menu-group-title"><span class="group-bar"></span>通用设置</div>
                <div class="menu-item" @click="showNotificationSettings = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #fff3e0;">🔔</span>
                        <span class="menu-text">消息通知</span>
                    </div>
                    <div class="menu-right">
                        <span class="toggle-switch active"></span>
                    </div>
                </div>
                <div class="menu-item" @click="goToStatistics">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #e8f5e9;">📊</span>
                        <span class="menu-text">销售统计</span>
                    </div>
                    <span class="menu-arrow">›</span>
                </div>
                <div class="menu-item" @click="showAbout = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #e0f2f1;">ℹ️</span>
                        <span class="menu-text">关于我们</span>
                    </div>
                    <span class="menu-arrow">›</span>
                </div>
            </div>
        </div>

        <!-- 退出登录 -->
        <div class="logout-section">
            <button class="logout-btn" @click="logout">
                <span>🚪</span>
                <span>退出登录</span>
            </button>
        </div>

        <div class="app-version">外卖商城 v1.0.0</div>

        <!-- 编辑资料弹窗 -->
        <div v-if="showEditProfile" class="modal-overlay" @click="showEditProfile = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>编辑资料</h3>
                    <span class="close-btn" @click="showEditProfile = false">✕</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>昵称</label>
                        <input v-model="editForm.nickname" placeholder="请输入昵称" />
                    </div>
                    <div class="form-group">
                        <label>手机号</label>
                        <input v-model="editForm.phone" placeholder="请输入手机号" />
                    </div>
                    <div class="form-group">
                        <label>邮箱</label>
                        <input v-model="editForm.email" placeholder="请输入邮箱" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" @click="showEditProfile = false">取消</button>
                    <button class="btn-primary" @click="saveProfile">保存</button>
                </div>
            </div>
        </div>

        <!-- 地址管理弹窗 -->
        <div v-if="showAddressModal" class="modal-overlay" @click="showAddressModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>收货地址</h3>
                    <span class="close-btn" @click="showAddressModal = false">✕</span>
                </div>
                <div class="modal-body">
                    <div v-if="addresses.length === 0" class="empty-address">
                        <span>📍</span>
                        <p>暂无收货地址</p>
                    </div>
                    <div v-else class="address-list">
                        <div v-for="addr in addresses" :key="addr.id" class="address-card-item">
                            <div class="address-info">
                                <div class="address-header">
                                    <span class="name">{{ addr.name }}</span>
                                    <span class="phone">{{ addr.phone }}</span>
                                    <span class="default-tag" v-if="addr.is_default">默认</span>
                                </div>
                                <p class="address-detail">{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary full-width">+ 添加新地址</button>
                </div>
            </div>
        </div>

        <!-- 修改密码弹窗 -->
        <div v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>修改密码</h3>
                    <span class="close-btn" @click="showPasswordModal = false">✕</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>当前密码</label>
                        <input type="password" placeholder="请输入当前密码" />
                    </div>
                    <div class="form-group">
                        <label>新密码</label>
                        <input type="password" placeholder="请输入新密码" />
                    </div>
                    <div class="form-group">
                        <label>确认新密码</label>
                        <input type="password" placeholder="请再次输入新密码" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" @click="showPasswordModal = false">取消</button>
                    <button class="btn-primary" @click="showPasswordModal = false">确认修改</button>
                </div>
            </div>
        </div>

        <!-- 关于我们弹窗 -->
        <div v-if="showAbout" class="modal-overlay" @click="showAbout = false">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>关于我们</h3>
                    <span class="close-btn" @click="showAbout = false">✕</span>
                </div>
                <div class="modal-body about-body">
                    <div class="about-logo">
                        <span>🍔</span>
                        <h2>外卖商城</h2>
                        <p>版本 1.0.0</p>
                    </div>
                    <div class="about-info">
                        <p>外卖商城是一款专注于本地生活服务的在线订餐平台，汇聚全城优质商家，为您提供便捷、快速、美味的外卖服务。</p>
                        <div class="about-stats">
                            <div class="about-stat">
                                <span class="num">18</span>
                                <span class="label">合作商家</span>
                            </div>
                            <div class="about-stat">
                                <span class="num">144</span>
                                <span class="label">精选美食</span>
                            </div>
                            <div class="about-stat">
                                <span class="num">30min</span>
                                <span class="label">平均送达</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const user = ref({})
const addresses = ref([])
const orders = ref([])
const showEditProfile = ref(false)
const showAddressModal = ref(false)
const showPasswordModal = ref(false)
const showNotificationSettings = ref(false)
const showAbout = ref(false)

const editForm = ref({
    nickname: '',
    phone: '',
    email: ''
})

const orderCount = ref(0)
const cartCount = ref(0)
const addressCount = ref(0)
const pendingCount = ref(0)
const paidCount = ref(0)
const deliveringCount = ref(0)
const completedCount = ref(0)
const returnedCount = ref(0)
const totalSpent = ref(0)
const monthSpent = ref(0)

const goToOrders = () => {
    window.location.href = '/orders'
}

const goToOrdersWithFilter = (status) => {
    window.location.href = '/orders?status=' + status
}

const goToCart = () => {
    window.location.href = '/cart'
}

const goToFavorites = () => {
    window.location.href = '/favorites'
}

const goToPoints = () => {
    window.location.href = '/points'
}

const goToRecommendations = () => {
    window.location.href = '/recommendations'
}

const goToNotifications = () => {
    window.location.href = '/notifications'
}

const goToStatistics = () => {
    window.location.href = '/statistics'
}

const saveProfile = () => {
    user.value.nickname = editForm.value.nickname
    user.value.phone = editForm.value.phone
    user.value.email = editForm.value.email
    localStorage.setItem('user', JSON.stringify(user.value))
    showEditProfile.value = false
    alert('资料已保存')
}

const logout = () => {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
}

const goBack = () => {
    window.history.back()
}

const fetchUserStats = async () => {
    if (!user.value?.id) return
    try {
        const res = await axios.get(`/api/orders/customer/${user.value.id}`)
        const orders = res.data
        orderCount.value = orders.length
        totalSpent.value = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
        const now = new Date()
        monthSpent.value = orders
            .filter(o => {
                const d = new Date(o.created_at)
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            })
            .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    } catch (e) {}
}

const vipLevel = computed(() => {
    if (user.value?.is_admin) return { level: 5, name: '超级VIP', next: null, progress: 100, color: '#FFD700' }
    const spent = totalSpent.value
    if (spent >= 5000) return { level: 5, name: '钻石VIP', next: null, progress: 100, color: '#B9F2FF' }
    if (spent >= 2000) return { level: 4, name: '铂金VIP', next: '再消费¥' + (5000 - spent) + '升钻石', progress: (spent / 5000) * 100, color: '#E0E0E0' }
    if (spent >= 800) return { level: 3, name: '黄金VIP', next: '再消费¥' + (2000 - spent) + '升铂金', progress: (spent / 2000) * 100, color: '#FFD700' }
    if (spent >= 200) return { level: 2, name: '白银VIP', next: '再消费¥' + (800 - spent) + '升黄金', progress: (spent / 800) * 100, color: '#C0C0C0' }
    return { level: 1, name: '普通会员', next: '再消费¥' + (200 - spent) + '升白银', progress: (spent / 200) * 100, color: '#CD7F32' }
})

onMounted(async () => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
        window.location.href = '/login'
        return
    }
    user.value = JSON.parse(storedUser)
    editForm.value = {
        nickname: user.value.nickname || '',
        phone: user.value.phone || '',
        email: user.value.email || ''
    }

    // 获取购物车数量
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0)

    // 获取订单和地址数据
    try {
        const [ordersRes, addressRes] = await Promise.all([
            axios.get(`/api/orders/customer/${user.value.id}`),
            axios.get(`/api/users/addresses`)
        ])
        orders.value = ordersRes.data
        orderCount.value = orders.value.length
        pendingCount.value = orders.value.filter(o => o.status === 'pending').length
        paidCount.value = orders.value.filter(o => o.status === 'paid').length
        deliveringCount.value = orders.value.filter(o => o.status === 'delivering').length
        completedCount.value = orders.value.filter(o => o.status === 'completed').length
        returnedCount.value = orders.value.filter(o => o.status === 'returned').length
        addresses.value = addressRes.data || []
        addressCount.value = addresses.value.length
    } catch (error) {
        console.error('加载数据失败:', error)
    }

    fetchUserStats()
})
</script>

<style scoped>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

@keyframes progressFill {
    from { width: 0; }
}

.profile-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 40px;
}

.profile-header {
    position: relative;
    padding-bottom: 60px;
}

.header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 220px;
    background: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    border-radius: 0 0 40px 40px;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 38px;
    height: 38px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(12px);
    z-index: 10;
}

.back-btn:hover {
    background: rgba(255,255,255,0.3);
    transform: scale(1.1);
}

.back-btn span {
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.user-card {
    position: relative;
    margin: 0 20px;
    margin-top: 50px;
    background: white;
    border-radius: 20px;
    padding: 28px 20px 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeInUp 0.6s ease both;
}

.avatar-wrapper {
    position: relative;
    margin-top: -65px;
    margin-bottom: 14px;
}

.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: white;
    border: 3px solid #d4a844;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2), 0 0 0 4px rgba(255,255,255,0.8);
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28px;
    height: 28px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    cursor: pointer;
    transition: transform 0.2s ease;
}

.avatar-edit:hover {
    transform: scale(1.15);
}

.user-info {
    text-align: center;
    margin-bottom: 14px;
}

.user-info h2 {
    margin: 0 0 6px;
    font-size: 24px;
    color: #1a1a2e;
    font-weight: 700;
}

.user-id {
    margin: 0 0 10px;
    font-size: 12px;
    color: rgba(255,255,255,0.9);
    background: linear-gradient(135deg, #d4a844, #b8860b);
    display: inline-block;
    padding: 3px 14px;
    border-radius: 12px;
    font-weight: 500;
}

.user-tags {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.tag {
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
}

.tag.vip {
    background: linear-gradient(135deg, #d4a844 0%, #f0d060 50%, #d4a844 100%);
    color: #1a1a2e;
}

.tag.member {
    background: #f0f0f0;
    color: #666;
}

.vip-progress {
    width: 100%;
    margin: 14px 0 0;
    padding: 14px 16px;
    background: #fafbfc;
    border-radius: 12px;
}

.vip-progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.vip-label {
    font-size: 13px;
    color: #999;
    font-weight: 500;
}

.vip-level {
    font-size: 13px;
    color: #d4a844;
    font-weight: 700;
}

.vip-progress-bar {
    width: 100%;
    height: 6px;
    background: #e8e8e8;
    border-radius: 3px;
    overflow: hidden;
}

.vip-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #d4a844 0%, #f0d060 50%, #d4a844 100%);
    border-radius: 3px;
    animation: progressFill 1.2s ease both;
    transition: width 1s ease;
}

.vip-progress-text {
    margin-top: 6px;
    text-align: right;
}

.vip-progress-text span {
    font-size: 11px;
    color: #bbb;
}

.user-stats {
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
    justify-content: center;
    padding-top: 18px;
    margin-top: 14px;
    border-top: 1px solid #f0f0f0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    flex: 1;
}

.stat-num {
    font-size: 26px;
    font-weight: 700;
    color: white;
}

.stat-label {
    font-size: 12px;
    color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.15);
    padding: 2px 12px;
    border-radius: 8px;
    font-weight: 500;
}

.stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(255,255,255,0.2);
}

.user-card .user-stats .stat-num {
    color: #1a1a2e;
}

.user-card .user-stats .stat-label {
    color: #999;
    background: #f5f7fa;
}

.user-card .user-stats .stat-divider {
    background: #f0f0f0;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px 12px;
    margin: -30px 20px 0;
    background: white;
    border-radius: 20px;
    padding: 24px 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    position: relative;
    z-index: 2;
    animation: fadeInUp 0.6s ease 0.1s both;
}

.stats-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: white;
    margin: -20px 16px 16px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    position: relative;
    z-index: 1;
}

.stats-row .stat-item { text-align: center; flex: 1; }
.stats-row .stat-num { display: block; font-size: 20px; font-weight: 700; color: #FF4757; }
.stats-row .stat-label { display: block; font-size: 12px; color: #999; margin-top: 4px; }
.stats-row .stat-divider { width: 1px; height: 30px; background: #e8e8e8; }

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.action-item:hover {
    transform: translateY(-4px);
}

.action-item:hover .action-icon {
    transform: scale(1.1);
}

.action-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.12);
    transition: transform 0.3s ease;
}

.action-text {
    font-size: 12px;
    color: #333;
    font-weight: 500;
}

.section {
    margin: 20px;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    animation: fadeInUp 0.6s ease 0.2s both;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
    font-weight: 600;
}

.view-all {
    font-size: 13px;
    color: #FF6B81;
    cursor: pointer;
    transition: color 0.2s ease;
}

.view-all:hover {
    color: #FF4757;
}

.order-status {
    display: flex;
    justify-content: space-between;
}

.status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    position: relative;
    padding: 10px 6px;
    border-radius: 12px;
    transition: background 0.3s ease;
    flex: 1;
}

.status-item:hover {
    background: #f8f9fa;
}

.status-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: transform 0.2s ease;
}

.status-item:hover .status-icon {
    transform: scale(1.08);
}

.status-icon.pending { background: #fff3e0; }
.status-icon.paid { background: #e3f2fd; }
.status-icon.delivering { background: #e8f5e9; }
.status-icon.completed { background: #f3e5f5; }
.status-icon.returned { background: #fce4ec; }

.status-text {
    font-size: 11px;
    color: #666;
    font-weight: 500;
}

.status-badge {
    position: absolute;
    top: 0;
    right: 4px;
    min-width: 18px;
    height: 18px;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white;
    font-size: 10px;
    padding: 0 5px;
    border-radius: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(255,71,87,0.4);
}

.menu-list {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.menu-group-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 12px 6px;
    font-size: 12px;
    color: #999;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.group-bar {
    display: inline-block;
    width: 3px;
    height: 14px;
    background: linear-gradient(180deg, #FF6B81, #FF4757);
    border-radius: 2px;
}

.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 12px;
    cursor: pointer;
    border-radius: 12px;
    transition: background 0.2s ease;
}

.menu-item:hover {
    background: #f8f9fa;
}

.menu-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.menu-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.menu-text {
    font-size: 15px;
    color: #333;
    font-weight: 500;
}

.menu-arrow {
    color: #ccc;
    font-size: 20px;
    font-weight: 300;
}

.menu-right {
    display: flex;
    align-items: center;
}

.toggle-switch {
    width: 44px;
    height: 24px;
    background: #ddd;
    border-radius: 12px;
    position: relative;
    transition: background 0.3s ease;
}

.toggle-switch.active {
    background: #4caf50;
}

.toggle-switch::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}

.toggle-switch.active::after {
    transform: translateX(20px);
}

.logout-section {
    margin: 20px;
    animation: fadeInUp 0.6s ease 0.3s both;
}

.logout-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
    border: none;
    border-radius: 12px;
    font-size: 16px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 16px rgba(255,71,87,0.3);
    transition: all 0.3s ease;
}

.logout-btn:hover {
    box-shadow: 0 8px 28px rgba(255,71,87,0.45);
    transform: translateY(-2px);
}

.app-version {
    text-align: center;
    padding: 16px 0 0;
    font-size: 12px;
    color: #ccc;
    letter-spacing: 0.5px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    border-radius: 20px 20px 0 0;
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a2e;
}

.close-btn {
    font-size: 20px;
    color: #999;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s ease;
}

.close-btn:hover {
    background: #f0f0f0;
}

.modal-body {
    padding: 24px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
    font-weight: 600;
}

.form-group input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #e8e8e8;
    border-radius: 12px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    height: 50px;
    background: #fafbfc;
}

.form-group input:focus {
    border-color: #FF6B81;
    background: white;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 16px 24px 24px;
}

.btn-secondary {
    flex: 1;
    padding: 14px;
    border: 1px solid #e0e0e0;
    background: white;
    border-radius: 12px;
    font-size: 15px;
    color: #666;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s ease;
}

.btn-secondary:hover {
    background: #f8f8f8;
}

.btn-primary {
    flex: 1;
    padding: 14px;
    border: none;
    background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
    color: white;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(255,71,87,0.3);
    transition: all 0.3s ease;
}

.btn-primary:hover {
    box-shadow: 0 6px 20px rgba(255,71,87,0.4);
    transform: translateY(-1px);
}

.btn-primary.full-width {
    width: 100%;
}

.empty-address {
    text-align: center;
    padding: 40px;
    color: #999;
}

.empty-address span {
    font-size: 48px;
}

.address-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.address-card-item {
    padding: 16px;
    background: #fafbfc;
    border-radius: 12px;
    border: 1px solid #f0f0f0;
}

.address-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
}

.address-header .name {
    font-weight: 600;
    color: #333;
}

.address-header .phone {
    color: #666;
    font-size: 13px;
}

.default-tag {
    padding: 2px 8px;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white;
    font-size: 11px;
    border-radius: 8px;
    font-weight: 600;
}

.address-detail {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
}

.about-body {
    text-align: center;
}

.about-logo {
    margin-bottom: 30px;
}

.about-logo span {
    font-size: 60px;
}

.about-logo h2 {
    margin: 10px 0 5px;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a2e;
}

.about-logo p {
    margin: 0;
    color: #999;
    font-size: 14px;
}

.about-info p {
    color: #666;
    line-height: 1.7;
    margin-bottom: 30px;
}

.about-stats {
    display: flex;
    justify-content: space-around;
    padding: 24px 20px;
    background: #fafbfc;
    border-radius: 16px;
    border: 1px solid #f0f0f0;
}

.about-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.about-stat .num {
    font-size: 22px;
    font-weight: 700;
    color: #FF4757;
}

.about-stat .label {
    font-size: 12px;
    color: #666;
}

@media (min-width: 768px) {
    .modal-overlay {
        align-items: center;
    }

    .modal-content {
        border-radius: 20px;
        max-height: 90vh;
    }
}

@media (max-width: 767px) {
    .profile-page {
        max-width: 100%;
    }

    .header-bg {
        height: 200px;
        border-radius: 0 0 32px 32px;
    }

    .user-card {
        margin: 0 16px;
        margin-top: 40px;
    }

    .avatar {
        width: 80px;
        height: 80px;
        font-size: 36px;
    }

    .avatar-wrapper {
        margin-top: -55px;
    }

    .user-info h2 {
        font-size: 22px;
    }

    .quick-actions {
        margin: -24px 16px 0;
        gap: 14px 8px;
        padding: 20px 10px;
    }

    .action-icon {
        width: 44px;
        height: 44px;
        font-size: 20px;
    }

    .action-text {
        font-size: 11px;
    }

    .section {
        margin: 16px;
    }

    .logout-section {
        margin: 16px;
    }

    .stat-num {
        font-size: 22px;
    }

    .order-status {
        gap: 2px;
    }

    .status-icon {
        width: 42px;
        height: 42px;
        font-size: 20px;
    }

    .form-group input {
        height: 46px;
    }
}
</style>
