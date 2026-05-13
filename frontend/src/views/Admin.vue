<template>
    <div class="admin-page">
        <div class="admin-header">
            <h1>管理后台</h1>
            <button class="logout-btn" @click="logout">退出登录</button>
        </div>
        
        <div class="admin-container">
            <div class="sidebar">
                <div 
                    v-for="item in menuItems" 
                    :key="item.id" 
                    :class="['menu-item', { active: activeMenu === item.id }]"
                    @click="item.link ? navigateTo(item.link) : activeMenu = item.id"
                >
                    <span class="menu-icon">{{ item.icon }}</span>
                    <span class="menu-text">{{ item.name }}</span>
                </div>
            </div>
            
            <div class="main-content">
                <div v-if="activeMenu === 'users'" class="content-section">
                    <h2>用户管理</h2>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>用户名</th>
                                    <th>邮箱</th>
                                    <th>手机号</th>
                                    <th>地址</th>
                                    <th>注册时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>{{ user.id }}</td>
                                    <td>{{ user.username }}</td>
                                    <td>{{ user.email }}</td>
                                    <td>{{ user.phone }}</td>
                                    <td>{{ user.address }}</td>
                                    <td>{{ formatDate(user.created_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div v-if="activeMenu === 'shops'" class="content-section">
                    <div class="section-header">
                        <h2>商家管理</h2>
                        <button class="add-btn" @click="showAddShop = true">+ 添加商家</button>
                    </div>
                    <div class="shops-grid">
                        <div v-for="shop in shops" :key="shop.id" class="shop-card">
                            <img :src="shop.image_url" :alt="shop.name" class="shop-image" />
                            <div class="shop-info">
                                <h3>{{ shop.name }}</h3>
                                <p>{{ shop.description }}</p>
                                <p class="shop-meta">{{ shop.address }}</p>
                            </div>
                            <div class="shop-actions">
                                <button class="edit-btn">编辑</button>
                                <button class="delete-btn">删除</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="activeMenu === 'products'" class="content-section">
                    <div class="section-header">
                        <h2>商品管理</h2>
                        <button class="add-btn" @click="showAddProduct = true">+ 添加商品</button>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>商品名称</th>
                                    <th>所属商家</th>
                                    <th>价格</th>
                                    <th>库存</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in products" :key="product.id">
                                    <td>{{ product.id }}</td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ getShopName(product.shop_id) }}</td>
                                    <td>¥{{ product.price.toFixed(2) }}</td>
                                    <td>{{ product.stock }}</td>
                                    <td>
                                        <button class="action-btn edit">编辑</button>
                                        <button class="action-btn delete">删除</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div v-if="activeMenu === 'orders'" class="content-section">
                    <h2>订单管理</h2>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>订单号</th>
                                    <th>用户</th>
                                    <th>金额</th>
                                    <th>状态</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="order in orders" :key="order.id">
                                    <td>{{ order.id }}</td>
                                    <td>{{ order.username }}</td>
                                    <td>¥{{ order.total_amount.toFixed(2) }}</td>
                                    <td :class="['status-badge', order.status]">{{ getStatusText(order.status) }}</td>
                                    <td>{{ formatDate(order.created_at) }}</td>
                                    <td>
                                        <button class="action-btn view">查看</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div v-if="activeMenu === 'stats'" class="content-section">
                    <h2>数据统计</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.users }}</div>
                                <div class="stat-label">用户数量</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🏪</div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.shops }}</div>
                                <div class="stat-label">商家数量</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🍔</div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.products }}</div>
                                <div class="stat-label">商品数量</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📋</div>
                            <div class="stat-info">
                                <div class="stat-value">{{ stats.orders }}</div>
                                <div class="stat-label">订单数量</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-if="showAddShop" class="modal-overlay" @click="showAddShop = false">
            <div class="modal-content" @click.stop>
                <h3>添加商家</h3>
                <form @submit.prevent="addShop">
                    <input v-model="newShop.name" placeholder="商家名称" class="modal-input" />
                    <input v-model="newShop.description" placeholder="商家描述" class="modal-input" />
                    <input v-model="newShop.address" placeholder="地址" class="modal-input" />
                    <input v-model="newShop.phone" placeholder="电话" class="modal-input" />
                    <input v-model="newShop.image_url" placeholder="图片URL" class="modal-input" />
                    <button type="submit" class="modal-submit">添加</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const activeMenu = ref('stats')
const users = ref([])
const shops = ref([])
const products = ref([])
const orders = ref([])
const stats = ref({
    users: 0,
    shops: 0,
    products: 0,
    orders: 0
})
const showAddShop = ref(false)
const showAddProduct = ref(false)
const newShop = ref({
    name: '',
    description: '',
    address: '',
    phone: '',
    image_url: ''
})

