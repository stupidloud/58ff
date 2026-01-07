<template>
  <form class="login-form px-[.75rem] pb-[2rem]" @submit.prevent="submit" autocomplete="on" novalidate>
    <div class="pt-[2.8rem] pb-[1.5rem]">
      <p class="text-[1.5rem] text-white font-[700] text-left">Faça login na sua conta</p>
      <p class="mr-[.75rem] text-[.875rem] text-white/40 text-left">
        Não tem uma conta?
        <span class="text-[var(--color-highlight)] font-[700] cursor-pointer" role="button" @click="emit('switch-form')">Registro</span>
      </p>
    </div>

    <!-- 手机号输入（巴西） -->
    <div
      class="flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
      :class="phoneBorderClass"
    >
      <div class="flex items-center w-full">
        <img class="mr-[.25rem] w-[1.25rem] h-[1.25rem] rounded-[100px]" src="/static/br.svg" alt="">
        <span class="text-white text-[.875rem]">+55</span>
        <span class="mx-[.8rem] w-[.0625rem] h-[1.25rem] bg-white/20"></span>
        <input
          v-model="phone"
          inputmode="numeric"
          maxlength="11"
          placeholder="Número"
          autocomplete="username"
          name="username"
          class="flex-1 bg-transparent outline-none text-white text-[.85rem]"
          @input="onPhoneInput"
        />
        <div
          v-if="phone.length"
          class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
          @click="clearPhone"
          aria-label="Limpar telefone"
        >
          <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
        </div>
      </div>
    </div>
    <div
      v-if="hasPhoneInput && !validPhone"
      class="text-[#E84F46] mt-[.5rem] font-[400] text-[.75rem] flex items-center gap-[.375rem]"
    >
        <ion-icon name="alert-circle-outline"></ion-icon>
      <span>Número de telefone inválido</span>
    </div>

    <!-- 密码输入（6-12 个字符） -->
    <div
      class="mt-[.75rem] flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
      :class="passwordBorderClass"
    >
      <div class="flex items-center w-full">
        <ion-icon name="key" class="text-white/40 text-[1.4rem] mr-[.5rem]"></ion-icon>        
        <input
          :type="showPwd ? 'text' : 'password'"
          v-model="password"
          maxlength="12"
          placeholder="Senha"
          autocomplete="current-password"
          name="password"
          class="flex-1 bg-transparent outline-none text-white text-[.85rem] placeholder:text-white/30"
        />
        <div
          v-if="password.length"
          class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
          @click="password = ''"
          aria-label="Limpar senha"
        >
          <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
        </div>
        <div
          class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-[.25rem]"
          @click="showPwd = !showPwd"
          :aria-pressed="showPwd"
        >
          <ion-icon :name="showPwd ? 'eye-off-outline' : 'eye-outline'" class="text-white text-[.8rem]"></ion-icon>
        </div>
      </div>
    </div>

    <div
      v-if="hasPasswordInput && !validPassword"
      class="text-[#E84F46] mt-[.5rem] font-[400] text-[.75rem] flex items-center gap-[.375rem]"
    >
      <ion-icon name="alert-circle-outline"></ion-icon>
      <span>Senha inválida (6–12 caracteres)</span>
    </div>

    <!-- 记住密码 + 忘记密码 -->
    <div class="flex items-center justify-between mt-[1rem]">
      <label class="flex items-center gap-[.5rem] cursor-pointer select-none" @click="remember = !remember">
        <div
          class="w-[.8rem] h-[.8rem] flex items-center justify-center rounded-[.1rem] transition-colors duration-300 ease-out border"
          :class="remember ? 'bg-[var(--color-active)] border-[var(--color-active)]' : 'bg-white border-[var(--color-active)]'"
          role="checkbox"
          :aria-checked="remember"
        >
          <Transition name="check">
            <ion-icon v-if="remember" name="checkmark" class="text-white text-[.6rem]"></ion-icon>
          </Transition>
        </div>
        <span class="text-white/60 text-[.75rem]">Lembrar Senha</span>
      </label>
      <span type="button" class="text-white/60 text-[.75rem]">Esqueceu a senha?</span>
    </div>

    <!-- 提交按钮 -->
    <button
      type="submit"
      class="mt-[1.5rem] w-full h-[2.875rem] rounded-[.375rem] font-[700] text-[.875rem] flex items-center justify-center !bg-[var(--color-active)]"
      :class="[ 'text-white transition-all duration-200 ease-out', (loading || !validPhone || !validPassword) ? 'btn-dim cursor-not-allowed' : '' ]"
      :disabled="!validPhone || !validPassword || loading"
    >
      <template v-if="loading">
        Carregando<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>
      </template>
      <template v-else>
        Entrar
      </template>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useUiStore } from '../../stores/ui'
