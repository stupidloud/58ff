<template>
  <div
    class="rounded-full relative h-4"
    :class="containerClass"
    :style="containerStyle"
  >
    <!-- 进度条填充部分 -->
    <div 
      class="absolute inset-0 rounded-full transition-all duration-300 ease-in-out"
      :style="progressStyle"
      style="background-color: var(--color-success);"
    ></div>
    
    <!-- 文字内容 -->
    <div
      class="absolute inset-0 flex items-center justify-center z-10 text-sm leading-[1rem] text-white font-medium"
    >
      <slot>
        {{ displayText }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 当前值 */
  current: number
  /** 最大值 */
  max: number
  /** 进度条宽度，可以是任何CSS宽度值 */
  width?: string
  /** 未填充部分的背景色 */
  backgroundColor?: string
  /** 额外的容器类名 */
  containerClass?: string
  /** 自定义容器样式 */
  containerStyle?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  current: 0,
  max: 100,
  width: '100%',
  backgroundColor: 'rgba(50,50,50,.08)',
  containerClass: '',
  containerStyle: () => ({})
})

// 计算进度百分比
const progressPercentage = computed(() => {
  if (props.max <= 0) return 100
  const percentage = Math.min((props.current / props.max) * 100, 100)
  return Math.max(percentage, 0)
})

// 计算进度条样式
const progressStyle = computed(() => ({
  width: `${progressPercentage.value}%`,
  ...props.containerStyle
}))

// 计算容器样式
const containerStyle = computed(() => ({
  width: props.width,
  background: props.backgroundColor,
  ...props.containerStyle
}))

// 格式化数字为巴西格式
const formatBrazilianNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

// 计算显示文字 - 固定格式：current/max
const displayText = computed(() => {
  return `${formatBrazilianNumber(props.current)}/${formatBrazilianNumber(props.max)}`
})
</script>

<style scoped>
/* Progress组件样式 */
</style>
