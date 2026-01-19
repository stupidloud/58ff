<template>
  <!-- 遮罩层 -->
  <OverlayMask :show="show" />

  <!-- 弹窗内容 -->
  <Transition name="modal">
    <div v-if="show"
      class="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[516px] h-full z-50 flex flex-col items-center justify-center pointer-events-none">
      <div class="rounded-2xl w-135 mx-auto pt-3 px-4 pb-6 modal-content pointer-events-auto border-[0.1px] border-[var(--color-inactive66)] bg-[var(--color-bg-primary)]"
        @click.stop>
        <!-- Tab 切换 -->
        <div class="relative">
          <div class="flex">
            <button @click="switchTab('register')"
              class="flex-1 pt-2 pb-6 px-4 font-medium transition-all flex items-center justify-center space-x-1 tab-button"
              :class="{ 'tab-active': activeTab === 'register', 'tab-inactive': activeTab !== 'register' }">
              <svg class="w-[1.3rem] h-[1.3rem]" fill="currentColor">
                <use xlink:href="#login_icon_zj--svgSprite:all"></use>
              </svg>
              <span class="text-[1.1rem]">Inscrever-se</span>
            </button>
            <button @click="switchTab('login')"
              class="flex-1 pt-2 pb-6 px-4 font-medium transition-all flex items-center justify-center space-x-1 tab-button"
              :class="{ 'tab-active': activeTab === 'login', 'tab-inactive': activeTab !== 'login' }">
              <svg class="w-[1.3rem] h-[1.3rem]" fill="currentColor">
                <use xlink:href="#login_icon_dl--svgSprite:all"></use>
              </svg>
              <span class="text-[1.1rem]">Acesso de membro</span>
            </button>
          </div>
          <!-- 底部指示线 -->
          <div class="absolute bottom-0 h-[0.1875rem] transition-all duration-300 ease-out w-1/2"
            style="background-color: var(--color-active);" :class="{
              'left-0': activeTab === 'register',
              'left-1/2': activeTab === 'login'
            }"></div>
        </div>

        <!-- 表单容器 -->
        <div class="relative overflow-hidden">
            <!-- 注册表单 -->
            <div class="absolute w-full top-0 left-0 form-slide-item" :class="{
              'form-active': activeTab === 'register',
              'form-inactive-left': activeTab !== 'register'
            }">
              <form autocomplete="off">
              <div class="mb-[2.5rem]">
                <label class="block text-[1rem] font-medium mt-6 mb-1">Número do Celular ou Conta</label>
                <div class="relative border border-[var(--color-inactive66)] rounded-[0.5rem]  focus-within:border-[var(--color-active)]">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-[1.3rem] h-[1.3rem] fill-[var(--color-inactive)]">
                    <use xlink:href="#input_icon_zh--svgSprite:all"></use>
                  </svg>
                  <input v-model="registerForm.username" type="text" maxlength="46"
                    autocomplete="off"
                    class="w-full pl-12 pr-12 py-3 bg-transparent focus:outline-none border-none form-input h-[3.5rem] text-[1.2rem]"
                    placeholder="Nome de Usuário">

                  <div @click="registerForm.username = ''" v-show="showRegisterUsernameClose" class="absolute flex items-center right-4 top-1/2 transform -translate-y-1/2">
                    <div class="flex items-center">
                      <svg class="w-[1.7rem] h-[1.7rem] fill-[var(--color-inactive66)]">
                        <use xlink:href="#comm_icon_qc--svgSprite:all"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-[2.5rem]">
                <div class="relative border border-[var(--color-inactive66)] rounded-[0.5rem]  focus-within:border-[var(--color-active)]">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-[1.3rem] h-[1.3rem] fill-[var(--color-inactive)]">
                    <use xlink:href="#input_icon_mm--svgSprite:all"></use>
                  </svg>
                  <input v-model="registerForm.password" :type="showRegisterPass ? 'text' : 'password'" maxlength="20"
                    autocomplete="new-password"
                    class="w-full pl-12 pr-24 py-3 bg-transparent focus:outline-none border-none form-input h-[3.5rem] text-[1.2rem]"
                    placeholder="Senha">

                  <div @click="registerForm.password = ''" v-show="showRegisterPasswordClose" class="absolute flex items-center right-[3.75rem] top-1/2 transform -translate-y-1/2">
                    <div class="flex items-center">
                      <svg class="w-[1.7rem] h-[1.7rem] fill-[var(--color-inactive66)]">
                        <use xlink:href="#comm_icon_qc--svgSprite:all"></use>
                      </svg>
                    </div>
                  </div>

                  <div @click="showRegisterPass = !showRegisterPass" class="absolute !left-auto !right-4  top-1/2 transform -translate-y-1/2 p-2 py-1">
                    <svg v-if="!showRegisterPass" class=" w-[1.8rem] h-[1.8rem] fill-[var(--color-inactive66)]">
                      <use xlink:href="#comm_icon_hide--svgSprite:all"></use>
                    </svg>
                    <svg v-else class=" w-[1.8rem] h-[1.8rem] fill-[var(--color-active)]">
                      <use xlink:href="#comm_icon_show--svgSprite:all"></use>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="flex items-center mb-[1rem]">
                <span class="text-[var(--color-highlight-text)] text-[1rem] mr-[1rem]">Força</span>
                <div class="flex items-center gap-[0.5rem]">
                  <div v-for="i in 4" :key="i" class="w-[5rem] h-[0.7rem] rounded-[0.5rem] "
                    :class="getPasswordStrengthBarClass(i)"></div>
                </div>
              </div>
              
              <div class="relative mb-[2.5rem]">
                <div tabindex="0" class="border border-[var(--color-inactive66)] rounded-[0.5rem] w-full h-[3.5rem] text-[1.2rem] focus:outline-none items-center flex px-[1.1rem] focus-within:border-[var(--color-active)]">
                  <div class="flex items-center h-full">
                    <img class="h-[1.5rem] mr-[0.5rem]" :src="getConstantAssetUrl('/area.png')" alt="">
                    <span class="text-[var(--color-highlight-text)] text-[1rem]">+55</span>
                    <img class="w-[1rem] ml-[1rem] mr-[1rem]" :src="getConstantAssetUrl('/down.png')" alt="">
                  </div>
                  <div class="w-[1px] h-[70%] bg-[var(--color-inactive66)]"></div>
                  <input v-phone-mask class="flex-1 bg-transparent px-[0.5rem] text-[1.2rem] text-white focus:outline-none border-none placeholder:text-[var(--color-inactive66)]" type="tel" v-model="registerForm.phone" placeholder="(XX) XXXXX-XXXX" maxlength="15">
                </div>

                <div @click="registerForm.phone = ''" v-show="showRegisterPhoneClose" class="absolute flex items-center right-4 top-1/2 transform -translate-y-1/2">
                  <div class="flex items-center">
                    <svg class="w-[1.7rem] h-[1.7rem] fill-[var(--color-inactive66)]">
                      <use xlink:href="#comm_icon_qc--svgSprite:all"></use>
                    </svg>
                  </div>
                </div>
              </div>

              <div @click="countrySelect = !countrySelect" class="relative">
                <div tabindex="0" class="mb-[2.5rem] border-[0.1rem] border-[var(--color-inactive66)] rounded-[0.5rem] w-full h-[3.5rem] text-[1.2rem] focus:outline-none focus:border-[var(--color-active)] items-center flex px-[1.1rem]">
                  <img class="h-[1.8rem] mr-[1rem]" :src="getConstantAssetUrl('/flag_br.png')" alt="">
                  <span class="text-[var(--color-highlight-text)] text-[1rem]">BRL（BRL）</span>
                  <img class="w-[1rem] ml-auto transition-transform duration-300" :class="{ 'rotate-180': countrySelect }" :src="getConstantAssetUrl('/down.png')" alt="">
                </div>
                <div class="absolute top-full left-0 w-full bg-[var(--color-bg-primary)] z-99 transition-transform duration-300 origin-top" :class="countrySelect ? 'scale-y-100' : 'scale-y-0'">
                  <div class="mt-[0.5rem] border border-[var(--color-inactive66)] rounded-[0.5rem] w-full h-[3.5rem] text-[1.2rem] focus:outline-none focus:border-[var(--color-active)] items-center flex px-[1.1rem]">
                    <img class="h-[1.8rem] mr-[1rem]" :src="getConstantAssetUrl('/flag_br.png')" alt="">
                    <span class="text-[var(--color-active)] text-[1rem]">BRL（BRL）</span>                  
                  </div>
                </div>
              </div>

              <div class="mb-[2.5rem]">
                <div class="relative border border-[var(--color-inactive66)] rounded-[0.5rem]  focus-within:border-[var(--color-active)]">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-[1.3rem] h-[1.3rem]"
                    fill="currentColor" style="color: var(--color-inactive);">
                    <use xlink:href="#input_icon_yqm--svgSprite:all"></use>
                  </svg>
                  <input v-model="registerForm.invite_code" type="text"
                    :readonly="isInviteCodeReadonly"
                    class="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none border-none form-input h-[3.5rem] text-[1.2rem] text-[var(--color-inactive66)]"
                    placeholder="Código de Convite (obrigatório)">
                </div>
              </div>

              <div class="flex items-center h-[2rem] mb-4">
                <Checkbox v-model="registerForm.agreeTerms" icon-size="1.6rem" shape="square">
                  <span class="ml-2 text-[1rem]">
                    Tenho 18 anos, li e concordo com
                    <a href="#" @click.prevent="showUserAgreement" class="link-text">《Contrato do usuário》</a>
                  </span>
                </Checkbox>
              </div>
              <Button variant="primary" block class="px-6 py-3 text-lg" @click="handleRegister" :style="{
                height: '3.5rem',
                fontSize: '1.2rem'
              }">
                Registro
              </Button>

              <div class="flex justify-around mt-4">
                <a @click="handleSupportClick" class="text-[1rem]" style="color: var(--color-active);">
                  Suporte ao cliente
                </a>
                <a @click.prevent class="text-[1rem]" style="color: var(--color-active);">
                  Jogar Grátis
                </a>
              </div>
              </form>
            </div>

            <!-- 登录表单 -->
            <div class="absolute w-full top-0 left-0 form-slide-item" :class="{
              'form-active': activeTab === 'login',
              'form-inactive-right': activeTab !== 'login'
            }">
              <form :autocomplete="loginForm.rememberMe ? 'off' : 'on'">
              <div class="mb-[2.5rem]">
                <label class="block text-[1rem] font-medium mt-[1.5rem] mb-[0.7rem]">Número do Celular ou Conta</label>
                <div class="relative border border-[var(--color-inactive66)] rounded-[0.5rem]  focus-within:border-[var(--color-active)]">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-[1.3rem] h-[1.3rem]"
                    fill="currentColor" style="color: var(--color-inactive);">
                    <use xlink:href="#input_icon_zh--svgSprite:all"></use>
                  </svg>
                  <input v-model="loginForm.username" type="text"
                    :autocomplete="hasSavedAccount ? 'off' : 'username'"
                    class="w-full pl-12 pr-12 py-3 bg-transparent focus:outline-none border-none form-input h-[3.5rem] text-[1.2rem]"
                    placeholder="Nome de Usuário">

                  <div @click="loginForm.username = ''" v-show="showLoginPhoneClose" class="absolute flex items-center right-4 top-1/2 transform -translate-y-1/2">
                    <div class="flex items-center">
                      <svg class="w-[1.7rem] h-[1.7rem] fill-[var(--color-inactive66)]">
                        <use xlink:href="#comm_icon_qc--svgSprite:all"></use>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mb-[2.5rem]">
                <div class="relative border border-[var(--color-inactive66)] rounded-[0.5rem]  focus-within:border-[var(--color-active)]">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-[1.3rem] h-[1.3rem]"
                    fill="currentColor" style="color: var(--color-inactive);">
                    <use xlink:href="#input_icon_mm--svgSprite:all"></use>
                  </svg>
                  <input v-model="loginForm.password" :type="showLoginPass ? 'text' : 'password'"
                    :autocomplete="hasSavedAccount ? 'new-password' : 'current-password'"
                    class="w-full pl-12 pr-24 py-3 bg-transparent focus:outline-none border-none form-input h-[3.5rem] text-[1.2rem]"
                    placeholder="Senha">

                  <div @click="loginForm.password = ''" v-show="showLoginPassClose" class="absolute flex items-center right-15 top-1/2 transform -translate-y-1/2">
                    <div class="flex items-center">
                      <svg class="w-[1.7rem] h-[1.7rem] fill-[var(--color-inactive66)]">
                        <use xlink:href="#comm_icon_qc--svgSprite:all"></use>
                      </svg>
                    </div>
                  </div>

                  <div @click="showLoginPass = !showLoginPass" class="absolute !left-auto !right-4  top-1/2 transform -translate-y-1/2 p-2 py-1">
                    <svg v-if="!showLoginPass" class=" w-[1.8rem] h-[1.8rem] fill-[var(--color-inactive66)]">
                      <use xlink:href="#comm_icon_hide--svgSprite:all"></use>
                    </svg>
                    <svg v-else class=" w-[1.8rem] h-[1.8rem] fill-[var(--color-active)]">
                      <use xlink:href="#comm_icon_show--svgSprite:all"></use>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="flex items-center h-[2rem] mb-4">
                <Checkbox v-model="loginForm.rememberMe" icon-size="1.6rem" shape="square">
                  <span class="ml-2 text-[1rem]">
                    Lembre-se da senha da conta
                  </span>
                </Checkbox>
              </div>
              <Button variant="primary" block class="px-6 py-3 text-lg" @click="handleLogin" :style="{
                height: '3.5rem',
                fontSize: '1.2rem'
              }">
                Login
              </Button>

              <!-- 底部链接 -->
              <div class="flex justify-around mt-4">
                <a @click="handleSupportClick" class="text-[1rem]" style="color: var(--color-active);">
                  Suporte ao cliente
                </a>
                <a @click.prevent class="text-[1rem]" style="color: var(--color-active);">
                  Jogar Grátis
                </a>
              </div>
              </form>
            </div>
        </div>
      </div>

      <!-- 外部关闭按钮 -->
      <div class="flex justify-center mt-1 pointer-events-auto modal-content" @click.stop>
        <button @click="$emit('close')" class="p-2">
          <img :src="getConstantAssetUrl('/icons/close-icon.png')" alt="关闭" class="w-[2.5rem] h-[2.5rem]">
        </button>
      </div>
    </div>
  </Transition>

  <!-- 用户协议弹窗 -->
  <UserAgreementModal :show="showUserAgreementModal" @close="showUserAgreementModal = false"
    @agree="handleUserAgreementAgree" />

  <!-- 加载状态 -->
  <Spinner :visible="isLoading" :text="activeTab === 'register' ? 'Registrando...' : 'Fazendo login...'" />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { Mask } from "maska"



