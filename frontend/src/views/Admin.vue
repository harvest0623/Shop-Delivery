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
    background: #f5f7fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.admin-header {
    display: none;
}

.admin-container {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 240px;
    min-height: 100vh;
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100;
}

.sidebar::before {
    content: '🍔 外卖商城管理';
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 24px 24px 32px;
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.5px;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 14px 24px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.25s ease;
    position: relative;
    margin: 2px 12px;
    border-radius: 10px;
}

.menu-item:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.08);
}

.menu-item.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
    border-left: none;
}

.menu-item.active::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 24px;
    background: #ffffff;
    border-radius: 0 3px 3px 0;
}

.menu-icon {
    font-size: 20px;
    margin-right: 14px;
    width: 24px;
    text-align: center;
    flex-shrink: 0;
}

.menu-text {
    font-size: 14px;
    font-weight: 500;
}

.sidebar::after {
    content: '👤 管理员';
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 24px;
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    font-weight: 500;
}

.main-content {
    flex: 1;
    margin-left: 240px;
    padding: 28px 32px;
    overflow-y: auto;
    min-height: 100vh;
    background: #f5f7fa;
}

.content-section {
    background: transparent;
    padding: 0;
    box-shadow: none;
}

.content-section h2 {
    display: none;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.section-header h2 {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
}

.add-btn {
    padding: 10px 24px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
}

.table-container {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    padding: 16px 20px;
    text-align: left;
}

.data-table thead tr {
    background: #2d3436;
}

.data-table th {
    background: transparent;
    font-weight: 600;
    color: #ffffff;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.data-table tbody tr {
    transition: background 0.2s ease;
    border-bottom: 1px solid #f1f3f5;
}

.data-table tbody tr:last-child {
    border-bottom: none;
}

.data-table tbody tr:hover {
    background: #e8f4fd;
}

.data-table td {
    color: #495057;
    font-size: 14px;
}

.action-btn {
    padding: 7px 16px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    margin-right: 8px;
    transition: all 0.2s ease;
}

.action-btn:last-child {
    margin-right: 0;
}

.action-btn.edit {
    background: #e3f2fd;
    color: #1565c0;
}

.action-btn.edit:hover {
    background: #bbdefb;
    box-shadow: 0 2px 8px rgba(21, 101, 192, 0.2);
}

.action-btn.delete {
    background: #ffebee;
    color: #c62828;
}

.action-btn.delete:hover {
    background: #ffcdd2;
    box-shadow: 0 2px 8px rgba(198, 40, 40, 0.2);
}

.action-btn.view {
    background: #e8f5e9;
    color: #2e7d32;
}

.action-btn.view:hover {
    background: #c8e6c9;
    box-shadow: 0 2px 8px rgba(46, 125, 50, 0.2);
}

.status-badge {
    display: inline-block;
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
}

.status-badge.pending {
    background: #fff8e1;
    color: #f57f17;
}

.status-badge.paid {
    background: #e3f2fd;
    color: #1565c0;
}

.status-badge.preparing {
    background: #fff3e0;
    color: #e65100;
}

.status-badge.delivering {
    background: #e8eaf6;
    color: #283593;
}

.status-badge.completed {
    background: #e8f5e9;
    color: #2e7d32;
}

.status-badge.cancelled {
    background: #fafafa;
    color: #757575;
}

.shops-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.shop-card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: none;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.shop-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.shop-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
}

.shop-info {
    padding: 18px 20px 12px;
}

.shop-info h3 {
    font-size: 16px;
    font-weight: 700;
    color: #1a1a2e;
    margin-bottom: 6px;
}

.shop-info p {
    font-size: 13px;
    color: #6c757d;
    margin-bottom: 4px;
    line-height: 1.5;
}

.shop-meta {
    color: #adb5bd !important;
    font-size: 12px !important;
}

.shop-actions {
    padding: 12px 20px;
    border-top: 1px solid #f1f3f5;
    display: flex;
    gap: 10px;
}

.edit-btn,
.delete-btn {
    flex: 1;
    padding: 8px 0;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.edit-btn {
    background: #e3f2fd;
    color: #1565c0;
}

.edit-btn:hover {
    background: #bbdefb;
}

.delete-btn {
    background: #ffebee;
    color: #c62828;
}

.delete-btn:hover {
    background: #ffcdd2;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 28px;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 24px;
    background: #ffffff;
    border-radius: 12px;
    color: #1a1a2e;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.stat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
}

.stat-icon {
    font-size: 36px;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;
    flex-shrink: 0;
}

.stat-card:nth-child(1) .stat-icon {
    background: #e8f5e9;
}

.stat-card:nth-child(2) .stat-icon {
    background: #fff3e0;
}

.stat-card:nth-child(3) .stat-icon {
    background: #fce4ec;
}

.stat-card:nth-child(4) .stat-icon {
    background: #e3f2fd;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #1a1a2e;
    line-height: 1.2;
}

.stat-label {
    font-size: 13px;
    color: #868e96;
    font-weight: 500;
    margin-top: 4px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: #ffffff;
    padding: 36px;
    border-radius: 20px;
    width: 90%;
    max-width: 440px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: modalIn 0.25s ease;
}

@keyframes modalIn {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.modal-content h3 {
    margin-bottom: 24px;
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
}

.modal-input {
    width: 100%;
    padding: 14px 18px;
    margin-bottom: 16px;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
}

.modal-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.modal-submit {
    width: 100%;
    padding: 14px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    margin-top: 4px;
}

.modal-submit:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.45);
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        min-height: auto;
        position: relative;
        flex-direction: row;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    }

    .sidebar::-webkit-scrollbar {
        display: none;
    }

    .sidebar::before {
        padding: 12px 16px;
        font-size: 15px;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .sidebar::after {
        display: none;
    }

    .menu-item {
        margin: 6px 4px;
        padding: 10px 16px;
        white-space: nowrap;
        flex-shrink: 0;
        border-radius: 20px;
    }

    .menu-item.active::before {
        display: none;
    }

    .menu-icon {
        margin-right: 6px;
    }

    .main-content {
        margin-left: 0;
        padding: 20px 16px;
    }

    .shops-grid {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .stat-card {
        padding: 18px 14px;
        gap: 12px;
    }

    .stat-icon {
        font-size: 28px;
        width: 44px;
        height: 44px;
    }

    .stat-value {
        font-size: 22px;
    }

    .data-table th,
    .data-table td {
        padding: 12px 14px;
    }
}
</style>
