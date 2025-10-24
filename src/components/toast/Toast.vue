<template>
  <div v-show="visible" class="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none">
    <div class="pointer-events-auto px-[.875rem] py-[.625rem] rounded-[.5rem] bg-[rgba(0,0,0,0.75)] text-white text-[.875rem] font-[600] shadow-lg animate-fade-in">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let timer: number | null = null

const show = (options: { message: string; duration?: number }) => {
  message.value = options.message
  visible.value = true
  if (timer) {
    window.clearTimeout(timer)
    timer = null
  }
  const duration = options.duration ?? 2000
  timer = window.setTimeout(() => {
    visible.value = false
    timer = null
  }, duration)
}

const hide = () => {
  if (timer) {
    window.clearTimeout(timer)
    timer = null
  }
  visible.value = false
}

defineExpose({ show, hide })
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 150ms ease-out;
}
</style>