const vPhoneMask = {
  mounted: (el: HTMLInputElement) => {
    const mask = new Mask({ mask: '(##) #####-####' })
    el.addEventListener('input', () => {
      el.value = mask.masked(el.value)
    })
  }
}
import { useStore } from 'vuex'
import Checkbox from '../ui/Checkbox.vue'
import Button from '../ui/Button.vue'
import UserAgreementModal from './UserAgreementModal.vue'
import OverlayMask from '../ui/OverlayMask.vue'
import Spinner from '../ui/Spinner.vue'
import { getStoredInviteCode } from '../../utils/urlParams'
import { $confirm } from '../common/confirmDialog'
import { $toast } from '../common/toast'
import { getConstantAssetUrl } from '../../utils/assets'
import { eventBus } from '../../utils/eventBus'

const props = defineProps<{
  show: boolean
  initialTab?: 'login' | 'register'
}>()

const emit = defineEmits(['close', 'navigate-to-support'])

// Vuex store
const store = useStore()

// 弹窗状态
const activeTab = ref<'login' | 'register'>('login')
const slideDirection = ref<'left' | 'right'>('right')
const showUserAgreementModal = ref(false)
const isLoading = ref(false)



// 监听弹窗显示状态
watch(() => props.show, (show) => {
  if (show) {
    // 清除之前的错误和成功消息
    clearErrors()
  }
})
const countrySelect = ref(false);
watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})



