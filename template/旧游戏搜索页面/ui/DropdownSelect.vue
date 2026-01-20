<template>
  <div class="DropdownSelect relative">
    <div
      class="flex items-center justify-between border-[0.1px] border-[var(--color-inactive)] rounded-3xl h-10 px-4 py-1 text-base bg-[var(--color-bg-primary)] text-[var(--color-inactive)] cursor-pointer select-none"
      @click="togglePanel"
    >
      <span>{{ selectedOption || placeholder }}</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': showPanel }"
        fill="currentColor"
        viewBox="0 0 1024 1024"
      >
        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
      </svg>
    </div>

    <!-- 下拉选项面板 -->
    <div
      v-if="showPanel"
      class="absolute top-full min-w-full w-max border-[0.1px] border-[var(--color-inactive)] rounded-lg z-[2] bg-[var(--color-bg-primary)] flex flex-col overflow-hidden"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
        class="px-4 py-2 text-white cursor-pointer whitespace-nowrap select-none"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  options: string[]
  placeholder?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择选项',
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

// 面板显示状态
const showPanel = ref(false)

// 当前选中的选项
const selectedOption = ref(props.modelValue)

// 切换面板显示
const togglePanel = () => {
  showPanel.value = !showPanel.value
}

// 选择选项
const selectOption = (option: string) => {
  selectedOption.value = option
  showPanel.value = false
  emit('update:modelValue', option)
  emit('change', option)
}

// 监听外部点击关闭面板
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.DropdownSelect')) {
    showPanel.value = false
  }
}

// 添加和移除事件监听器
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>


