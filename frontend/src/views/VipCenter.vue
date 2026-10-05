<template>
    <div class="vip-center-page">
        <div class="page-header">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <h1>👑 会员中心</h1>
        </div>

        <div class="vip-card">
            <div class="vip-card-bg"></div>
            <div class="vip-card-content">
                <div class="vip-card-top">
                    <div class="vip-user-info">
                        <div class="vip-avatar">
                            <img v-if="user.avatar" :src="user.avatar" alt="avatar" />
                            <span v-else>{{ (user.username || '?')[0] }}</span>
                        </div>
                        <div class="vip-user-detail">
                            <span class="vip-username">{{ user.username || '用户' }}</span>
                            <span class="vip-level-tag" :class="vipLevelInfo.class">{{ vipLevelInfo.name }}</span>
                        </div>
                    </div>
                    <div class="vip-points-area">
                        <span class="vip-points-label">积分</span>
                        <span class="vip-points-value">{{ userPoints }}</span>
                        <button class="upgrade-btn" @click="showUpgradeModal = true">升级VIP</button>
                    </div>
                </div>
                <div class="vip-progress-area">
                    <div class="vip-progress-text">
                        距离{{ nextLevelInfo.name }}还需消费 <span class="highlight">{{ amountToNextLevel }}元</span>
                    </div>
                    <div class="vip-progress-bar">
                        <div class="vip-progress-fill" :style="{ width: progressPercent + '%' }"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h3>🎉 VIP特权</h3>
            </div>
            <div class="privilege-grid">
                <div
                    v-for="priv in privileges"
                    :key="priv.name"
                    class="privilege-card"
                >
                    <div class="privilege-icon">{{ priv.icon }}</div>
                    <div class="privilege-name">{{ priv.name }}</div>
                    <div class="privilege-desc">{{ priv.desc }}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="section-header">
                <h3>🏅 等级说明</h3>
            </div>
            <div class="level-list">
                <div
                    v-for="level in levels"
                    :key="level.name"
                    class="level-item"
                    :class="{ active: level.name === vipLevelInfo.name }"
                >
                    <div class="level-dot" :style="{ background: level.color }"></div>
                    <div class="level-info">
                        <div class="level-name">{{ level.name }}</div>
                        <div class="level-condition">累计消费{{ level.threshold }}元</div>
                    </div>
                    <div class="level-privileges">
                        <span class="priv-count">{{ level.privCount }}项特权</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="action-section">
            <button class="vip-open-btn" @click="showUpgradeModal = true">
                <span class="btn-icon">👑</span>
                <span class="btn-text">开通VIP ¥99/年</span>
            </button>
            <button class="vip-renew-btn" @click="showUpgradeModal = true">
                立即续费
            </button>
            <p class="action-disclaimer">* 会员权益以实际为准</p>
        </div>

        <div class="modal-overlay" v-if="showUpgradeModal" @click.self="showUpgradeModal = false">
            <div class="modal-card">
                <div class="modal-header">
                    <h3>👑 开通VIP会员</h3>
                    <div class="modal-close" @click="showUpgradeModal = false">✕</div>
                </div>
                <div class="modal-body">
                    <div class="modal-vip-icon">👑</div>
                    <div class="modal-price">
                        <span class="price-symbol">¥</span>
                        <span class="price-amount">99</span>
                        <span class="price-unit">/年</span>
                    </div>
                    <div class="modal-benefits">
                        <div class="benefit-item" v-for="b in modalBenefits" :key="b">✅ {{ b }}</div>
                    </div>
                    <button class="modal-confirm-btn" @click="handleUpgrade">立即开通</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const user = ref({})
const userPoints = ref(0)
const totalSpent = ref(0)
const showUpgradeModal = ref(false)

const privileges = [
    { icon: '🚀', name: '极速配送', desc: 'VIP免配送费' },
    { icon: '💰', name: '专属折扣', desc: '全场95折' },
    { icon: '🎁', name: '每日红包', desc: '每天签到双倍积分' },
    { icon: '📦', name: '优先发货', desc: '订单优先处理' },
    { icon: '🎫', name: '专属优惠券', desc: '每月发放优惠券' },
    { icon: '⭐', name: '专属客服', desc: '1对1客服服务' }
]