// 注册表单数据
const registerForm = ref({
  username: '',
  password: '',
  phone: '',
  invite_code: '',
  agreeTerms: true
})

// 邀请码是否只读（如果localStorage中有邀请码则只读）
const isInviteCodeReadonly = computed(() => {
  return !!getStoredInviteCode()
})

// 登录表单数据
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false
})

// 检查是否有保存的账户
const hasSavedAccount = computed(() => {
  return !!localStorage.getItem('remembered_username')
})

const showRegisterPass = ref(false);
const showLoginPass = ref(false);

// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerForm.value.password;
  let score = 0;
  if (!password) return 0;

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);

  if (password.length >= 8) {
    score += 2;
  } else if (password.length >= 6) {
    score += 1;
  }

  let charTypeCount = 0;
  if (hasLowerCase) charTypeCount++;
  if (hasUpperCase) charTypeCount++;
  if (hasNumbers) charTypeCount++;
  if (hasSpecialChars) charTypeCount++;

  if (charTypeCount >= 3) {
    score += 2;
  } else if (charTypeCount >= 2) {
    score += 1;
  }

  if (password.length < 6) {
    return 1;
  }

  if (score >= 4) return 4;
  if (score >= 3) return 3;
  if (score >= 2) return 2;
  if (score >= 1) return 1;

  return score;
});

