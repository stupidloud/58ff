<template>
  <div
    class="InputBox rounded-4xl relative border transition-colors duration-200"
    :class="{
      'border-[var(--color-active)]': isFocused,
      'border-[var(--color-inactive66)]': !isFocused
    }"
    :style="{ backgroundColor: props.bgColor }"
  >
    <div class="box flex items-center justify-center relative h-full">
      <div class="Inp mx-2 w-full">
        <div>
          <div>
            <input
              ref="inputRef"
              type="text"
              autocomplete="off"
              :placeholder="placeholder"
              :value="localValue"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              @keyup.enter="handleSearch"
              class="text-white text-lg focus:outline-none focus:border-none focus:ring-0 w-full placeholder:text-[var(--color-inactive)] bg-transparent"
            >
          </div>
        </div>
      </div>
      <div class="rightBox flex items-center pr-4">
        <div class="search flex justify-center items-center" @click="handleSearch">
          <svg aria-hidden="true" focusable="false" class="w-[1.2rem] h-[1.2rem] fill-[var(--color-inactive)]">
            <use xlink:href="#comm_icon_ss--svgSprite:all"></use>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 定义props
interface Props {
  modelValue?: string
  placeholder?: string
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'ID do Membro',
  bgColor: 'var(--color-bg-primary)'
})

// 定义事件
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'search': [value: string]
}>()

// 焦点状态
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement>()

// 本地值状态
const localValue = ref(props.modelValue)

// 监听props.modelValue变化，同步到本地值
watch(() => props.modelValue, (newValue) => {
  localValue.value = newValue
}, { immediate: true })

// 处理输入
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  localValue.value = target.value
  emit('update:modelValue', target.value)
}

// 处理焦点获得
const handleFocus = () => {
  isFocused.value = true
}

// 处理焦点失去
const handleBlur = () => {
  isFocused.value = false
}

// 处理搜索
const handleSearch = () => {
  emit('search', localValue.value.trim())
}
</script>

<style scoped>
/* 搜索框样式 */
</style>
