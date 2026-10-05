<template>
    <div class="notifications-page">
        <div class="page-header">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <h1>🔔 消息通知</h1>
            <div class="mark-all-read" @click="markAllRead">全部已读</div>
        </div>

        <div class="tabs">
            <div
                v-for="tab in tabs"
                :key="tab.value"
                class="tab-item"
                :class="{ active: activeTab === tab.value }"
                @click="activeTab = tab.value"
            >
                {{ tab.label }}
                <span v-if="tab.value === 'all' && unreadCount > 0" class="tab-badge">{{ unreadCount }}</span>
            </div>
        </div>

        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
        </div>

        <div v-else-if="filteredNotifications.length === 0" class="empty-state">
            <div class="empty-icon">🔔</div>
            <p>暂无新消息</p>
        </div>

        <div v-else class="notification-list">
            <div
                v-for="item in filteredNotifications"
                :key="item.id"
                class="notification-card"
                :class="{ unread: !item.is_read }"
                @click="markAsRead(item)"
            >
                <div class="icon-area" :class="item.type">
                    {{ getTypeIcon(item.type) }}
                </div>
                <div class="notification-body">
                    <div class="notification-header">
                        <h3 class="notification-title">{{ item.title }}</h3>
                        <span v-if="!item.is_read" class="unread-dot"></span>
                    </div>
                    <p class="notification-content">{{ item.content }}</p>
                    <span class="notification-time">{{ formatTime(item.created_at) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const notifications = ref([])
const loading = ref(true)
const activeTab = ref('all')
const unreadCount = ref(0)

const tabs = [
    { label: '全部', value: 'all' },
    { label: '订单', value: 'order' },
    { label: '系统', value: 'system' },
    { label: '促销', value: 'promotion' }
]

const getUser = () => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
}

const filteredNotifications = computed(() => {
    if (activeTab.value === 'all') return notifications.value
    return notifications.value.filter(n => n.type === activeTab.value)
})

const getTypeIcon = (type) => {
    const map = {
        order: '📦',
        system: '⚙️',
        promotion: '🎉'
    }
    return map[type] || '🔔'
}

const formatTime = (time) => {
    if (!time) return ''
    const date = new Date(time)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
}

const loadNotifications = async () => {
    const user = getUser()
    if (!user) {
        loading.value = false
        return
    }

    try {
        const [notifRes, countRes] = await Promise.all([
            axios.get(`/api/notifications/customer/${user.id}`),
            axios.get(`/api/notifications/unread-count/${user.id}`)
        ])
        notifications.value = notifRes.data || []
        unreadCount.value = typeof countRes.data === 'number' ? countRes.data : (countRes.data?.count || 0)
    } catch (error) {
        console.error('加载通知失败:', error)
    } finally {
        loading.value = false
    }
}

const markAsRead = async (item) => {
    if (item.is_read) return

    try {
        await axios.put(`/api/notifications/${item.id}/read`)
        item.is_read = true
        if (unreadCount.value > 0) unreadCount.value--
    } catch (error) {
        console.error('标记已读失败:', error)
    }
}

const markAllRead = async () => {
    const user = getUser()
    if (!user) return

    try {
        await axios.put(`/api/notifications/read-all`, null, {
            params: { customer_id: user.id }
        })
        notifications.value.forEach(n => { n.is_read = true })
        unreadCount.value = 0
    } catch (error) {
        console.error('全部已读失败:', error)
    }
}

const goBack = () => {
    window.history.back()
}

onMounted(() => {
    const user = getUser()
    if (!user) {
        window.location.href = '/login'
        return
    }
    loadNotifications()
})
</script>

<style scoped>
.notifications-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 40px;
}

.page-header {
    background: linear-gradient(135deg, #4A90D9, #357ABD);
    padding: 20px;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 0 24px 24px;
    box-shadow: 0 4px 20px rgba(74, 144, 217, 0.3);
}

.back-btn {
    position: absolute;
    left: 15px;
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
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mark-all-read {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 4px 10px;
    border-radius: 12px;
}

.mark-all-read:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
}

.tabs {
    display: flex;
    gap: 10px;
    padding: 16px 20px;
    overflow-x: auto;
}

.tab-item {
    padding: 8px 20px;
    background: white;
    border-radius: 20px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #666;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    border: 1px solid #eef1f5;
}

.tab-item.active {
    background: linear-gradient(135deg, #4A90D9, #357ABD);
    color: white;
    border-color: transparent;
    box-shadow: 0 4px 14px rgba(74, 144, 217, 0.35);
}

.tab-badge {
    background: #ff4757;
    color: white;
    font-size: 11px;
    padding: 1px 7px;
    border-radius: 10px;
    font-weight: 600;
    line-height: 16px;
}

.tab-item.active .tab-badge {
    background: rgba(255, 255, 255, 0.3);
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 16px;
    color: #999;
}

.loading-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #e8eaed;
    border-top-color: #4A90D9;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-state {
    text-align: center;
    padding: 100px 20px;
}

.empty-icon {
    font-size: 72px;
    margin-bottom: 20px;
    opacity: 0.5;
    filter: grayscale(0.3);
}

.empty-state p {
    color: #999;
    font-size: 16px;
    margin: 0;
    font-weight: 500;
}

.notification-list {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.notification-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: white;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;
    animation: fadeInUp 0.4s ease both;
}

.notification-card:nth-child(1) { animation-delay: 0s; }
.notification-card:nth-child(2) { animation-delay: 0.05s; }
.notification-card:nth-child(3) { animation-delay: 0.1s; }
.notification-card:nth-child(4) { animation-delay: 0.15s; }
.notification-card:nth-child(5) { animation-delay: 0.2s; }
.notification-card:nth-child(6) { animation-delay: 0.25s; }
.notification-card:nth-child(7) { animation-delay: 0.3s; }
.notification-card:nth-child(8) { animation-delay: 0.35s; }

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.notification-card.unread {
    background: white;
    border-left: 4px solid #4A90D9;
    box-shadow: 0 2px 8px rgba(74, 144, 217, 0.08);
}

.notification-card:not(.unread) {
    background: #f8f9fa;
    border-left: 4px solid transparent;
}

.notification-card:hover {
    transform: scale(1.01);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
}

.icon-area {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
}

.icon-area.order {
    background: #e3f2fd;
}

.icon-area.system {
    background: #f3e5f5;
}

.icon-area.promotion {
    background: #fff3e0;
}

.notification-body {
    flex: 1;
    min-width: 0;
}

.notification-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.notification-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.unread-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4A90D9;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.15);
}

.notification-content {
    margin: 0 0 8px;
    font-size: 13px;
    color: #888;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notification-time {
    font-size: 12px;
    color: #bbb;
    display: block;
    text-align: right;
}

@media (max-width: 480px) {
    .page-header h1 {
        font-size: 18px;
    }

    .tabs {
        gap: 8px;
        padding: 12px 16px;
    }

    .tab-item {
        padding: 7px 16px;
        font-size: 13px;
    }

    .notification-list {
        padding: 0 12px;
        gap: 10px;
    }

    .notification-card {
        padding: 14px;
    }
}
</style>