// 获取密码强度条的样式类
const getPasswordStrengthBarClass = (barIndex: number) => {
  if (passwordStrength.value < barIndex) {
    return 'bg-[var(--color-inactive66)]'
  }

  // 根据密码强度等级返回不同颜色
  switch (passwordStrength.value) {
    case 1:
      return 'bg-[var(--color-error)]'      // 红色 - 弱
    case 2:
      return 'bg-[var(--color-warning)]'    // 黄色 - 中等
    case 3:
      return 'bg-[var(--color-warning)]'    // 黄色 - 良好
    case 4:
      return 'bg-[var(--color-success)]'    // 绿色 - 强
    default:
      return 'bg-[var(--color-inactive66)]'
  }
}

// 切换Tab
const switchTab = (tab: 'login' | 'register') => {
  if (activeTab.value === tab) return

  // 根据切换方向设置动画方向
  if (tab === 'register') {
    // 点击注册（左侧），从左侧滑入
    slideDirection.value = 'left'
  } else {
    // 点击登录（右侧），从右侧滑入
    slideDirection.value = 'right'
  }

  activeTab.value = tab
}

// 清除错误信息
const clearErrors = () => {
  store.dispatch('auth/clearError')
}

// 表单验证
const validateLoginForm = () => {
  if (!loginForm.value.username.trim()) {
    $toast.error('Por favor, insira o nome de usuário ou telefone')
    return false
  }
  if (!loginForm.value.password.trim()) {
    $toast.error('Por favor, insira a senha')
    return false
  }
  return true
}

