<template>
  <div class="empty-component flex flex-col items-center justify-center">
    <!-- 使用 mask 方式显示 SVG 图标 -->
    <div 
      class="empty-icon w-[10rem] h-[12.5rem]"
      :style="{
        backgroundColor: iconColor,
        mask: `url(/static/empty-bg-new.svg) no-repeat center`,
        maskSize: 'contain',
        WebkitMask: `url(/static/empty-bg-new.svg) no-repeat center`,
        WebkitMaskSize: 'contain'
      }"
    ></div>
    
    <!-- 空状态文本 -->
    <div class="empty-text text-center w-full">
      <p class="text-[1rem]" :style="{ color: textColor }">
        {{ title }}
      </p>      
    </div>
    
    <!-- 可选的操作按钮 -->
    <slot name="action"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  description?: string
  iconColor?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  iconColor: '#9CA3AF', // 默认灰色
  textColor: '#6B7280'   // 默认文本颜色
})
</script>

<style scoped>
.empty-component {
  min-height: 200px;
}

.empty-icon {
  transition: all 0.3s ease;
}

</style>