<template>
    <div class="reviews-page">
        <div class="page-header">
            <div class="back-btn" @click="goBack">
                <span>←</span>
            </div>
            <h1>📝 商品评价</h1>
        </div>

        <div class="reviews-container">
            <div class="rating-summary-card">
                <div class="rating-summary-top">
                    <div class="rating-big-number">
                        <span class="rating-value">{{ averageRating }}</span>
                        <span class="rating-max">/5</span>
                    </div>
                    <div class="rating-stars-display">
                        <span v-for="i in 5" :key="i" class="star-large" :class="{ active: i <= Math.round(parseFloat(averageRating)) }">★</span>
                    </div>
                </div>
                <div class="rating-summary-bottom">
                    <div class="total-reviews-count">
                        <span class="count-number">{{ reviews.length }}</span>
                        <span class="count-label">条评价</span>
                    </div>
                    <div class="rating-bars">
                        <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="rating-bar-row">
                            <span class="bar-label">{{ star }}星</span>
                            <div class="bar-track">
                                <div class="bar-fill" :style="{ width: getStarPercentage(star) + '%' }"></div>
                            </div>
                            <span class="bar-count">{{ getStarCount(star) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tag-filter" v-if="allTags.length > 0">
              <span v-for="tag in allTags" :key="tag" class="tag-chip" :class="{ active: activeTag === tag }" @click="activeTag = activeTag === tag ? '' : tag">
                {{ tag }}
              </span>
            </div>

            <div v-if="loading" class="loading">
                <div class="loading-spinner"></div>
                <p>正在加载评价...</p>
            </div>

            <div v-else-if="reviews.length === 0" class="empty">
                <div class="empty-icon">💬</div>
                <h3>暂无评价</h3>
                <p>快来发表第一条评论吧</p>
            </div>

            <div v-else class="reviews-list">
                <div
                    v-for="review in filteredReviews"
                    :key="review.id"
                    class="review-card"
                >
                    <div class="review-header">
                        <div class="reviewer-info">
                            <div class="reviewer-avatar">
                                <img v-if="review.avatar_url" :src="review.avatar_url" />
                                <span v-else class="avatar-placeholder">{{ (review.customer_name || '匿名')[0] }}</span>
                            </div>
                            <div class="reviewer-meta">
                                <span class="reviewer-name">{{ review.customer_name || '匿名用户' }}</span>
                                <div class="reviewer-stars">
                                    <span v-for="i in 5" :key="i" class="star-small" :class="{ active: i <= review.rating }">★</span>
                                </div>
                            </div>
                        </div>
                        <span class="review-time">{{ formatTime(review.created_at) }}</span>
                    </div>
                    <div class="review-body">
                        <p class="review-text">{{ review.content }}</p>
                    </div>
                    <div v-if="review.images && review.images.length > 0" class="review-images">
                        <img v-for="(img, idx) in review.images" :key="idx" :src="img" @click="openLightbox(review.images, idx)" class="review-img" />
                    </div>
                </div>
            </div>
        </div>

        <div v-if="lightboxVisible" class="lightbox-overlay" @click="closeLightbox">
          <span class="lightbox-close" @click="closeLightbox">✕</span>
          <span class="lightbox-arrow left" @click.stop="prevImage" v-if="lightboxImages.length > 1">‹</span>
          <img :src="lightboxImages[lightboxIndex]" class="lightbox-img" @click.stop />
          <span class="lightbox-arrow right" @click.stop="nextImage" v-if="lightboxImages.length > 1">›</span>
          <div class="lightbox-counter">{{ lightboxIndex + 1 }} / {{ lightboxImages.length }}</div>
        </div>

        <button class="write-review-btn" @click="openWriteModal">
            <span>✍️</span>
            <span>写评价</span>
        </button>

        <div v-if="showModal" class="modal-overlay" @click="closeWriteModal">
            <div class="modal-content" @click.stop>
                <h2>写评价</h2>
                <div class="modal-rating-select">
                    <span class="modal-label">评分：</span>
                    <div class="modal-stars">
                        <span
                            v-for="i in 5"
                            :key="i"
                            class="star-selectable"
                            :class="{ active: i <= newRating }"
                            @click="newRating = i"
                        >★</span>
                    </div>
                </div>
                <div class="modal-form-group">
                    <textarea
                        v-model="newContent"
                        placeholder="分享你的使用体验..."
                        rows="4"
                    ></textarea>
                </div>
                <div class="modal-form-group">
                    <span class="modal-label">添加图片：</span>
                    <div class="image-upload-area">
                        <div
                            v-for="(img, idx) in newImages"
                            :key="idx"
                            class="upload-preview-item"
                        >
                            <img :src="img" />
                            <span class="remove-img-btn" @click="removeNewImage(idx)">×</span>
                        </div>
                        <div class="upload-trigger" @click="addImageUrl">
                            <span>+</span>
                        </div>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn-cancel" @click="closeWriteModal">取消</button>
                    <button class="btn-submit" @click="submitReview" :disabled="newRating === 0 || !newContent.trim()">
                        提交评价
                    </button>
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
const productId = route.params.productId

const reviews = ref([])
const loading = ref(true)
const showModal = ref(false)
const newRating = ref(0)
const newContent = ref('')
const newImages = ref([])
const activeTag = ref('')

const lightboxVisible = ref(false)
const lightboxImages = ref([])
const lightboxIndex = ref(0)

const averageRating = computed(() => {
    if (reviews.value.length === 0) return '0.0'
    const sum = reviews.value.reduce((acc, r) => acc + r.rating, 0)
    return (sum / reviews.value.length).toFixed(1)
})

const getStarCount = (star) => {
    return reviews.value.filter(r => r.rating === star).length
}

const getStarPercentage = (star) => {
    if (reviews.value.length === 0) return 0
    return (getStarCount(star) / reviews.value.length) * 100
}

const allTags = computed(() => {
    const tagSet = new Set()
    reviews.value.forEach(r => {
        if (r.content) {
            const tags = ['好吃', '分量足', '包装好', '配送快', '性价比高', '新鲜', '推荐', '还会再来']
            tags.forEach(t => { if (r.content.includes(t)) tagSet.add(t) })
        }
    })
    return Array.from(tagSet).slice(0, 8)
})

const filteredReviews = computed(() => {
    let result = reviews.value
    if (activeTag.value) {
        result = result.filter(r => r.content && r.content.includes(activeTag.value))
    }
    return result
})

const formatTime = (time) => {
    if (!time) return ''
    const date = new Date(time)
    return date.toLocaleString('zh-CN')
}

const goBack = () => {
    window.history.back()
}

const openWriteModal = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) {
        alert('请先登录')
        return
    }
    showModal.value = true
}

