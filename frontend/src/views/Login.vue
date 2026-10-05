<template>
    <div class="login-page">
        <div class="brand-section">
            <div class="brand-content">
                <div class="brand-logo">🍔</div>
                <h1 class="brand-title">外卖商城</h1>
                <p class="brand-slogan">新鲜美味，即刻送达</p>
                <div class="brand-features">
                    <div class="feature-item">
                        <span class="feature-icon">⚡</span>
                        <span class="feature-text">闪电配送</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✅</span>
                        <span class="feature-text">品质保障</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🤖</span>
                        <span class="feature-text">AI推荐</span>
                    </div>
                </div>
            </div>
            <div class="brand-dots">
                <span v-for="n in 20" :key="n" class="dot"></span>
            </div>
        </div>
        <div class="login-section">
            <div class="login-card">
                <div class="login-header">
                    <h1>欢迎回来</h1>
                    <p>登录您的账户</p>
                </div>

                <form @submit.prevent="handleLogin" class="login-form">
                    <div class="form-group">
                        <label for="username">用户名</label>
                        <input
                            type="text"
                            id="username"
                            v-model="form.username"
                            placeholder="请输入用户名"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label for="password">密码</label>
                        <div class="password-input-wrap">
                            <input
                                :type="showPassword ? 'text' : 'password'"
                                id="password"
                                v-model="form.password"
                                placeholder="请输入密码"
                                class="form-input"
                            />
                            <span class="eye-icon" @click="togglePassword">
                                {{ showPassword ? '🙈' : '👁️' }}
                            </span>
                        </div>
                    </div>

                    <button type="submit" class="login-btn" :disabled="isLoading">
                        <span v-if="isLoading">登录中...</span>
                        <span v-else>登录</span>
                    </button>

                    <div v-if="error" class="error-message">
                        {{ error }}
                    </div>
                </form>

                <div class="login-footer">
                    <p>还没有账户？<button class="register-link" @click="goToRegister">立即注册</button></p>
                    <a href="javascript:void(0)" class="forgot-link">忘记密码？</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
    username: '',
    password: ''
})

const isLoading = ref(false)
const error = ref('')
const showPassword = ref(false)

const togglePassword = () => {
    showPassword.value = !showPassword.value
}

const handleLogin = async () => {
    if (!form.value.username || !form.value.password) {
        error.value = '请输入用户名和密码'
        return
    }

    isLoading.value = true
    error.value = ''

    try {
        const res = await axios.post('/api/users/login', form.value)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        localStorage.setItem('token', res.data.token)
        window.location.href = '/'
    } catch (err) {
        error.value = err.response?.data?.error || '登录失败，请检查用户名和密码'
    } finally {
        isLoading.value = false
    }
}

const goToRegister = () => {
    window.location.href = '/register'
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-page {
  min-height: 100vh;
  display: flex;
  background: #fff;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #FF4757 0%, #FF6B81 50%, #FF8A5C 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 60px 40px;
}

.brand-content {
  position: relative;
  z-index: 2;
  text-align: center;
  animation: fadeInUp 0.8s ease;
}

.brand-logo {
  font-size: 96px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.brand-title {
  font-size: 42px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: 2px;
}

.brand-slogan {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 48px;
  font-weight: 400;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-start;
  margin-left: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  padding: 14px 28px;
  border-radius: 14px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature-item:hover {
  transform: translateX(6px);
  background: rgba(255, 255, 255, 0.28);
}

.feature-icon {
  font-size: 26px;
}

.feature-text {
  font-size: 16px;
  color: #fff;
  font-weight: 600;
}

.brand-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  z-index: 1;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
}

.login-section {
  width: 520px;
  min-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 50px;
  background: #fff;
}

.login-card {
  width: 100%;
  max-width: 400px;
  animation: fadeInUp 0.8s ease 0.15s both;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 10px;
}

.login-header p {
  color: #999;
  font-size: 15px;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #444;
  font-weight: 600;
}

.password-input-wrap {
  position: relative;
}

.form-input {
  width: 100%;
  height: 50px;
  padding: 0 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  background: #f8f9fa;
  color: #333;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.password-input-wrap .form-input {
  padding-right: 50px;
}

.form-input:focus {
  border-color: #FF4757;
  box-shadow: 0 0 0 4px rgba(255, 71, 87, 0.1);
  background: #fff;
  transform: scale(1.01);
}

.form-input::placeholder {
  color: #bbb;
}

.eye-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  cursor: pointer;
  user-select: none;
  opacity: 0.5;
  transition: opacity 0.3s;
  z-index: 10;
  display: inline-block;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 24px;
}

.eye-icon:hover {
  opacity: 1;
}

.login-btn {
  width: 100%;
  height: 50px;
  border: none;
  background: linear-gradient(135deg, #FF4757 0%, #FF6B81 100%);
  color: #fff;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 6px;
  letter-spacing: 1px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 30px rgba(255, 71, 87, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(1.01);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fff0f0;
  color: #e74c3c;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #ffd6d6;
  font-weight: 500;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.login-footer p {
  color: #999;
  margin: 0 0 12px;
  font-size: 14px;
}

.register-link {
  background: none;
  border: none;
  color: #FF4757;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0;
}

.register-link:hover {
  color: #FF6B81;
}

.forgot-link {
  color: #bbb;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #FF4757;
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
    background: #fff;
  }

  .brand-section {
    display: none;
  }

  .login-section {
    width: 100%;
    min-width: unset;
    flex: 1;
    padding: 40px 24px;
  }

  .login-card {
    max-width: 100%;
  }

  .login-header h1 {
    font-size: 28px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .login-section {
    width: 460px;
    min-width: 380px;
    padding: 40px 36px;
  }

  .brand-section {
    padding: 40px 24px;
  }

  .brand-logo {
    font-size: 72px;
  }

  .brand-title {
    font-size: 32px;
  }

  .brand-features {
    margin-left: 20px;
  }

  .feature-item {
    padding: 10px 20px;
  }
}
</style>