const menuItems = [
    { id: 'stats', name: '数据统计', icon: '📊', link: '/statistics' },
    { id: 'users', name: '用户管理', icon: '👥', link: null },
    { id: 'shops', name: '商家管理', icon: '🏪', link: null },
    { id: 'products', name: '商品管理', icon: '🍔', link: null },
    { id: 'orders', name: '订单管理', icon: '📋', link: null }
]

const getStatusText = (status) => {
    const statusMap = {
        pending: '待支付',
        paid: '已支付',
        preparing: '准备中',
        delivering: '配送中',
        completed: '已完成',
        cancelled: '已取消'
    }
    return statusMap[status] || status
}

const getShopName = (shopId) => {
    const shop = shops.value.find(s => s.id === shopId)
    return shop ? shop.name : '未知'
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN')
}

const logout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
}

const navigateTo = (link) => {
    window.location.href = link
}

const addShop = async () => {
    try {
        await axios.post('/api/shops', newShop.value)
        showAddShop.value = false
        newShop.value = { name: '', description: '', address: '', phone: '', image_url: '' }
        loadData()
    } catch (error) {
        console.error('Failed to add shop:', error)
    }
}

const loadData = async () => {
    try {
        const [usersRes, shopsRes, productsRes, ordersRes] = await Promise.all([
            axios.get('/api/users'),
            axios.get('/api/shops'),
            axios.get('/api/products'),
            axios.get('/api/orders')
        ])
        
        users.value = usersRes.data
        shops.value = shopsRes.data
        products.value = productsRes.data
        orders.value = ordersRes.data
        
        stats.value = {
            users: users.value.length,
            shops: shops.value.length,
            products: products.value.length,
            orders: orders.value.length
        }
    } catch (error) {
        console.error('Failed to load data:', error)
    }
}

onMounted(() => {
    const user = JSON.parse(localStorage.getItem('user') || null)
    if (!user || user.username !== 'admin') {
        window.location.href = '/login'
        return
    }
    loadData()
})
</script>

<style scoped>
.admin-page {
    min-height: 100vh;
    background: #f5f5f5;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.admin-header h1 {
    font-size: 24px;
    color: #333;
}

.logout-btn {
    padding: 10px 20px;
    border: none;
    background: #f5f5f5;
    color: #666;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: #e8e8e8;
}

.admin-container {
    display: flex;
    height: calc(100vh - 72px);
}

.sidebar {
    width: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px 0;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
    background: rgba(255, 255, 255, 0.2);
    border-left: 3px solid white;
}

.menu-icon {
    font-size: 20px;
    margin-right: 10px;
}

.menu-text {
    font-size: 15px;
}

.main-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
}

.content-section {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.content-section h2 {
    font-size: 22px;
    margin-bottom: 20px;
    color: #333;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.add-btn {
    padding: 10px 20px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.table-container {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
}

.data-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #333;
}

.action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    margin-right: 5px;
    transition: all 0.2s ease;
}

.action-btn.edit {
    background: #e3f2fd;
    color: #1976d2;
}

.action-btn.delete {
    background: #ffebee;
    color: #c62828;
}

.action-btn.view {
    background: #e8f5e9;
    color: #2e7d32;
}

.status-badge {
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
}

.status-badge.pending {
    background: #fff3cd;
    color: #856404;
}

.status-badge.paid {
    background: #cce5ff;
    color: #004085;
}

.status-badge.preparing {
    background: #d4edda;
    color: #155724;
}

.status-badge.delivering {
    background: #e7f3ff;
    color: #0c63e4;
}

.status-badge.completed {
    background: #f8d7da;
    color: #721c24;
}

.shops-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.shop-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
}

.shop-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.shop-info {
    padding: 15px;
}

.shop-info h3 {
    font-size: 16px;
    margin-bottom: 5px;
}

.shop-info p {
    font-size: 13px;
    color: #666;
    margin-bottom: 5px;
}

.shop-meta {
    color: #888;
    font-size: 12px;
}

.shop-actions {
    padding: 10px 15px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 10px;
}

.edit-btn,
.delete-btn {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
}

.edit-btn {
    background: #f0f0f0;
    color: #333;
}

.delete-btn {
    background: #ffebee;
    color: #c62828;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    color: white;
}

.stat-icon {
    font-size: 40px;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
}

.modal-content h3 {
    margin-bottom: 20px;
}

.modal-input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
}

.modal-input:focus {
    border-color: #667eea;
}

.modal-submit {
    width: 100%;
    padding: 12px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .admin-container {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        padding: 10px;
    }
    
    .menu-item {
        display: inline-flex;
        padding: 10px 15px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 8px;
    }
    
    .shops-grid {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>
