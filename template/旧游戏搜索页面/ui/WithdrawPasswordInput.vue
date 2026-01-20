<template>
  <div>
    <!-- 标题和显示/隐藏切换 -->
    <div class="flex items-center w-full justify-between mb-[1rem]" v-if="showLabel">
      <span class="text-white text-[1.2rem]">{{ label }}</span>
      <svg 
        @click="togglePasswordVisibility" 
        v-if="!showPassword" 
        class="w-[1.8rem] h-[1.8rem] fill-[var(--color-inactive66)] cursor-pointer"
      >
        <use xlink:href="#comm_icon_hide--svgSprite:all"></use>
      </svg>
      <svg 
        @click="togglePasswordVisibility" 
        v-else 
        class="w-[1.8rem] h-[1.8rem] fill-[var(--color-active)] cursor-pointer"
      >
        <use xlink:href="#comm_icon_show--svgSprite:all"></use>
      </svg>
    </div>

    <!-- 密码输入框 -->
    <div class="flex rounded-[.5rem] bg-[var(--color-bg-primary)] w-full border border-[var(--color-inactive66)]">
      <div 
        v-for="(_, index) in 6" 
        :key="index"
        class="flex-1/6 h-[5rem] border-r border-[var(--color-inactive66)] flex items-center last:border-r-0"
      >
        <input 
          :ref="(el: any) => passwordInputs[index] = el as HTMLInputElement"
          autocomplete="off"
          v-model="passwordValues[index]" 
          maxlength="1" 
          type="tel"
          @input="handleInput(index, $event)" 
          @keydown="handleKeydown(index, $event)"
          @focus="handleFocus(index)" 
          :class="[
            'w-full h-full text-white bg-transparent text-center focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--color-active)] leading-none caret-transparent select-none',
            showPassword ? 'text-[3rem]' : 'password-dot'
          ]" 
        />
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="text-[var(--color-warning)] text-[0.9rem] mt-[0.5rem]">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  showLabel?: boolean
  placeholder?: string
  disabled?: boolean
  errorMessage?: string
  autoFocus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'Senha de Saque',
  showLabel: true,
  placeholder: '',
  disabled: false,
  errorMessage: '',
  autoFocus: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'complete': [value: string]
  'input': [value: string]
}>()

// 响应式状态
const showPassword = ref(false)
const passwordValues = ref<string[]>(new Array(6).fill(''))
const passwordInputs = ref<(HTMLInputElement | null)[]>([])

// 计算属性：完整密码
const fullPassword = computed(() => passwordValues.value.join(''))

// 监听modelValue变化，同步到内部状态
watch(() => props.modelValue, (newValue) => {
  if (newValue !== fullPassword.value) {
    const values = newValue.split('').slice(0, 6)
    passwordValues.value = [...values, ...new Array(6 - values.length).fill('')]
  }
}, { immediate: true })

// 监听内部状态变化，发出事件
watch(fullPassword, (newValue) => {
  emit('update:modelValue', newValue)
  emit('input', newValue)
  
  // 如果输入完成（6位数字），发出complete事件
  if (newValue.length === 6 && /^\d{6}$/.test(newValue)) {
    emit('complete', newValue)
  }
})

// 切换密码显示/隐藏
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 处理输入事件
const handleInput = async (index: number, event: Event) => {
  if (props.disabled) return
  
  const target = event.target as HTMLInputElement
  const value = target.value

  // 只允许输入数字
  if (value && !/^[0-9]$/.test(value)) {
    passwordValues.value[index] = ''
    return
  }

  passwordValues.value[index] = value

  // 如果输入了值且不是最后一个输入框，自动跳转到下一个
  if (value && index < 5) {
    await nextTick()
    const nextInput = passwordInputs.value[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }
}

// 处理按键事件
const handleKeydown = async (index: number, event: KeyboardEvent) => {
  if (props.disabled) return
  
  // 处理退格键
  if (event.key === 'Backspace') {
    // 如果当前输入框有值，清空当前输入框
    if (passwordValues.value[index]) {
      passwordValues.value[index] = ''
    } else if (index > 0) {
      // 如果当前输入框没有值，跳转到上一个输入框并清空
      passwordValues.value[index - 1] = ''
      await nextTick()
      const prevInput = passwordInputs.value[index - 1]
      if (prevInput) {
        prevInput.focus()
      }
    }
    event.preventDefault()
  }
  // 处理左右箭头键
  else if (event.key === 'ArrowLeft' && index > 0) {
    await nextTick()
    const prevInput = passwordInputs.value[index - 1]
    if (prevInput) {
      prevInput.focus()
    }
  }
  else if (event.key === 'ArrowRight' && index < 5) {
    await nextTick()
    const nextInput = passwordInputs.value[index + 1]
    if (nextInput) {
      nextInput.focus()
    }
  }
}

// 处理焦点事件
const handleFocus = (index: number) => {
  if (props.disabled) return
  
  // No-op: We keep the focus handler for potential future use,
  // but remove the selection logic.
}

// 清空密码
const clearPassword = () => {
  passwordValues.value = new Array(6).fill('')
  // 聚焦到第一个输入框
  const firstInput = passwordInputs.value[0]
  if (firstInput) {
    firstInput.focus()
  }
}

// 验证密码格式
const isValid = computed(() => {
  const password = fullPassword.value
  return password.length === 6 && /^\d{6}$/.test(password)
})

// 暴露方法给父组件
defineExpose({
  clearPassword,
  isValid,
  focus: () => {
    const firstInput = passwordInputs.value[0]
    if (firstInput) {
      firstInput.focus()
    }
  }
})
</script>

<style scoped>
.password-dot {
  font-size: 4rem;
  -webkit-text-security: disc;
  text-security: disc;
}
</style>
