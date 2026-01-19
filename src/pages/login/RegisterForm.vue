<template>
  <form class="login-form px-[.75rem] pb-[2rem]" @submit.prevent="submit" autocomplete="on" novalidate>
    <div class="pt-[2.8rem] pb-[1.5rem]">
      <p class="text-[1.5rem] text-white font-[700] text-left">Crie uma conta de jogo</p>
      <p class="mr-[.75rem] text-[.875rem] text-white/40 text-left">
        já tem uma conta?
        <span class="text-[var(--color-highlight)] font-[700] cursor-pointer" role="button" @click="emit('switch-form')">Entrar</span>
      </p>
    </div>

    <!-- 用户名 -->
    <div
      class="flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
      :class="usernameBorderClass"
    >
      <div class="flex items-center w-full">
        <ion-icon name="person-circle-outline" class="text-white/40 text-[1.2rem] mr-[.5rem]"></ion-icon>
        <input
          v-model="username"
          maxlength="46"
          placeholder="Nome de Usuário"
          autocomplete="username"
          name="username"
          class="flex-1 bg-transparent outline-none text-white text-[.85rem]"
        />
        <div
          v-if="username.length"
          class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
          @click="username = ''"
          aria-label="Limpar usuário"
        >
          <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
        </div>
      </div>
    </div>

    <!-- 手机号输入（巴西） -->
    <div
      class="mt-[.75rem] flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
      :class="phoneBorderClass"
    >
      <div class="flex items-center w-full">
        <img class="mr-[.25rem] w-[1.25rem] h-[1.25rem] rounded-[100px]" src="/static/br.svg" alt="">
        <span class="text-white text-[.875rem]">+55</span>
        <span class="mx-[.8rem] w-[.0625rem] h-[1.25rem] bg-white/20"></span>
        <input
          v-model="phone"
          inputmode="numeric"
          maxlength="15"
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
      <span>O número de telefone deve conter 11 dígitos.</span>
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
          autocomplete="new-password"
          name="new-password"
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


    

    <!-- 确认密码输入（再次输入以确认） -->
    <div
      class="mt-[.75rem] flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
      :class="passwordConfirmBorderClass"
    >
      <div class="flex items-center w-full">
        <ion-icon name="key" class="text-white/40 text-[1.4rem] mr-[.5rem]"></ion-icon>
        <input
          :type="showPwdConfirm ? 'text' : 'password'"
          v-model="passwordConfirm"
          maxlength="12"
          placeholder="Confirmar senha"
          autocomplete="new-password"
          name="confirm-password"
          class="flex-1 bg-transparent outline-none text-white text-[.85rem] placeholder:text-white/30"
        />
        <div
          v-if="passwordConfirm.length"
          class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
          @click="passwordConfirm = ''"
          aria-label="Limpar confirmação"
        >
          <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
        </div>
        <div
          class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-[.25rem]"
          @click="showPwdConfirm = !showPwdConfirm"
          :aria-pressed="showPwdConfirm"
        >
          <ion-icon :name="showPwdConfirm ? 'eye-off-outline' : 'eye-outline'" class="text-white text-[.8rem]"></ion-icon>
        </div>
      </div>
    </div>

    <div
      v-if="hasPasswordConfirmInput && !validPasswordConfirm"
      class="text-[#E84F46] mt-[.5rem] font-[400] text-[.75rem] flex items-center gap-[.375rem]"
    >
      <ion-icon name="alert-circle-outline"></ion-icon>
      <span>As senhas não coincidem</span>
    </div>

    <!-- 邀请码 -->
    <div
      class="mt-[.75rem] flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
      :class="inviteBorderClass"
    >
      <div class="flex items-center w-full">
        <ion-icon name="pricetag-outline" class="text-white/40 text-[1.2rem] mr-[.5rem]"></ion-icon>
        <input
          v-model="inviteCode"
          placeholder="Código de Convite (id:123)"
          autocomplete="off"
          class="flex-1 bg-transparent outline-none text-white text-[.85rem] placeholder:text-white/30"
        />
        <div
          v-if="inviteCode.length"
          class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
          @click="inviteCode = ''"
          aria-label="Limpar código"
        >
          <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
        </div>
      </div>
    </div>

    <!-- 同意协议 -->
    <div class="flex items-center justify-between mt-[1rem]">
      <label class="flex items-center gap-[.5rem] cursor-pointer select-none" @click="agreeTerms = !agreeTerms">
        <div
          class="w-[.8rem] h-[.8rem] flex items-center justify-center rounded-[.1rem] transition-colors duration-300 ease-out border"
          :class="agreeTerms ? 'bg-[var(--color-active)] border-[var(--color-active)]' : 'bg-white border-[var(--color-active)]'"
          role="checkbox"
          :aria-checked="agreeTerms"
        >
          <Transition name="check">
            <ion-icon v-if="agreeTerms" name="checkmark" class="text-white text-[.6rem]"></ion-icon>
          </Transition>
        </div>
        <span class="text-white/60 text-[.75rem]">Concordo com o contrato do usuário</span>
      </label>
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
    </div>

    <!-- 提交按钮 -->
    <button
      type="submit"
      class="mt-[1.5rem] w-full h-[2.875rem] rounded-[.375rem] font-[700] text-[.875rem] flex items-center justify-center !bg-[var(--color-active)]"
      :class="[ 'text-white transition-all duration-200 ease-out', (loading || !validPhone || !validPassword || !validPasswordConfirm) ? 'btn-dim cursor-not-allowed' : '' ]"
      :disabled="!validPhone || !validPassword || !validPasswordConfirm || loading"
    >
      <template v-if="loading || !validPhone || !validPassword || !validPasswordConfirm">
        Carregando<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>
      </template>
      <template v-else>
        Registrar
      </template>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { showToast } from '../../components/toast/service'

