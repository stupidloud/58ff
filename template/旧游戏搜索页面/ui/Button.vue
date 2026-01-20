<template>
  <button
    @click="!disabled && $emit('click')"
    :type="type"
    :disabled="disabled"
    class="font-medium transition-all duration-200 ease-in-out focus:outline-none"
    :class="buttonClasses"
    :style="buttonStyles"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'outline' | ''
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  disabled?: boolean
  rounded?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  block: false,
  disabled: false,
  rounded: 'lg'
})

defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const classes = []

  // 圆角样式
  classes.push(`rounded-${props.rounded}`)

  // 尺寸相关
  if (props.block) {
    classes.push('w-full')
  }

  // 禁用状态
  if (props.disabled) {
    classes.push('cursor-not-allowed')
  } else {
    classes.push('cursor-pointer')
  }

  return classes.join(' ')
})

const buttonStyles = computed(() => {
  // 禁用状态样式
  if (props.disabled) {
    return {
      'background-color': '#999',
      'color': 'white'
    }
  }

  if (props.variant === 'primary') {
    return {
      'background-color': 'var(--color-active)',
      'color': 'var(--color-bg-primary)'
    }
  } else if (props.variant === 'outline') {
    return {
      'background-color': 'var(--color-bg-primary)',
      'color': 'var(--color-active)',
      'box-shadow': 'inset 0 0 0 1px var(--color-active)'
    }
  }
  return {}
})
</script>

<style scoped>
</style>
