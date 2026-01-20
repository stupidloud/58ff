<template>
  <div
    class="fixed left-1/2 transform -translate-x-1/2 w-full max-w-[516px] transition-opacity duration-500 ease-in-out"
    :class="[
      topClass,
      heightClass,
      zIndexClass,
      {
        'opacity-100 pointer-events-auto': show,
        'opacity-0 pointer-events-none': !show
      }
    ]"
    :style="computedStyle"
    @click="show && $emit('close')"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  /** 顶部位置，默认为 'top-0' */
  top?: string
  /** 高度，默认为 'h-full' */
  height?: string
  /** z-index层级，默认为 'z-50' */
  zIndex?: string
}

const props = withDefaults(defineProps<Props>(), {
  top: 'top-0',
  height: 'h-full',
  zIndex: 'z-50'
})

defineEmits<{
  close: []
}>()

// 计算CSS类
const topClass = computed(() => props.top)
const heightClass = computed(() => {
  // 特殊处理calc高度
  if (props.height === 'h-[calc(100vh-4.5rem)]') {
    return '' // 不使用class，改用style
  }
  return props.height
})
const zIndexClass = computed(() => props.zIndex)

// 计算样式
const computedStyle = computed(() => {
  const style: Record<string, string> = {
    backgroundColor: 'var(--color-bg-overlay)'
  }

  // 特殊处理calc高度
  if (props.height === 'h-[calc(100vh-4.5rem)]') {
    style.height = 'calc(100vh - 4.5rem)'
  }

  return style
})
</script>

<style scoped>
/* 遮罩层组件样式 */
</style>
