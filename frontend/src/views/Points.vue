<template>
    <div class="points-page">
        <div class="page-header">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <h1>🎯 积分中心</h1>
        </div>

        <div class="points-card">
            <div class="points-card-bg"></div>
            <div class="points-card-content">
                <div class="points-main">
                    <span class="points-label">当前积分</span>
                    <span class="points-value">{{ totalPoints }}</span>
                </div>
                <div class="points-card-info">
                    <div class="points-info-item">
                        <span class="info-num">{{ checkinDays }}</span>
                        <span class="info-label">签到天数</span>
                    </div>
                    <div class="points-divider"></div>
                    <div class="points-info-item">
                        <span class="info-num">{{ totalEarned }}</span>
                        <span class="info-label">累计获得</span>
                    </div>
                    <div class="points-divider"></div>
                    <div class="points-info-item">
                        <span class="info-num">{{ totalSpent }}</span>
                        <span class="info-label">已使用</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h3>📅 每日签到</h3>
                <span class="streak-badge" v-if="consecutiveDays > 0">🔥 连续{{ consecutiveDays }}天</span>
            </div>
            <div class="checkin-calendar">
                <div
                    v-for="(day, index) in weekDays"
                    :key="index"
                    class="calendar-day"
                    :class="{ checked: day.checked, today: day.isToday }"
                >
                    <span class="day-label">{{ day.label }}</span>
                    <div class="day-icon">
                        <span v-if="day.checked">✅</span>
                        <span v-else-if="day.isToday" class="today-dot"></span>
                        <span v-else class="empty-dot"></span>
                    </div>
                    <span class="day-points">+{{ day.points }}</span>
                </div>
            </div>
            <div class="checkin-reward-tip" v-if="consecutiveDays >= 6">
                🎉 本周全勤！额外奖励 50 积分
            </div>
            <button
                class="checkin-btn"
                :class="{ checked: todayChecked }"
                @click="doCheckin"
                :disabled="todayChecked"
            >
                <span v-if="todayChecked">✅ 今日已签到</span>
                <span v-else>签到 +10积分</span>
            </button>
        </div>

        <div class="section">
            <div class="section-header">
                <h3>📋 每日任务</h3>
                <span class="task-progress">{{ completedTaskCount }}/{{ tasks.length }}</span>
            </div>
            <div class="task-list">
                <div
                    v-for="task in tasks"
                    :key="task.id"
                    class="task-card"
                    :class="{ completed: task.completed }"
                >
                    <div class="task-icon">{{ task.icon }}</div>
                    <div class="task-info">
                        <div class="task-top">
                            <span class="task-name">{{ task.name }}</span>
                            <span class="task-reward">+{{ task.points }}分</span>
                        </div>
                        <span class="task-desc">{{ task.description }}</span>
                        <div class="task-progress-bar">
                            <div
                                class="task-progress-fill"
                                :style="{ width: Math.min((task.progress / task.target) * 100, 100) + '%' }"
                            ></div>
                        </div>
                        <span class="task-progress-text">{{ task.progress }}/{{ task.target }}</span>
                    </div>
                    <button
                        class="task-btn"
                        :class="{ done: task.completed }"
                        :disabled="task.completed"
                        @click="completeTask(task)"
                    >
                        {{ task.completed ? '已完成' : '去完成' }}
                    </button>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h3>📝 积分记录</h3>
            </div>
            <div v-if="records.length === 0" class="empty-records">
                <span>📭</span>
                <p>暂无积分记录</p>
            </div>
            <div v-else class="records-list">
                <div
                    v-for="record in records"
                    :key="record.id"
                    class="record-item"
                >
                    <div class="record-left">
                        <span class="record-type-icon">{{ getRecordIcon(record.type) }}</span>
                        <div class="record-info">
                            <span class="record-desc">{{ record.description }}</span>
                            <span class="record-time">{{ formatTime(record.created_at) }}</span>
                        </div>
                    </div>
                    <span
                        class="record-points"
                        :class="{ positive: record.points > 0, negative: record.points < 0 }"
                    >
                        {{ record.points > 0 ? '+' : '' }}{{ record.points }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const user = ref({})
const totalPoints = ref(0)
const checkinDays = ref(0)
const totalEarned = ref(0)
const totalSpent = ref(0)
const todayChecked = ref(false)
const consecutiveDays = ref(0)
const records = ref([])
const tasks = ref([])

const weekDays = ref([
    { label: '周一', checked: false, isToday: false, points: 10 },
    { label: '周二', checked: false, isToday: false, points: 10 },
    { label: '周三', checked: false, isToday: false, points: 10 },
    { label: '周四', checked: false, isToday: false, points: 10 },
    { label: '周五', checked: false, isToday: false, points: 10 },
    { label: '周六', checked: false, isToday: false, points: 10 },
    { label: '周日', checked: false, isToday: false, points: 10 }
])

const defaultTasks = [
    { id: 1, name: '每日签到', description: '完成今日签到', icon: '📅', points: 10, progress: 0, target: 1, completed: false, type: 'checkin' },
    { id: 2, name: '浏览商品', description: '浏览任意3个商品详情', icon: '👀', points: 15, progress: 0, target: 3, completed: false, type: 'browse' },
    { id: 3, name: '下单奖励', description: '完成一笔订单', icon: '🛒', points: 30, progress: 0, target: 1, completed: false, type: 'order' },
    { id: 4, name: '分享好友', description: '分享商品给好友', icon: '🔗', points: 20, progress: 0, target: 1, completed: false, type: 'share' },
    { id: 5, name: '评价订单', description: '对已完成订单进行评价', icon: '⭐', points: 20, progress: 0, target: 1, completed: false, type: 'review' }
]

const completedTaskCount = computed(() => {
    return tasks.value.filter(t => t.completed).length
})

const getRecordIcon = (type) => {
    const icons = {
        checkin: '📅',
        browse: '👀',
        order: '🛒',
        share: '🔗',
        review: '⭐',
        reward: '🎁',
        spend: '🛍️'
    }
    return icons[type] || '📌'
}

const formatTime = (time) => {
    if (!time) return ''
    const date = new Date(time)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}月${day}日 ${hours}:${minutes}`
}

const initWeekDays = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    weekDays.value.forEach((day, index) => {
        day.isToday = index === todayIndex
    })
}

const loadPointsData = async () => {
    if (!user.value.id) return

    try {
        const res = await axios.get(`/api/points/customer/${user.value.id}`)
        const data = res.data
        totalPoints.value = data.total_points || 0
        checkinDays.value = data.checkin_days || 0
        totalEarned.value = data.total_earned || 0
        totalSpent.value = data.total_spent || 0
        records.value = data.records || []
    } catch (error) {
        console.error('加载积分数据失败:', error)
    }
}

const loadCheckinStatus = async () => {
    try {
        const res = await axios.get('/api/points/checkin/status')
        const data = res.data
        todayChecked.value = data.today_checked || false
        consecutiveDays.value = data.consecutive_days || 0
        if (data.week_checkins) {
            data.week_checkins.forEach((checked, index) => {
                if (index < weekDays.value.length) {
                    weekDays.value[index].checked = checked
                }
            })
        }
    } catch (error) {
        console.error('加载签到状态失败:', error)
    }
}

const doCheckin = async () => {
    if (todayChecked.value) return

    try {
        await axios.post('/api/points/checkin')
        todayChecked.value = true
        totalPoints.value += 10
        checkinDays.value += 1
        consecutiveDays.value += 1

        const now = new Date()
        const dayOfWeek = now.getDay()
        const todayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1
        weekDays.value[todayIndex].checked = true

        records.value.unshift({
            id: Date.now(),
            type: 'checkin',
            description: '每日签到',
            points: 10,
            created_at: new Date().toISOString()
        })

        alert('签到成功！获得 10 积分 🎉')
    } catch (error) {
        console.error('签到失败:', error)
        alert('签到失败，请重试')
    }
}

const loadTasks = async () => {
    try {
        const res = await axios.get('/api/points/tasks')
        const serverTasks = res.data
        if (serverTasks && serverTasks.length > 0) {
            tasks.value = serverTasks
        } else {
            tasks.value = [...defaultTasks]
        }
    } catch (error) {
        tasks.value = [...defaultTasks]
    }

    if (user.value.id) {
        try {
            const res = await axios.get(`/api/points/tasks/customer/${user.value.id}`)
            const completedTasks = res.data || []
            tasks.value.forEach(task => {
                const completed = completedTasks.find(t => t.task_id === task.id || t.type === task.type)
                if (completed) {
                    task.completed = completed.completed || false
                    task.progress = completed.progress || task.target
                }
            })
        } catch (error) {
            console.error('加载任务状态失败:', error)
        }
    }
}

const completeTask = async (task) => {
    if (task.completed) return

    try {
        await axios.post('/api/points/tasks/complete', {
            task_id: task.id,
            task_type: task.type
        })
        task.completed = true
        task.progress = task.target
        totalPoints.value += task.points

        records.value.unshift({
            id: Date.now(),
            type: task.type,
            description: task.name,
            points: task.points,
            created_at: new Date().toISOString()
        })

        alert(`任务完成！获得 ${task.points} 积分 🎉`)
    } catch (error) {
        console.error('完成任务失败:', error)
        alert('操作失败，请重试')
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

    initWeekDays()
    await Promise.all([
        loadPointsData(),
        loadCheckinStatus(),
        loadTasks()
    ])
})
</script>

<style scoped>
.points-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 40px;
}

.page-header {
    background: white;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: relative;
}

.back-btn {
    position: absolute;
    left: 15px;
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
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}

.points-card {
    margin: 20px;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
}

.points-card-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
}

.points-card-content {
    position: relative;
    padding: 30px 25px;
}

.points-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
}

.points-label {
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    margin-bottom: 8px;
}

.points-value {
    font-size: 52px;
    font-weight: 800;
    color: white;
    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
    line-height: 1;
}

.points-card-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.2);
}

.points-info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.info-num {
    font-size: 22px;
    font-weight: 700;
    color: white;
}

.info-label {
    font-size: 12px;
    color: rgba(255,255,255,0.8);
}

.points-divider {
    width: 1px;
    height: 30px;
    background: rgba(255,255,255,0.3);
}

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

.streak-badge {
    font-size: 13px;
    color: #FF6B35;
    font-weight: 600;
    background: #FFF3E8;
    padding: 4px 10px;
    border-radius: 12px;
}

.checkin-calendar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.calendar-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px 6px;
    border-radius: 12px;
    flex: 1;
    transition: all 0.3s ease;
}

.calendar-day.today {
    background: #FFF3E8;
}

.calendar-day.checked {
    background: #E8F8EE;
}

.day-label {
    font-size: 12px;
    color: #999;
}

.day-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.today-dot {
    width: 10px;
    height: 10px;
    background: #FF6B35;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
}

.empty-dot {
    width: 10px;
    height: 10px;
    background: #E0E0E0;
    border-radius: 50%;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
}

.day-points {
    font-size: 11px;
    color: #999;
}

.checkin-reward-tip {
    text-align: center;
    font-size: 13px;
    color: #FF6B35;
    padding: 8px 0;
    margin-bottom: 10px;
    background: #FFF8F0;
    border-radius: 8px;
}

.checkin-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
    transition: all 0.3s ease;
}

.checkin-btn:hover:not(.checked) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.checkin-btn:active:not(.checked) {
    transform: translateY(0);
}

.checkin-btn.checked {
    background: #E8F8EE;
    color: #4CAF50;
    box-shadow: none;
    cursor: not-allowed;
}

.task-progress {
    font-size: 13px;
    color: #999;
    background: #f5f5f5;
    padding: 4px 10px;
    border-radius: 12px;
}

.task-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.task-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: #FAFAFA;
    border-radius: 14px;
    transition: all 0.3s ease;
}

.task-card:hover {
    background: #F5F5F5;
}

.task-card.completed {
    opacity: 0.6;
}

.task-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    flex-shrink: 0;
}

.task-info {
    flex: 1;
    min-width: 0;
}

.task-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
}

.task-name {
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

.task-reward {
    font-size: 13px;
    color: #FF6B35;
    font-weight: 600;
    flex-shrink: 0;
}

.task-desc {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
    display: block;
}

.task-progress-bar {
    width: 100%;
    height: 6px;
    background: #E8E8E8;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 4px;
}

.task-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF6B35, #F7931E);
    border-radius: 3px;
    transition: width 0.6s ease;
    animation: progressGlow 2s infinite;
}

@keyframes progressGlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}

.task-progress-text {
    font-size: 11px;
    color: #bbb;
}

.task-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: white;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.task-btn:hover:not(.done) {
    transform: scale(1.05);
    box-shadow: 0 3px 10px rgba(255, 107, 53, 0.3);
}

.task-btn.done {
    background: #E8F8EE;
    color: #4CAF50;
    cursor: not-allowed;
}

.empty-records {
    text-align: center;
    padding: 30px;
    color: #ccc;
}

.empty-records span {
    font-size: 40px;
}

.empty-records p {
    margin: 10px 0 0;
    font-size: 14px;
}

.records-list {
    display: flex;
    flex-direction: column;
}

.record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #f5f5f5;
    transition: background 0.2s ease;
}

.record-item:last-child {
    border-bottom: none;
}

.record-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.record-type-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
}

.record-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.record-desc {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.record-time {
    font-size: 12px;
    color: #999;
}

.record-points {
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
}

.record-points.positive {
    color: #FF6B35;
}

.record-points.negative {
    color: #999;
}

@media (min-width: 768px) {
    .points-page {
        max-width: 500px;
        margin: 0 auto;
    }
}
</style>