const closeWriteModal = () => {
    showModal.value = false
    newRating.value = 0
    newContent.value = ''
    newImages.value = []
}

const addImageUrl = () => {
    const url = prompt('请输入图片URL：')
    if (url && url.trim()) {
        newImages.value.push(url.trim())
    }
}

const removeNewImage = (idx) => {
    newImages.value.splice(idx, 1)
}

const openLightbox = (images, idx) => {
    lightboxImages.value = images
    lightboxIndex.value = idx
    lightboxVisible.value = true
}
const closeLightbox = () => { lightboxVisible.value = false }
const prevImage = () => { lightboxIndex.value = lightboxIndex.value > 0 ? lightboxIndex.value - 1 : lightboxImages.value.length - 1 }
const nextImage = () => { lightboxIndex.value = lightboxIndex.value < lightboxImages.value.length - 1 ? lightboxIndex.value + 1 : 0 }

const submitReview = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (!user) {
        alert('请先登录')
        return
    }
    if (newRating.value === 0) {
        alert('请选择评分')
        return
    }
    if (!newContent.value.trim()) {
        alert('请输入评价内容')
        return
    }

    try {
        await axios.post('/api/reviews', {
            customer_id: user.id,
            product_id: parseInt(productId),
            rating: newRating.value,
            content: newContent.value.trim(),
            images: newImages.value
        })
        alert('评价提交成功！')
        closeWriteModal()
        loadReviews()
    } catch (error) {
        console.error('提交评价失败:', error)
        alert('提交失败，请重试')
    }
}