const emit = defineEmits<{ (e: 'switch-form'): void }>()
const route = useRoute()
const auth = useAuthStore()

const phone = ref('')

const password = ref('')
const showPwd = ref(false)
const remember = ref(true)
const loading = ref(false)

// 新增：确认密码状态
const passwordConfirm = ref('')
const showPwdConfirm = ref(false)
const username = ref('')
const inviteCode = ref('')
const agreeTerms = ref(true)

const sanitize = (s: string) => s.replace(/\D/g, '')
const maskBrazilPhone = (digits: string) => {
  const d = digits
  const dd = d.slice(0, 2)
  const rest = d.slice(2)
  if (d.length <= 2) return `(${dd}`
  if (d.length <= 6) return `(${dd}) ${rest}`
  if (d.length <= 10) return `(${dd}) ${rest.slice(0, 4)}-${rest.slice(4)}`
  return `(${dd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
}
const onPhoneInput = (e: Event) => {
  const t = e.target as HTMLInputElement
  const digits = sanitize(t.value).slice(0, 11)
  phone.value = maskBrazilPhone(digits)
}
const clearPhone = () => {
  phone.value = ''
}

// 巴西手机号：只验证总位数为11（与旧项目一致）
const validPhone = computed(() => sanitize(phone.value).length === 11)

// 密码 6-12 个字符
const validPassword = computed(() => password.value.length >= 6 && password.value.length <= 12)

// 确认密码必须与密码匹配，并且长度规则相同
const validPasswordConfirm = computed(() => passwordConfirm.value.length >= 6 && passwordConfirm.value.length <= 12 && passwordConfirm.value === password.value)

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
const hasPasswordConfirmInput = computed(() => passwordConfirm.value.length > 0)
const passwordConfirmBorderClass = computed(() => {
  if (!hasPasswordConfirmInput.value) return 'border-[var(--color-border-1)]'
  return validPasswordConfirm.value ? 'border-[#61D669]' : 'border-[#E84F46]'
})

const validUsername = computed(() => username.value.trim().length > 0 && username.value.trim().length <= 46)
const hasUsernameInput = computed(() => username.value.length > 0)
const usernameBorderClass = computed(() => {
  if (!hasUsernameInput.value) return 'border-[var(--color-border-1)]'
  return validUsername.value ? 'border-[#61D669]' : 'border-[#E84F46]'
})
const hasInviteInput = computed(() => inviteCode.value.length > 0)
const inviteBorderClass = computed(() => {
  if (!hasInviteInput.value) return 'border-[var(--color-border-1)]'
  return inviteCode.value.includes(':') ? 'border-[#61D669]' : 'border-[#E84F46]'
})

const getInviteCodeFromUrl = () => {
  try {
    const q = route.query
    const idParam = typeof q.id === 'string' ? q.id : Array.isArray(q.id) ? q.id[0] : ''
    if (idParam && /^\d+$/.test(idParam)) return `id:${idParam}`
    const pathLast = (typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean).pop() : '') || ''
    if (pathLast && /^\d+$/.test(pathLast)) return `id:${pathLast}`
    const stored = localStorage.getItem('invite_code') || ''
    return stored
  } catch {
    return ''
  }
}

onMounted(() => {
  const code = getInviteCodeFromUrl()
  if (code) {
    inviteCode.value = code
    try { localStorage.setItem('invite_code', code) } catch {}
  }
  const rememberedUsername = localStorage.getItem('remembered_username')
  const rememberedPassword = localStorage.getItem('remembered_password')
  if (rememberedUsername) username.value = rememberedUsername
  if (rememberedPassword) password.value = rememberedPassword
})

const translateRegisterError = (code?: number, defaultMsg?: string) => {
  const map: Record<number, string> = {
    1001: 'Formato do código de convite inválido',
    1002: 'Nome de usuário já existe',
    1003: 'Número de celular já registrado',
    1004: 'Agente não existe',
    1005: 'Código de convite inválido',
    1006: 'Falha no registro',
  }
  if (!code) return defaultMsg || 'Falha no registro'
  return map[code] || (defaultMsg || 'Falha no registro')
}

const submit = async () => {
  if (loading.value) return
  if (!validUsername.value) { showToast('Por favor, insira o nome de usuário'); return }
  if (!validPhone.value) { showToast('Número de telefone inválido'); return }
  if (!validPassword.value) { showToast('Senha inválida (6–12 caracteres)'); return }
  if (!validPasswordConfirm.value) { showToast('As senhas não coincidem'); return }
  if (!inviteCode.value.trim()) { showToast('Por favor, insira o código de convite'); return }
  if (!inviteCode.value.includes(':')) { showToast('Formato do código de convite inválido'); return }
  if (!agreeTerms.value) { showToast('Por favor, concorde com o contrato do usuário'); return }
  loading.value = true
  try {
    const payload = {
      username: username.value.trim(),
      phone_number: sanitize(phone.value),
      password: password.value,
      invite_code: inviteCode.value.trim(),
    }
    const res = await auth.register(payload)
    if ((res as any)?.success) {
      try {
        localStorage.setItem('remembered_username', username.value.trim())
        localStorage.setItem('remembered_password', password.value)
      } catch {}
      showToast('Registro bem-sucedido')
    } else {
      const msg = translateRegisterError((res as any)?.errorCode, (res as any)?.error || 'Falha no registro')
      showToast(msg)
    }
  } catch (e: any) {
    showToast(e?.message || 'Falha no registro, tente novamente')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
 }
 
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
