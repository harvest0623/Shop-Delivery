<template>
    <div class="recommendations-page">
        <div class="top-nav">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <h1 class="nav-title">🤖 AI今日推荐</h1>
            <div class="refresh-btn" @click="loadRecommendations(true)">
                <span>🔄</span>
            </div>
        </div>

        <div class="reason-banner">
            <div class="reason-icon">✨</div>
            <div class="reason-text">
                <h3>{{ reason || '智能推荐' }}</h3>
                <p>根据您的浏览偏好和当前时间段为您智能推荐</p>
            </div>
        </div>

        <div class="content-area">
            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>AI正在为您挑选美食...</p>
            </div>

            <div v-else-if="displayList.length === 0" class="empty-state">
                <div class="empty-icon">🤖</div>
                <h2>暂无推荐</h2>
                <p>多浏览商品后会为您个性化推荐</p>
            </div>

            <template v-else>
                <div class="products-grid">
                    <div
                        v-for="item in displayList"
                        :key="item.id"
                        class="product-card"
                        @click="goToProduct(item)"
                    >
                        <div class="card-image-wrapper">
                            <img
                                :src="getProductImage(item)"
                                :alt="item.name"
                                class="card-image"
                                @error="onImgError($event, item)"
                            />
                            <div class="card-price-badge">¥{{ formatPrice(item.price) }}</div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-name">{{ item.name }}</h3>
                            <p class="card-shop">🏪 {{ item.shop_name || '美食商家' }}</p>
                            <div class="card-tag" :class="getTagClass(item)">
                                {{ getTagText(item) }}
                            </div>
                            <div class="card-actions">
                                <button
                                    class="action-btn like-btn"
                                    :class="{ active: feedbackMap[item.id] === 'like' }"
                                    @click.stop="sendFeedback(item.id, 'like')"
                                >
                                    👍 喜欢
                                </button>
                                <button
                                    class="action-btn dislike-btn"
                                    :class="{ active: feedbackMap[item.id] === 'dislike' }"
                                    @click.stop="sendFeedback(item.id, 'dislike')"
                                >
                                    👎 不喜欢
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="refresh-area">
                    <button class="refresh-more-btn" @click="shuffleDisplay">
                        🔄 换一批推荐
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(true)
const allRecommendations = ref([])
const displayList = ref([])
const feedbackMap = ref({})
const reason = ref('')

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop',
]

const getUser = () => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
}

const formatPrice = (price) => {
    const p = Number(price)
    return isNaN(p) ? '0.00' : p.toFixed(2)
}

const getProductImage = (item) => {
    if (item.image_url && item.image_url !== 'null' && item.image_url !== 'undefined') {
        return item.image_url
    }
    const idx = (item.id || 0) % FALLBACK_IMAGES.length
    return FALLBACK_IMAGES[idx]
}

const onImgError = (event, item) => {
    const idx = (item.id || 0) % FALLBACK_IMAGES.length
    event.target.src = FALLBACK_IMAGES[idx]
    event.target.onerror = null
}

const getTagClass = (item) => {
    const desc = ((item.description || '') + (item.name || '')).toLowerCase()
    if (/辣|麻|川/.test(desc)) return 'tag-hot'
    if (/甜|奶茶|蛋糕|饮/.test(desc)) return 'tag-new'
    if (/沙拉|轻食|健康/.test(desc)) return 'tag-like'
    if (/套餐|特价/.test(desc)) return 'tag-deal'
    return 'tag-default'
}

const getTagText = (item) => {
    const desc = ((item.description || '') + (item.name || '')).toLowerCase()
    if (/辣|麻|川/.test(desc)) return '🌶️ 辣味推荐'
    if (/甜|奶茶|蛋糕|饮/.test(desc)) return '🧋 甜蜜推荐'
    if (/沙拉|轻食|健康/.test(desc)) return '🥗 健康推荐'
    if (/套餐|特价/.test(desc)) return '🔥 超值推荐'
    return '✨ 为您推荐'
}

const loadRecommendations = async (forceRefresh = false) => {
    const user = getUser()
    if (!user) {
        loading.value = false
        return
    }

    loading.value = true
    try {
        const response = await axios.get(`/api/recommendations/${user.id}`)
        const data = response.data
        allRecommendations.value = data.recommendations || []
        reason.value = data.reason || '智能推荐'
        feedbackMap.value = {}
        shuffleDisplay()
    } catch (error) {
        console.error('加载推荐失败:', error)
        allRecommendations.value = []
        displayList.value = []
    } finally {
        loading.value = false
    }
}