const loadReviews = async () => {
    try {
        const response = await axios.get(`/api/reviews/product/${productId}`)
        reviews.value = response.data
    } catch (error) {
        console.error('加载评价失败:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadReviews()
})
</script>

<style scoped>
.reviews-page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 120px;
}

.page-header {
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    padding: 24px 20px;
    text-align: center;
    color: white;
    position: relative;
    border-radius: 0 0 24px 24px;
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
}

.back-btn {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 38px;
    height: 38px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: translateY(-50%) scale(1.1);
}

.back-btn span {
    color: white;
    font-size: 20px;
    font-weight: bold;
}

.page-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: white;
}

.reviews-container {
    padding: 16px;
    max-width: 800px;
    margin: 0 auto;
}

.rating-summary-card {
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    border-radius: 20px;
    padding: 24px;
    color: white;
    margin-bottom: 20px;
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.35);
    animation: fadeInUp 0.5s ease both;
}

.rating-summary-top {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.rating-big-number {
    display: flex;
    align-items: baseline;
}

.rating-value {
    font-size: 48px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -1px;
}

.rating-max {
    font-size: 18px;
    opacity: 0.7;
    margin-left: 2px;
}

.rating-stars-display {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.star-large {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.35);
    transition: color 0.2s;
}

.star-large.active {
    color: #FFD700;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}

.rating-summary-bottom {
    display: flex;
    gap: 24px;
    align-items: center;
}

.total-reviews-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 80px;
}

.count-number {
    font-size: 28px;
    font-weight: 700;
}

.count-label {
    font-size: 13px;
    opacity: 0.85;
}

.rating-bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.rating-bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bar-label {
    font-size: 12px;
    min-width: 30px;
    text-align: right;
    opacity: 0.9;
}

.bar-track {
    flex: 1;
    height: 8px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #FFD700, #FFA500);
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.bar-count {
    font-size: 12px;
    min-width: 20px;
    opacity: 0.85;
}

.tag-filter { display: flex; gap: 8px; padding: 0 20px 16px; flex-wrap: wrap; }
.tag-chip {
  padding: 6px 14px; border-radius: 20px;
  background: #f0f0f0; font-size: 13px; color: #666;
  cursor: pointer; transition: all 0.2s;
}
.tag-chip.active { background: linear-gradient(135deg, #FF4757, #FF6B81); color: white; }
.tag-chip:hover:not(.active) { background: #e8e8e8; }

.lightbox-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9); z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column;
}
.lightbox-close {
  position: absolute; top: 20px; right: 20px;
  color: white; font-size: 28px; cursor: pointer;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.15); border-radius: 50%;
}
.lightbox-img { max-width: 90vw; max-height: 80vh; border-radius: 8px; object-fit: contain; }
.lightbox-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  color: white; font-size: 48px; cursor: pointer;
  padding: 20px; user-select: none;
}
.lightbox-arrow.left { left: 10px; }
.lightbox-arrow.right { right: 10px; }
.lightbox-arrow:hover { opacity: 0.7; }
.lightbox-counter { color: white; margin-top: 16px; font-size: 14px; }

.loading {
    text-align: center;
    padding: 60px 20px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f0f0f0;
    border-top-color: #FF6B35;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.empty {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.empty h3 {
    margin: 0 0 8px;
    color: #333;
}

.empty p {
    margin: 0;
    color: #999;
}

.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.review-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: fadeInUp 0.5s ease both;
}

.review-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
}

.reviewer-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: linear-gradient(135deg, #FF6B35, #F7931E);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
}