const validateRegisterForm = () => {
  const username = registerForm.value.username.trim()
  const phone = registerForm.value.phone.trim()
  const password = registerForm.value.password.trim()
  const inviteCode = registerForm.value.invite_code.trim()

  if (!username) {
    $toast.error('Por favor, insira o nome de usuário')
    return false
  }
  if (username.length > 46) {
    $toast.error('O nome de usuário não pode exceder 46 caracteres')
    return false
  }

  if (!phone) {
    $toast.error('Por favor, insira o número de celular')
    return false
  }

  // 验证手机号码位数（巴西手机号为11位）
  const cleanPhone = phone.replace(/\D/g, '')
  if (!/^\d{11}$/.test(cleanPhone)) {
    $toast.error('O número de telefone deve conter 11 dígitos.')
    return false
  }

  if (!password) {
    $toast.error('Por favor, insira a senha')
    return false
  }

  if (password.length < 6) {
    $toast.error('A senha deve ter pelo menos 6 caracteres')
    return false
  }

  if (password.length > 20) {
    $toast.error('A senha não pode exceder 20 caracteres')
    return false
  }

  if (!inviteCode) {
    $toast.error('Por favor, insira o código de convite')
    return false
  }

  // 验证邀请码格式
  if (!inviteCode.includes(':')) {
    $toast.error('Formato do código de convite inválido, deve usar prefixo id: ou ic:')
    return false
  }

  const [prefix, id] = inviteCode.split(':')
  if (!['id', 'ic'].includes(prefix) || !id || isNaN(Number(id))) {
    $toast.error('Formato do código de convite inválido, deve usar prefixo id: ou ic:')
    return false
  }

  if (!registerForm.value.agreeTerms) {
    $toast.error('Por favor, concorde com o contrato do usuário')
    return false
  }
  return true
}

