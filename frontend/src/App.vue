<script setup>
import { computed } from 'vue'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

const showNavFooter = computed(() => {
    const path = window.location.pathname
    return !['/', '/login', '/register'].includes(path)
})
</script>

<template>
    <div class="app">
        <NavBar v-if="showNavFooter" />
        <main>
            <router-view />
        </main>
        <Footer v-if="showNavFooter" />
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

main {
    flex: 1;
}
</style>