const shuffleDisplay = () => {
    const shuffled = [...allRecommendations.value].sort(() => Math.random() - 0.5)
    displayList.value = shuffled.slice(0, Math.min(6, shuffled.length))
    if (displayList.value.length === 0 && allRecommendations.value.length > 0) {
        displayList.value = allRecommendations.value.slice(0, 6)
    }
}

const goToProduct = (item) => {
    if (item.shop_id) {
        window.location.href = `/shop/${item.shop_id}`
    } else {
        window.location.href = '/products'
    }
}

const sendFeedback = async (productId, feedbackType) => {
    const user = getUser()
    if (!user) return
    try {
        await axios.post('/api/recommendations/feedback', {
            customer_id: user.id,
            product_id: productId,
            feedback_type: feedbackType
        })
        feedbackMap.value[productId] = feedbackType
    } catch (error) {
        console.error('反馈失败:', error)
    }
}

const goBack = () => {
    window.history.back()
}

onMounted(() => {
    const user = getUser()
    if (!user) {
        alert('请先登录')
        window.location.href = '/login'
        return
    }
    loadRecommendations()
})
</script>

<style scoped>
.recommendations-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 30%, #f5f7fa 60%);
    padding-bottom: 40px;
}

.top-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 15px 15px;
    position: relative;
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
    backdrop-filter: blur(10px);
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1);
}

.back-btn span {
    color: white;
    font-size: 18px;
    font-weight: bold;
}

.nav-title {
    margin: 0;
    font-size: 22px;
    color: white;
    font-weight: 700;
}

.refresh-btn {
    position: absolute;
    right: 15px;
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
    backdrop-filter: blur(10px);
}

.refresh-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%) scale(1.1) rotate(180deg);
}

.refresh-btn span {
    font-size: 18px;
}

.reason-banner {
    margin: 10px 20px 20px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35);
}

.reason-icon {
    font-size: 36px;
    flex-shrink: 0;
}

.reason-text h3 {
    margin: 0 0 6px;
    color: white;
    font-size: 17px;
    font-weight: 700;
}

.reason-text p {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    line-height: 1.5;
}

.content-area {
    padding: 0 15px;
    max-width: 800px;
    margin: 0 auto;
}

.loading {
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(102, 126, 234, 0.2);
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading p {
    color: #888;
    font-size: 14px;
}

.empty-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.empty-icon {
    font-size: 72px;
    margin-bottom: 20px;
}

.empty-state h2 {
    margin: 0 0 10px;
    font-size: 22px;
    color: #333;
}

.empty-state p {
    margin: 0;
    color: #999;
    font-size: 15px;
}

.products-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
}

.product-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.card-image-wrapper {
    width: 100%;
    height: 180px;
    overflow: hidden;
    position: relative;
}

.card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.product-card:hover .card-image {
    transform: scale(1.06);
}

.card-price-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: linear-gradient(135deg, #FF4757, #FF6B81);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 700;
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
}

.card-body {
    padding: 16px;
}

.card-name {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 700;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-shop {
    margin: 0 0 10px;
    font-size: 13px;
    color: #999;
}

.card-tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 14px;
}

.tag-like {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

.tag-hot {
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
}

.tag-meal {
    background: rgba(255, 165, 2, 0.1);
    color: #ff9502;
}

.tag-new {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
}

.tag-deal {
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
}

.tag-default {
    background: rgba(153, 153, 153, 0.1);
    color: #999;
}

.card-actions {
    display: flex;
    gap: 10px;
}

.action-btn {
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.like-btn {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
}

.like-btn:hover,
.like-btn.active {
    background: linear-gradient(135deg, #2ed573 0%, #17b960 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(46, 213, 115, 0.35);
    transform: translateY(-2px);
}

.dislike-btn {
    background: rgba(153, 153, 153, 0.1);
    color: #999;
}

.dislike-btn:hover,
.dislike-btn.active {
    background: linear-gradient(135deg, #999 0%, #777 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(153, 153, 153, 0.35);
    transform: translateY(-2px);
}

.refresh-area {
    text-align: center;
    margin-top: 24px;
}

.refresh-more-btn {
    padding: 14px 40px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35);
}

.refresh-more-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.45);
    filter: brightness(1.08);
}

.refresh-more-btn:active {
    transform: translateY(-1px);
}

@media (min-width: 640px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .card-image-wrapper {
        height: 200px;
    }
}
</style>