// 登录错误码翻译
const translateLoginError = (code: number, defaultMsg: string): string => {
  const errorMessages: Record<number, string> = {
    1001: 'Número de telefone ou senha incorretos', // 手机号或密码错误
    2001: 'Número de telefone ou senha não podem estar vazios', // 手机号或密码不能为空
    0: 'Falha no login, tente novamente' // 登录失败，请重试
  }

  return errorMessages[code] || defaultMsg
}

// 注册错误码翻译
const translateRegisterError = (code: number, defaultMsg: string): string => {
  const errorMessages: Record<number, string> = {
    1001: 'Formato do código de convite inválido, deve usar prefixo id: ou ic:', // 邀请码格式错误，必须使用id:或ic:前缀
    1002: 'Nome de usuário já existe', // 用户名已存在
    1003: 'Número de celular já registrado', // 手机号已注册
    1004: 'Agente não existe', // 业务员不存在
    1005: 'Código de convite inválido', // 邀请码无效
    1006: 'Falha no registro' // 注册失败
  }

  return errorMessages[code] || defaultMsg
}
const showLoginPhoneClose = computed(() => {
  return loginForm.value.username.length > 0;
})
const showLoginPassClose = computed(() => {
  return loginForm.value.password.length > 0;
})

// 注册表单清除按钮显示逻辑
const showRegisterUsernameClose = computed(() => {
  return registerForm.value.username.length > 0;
})
const showRegisterPasswordClose = computed(() => {
  return registerForm.value.password.length > 0;
})
const showRegisterPhoneClose = computed(() => {
  return registerForm.value.phone.length > 0;
})
// 处理注册
const handleRegister = async () => {
  clearErrors()

  if (!validateRegisterForm()) {
    return
  }

  isLoading.value = true

  try {
    const result = await store.dispatch('auth/register', {
      username: registerForm.value.username,
      phone_number: registerForm.value.phone.replace(/\D/g, ''),
      password: registerForm.value.password,
      invite_code: registerForm.value.invite_code
    })

    if (result.success) {
      console.log('注册成功:', result.data)
      isLoading.value = false // 注册成功后立即隐藏 spinner

      // 注册成功后保存用户名和密码到localStorage（自动记住）
      localStorage.setItem('remembered_username', registerForm.value.username)
      localStorage.setItem('remembered_password', registerForm.value.password)

      // 注册成功后显示确认框
      const initGift = store.getters['site/initGift']
      await showRegistrationSuccessDialog(initGift)

      // 关闭登录弹窗
      emit('close')
    } else {
      isLoading.value = false // 注册失败时隐藏 spinner
      // 尝试解析错误码进行翻译
      let errorMsg = result.error || 'Falha no registro'

      // 如果错误信息包含错误码，尝试翻译
      if (result.errorCode) {
        errorMsg = translateRegisterError(result.errorCode, errorMsg)
      }

      // 使用toast显示错误信息
      $toast.error(errorMsg)
    }
  } catch (error: any) {
    isLoading.value = false // 发生错误时隐藏 spinner

    // catch块现在主要处理网络错误等异常
    const errorMsg = error instanceof Error ? error.message : 'Falha no registro, tente novamente'
    $toast.error(errorMsg)
    console.error('注册错误:', error)
  }
}

// 处理登录
const handleLogin = async () => {
  clearErrors()

  if (!validateLoginForm()) {
    return
  }

  isLoading.value = true

  try {
    const result = await store.dispatch('auth/login', {
      phone_number: loginForm.value.username,
      password: loginForm.value.password
    })

    if (result.success) {
      console.log('登录成功:', result.data)

      // 如果选择了记住密码，保存用户名和密码到localStorage
      if (loginForm.value.rememberMe) {
        localStorage.setItem('remembered_username', loginForm.value.username)
        localStorage.setItem('remembered_password', loginForm.value.password)
      } else {
        localStorage.removeItem('remembered_username')
        localStorage.removeItem('remembered_password')
      }

      // 登录成功后直接关闭弹窗
      emit('close')
    } else {
      // 尝试翻译错误码
      let errorMsg = result.error || 'Falha no login'

      // 如果有错误码，尝试翻译
      if (result.errorCode) {
        errorMsg = translateLoginError(result.errorCode, errorMsg)
      }

      $toast.error(errorMsg)
    }
  } catch (error) {
    $toast.error('Falha no login, tente novamente')
    console.error('登录错误:', error)
  } finally {
    isLoading.value = false
  }
}

