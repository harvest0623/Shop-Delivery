<template>
    <footer class="footer">
        <div class="footer-links">
            <a href="/">首页</a>
            <a href="/shops">商家</a>
            <a href="/products">商品</a>
            <a href="/orders">订单</a>
            <a href="/profile">我的</a>
        </div>
        <div class="footer-info">
            <p>客服热线: 400-888-8888</p>
            <p>© 2024 外卖商城. All rights reserved.</p>
        </div>
    </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
    background: #333;
    color: white;
    padding: 20px 15px;
    margin-top: 30px;
}

.footer-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.footer-links a {
    color: #aaa;
    text-decoration: none;
    font-size: 14px;
}

.footer-links a:hover {
    color: #fff;
}

.footer-info {
    text-align: center;
}

.footer-info p {
    color: #666;
    font-size: 12px;
    margin: 4px 0;
}
</style>