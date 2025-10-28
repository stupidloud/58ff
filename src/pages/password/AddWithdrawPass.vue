<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <NavBar :canReturn="true" :title="'Saque Senha'"></NavBar>        
        <div class="p-[.75rem]">
            <p class="text-white font-[600] text-[.875rem] text-left">Configurar Saque Senha</p>
            <p class="text-white/40 text-[.75rem] text-left mt-[.8rem] mb-[.5rem]">Novo Saque Senha</p>
            
            <!-- 新密码输入 -->
            <div class="flex justify-between mb-[1.5rem]">
                <input
                    v-for="(digit, index) in newPassword"
                    :key="`new-${index}`"
                    :ref="(el) => { if (el) newPasswordRefs[index] = el as HTMLInputElement }"
                    v-model="newPassword[index]"
                    type="password"
                    maxlength="1"
                    class="w-[2.75rem] h-[2.75rem] bg-[var(--color-bg-aside)] border border-white/10 rounded-[.375rem] text-center text-white text-[2.25rem] font-[600] focus:border-[var(--color-active)] focus:outline-none"
                    @input="handleNewPasswordInput(index, $event)"
                    @keydown="handleKeydown(index, $event, 'new')"
                />
            </div>
            
            <p class="text-white/40 text-[.75rem] text-left mt-[.8rem] mb-[.5rem]">Confirmar Novo Senha</p>
            
            <!-- 确认密码输入 -->
            <div class="flex justify-between mb-[1rem]">
                <input
                    v-for="(digit, index) in confirmPassword"
                    :key="`confirm-${index}`"
                    :ref="(el) => { if (el) confirmPasswordRefs[index] = el as HTMLInputElement }"
                    v-model="confirmPassword[index]"
                    type="password"
                    maxlength="1"
                    class="w-[2.75rem] h-[2.75rem] bg-[var(--color-bg-aside)] border border-white/10 rounded-[.375rem] text-center text-white text-[2.25rem] font-[600] focus:border-[var(--color-active)] focus:outline-none"
                    @input="handleConfirmPasswordInput(index, $event)"
                    @keydown="handleKeydown(index, $event, 'confirm')"
                />
            </div>
            <p class="text-[var(--color-warning)] text-[.65rem] font-[500]">Para o primeiro saque, você precisa definir a senha de saque primeiro</p>

            <div
                @click="handleSetPassword"
                class="mt-[1.5rem] w-full h-[2.875rem] rounded-[.375rem] font-[700] text-[.875rem] flex items-center justify-center !bg-[var(--color-active)] cursor-pointer"
                :class="[ 'text-white transition-all duration-200 ease-out', (loading || !canSetPassword) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:brightness-110' ]"
                >            
                <span v-if="loading">Processando...</span>
                <span v-else>Definir Senha</span>            
            </div>
        </div>        
    </div>
</template>
<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// 密码数组，每个元素代表一位数字
const newPassword = ref(['', '', '', '', '', ''])
const confirmPassword = ref(['', '', '', '', '', ''])

// 加载状态
const loading = ref(false)

// 输入框引用
const newPasswordRefs = ref<(HTMLInputElement | null)[]>([])
const confirmPasswordRefs = ref<(HTMLInputElement | null)[]>([])

// 计算是否可以设置密码
const canSetPassword = computed(() => {
  const newPasswordComplete = newPassword.value.every(digit => digit !== '')
  const confirmPasswordComplete = confirmPassword.value.every(digit => digit !== '')
  const passwordsMatch = newPassword.value.join('') === confirmPassword.value.join('')
  
  return newPasswordComplete && confirmPasswordComplete && passwordsMatch
})

// 处理设置密码
const handleSetPassword = async () => {
  if (!canSetPassword.value || loading.value) return
  
  loading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 这里可以添加实际的密码设置逻辑
    console.log('设置密码:', newPassword.value.join(''))
    
    // 设置成功后的处理
    router.push({ name: 'senha-saque' })
    
  } catch (error) {
    console.error('设置密码失败:', error)
    
  } finally {
    loading.value = false
  }
}

// 处理新密码输入
const handleNewPasswordInput = async (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // 只允许数字
  if (!/^\d$/.test(value)) {
    newPassword.value[index] = ''
    return
  }
  
  newPassword.value[index] = value
  
  // 自动聚焦到下一个输入框
  if (value && index < 5) {
    await nextTick()
    newPasswordRefs.value[index + 1]?.focus()
  } else if (value && index === 5) {
    // 新密码输入完成，聚焦到确认密码第一个输入框
    await nextTick()
    confirmPasswordRefs.value[0]?.focus()
  }
}

// 处理确认密码输入
const handleConfirmPasswordInput = async (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // 只允许数字
  if (!/^\d$/.test(value)) {
    confirmPassword.value[index] = ''
    return
  }
  
  confirmPassword.value[index] = value
  
  // 自动聚焦到下一个输入框
  if (value && index < 5) {
    await nextTick()
    confirmPasswordRefs.value[index + 1]?.focus()
  }
}

// 处理键盘事件
const handleKeydown = async (index: number, event: KeyboardEvent, type: 'new' | 'confirm') => {
  const refs = type === 'new' ? newPasswordRefs.value : confirmPasswordRefs.value
  const password = type === 'new' ? newPassword.value : confirmPassword.value
  
  if (event.key === 'Backspace') {
    if (!password[index] && index > 0) {
      // 当前输入框为空且不是第一个，聚焦到前一个输入框
      await nextTick()
      refs[index - 1]?.focus()
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    await nextTick()
    refs[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    await nextTick()
    refs[index + 1]?.focus()
  }
}
</script>
<style lang="css" scoped></style>