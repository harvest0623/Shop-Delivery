import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/shops',
        name: 'shops',
        component: () => import('../views/Shops.vue')
    },
    {
        path: '/shop/:id',
        name: 'shop-detail',
        component: () => import('../views/ShopDetail.vue')
    },
    {
        path: '/products',
        name: 'products',
        component: () => import('../views/Products.vue')
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('../views/Cart.vue')
    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import('../views/Orders.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/Admin.vue')
    },
    {
        path: '/statistics',
        name: 'statistics',
        component: () => import('../views/Statistics.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
