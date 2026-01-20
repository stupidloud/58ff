<template>
  <div
    @click="handleClick"
    class="rounded-lg p-3 relative h-[3.5rem] cursor-pointer flex items-center justify-center text-center"
    :class="[
      { 'cursor-default': disabled },
      variant === 'amount' ? 'flex-col' : ''
    ]"
    :style="buttonStyles"
  >
    <!-- 支付方式按钮布局 (带图标) -->
    <template v-if="variant === 'payment'">
      <img
        v-if="icon"
        :src="icon"
        :alt="label"
        class="w-8 h-8 rounded-sm mr-2 object-cover"
      />
      <div class="flex-1 text-center">
        <span class="text-xl text-[var(--color-highlight-text)]">{{ label }}</span>
      </div>
    </template>

    <!-- 选择按钮布局 (纯文本) -->
    <template v-else-if="variant === 'selection'">
      <span class="text-xl text-[var(--color-highlight-text)]">{{ label }}</span>
    </template>

    <!-- 金额按钮布局 (垂直排列) -->
    <template v-else-if="variant === 'amount'">
      <span class="text-xl font-medium text-[var(--color-highlight-text)]">{{ label }}</span>
      <!-- 奖金标签 -->
      <div
        v-if="bonus"
        class="absolute top-0 right-0 bg-red-500 text-sm px-2 rounded-tr-sm text-white font-medium leading-4"
      >
        +{{ bonus }}
      </div>
    </template>

    <!-- 激活状态角标 -->
    <div 
      v-if="showBadge" 
      class="absolute bottom-0 right-0 w-6 h-6 flex items-end justify-end rounded-br-sm bg-[var(--color-active)]" 
      style="clip-path: polygon(100% 0, 0 100%, 100% 100%);"
    >
      <svg class="w-2.5 h-2.5 mb-0.5 mr-0.5 fill-[var(--color-bg-primary)]">
        <use xlink:href="#comm_icon_gou--svgSprite:all"></use>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 按钮变体类型
type ButtonVariant = 'payment' | 'selection' | 'amount'

interface Props {
  /** 按钮变体类型 */
  variant: ButtonVariant
  /** 按钮文本 */
  label: string
  /** 是否选中状态 */
  selected?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 图标路径 (仅payment类型使用) */
  icon?: string
  /** 奖金数值 (仅amount类型使用) */
  bonus?: number | null
  /** 是否显示角标 */
  showBadge?: boolean
  /** 按钮值 (用于事件传递) */
  value?: any
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
  showBadge: false
})

const emit = defineEmits<{
  click: [value: any]
}>()

// 处理点击事件
const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.value)
  }
}



// 计算按钮样式
const buttonStyles = computed(() => {
  const styles: Record<string, string> = {
    'background-color': 'var(--color-bg-primary)'
  }

  // 根据选中状态设置边框
  if (props.selected) {
    styles.border = '0.1px solid var(--color-active)'
  } else {
    styles.border = '0.1px solid var(--color-inactive66)'
  }

  // 禁用状态
  if (props.disabled) {
    styles.opacity = '0.5'
  }

  return styles
})
</script>

<style scoped>
/* 充值按钮组件样式 */
</style>
