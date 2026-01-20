<template>
  <div class="flex items-center">
    <div class="relative">
      <input
        :id="inputId"
        type="checkbox"
        :checked="modelValue"
        @change="handleChange"
        class="sr-only"
      />
      <label
        :for="inputId"
        class="border flex items-center justify-center cursor-pointer rounded-[0.3rem] w-[1.6rem] h-[1.6rem]"
        :style="checkboxStyles"
      >
        <!-- 选中状态的勾选图标 -->
        <svg
          v-if="modelValue"
          class="text-white w-[1.6rem] h-[1.6rem]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
    </div>

    <!-- 标签文本（可点击切换） -->
    <label :for="inputId" class="cursor-pointer select-none">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 生成唯一ID
const inputId = computed(() => `checkbox-${Math.random().toString(36).substring(2, 11)}`)

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}

const checkboxStyles = computed(() => {
  if (props.modelValue) {
    // 选中状态使用工具绿色
    return {
      'background-color': 'var(--color-success)',
      'border-color': 'var(--color-success)'
    }
  } else {
    // 未选中状态，边框使用非激活色
    return {
      'background-color': 'transparent',
      'border-color': 'var(--color-inactive)'
    }
  }
})
</script>

<style scoped>
/* 隐藏默认checkbox */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