// 显示注册成功确认框
const showRegistrationSuccessDialog = async (initGift: number = 0) => {
  try {
    let message = 'Registro bem-sucedido! Comece a jogar agora~'
    if (initGift > 0) {
      message = `Registro bem-sucedido! Você recebeu um bônus de R$ ${initGift}!`
    }
    
    await $confirm({
      title: 'Lembrete',
      message: message,
      confirmText: 'Depositar Agora',
      cancelText: '',
      showCloseIcon: true
    })
    // 用户点击"Depositar Agora"后的处理
    console.log('用户选择立即充值')

    // 使用事件总线触发充值弹窗
    eventBus.emit('open-deposit-modal')
  } catch (error) {
    // 用户关闭对话框或其他错误
    console.log('注册成功对话框被关闭')
  }
}

// 处理支持客服点击
const handleSupportClick = () => {
  // 关闭弹窗并跳转到支持页面
  emit('close')
  emit('navigate-to-support')
}

// 显示用户协议弹窗
const showUserAgreement = () => {
  showUserAgreementModal.value = true
}

// 处理用户协议同意
const handleUserAgreementAgree = () => {
  registerForm.value.agreeTerms = true
}

// 组件挂载时初始化数据
onMounted(() => {
  // 自动填充邀请码
  const storedInviteCode = getStoredInviteCode()
  if (storedInviteCode) {
    registerForm.value.invite_code = storedInviteCode
    console.log('自动填充邀请码:', storedInviteCode)
  }

  // 恢复记住的用户名和密码
  const rememberedUsername = localStorage.getItem('remembered_username')
  const rememberedPassword = localStorage.getItem('remembered_password')
  if (rememberedUsername) {
    loginForm.value.username = rememberedUsername
    loginForm.value.rememberMe = true
  }
  if (rememberedPassword) {
    loginForm.value.password = rememberedPassword
  }
})
</script>

<style>
/* Tab按钮样式 */
.tab-button.tab-active {
  color: var(--color-active);
}

/* 表单输入框样式 */
.form-input {
  border-color: var(--color-inactive66);
  color: var(--color-white);
  caret-color: var(--color-white);
}

/* SVG图标简单定位 */
.form-input+svg,
.form-input~svg {
  top: 50%;
  left: 1rem;
}

.form-input:focus {
  --tw-ring-color: var(--color-active);
}

.form-input::placeholder {
  color: var(--color-inactive66);
  font-size: inherit;
}

/* 移除浏览器默认的密码显示/隐藏按钮 */
.form-input::-ms-reveal,
.form-input::-ms-clear {
  display: none;
}

.form-input::-webkit-credentials-auto-fill-button {
  display: none !important;
}

.form-input::-webkit-strong-password-auto-fill-button {
  display: none !important;
}

/* 自定义组件样式 */

/* 链接样式 */
.link-text {
  color: var(--color-active);
}


/* 弹窗动画 */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-to {
  opacity: 1;
}

.modal-leave-from {
  opacity: 1;
}

.modal-leave-to {
  opacity: 0;
}

/* 弹窗内容缩放动画 */
.modal-enter-from .modal-content {
  transform: scale(0.7);
  opacity: 0;
}

.modal-enter-to .modal-content {
  transform: scale(1);
  opacity: 1;
}

.modal-leave-from .modal-content {
  transform: scale(1);
  opacity: 1;
}

.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}

.modal-content {
  transition: all 0.3s ease-out;
}

/* 表单滑动动画 - 使用 opacity + visibility 方案 */
.form-slide-item {
  transition: transform 0.3s linear;
}

.form-active {
  transform: translateX(0);
  visibility: visible;
  position: relative;
}

.form-inactive-left {
  transform: translateX(-100%);
  visibility: hidden;
}

.form-inactive-right {
  transform: translateX(100%);
  visibility: hidden;
}



</style>