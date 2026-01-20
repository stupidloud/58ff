<template>
  <!-- 游戏加载组件 - 透明背景小组件 -->
  <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
    <div class="bg-black/50 backdrop-blur-xs rounded-2xl px-6 py-12 flex flex-col items-center shadow-2xl">
      <div class="spinner w-12 h-12 border-2 border-white/30 border-t-[var(--color-active)] rounded-full mb-3"></div>
      <p class="text-white text-sm font-medium">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible?: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  visible: false,
  text: 'Carregando...'
})
</script>

<style scoped>
.spinner {
  animation: spin 1s ease infinite;
  /* 移动端优化 */
  will-change: transform;
  transform-origin: center;
  backface-visibility: hidden;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 确保在所有浏览器中都能工作 */
@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
