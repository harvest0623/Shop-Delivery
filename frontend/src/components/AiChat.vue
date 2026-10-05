<template>
  <div class="ai-chat-wrapper" v-if="enabled">
    <Transition name="chat-pop">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="header-left">
            <div class="ai-avatar">🤖</div>
            <div class="header-info">
              <span class="header-title">AI美食助手</span>
              <span class="header-status">在线</span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" @click="clearChat" title="清空对话">🗑️</button>
            <button class="header-btn" @click="isOpen = false" title="最小化">✕</button>
          </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-if="messages.length === 0" class="welcome-panel">
            <div class="welcome-emoji">🤖</div>
            <h3>你好！我是AI美食助手</h3>
            <p>我可以帮你推荐美食、解答营养问题、查询订单</p>
            <div class="quick-actions">
              <button v-for="action in quickActions" :key="action" class="quick-btn" @click="sendQuickMessage(action)">
                {{ action }}
              </button>
            </div>
          </div>

          <div v-for="(msg, idx) in messages" :key="idx" class="message" :class="msg.role">
            <div class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</div>
            <div class="msg-content">
              <div class="msg-text" v-html="formatMessage(msg.content)"></div>
              <div v-if="msg.products && msg.products.length > 0" class="msg-products">
                <div v-for="p in msg.products" :key="p.id" class="product-mini-card" @click="goToProduct(p)">
                  <img :src="p.image_url || 'https://via.placeholder.com/60'" />
                  <span class="pmc-name">{{ p.name }}</span>
                  <span class="pmc-price">¥{{ Number(p.price).toFixed(2) }}</span>
                </div>
              </div>
              <div v-if="msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1" class="msg-suggestions">
                <button v-for="s in msg.suggestions" :key="s" class="suggestion-btn" @click="sendMessage(s)">
                  {{ s }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="message assistant">
            <div class="msg-avatar">🤖</div>
            <div class="msg-content">
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <input
            v-model="inputMessage"
            @keyup.enter="sendMessage()"
            placeholder="问我任何美食问题..."
            class="chat-input"
            :disabled="isLoading"
          />
          <button class="send-btn" @click="sendMessage()" :disabled="!inputMessage.trim() || isLoading">
            <span v-if="isLoading">⏳</span>
            <span v-else>➤</span>
          </button>
        </div>
      </div>
    </Transition>

    <button class="ai-fab" @click="toggleChat" :class="{ active: isOpen }">
      <span class="fab-icon" :class="{ rotate: isOpen }">{{ isOpen ? '✕' : '🤖' }}</span>
      <span v-if="unreadCount > 0 && !isOpen" class="fab-badge">{{ unreadCount }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import axios from 'axios'

const enabled = ref(true)
const isOpen = ref(false)
const messages = ref([])
const inputMessage = ref('')
const isLoading = ref(false)
const unreadCount = ref(0)
const messagesContainer = ref(null)

const quickActions = ['今天吃什么', '推荐辣的', '营养知识', '减肥适合吃什么', '查看订单']

const customerId = (() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.id || 'anonymous'
  } catch { return 'anonymous' }
})()

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) unreadCount.value = 0
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async (text) => {
  const msg = text || inputMessage.value.trim()
  if (!msg) return

  messages.value.push({ role: 'user', content: msg })
  inputMessage.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const res = await axios.post('/api/ai/chat', {
      customer_id: customerId,
      message: msg
    })
    messages.value.push({
      role: 'assistant',
      content: res.data.text,
      products: res.data.products || [],
      suggestions: res.data.suggestions || []
    })
    if (!isOpen.value) unreadCount.value++
  } catch (e) {
    messages.value.push({
      role: 'assistant',
      content: '😅 抱歉，我暂时无法回应，请稍后再试～',
      suggestions: ['重试']
    })
  }

  isLoading.value = false
  scrollToBottom()
}

const sendQuickMessage = (msg) => { sendMessage(msg) }

const clearChat = async () => {
  messages.value = []
  try {
    await axios.post('/api/ai/clear-history', { customer_id: customerId })
  } catch (e) {}
}

const formatMessage = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '&bull; ')
}

const goToProduct = (p) => {
  if (p.shop_name) {
    window.location.href = '/shops'
  }
}

onMounted(() => {
  if (isOpen.value) scrollToBottom()
})
</script>

<style scoped>
.ai-chat-wrapper { position: fixed; bottom: 90px; right: 20px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }

.ai-fab {
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s; position: relative;
}
.ai-fab:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(102, 126, 234, 0.6); }
.ai-fab.active { background: linear-gradient(135deg, #e74c3c, #c0392b); }
.fab-icon { font-size: 24px; transition: transform 0.3s; }
.fab-icon.rotate { transform: rotate(90deg); }
.fab-badge {
  position: absolute; top: -4px; right: -4px;
  width: 20px; height: 20px; border-radius: 50%;
  background: #FF4757; color: white; font-size: 11px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; border: 2px solid white;
}

.chat-window {
  position: absolute; bottom: 70px; right: 0;
  width: 380px; height: 520px;
  background: white; border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  display: flex; flex-direction: column; overflow: hidden;
  border: 1px solid #e8e8e8;
}

.chat-header {
  padding: 14px 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white; display: flex; justify-content: space-between; align-items: center;
}
.header-left { display: flex; align-items: center; gap: 10px; }
.ai-avatar { font-size: 28px; }
.header-info { display: flex; flex-direction: column; }
.header-title { font-weight: 600; font-size: 15px; }
.header-status { font-size: 11px; opacity: 0.8; }
.header-actions { display: flex; gap: 4px; }
.header-btn {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(255,255,255,0.15); border: none;
  color: white; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
}
.header-btn:hover { background: rgba(255,255,255,0.3); }

.chat-messages {
  flex: 1; overflow-y: auto; padding: 16px;
  background: #f8f9fa;
}

.welcome-panel {
  text-align: center; padding: 30px 20px;
}
.welcome-emoji { font-size: 48px; margin-bottom: 12px; }
.welcome-panel h3 { font-size: 18px; margin: 0 0 8px; color: #333; }
.welcome-panel p { font-size: 13px; color: #999; margin: 0 0 16px; }
.quick-actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.quick-btn {
  padding: 8px 14px; border-radius: 20px;
  background: white; border: 1px solid #e0e0e0;
  font-size: 12px; color: #666; cursor: pointer;
  transition: all 0.2s;
}
.quick-btn:hover { border-color: #667eea; color: #667eea; background: #f0f3ff; }

.message {
  display: flex; gap: 8px; margin-bottom: 12px;
  animation: msgIn 0.3s ease;
}
@keyframes msgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.message.user { flex-direction: row-reverse; }
.msg-avatar { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
.msg-content { max-width: 80%; }
.msg-text {
  padding: 10px 14px; border-radius: 14px;
  font-size: 13px; line-height: 1.6; word-break: break-word;
}
.assistant .msg-text { background: white; color: #333; border-bottom-left-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.user .msg-text { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-bottom-right-radius: 4px; }

.msg-products {
  display: flex; gap: 8px; margin-top: 8px; overflow-x: auto; padding-bottom: 4px;
}
.product-mini-card {
  flex-shrink: 0; width: 100px; text-align: center;
  background: white; border-radius: 10px; padding: 8px;
  cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}
.product-mini-card:hover { transform: translateY(-2px); }
.product-mini-card img { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; }
.pmc-name { display: block; font-size: 11px; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pmc-price { color: #FF4757; font-size: 12px; font-weight: 600; }

.msg-suggestions {
  display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;
}
.suggestion-btn {
  padding: 5px 12px; border-radius: 16px;
  background: white; border: 1px solid #e0e0e0;
  font-size: 11px; color: #667eea; cursor: pointer;
  transition: all 0.2s;
}
.suggestion-btn:hover { background: #667eea; color: white; border-color: #667eea; }

.typing-indicator {
  display: flex; gap: 4px; padding: 12px 16px;
  background: white; border-radius: 14px; width: fit-content;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.typing-indicator span {
  width: 6px; height: 6px; border-radius: 50%;
  background: #999; animation: typing 1.2s infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }

.chat-input-area {
  padding: 12px 16px; border-top: 1px solid #eee;
  display: flex; gap: 8px; background: white;
}
.chat-input {
  flex: 1; padding: 10px 16px; border: 1px solid #e0e0e0;
  border-radius: 24px; font-size: 13px; outline: none;
  transition: border-color 0.2s;
}
.chat-input:focus { border-color: #667eea; }
.send-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; transition: transform 0.2s;
}
.send-btn:hover { transform: scale(1.05); }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.chat-pop-enter-active { animation: popIn 0.3s ease; }
.chat-pop-leave-active { animation: popOut 0.2s ease; }
@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes popOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9) translateY(20px); } }

@media (max-width: 480px) {
  .chat-window { width: calc(100vw - 20px); right: -10px; height: 60vh; }
}
</style>