const levels = [
    { name: '普通会员', threshold: 0, color: '#9E9E9E', privCount: 2 },
    { name: '银卡会员', threshold: 500, color: '#B0BEC5', privCount: 4 },
    { name: '金卡会员', threshold: 2000, color: '#FFD700', privCount: 6 },
    { name: '钻石会员', threshold: 5000, color: '#9C27B0', privCount: 8 }
]

const modalBenefits = [
    '全场免配送费',
    '全场商品95折',
    '每日签到双倍积分',
    '每月专属优惠券礼包',
    '优先发货特权',
    '1对1专属客服'
]

const getVipLevel = (spent) => {
    if (spent >= 5000) return 3
    if (spent >= 2000) return 2
    if (spent >= 500) return 1
    return 0
}

const vipLevelIndex = computed(() => getVipLevel(totalSpent.value))

const vipLevelInfo = computed(() => levels[vipLevelIndex.value])

const nextLevelInfo = computed(() => {
    if (vipLevelIndex.value >= levels.length - 1) {
        return levels[levels.length - 1]
    }
    return levels[vipLevelIndex.value + 1]
})

const amountToNextLevel = computed(() => {
    if (vipLevelIndex.value >= levels.length - 1) return 0
    const diff = nextLevelInfo.value.threshold - totalSpent.value
    return diff > 0 ? diff : 0
})

const progressPercent = computed(() => {
    if (vipLevelIndex.value >= levels.length - 1) return 100
    const current = totalSpent.value
    const base = levels[vipLevelIndex.value].threshold
    const target = nextLevelInfo.value.threshold
    if (target === base) return 100
    const percent = ((current - base) / (target - base)) * 100
    return Math.min(Math.max(percent, 0), 100)
})

const goBack = () => {
    window.history.back()
}

const loadData = async () => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
        window.location.href = '/login'
        return
    }
    user.value = JSON.parse(storedUser)

    try {
        const res = await axios.get(`/api/points/customer/${user.value.id}`)
        const data = res.data
        userPoints.value = data.total_points || 0
        totalSpent.value = data.total_spent || 0
    } catch (error) {
        console.error('加载会员数据失败:', error)
    }
}

const handleUpgrade = async () => {
    try {
        await axios.post('/api/vip/upgrade', {
            customer_id: user.value.id
        })
        alert('VIP开通成功！🎉')
        showUpgradeModal.value = false
        loadData()
    } catch (error) {
        console.error('开通VIP失败:', error)
        alert('开通失败，请重试')
    }
}

onMounted(() => {
    loadData()
})
</script>

<style scoped>
.vip-center-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 40px;
}

.page-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 20px;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-btn {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-50%) scale(1.1);
}

.back-btn span {
    color: #ffd700;
    font-size: 18px;
    font-weight: bold;
}

.page-header h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #ffd700;
}

.vip-card {
    margin: 20px;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 8px 40px rgba(26, 26, 46, 0.3);
}

.vip-card-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    z-index: 0;
}

.vip-card-bg::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -30%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
    border-radius: 50%;
}

.vip-card-content {
    position: relative;
    z-index: 1;
    padding: 28px 24px;
}

.vip-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
}

.vip-user-info {
    display: flex;
    align-items: center;
    gap: 14px;
}

.vip-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a2e;
    border: 3px solid rgba(255, 215, 0, 0.5);
    overflow: hidden;
    flex-shrink: 0;
}

.vip-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.vip-user-detail {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.vip-username {
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
}

.vip-level-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    width: fit-content;
}

.vip-level-tag.vip-normal {
    background: rgba(158, 158, 158, 0.3);
    color: #bdbdbd;
}

.vip-level-tag.vip-silver {
    background: rgba(176, 190, 197, 0.3);
    color: #e0e0e0;
}

.vip-level-tag.vip-gold {
    background: rgba(255, 215, 0, 0.25);
    color: #ffd700;
}

.vip-level-tag.vip-diamond {
    background: rgba(156, 39, 176, 0.3);
    color: #ce93d8;
}