import { showToast } from '../../components/toast/service'

const emit = defineEmits<{ (e: 'switch-form'): void }>()

const phone = ref('')

const password = ref('')
const showPwd = ref(false)
const remember = ref(true)
const loading = ref(false)
const auth = useAuthStore()
const ui = useUiStore()

const sanitize = (s: string) => s.replace(/\D/g, '')
const onPhoneInput = (e: Event) => {
  const t = e.target as HTMLInputElement
  phone.value = sanitize(t.value).slice(0, 11)
}
const clearPhone = () => {
  phone.value = ''
}

const validPhone = computed(() => sanitize(phone.value).length > 0)

// 密码 6-12 个字符
const validPassword = computed(() => password.value.length >= 6 && password.value.length <= 12)

// 边框颜色与输入状态（实时）
const hasPhoneInput = computed(() => sanitize(phone.value).length > 0)
const phoneBorderClass = computed(() => {
  if (!hasPhoneInput.value) return 'border-[var(--color-border-1)]'
  return validPhone.value ? 'border-[#61D669]' : 'border-[#E84F46]'
})
const hasPasswordInput = computed(() => password.value.length > 0)
const passwordBorderClass = computed(() => {
  if (!hasPasswordInput.value) return 'border-[var(--color-border-1)]'
  return validPassword.value ? 'border-[#61D669]' : 'border-[#E84F46]'
})

const submit = async () => {
  if (!validPhone.value || !validPassword.value || loading.value) return
  loading.value = true
  try {
    const res = await auth.login({ phone_number: sanitize(phone.value), password: password.value })
    if (res && res.success) {
      ui.closeLogin()
    } else {
      const msg = res?.error || 'Falha no login'
      showToast(msg)
    }
  } finally {
    loading.value = false
  }
}

watch(() => ui.loginOpen, (open) => {
  if (open) {
    loading.value = false
  }
})
</script>

<style scoped>
 
 /* 记住密码对勾动画 */
 .check-enter-active,
 .check-leave-active {
  transition: opacity 220ms cubic-bezier(.2,.8,.2,1), transform 220ms cubic-bezier(.2,.8,.2,1);
 }
 .check-enter-from,
 .check-leave-to {
   opacity: 0;
   transform: scale(.6);
 }
 .check-enter-to,
 .check-leave-from {
   opacity: 1;
   transform: scale(1);
 }
 
 /* 加载省略号动画 */
  .loading-dots {
    display: inline-flex;
    gap: .1rem;
    margin-left: .125rem;
    vertical-align: baseline;
  }
  .loading-dots span {
    animation: loading-dot 1s ease-in-out infinite;
    opacity: .3;
  }
  .loading-dots span:nth-child(2) { animation-delay: .2s; }
  .loading-dots span:nth-child(3) { animation-delay: .4s; }
  @keyframes loading-dot {
    0%, 100% { opacity: .3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-.08rem); }
  }
 
  /* 按钮禁用态：降低亮度与饱和度，保持主色 */
  .btn-dim {
    filter: brightness(.92) saturate(.95);
  }
</style>
