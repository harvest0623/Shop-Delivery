<template>
    <div class="register-page">
        <div class="register-container">
            <div class="register-card">
                <div class="register-header">
                    <h1>创建账户</h1>
                    <p>开启您的外卖之旅</p>
                </div>
                
                <form @submit.prevent="handleRegister" class="register-form">
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
                        <label for="email">邮箱</label>
                        <input 
                            type="email" 
                            id="email" 
                            v-model="form.email" 
                            placeholder="请输入邮箱"
                            class="form-input"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">手机号</label>
                        <input 
                            type="tel" 
                            id="phone" 
                            v-model="form.phone" 
                            placeholder="请输入手机号"
                            class="form-input"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="address">收货地址</label>
                        <input 
                            type="text" 
                            id="address" 
                            v-model="form.address" 
                            placeholder="请输入收货地址"
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
                    
                    <div class="form-group">
                        <label for="confirmPassword">确认密码</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            v-model="form.confirmPassword" 
                            placeholder="请再次输入密码"
                            class="form-input"
                        />
                    </div>
                    
                    <button type="submit" class="register-btn" :disabled="isLoading">
                        <span v-if="isLoading">注册中...</span>
                        <span v-else>注册</span>
                    </button>
                    
                    <div v-if="error" class="error-message">
                        {{ error }}
                    </div>
                    
                    <div v-if="success" class="success-message">
                        {{ success }}
                    </div>
                </form>
                
                <div class="register-footer">
                    <p>已有账户？</p>
                    <button class="login-link" @click="goToLogin">立即登录</button>
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
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
    if (!form.value.username || !form.value.password) {
        error.value = '请填写用户名和密码'
        return
    }
    
    if (form.value.password !== form.value.confirmPassword) {
        error.value = '两次输入的密码不一致'
        return
    }
    
    isLoading.value = true
    error.value = ''
    success.value = ''
    
    try {
        const res = await axios.post('/api/users/register', {
            username: form.value.username,
            password: form.value.password,
            email: form.value.email,
            phone: form.value.phone,
            address: form.value.address
        })
        
        success.value = '注册成功！正在跳转到登录页面...'
        
        setTimeout(() => {
            window.location.href = '/login'
        }, 2000)
    } catch (err) {
        error.value = err.response?.data?.error || '注册失败，请重试'
    } finally {
        isLoading.value = false
    }
}

const goToLogin = () => {
    window.location.href = '/login'
}
</script>

<style scoped>
.register-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.register-container {
    width: 100%;
    max-width: 420px;
}

.register-card {
    background: white;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.register-header {
    text-align: center;
    margin-bottom: 30px;
}

.register-header h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
}

.register-header p {
    color: #888;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
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

.register-btn {
    padding: 16px;
    margin-top: 10px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.register-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
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

.success-message {
    background: #d4edda;
    color: #155724;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
}

.register-footer {
    margin-top: 30px;
    text-align: center;
}

.register-footer p {
    color: #888;
    margin-bottom: 10px;
}

.login-link {
    background: none;
    border: none;
    color: #667eea;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s ease;
}

.login-link:hover {
    color: #764ba2;
}
</style>
