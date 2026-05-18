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
                <span class="view-all" @click="goToOrders">查看全部 →</span>
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
                </div>
                <div class="status-item" @click="goToOrdersWithFilter('delivering')">
                    <div class="status-icon delivering">🚚</div>
                    <span class="status-text">配送中</span>
                </div>
                <div class="status-item" @click="goToOrdersWithFilter('completed')">
                    <div class="status-icon completed">✅</div>
                    <span class="status-text">已完成</span>
                </div>
                <div class="status-item" @click="goToOrdersWithFilter('returned')">
                    <div class="status-icon returned">↩️</div>
                    <span class="status-text">退货/售后</span>
                </div>
            </div>
        </div>

        <!-- 设置菜单 -->
        <div class="section">
            <div class="section-header">
                <h3>⚙️ 设置</h3>
            </div>
            <div class="menu-list">
                <div class="menu-item" @click="showEditProfile = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #e3f2fd;">👤</span>
                        <span class="menu-text">个人资料</span>
                    </div>
                    <span class="menu-arrow">→</span>
                </div>
                <div class="menu-item" @click="showAddressModal = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #fce4ec;">🏠</span>
                        <span class="menu-text">地址管理</span>
                    </div>
                    <span class="menu-arrow">→</span>
                </div>
                <div class="menu-item" @click="showPasswordModal = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #f3e5f5;">🔐</span>
                        <span class="menu-text">修改密码</span>
                    </div>
                    <span class="menu-arrow">→</span>
                </div>
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
                    <span class="menu-arrow">→</span>
                </div>
                <div class="menu-item" @click="showAbout = true">
                    <div class="menu-left">
                        <span class="menu-icon" style="background: #e0f2f1;">ℹ️</span>
                        <span class="menu-text">关于我们</span>
                    </div>
                    <span class="menu-arrow">→</span>
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
import { ref, onMounted } from 'vue'
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

const goToOrders = () => {
    window.location.href = '/orders'
}

const goToOrdersWithFilter = (status) => {
    window.location.href = '/orders'
}

const goToCart = () => {
    window.location.href = '/cart'
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
        addresses.value = addressRes.data || []
        addressCount.value = addresses.value.length
    } catch (error) {
        console.error('加载数据失败:', error)
    }
})
</script>

<style scoped>
.profile-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 40px;
}

/* 顶部用户信息 */
.profile-header {
    position: relative;
    padding-bottom: 60px;
}

.header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 180px;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    border-radius: 0 0 30px 30px;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
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
    margin-top: 40px;
    background: white;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.avatar-wrapper {
    position: relative;
    margin-top: -60px;
    margin-bottom: 15px;
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    color: white;
    border: 4px solid white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
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
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    cursor: pointer;
}

.user-info {
    text-align: center;
    margin-bottom: 20px;
}

.user-info h2 {
    margin: 0 0 5px;
    font-size: 22px;
    color: #333;
}

.user-id {
    margin: 0 0 10px;
    font-size: 13px;
    color: #999;
}

.user-tags {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.tag {
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
}

.tag.vip {
    background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
    color: #333;
}

.tag.member {
    background: #f0f0f0;
    color: #666;
}

.user-stats {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    justify-content: center;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.stat-num {
    font-size: 24px;
    font-weight: 700;
    color: #333;
}

.stat-label {
    font-size: 12px;
    color: #999;
}

.stat-divider {
    width: 1px;
    height: 30px;
    background: #e0e0e0;
}

/* 快捷功能入口 */
.quick-actions {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin: 20px;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.action-item:hover {
    transform: translateY(-3px);
}

.action-icon {
    width: 50px;
    height: 50px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.action-text {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

/* 区块样式 */
.section {
    margin: 20px;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
}

.view-all {
    font-size: 13px;
    color: #ff6b6b;
    cursor: pointer;
}

/* 订单状态 */
.order-status {
    display: flex;
    justify-content: space-around;
}

.status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    position: relative;
    padding: 10px;
    border-radius: 12px;
    transition: background 0.3s ease;
}

.status-item:hover {
    background: #f8f9fa;
}

.status-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.status-icon.pending { background: #fff3e0; }
.status-icon.paid { background: #e3f2fd; }
.status-icon.delivering { background: #e8f5e9; }
.status-icon.completed { background: #f3e5f5; }
.status-icon.returned { background: #fce4ec; }

.status-text {
    font-size: 12px;
    color: #666;
}

.status-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    background: #ff6b6b;
    color: white;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 600;
}

/* 菜单列表 */
.menu-list {
    display: flex;
    flex-direction: column;
}

.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    transition: background 0.2s ease;
}

.menu-item:last-child {
    border-bottom: none;
}

.menu-item:hover {
    background: #fafafa;
    margin: 0 -20px;
    padding: 16px 20px;
    border-radius: 8px;
}

.menu-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.menu-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.menu-text {
    font-size: 15px;
    color: #333;
}

.menu-arrow {
    color: #ccc;
    font-size: 16px;
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
}

.toggle-switch.active::after {
    transform: translateX(20px);
}

/* 退出登录 */
.logout-section {
    margin: 20px;
}

.logout-btn {
    width: 100%;
    padding: 16px;
    background: white;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    color: #ff6b6b;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: #fff5f5;
    box-shadow: 0 4px 15px rgba(255,107,107,0.15);
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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

@keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
}

.close-btn {
    font-size: 20px;
    color: #999;
    cursor: pointer;
}

.modal-body {
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
}

.form-group input:focus {
    border-color: #ff6b6b;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px;
    border-top: 1px solid #f0f0f0;
}

.btn-secondary {
    flex: 1;
    padding: 14px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 12px;
    font-size: 15px;
    color: #666;
    cursor: pointer;
}

.btn-primary {
    flex: 1;
    padding: 14px;
    border: none;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
}

.btn-primary.full-width {
    width: 100%;
}

/* 地址列表 */
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
    background: #f8f9fa;
    border-radius: 12px;
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
    background: #ff6b6b;
    color: white;
    font-size: 11px;
    border-radius: 8px;
}

.address-detail {
    margin: 0;
    font-size: 14px;
    color: #666;
}

/* 关于我们 */
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
}

.about-logo p {
    margin: 0;
    color: #999;
    font-size: 14px;
}

.about-info p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 30px;
}

.about-stats {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 16px;
}

.about-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.about-stat .num {
    font-size: 20px;
    font-weight: 700;
    color: #ff6b6b;
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
</style>
