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
    background: #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 40px;
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.6s ease;
}

.register-page::before {
    content: "🍔\A\A加入我们\A\A创建账户，享受专属优惠\A\A✅ 专属优惠折扣\A✅ AI智能推荐\A✅ 积分奖励体系";
    white-space: pre-wrap;
    position: absolute;
    left: 0;
    top: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    line-height: 2;
    text-align: center;
    padding: 40px;
    box-sizing: border-box;
}

.register-container {
    width: 100%;
    max-width: 480px;
    position: relative;
    z-index: 1;
    margin-right: 5%;
}

.register-card {
    background: white;
    border-radius: 20px;
    padding: 48px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.2);
}

.register-header {
    text-align: center;
    margin-bottom: 32px;
}

.register-header h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 700;
}

.register-header p {
    color: #999;
    font-size: 14px;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
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
    width: 100%;
    height: 50px;
    padding: 0 16px;
    border: 2px solid #e8e8e8;
    border-radius: 12px;
    font-size: 15px;
    background: #f8f9fa;
    outline: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.form-input:focus {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    background: #fff;
}

.form-input::placeholder {
    color: #bbb;
}

.register-btn {
    width: 100%;
    height: 50px;
    margin-top: 8px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    letter-spacing: 1px;
}

.register-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.register-btn:active:not(:disabled) {
    transform: translateY(0);
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
    animation: fadeInUp 0.3s ease;
}

.success-message {
    background: #d4edda;
    color: #155724;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
    animation: fadeInUp 0.3s ease;
}

.register-footer {
    margin-top: 28px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.register-footer p {
    color: #999;
    margin-bottom: 0;
    font-size: 14px;
}

.login-link {
    background: none;
    border: none;
    color: #667eea;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    display: inline-block;
}

.login-link:hover {
    color: #764ba2;
    transform: scale(1.05);
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

@media (max-width: 768px) {
    .register-page::before {
        display: none;
    }

    .register-page {
        justify-content: center;
        padding: 20px;
    }

    .register-container {
        max-width: 100%;
        margin-right: 0;
    }

    .register-card {
        padding: 32px 24px;
    }
}
</style>
