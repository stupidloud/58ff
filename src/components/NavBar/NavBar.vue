<template>
  <div 
    class="sticky top-0 left-0 right-0 z-50 max-w-[486px] mx-auto"
  >
    <div class="h-[3.5rem] bg-[var(--color-tabbar)] flex items-center justify-center relative">
      <!-- 返回按钮 -->
     <div @click="goBack" class="hover:bg-white/10 rounded-[1rem] flex items-center justify-center px-[.85rem] py-[.25rem] cursor-pointer absolute left-[1rem]">
      <ion-icon class="text-white text-[1.2rem]" name="chevron-back-outline"></ion-icon>
     </div>
      
      <p class="text-white text-[1rem] font-[600]">{{ title }}</p>
      
      <!-- 右侧占位 -->
      <div class="w-8 h-8"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// Props定义
interface Props {
  canReturn?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  canReturn: false,
  title: ''
})

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* 导航栏样式 */
.navbar-shadow {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>