.vip-points-area {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

.vip-points-label {
    color: rgba(255, 255, 255, 0.6);
    font-size: 13px;
}

.vip-points-value {
    color: #ffd700;
    font-size: 28px;
    font-weight: 800;
}

.upgrade-btn {
    padding: 6px 18px;
    background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    color: #1a1a2e;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.upgrade-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}

.vip-progress-area {
    width: 100%;
}

.vip-progress-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    margin-bottom: 10px;
}

.vip-progress-text .highlight {
    color: #ffd700;
    font-weight: 700;
}

.vip-progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    overflow: hidden;
}

.vip-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ffd700 0%, #ffa500 100%);
    border-radius: 4px;
    transition: width 0.6s ease;
}

.section {
    margin: 20px;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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

.privilege-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.privilege-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px 12px;
    background: #f8f9fa;
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: default;
}

.privilege-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    background: white;
}

.privilege-icon {
    font-size: 32px;
    line-height: 1;
}

.privilege-name {
    font-size: 14px;
    font-weight: 700;
    color: #333;
}

.privilege-desc {
    font-size: 12px;
    color: #999;
    text-align: center;
}

.level-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.level-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.level-item.active {
    background: linear-gradient(135deg, #fff8e1 0%, #fff3c4 100%);
    box-shadow: 0 2px 12px rgba(255, 215, 0, 0.15);
}

.level-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.level-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.level-name {
    font-size: 15px;
    font-weight: 700;
    color: #333;
}

.level-condition {
    font-size: 12px;
    color: #999;
}

.level-privileges {
    flex-shrink: 0;
}

.priv-count {
    font-size: 12px;
    color: #ff6b6b;
    font-weight: 600;
    background: rgba(255, 107, 107, 0.08);
    padding: 4px 10px;
    border-radius: 10px;
}

.action-section {
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.vip-open-btn {
    width: 100%;
    max-width: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px 32px;
    background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    color: #1a1a2e;
    border: none;
    border-radius: 30px;
    font-size: 18px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 30px rgba(255, 215, 0, 0.4);
}

.vip-open-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(255, 215, 0, 0.6);
}

.vip-open-btn:active {
    transform: translateY(-1px);
}

.btn-icon {
    font-size: 22px;
}

.vip-renew-btn {
    width: 100%;
    max-width: 400px;
    padding: 14px 32px;
    background: white;
    color: #1a1a2e;
    border: 2px solid #ffd700;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.vip-renew-btn:hover {
    background: #fff8e1;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
}

.action-disclaimer {
    font-size: 12px;
    color: #999;
    margin: 4px 0 0;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 20px;
    backdrop-filter: blur(4px);
}

.modal-card {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 380px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f5f5f5;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #e0e0e0;
}

.modal-body {
    padding: 30px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.modal-vip-icon {
    font-size: 60px;
    line-height: 1;
}

.modal-price {
    display: flex;
    align-items: baseline;
    gap: 2px;
}

.price-symbol {
    font-size: 20px;
    color: #ffa500;
    font-weight: 700;
}

.price-amount {
    font-size: 48px;
    font-weight: 900;
    color: #1a1a2e;
    line-height: 1;
}

.price-unit {
    font-size: 16px;
    color: #999;
}

.modal-benefits {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.benefit-item {
    font-size: 14px;
    color: #555;
    padding: 8px 16px;
    background: #f8f9fa;
    border-radius: 10px;
}

.modal-confirm-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
    color: #1a1a2e;
    border: none;
    border-radius: 30px;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
    margin-top: 10px;
}

.modal-confirm-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(255, 215, 0, 0.6);
}

@media (max-width: 480px) {
    .privilege-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .privilege-card {
        padding: 16px 10px;
    }

    .privilege-icon {
        font-size: 28px;
    }

    .vip-card-top {
        flex-direction: column;
        gap: 16px;
    }

    .vip-points-area {
        flex-direction: row;
        align-items: center;
        gap: 12px;
    }

    .vip-points-value {
        font-size: 22px;
    }

    .vip-open-btn {
        font-size: 16px;
        padding: 16px 24px;
    }
}
</style>
