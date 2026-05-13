<template>
    <div class="login-page">
        <div class="login-container">
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
                        <input 
                            type="password" 
                            id="password" 
                            v-model="form.password" 
                            placeholder="请输入密码"
                            class="form-input"
                        />
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
                    <p>还没有账户？</p>
                    <button class="register-link" @click="goToRegister">立即注册</button>
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
.login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.login-container {
    width: 100%;
    max-width: 420px;
}

.login-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-header h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
}

.login-header p {
    color: #888;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.form-input {
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;
}

.form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
    color: #aaa;
}

.login-btn {
    padding: 16px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
}

.login-footer {
    margin-top: 30px;
    text-align: center;
}

.login-footer p {
    color: #888;
    margin-bottom: 10px;
}

.register-link {
    background: none;
    border: none;
    color: #667eea;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s ease;
}

.register-link:hover {
    color: #764ba2;
}
</style>
