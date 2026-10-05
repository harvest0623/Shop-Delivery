<template>
    <Teleport to="body">
        <Transition name="toast">
            <div v-if="toast.visible.value" class="toast-mask" :class="toast.position.value">
                <div class="toast-box" :class="toast.type.value">
                    <span class="toast-icon">{{ toast.icon.value }}</span>
                    <span class="toast-msg">{{ toast.message.value }}</span>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { toast } from '../utils/toast'
</script>

<style scoped>
.toast-mask {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    pointer-events: none;
}
.toast-mask.top { top: 80px; }
.toast-mask.center { top: 50%; transform: translate(-50%, -50%); }
.toast-mask.bottom { bottom: 80px; }

.toast-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
}
.toast-box.success { background: rgba(34, 197, 94, 0.9); }
.toast-box.error { background: rgba(239, 68, 68, 0.9); }
.toast-box.warning { background: rgba(245, 158, 11, 0.9); }
.toast-box.info { background: rgba(59, 130, 246, 0.9); }

.toast-icon { font-size: 18px; }

.toast-enter-active { animation: toastIn 0.3s ease; }
.toast-leave-active { animation: toastOut 0.2s ease; }
@keyframes toastIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes toastOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-20px); } }
</style>
