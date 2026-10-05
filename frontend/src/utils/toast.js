import { ref, computed } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('info')
const position = ref('top')
let timer = null

const icon = computed(() => {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }
    return icons[type.value] || icons.info
})

const show = (msg, options = {}) => {
    message.value = msg
    type.value = options.type || 'info'
    position.value = options.position || 'top'
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, options.duration || 2000)
}

export const toast = {
    show,
    success: (msg, opts) => show(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => show(msg, { ...opts, type: 'error' }),
    warning: (msg, opts) => show(msg, { ...opts, type: 'warning' }),
    info: (msg, opts) => show(msg, { ...opts, type: 'info' }),
    visible,
    message,
    type,
    position,
    icon
}