.reviewer-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.avatar-placeholder {
    color: white;
    font-size: 16px;
    font-weight: 700;
}

.reviewer-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.reviewer-name {
    font-size: 15px;
    font-weight: 600;
    color: #333;
}

.reviewer-stars {
    display: flex;
    gap: 2px;
}

.star-small {
    font-size: 14px;
    color: #e0e0e0;
    transition: color 0.2s;
}

.star-small.active {
    color: #FFD700;
}

.review-time {
    font-size: 12px;
    color: #aaa;
    white-space: nowrap;
    margin-top: 2px;
}

.review-body {
    margin-bottom: 14px;
}

.review-text {
    margin: 0;
    font-size: 14px;
    color: #444;
    line-height: 1.6;
}

.review-images {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
}

.review-images::-webkit-scrollbar {
    display: none;
}

.review-img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    flex-shrink: 0;
}

.review-img:hover {
    transform: scale(1.1);
}

.review-image-item {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.review-image-item:hover {
    transform: scale(1.1);
}

.review-image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.write-review-btn {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 36px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(255, 107, 53, 0.45);
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 100;
}

.write-review-btn:hover {
    transform: translateX(-50%) translateY(-3px);
    box-shadow: 0 12px 36px rgba(255, 107, 53, 0.55);
}

.write-review-btn:active {
    transform: translateX(-50%) scale(0.95);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.25s ease;
}

.modal-content {
    background: white;
    border-radius: 20px;
    padding: 28px;
    max-width: 440px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.modal-content h2 {
    font-size: 20px;
    margin: 0 0 24px;
    text-align: center;
    font-weight: 700;
    color: #333;
}

.modal-rating-select {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}

.modal-label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.modal-stars {
    display: flex;
    gap: 6px;
}

.star-selectable {
    font-size: 32px;
    color: #e0e0e0;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.star-selectable.active {
    color: #FFD700;
    transform: scale(1.1);
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

.star-selectable:hover {
    color: #FFD700;
    transform: scale(1.2);
    text-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
}

.modal-form-group {
    margin-bottom: 20px;
}

.modal-form-group textarea {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #eee;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    font-family: inherit;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
    background: #fafafa;
}

.modal-form-group textarea:focus {
    outline: none;
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.12);
    background: white;
}

.image-upload-area {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.upload-preview-item {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
}

.upload-preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-img-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 22px;
    height: 22px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    cursor: pointer;
    line-height: 1;
    transition: background 0.2s;
}

.remove-img-btn:hover {
    background: rgba(255, 59, 48, 0.85);
}

.upload-trigger {
    width: 80px;
    height: 80px;
    border: 2px dashed #d0d0d0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 28px;
    color: #bbb;
    background: #fafafa;
}

.upload-trigger:hover {
    border-color: #FF6B35;
    color: #FF6B35;
    background: #fff5f0;
}

.modal-buttons {
    display: flex;
    gap: 14px;
    margin-top: 24px;
}

.btn-cancel {
    flex: 1;
    padding: 13px;
    border: 1.5px solid #e0e0e0;
    border-radius: 25px;
    background: white;
    color: #666;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.btn-cancel:hover {
    background: #f5f5f5;
    border-color: #ccc;
}

.btn-submit {
    flex: 1;
    padding: 13px;
    border: none;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: white;
    border-radius: 25px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.btn-submit:hover {
    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.45);
    transform: translateY(-1px);
}

.btn-submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

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

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.96);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media (max-width: 768px) {
    .reviews-container {
        padding: 12px;
    }

    .rating-summary-card {
        border-radius: 16px;
        padding: 20px;
    }

    .rating-summary-bottom {
        flex-direction: column;
        gap: 16px;
    }

    .rating-bars {
        width: 100%;
    }

    .review-card {
        padding: 16px;
    }

    .page-header {
        border-radius: 0 0 20px 20px;
    }

    .write-review-btn {
        bottom: 24px;
        padding: 12px 28px;
        font-size: 15px;
    }
}
</style>
