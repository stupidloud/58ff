<template>
    <div class="h-screen flex flex-col relative z-10 bg-[var(--color-bg-main)]">
        <CommonHeader>
            Segurança
        </CommonHeader>
        <div class="p-[1rem]">
            <div class="rounded-[.5rem] bg-[var(--color-bg-primary)] px-[1rem] mb-[1rem]">
                <div class="flex items-center h-[3.9rem] border-b border-[var(--color-inactive66)]">
                    <svg class="w-[15px] h-[15px] fill-[var(--color-error)]" aria-hidden="true" focusable="false">
                        <use xlink:href="#input_icon_zh--svgSprite:all"></use>
                    </svg>
                    <span class="ml-[1rem] text-white text-[1rem]">Conta do Membro</span>
                    <span class="ml-auto text-[.9rem] text-[var(--color-inactive)]">{{ userInfo?.id || '--' }}</span>
                </div>
                <div class="flex items-center h-[3.9rem] border-b border-[var(--color-inactive66)]">
                    <svg class="w-[15px] h-[15px] fill-[var(--color-active)]" aria-hidden="true" focusable="false">
                        <use xlink:href="#input_icon_sj--svgSprite:all"></use>
                    </svg>
                    <span class="ml-[1rem] text-white text-[1rem]">Telefone Celular</span>
                    <span class="ml-auto text-[.9rem] text-[var(--color-inactive)]">{{ maskedPhoneNumber }}</span>
                </div>
                <div class="flex items-center h-[3.9rem] border-b border-[var(--color-inactive66)]">
                    <svg class="w-[15px] h-[15px] fill-[var(--color-active)]" aria-hidden="true" focusable="false">
                        <use xlink:href="#input_icon_yj--svgSprite:all"></use>
                    </svg>
                    <span class="ml-[1rem] text-white text-[1rem]">Email</span>
                    <span class="ml-auto text-[.9rem] text-[var(--color-inactive)]">Não vinculado</span>
                    <svg class="w-[10px] h-[10px] fill-[var(--color-inactive)] ml-[1rem] scale-x-[-1]" aria-hidden="true" focusable="false">
                        <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                    </svg>
                </div>
                <div class="flex items-center h-[3.9rem]">
                    <svg class="w-[15px] h-[15px] fill-[var(--color-error)]" aria-hidden="true" focusable="false">
                        <use xlink:href="#icon_wd_ggyz_b--svgSprite:all"></use>
                    </svg>
                    <span class="ml-[1rem] text-white text-[1rem]">Google Authenticator</span>
                    <span class="ml-auto text-[.9rem] text-[var(--color-inactive)]">Não vinculado</span>
                    <svg class="w-[10px] h-[10px] fill-[var(--color-inactive)] ml-[1rem] scale-x-[-1]" aria-hidden="true" focusable="false">
                        <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                    </svg>
                </div>
            </div>

            <div class="rounded-[.5rem] bg-[var(--color-bg-primary)] px-[1rem]">
                <div @click="router.push('/changeLoginPass')" class="flex items-center h-[3.9rem] border-b border-[var(--color-inactive66)]">
                    <svg class="w-[15px] h-[15px] fill-[var(--color-success)]" aria-hidden="true" focusable="false">
                        <use xlink:href="#input_icon_yz--svgSprite:all"></use>
                    </svg>
                    <span class="ml-[1rem] text-white text-[1rem]">Senha de Login</span>
                    <span class="ml-auto text-[.9rem] text-[var(--color-inactive)]"></span>
                    <svg class="w-[10px] h-[10px] fill-[var(--color-inactive)] ml-[1rem] scale-x-[-1]" aria-hidden="true" focusable="false">
                        <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                    </svg>
                </div>
                <div @click="router.push('/changeWithdrawPass')" class="flex items-center h-[3.9rem] border-b border-[var(--color-inactive66)]">
                    <svg class="w-[15px] h-[15px] fill-[var(--color-error)]" aria-hidden="true" focusable="false">
                        <use xlink:href="#input_icon_card--svgSprite:all"></use>
                    </svg>
                    <span class="ml-[1rem] text-white text-[1rem]">Senha de Saque</span>
                    <span class="ml-auto text-[.9rem] text-[var(--color-inactive)]">{{ withdrawPasswordStatus }}</span>
                    <svg class="w-[10px] h-[10px] fill-[var(--color-inactive)] ml-[1rem] scale-x-[-1]" aria-hidden="true" focusable="false">
                        <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                    </svg>
                </div>
                <div class="flex items-center h-[3.9rem]">
                    <svg class="w-[15px] h-[15px] fill-[var(--color-success)]" aria-hidden="true" focusable="false">
                        <use xlink:href="#input_icon_mb--svgSprite:all"></use>
                    </svg>
                    <span class="ml-[1rem] text-white text-[1rem]">Pergunta de Segurança</span>
                    <span class="ml-auto text-[.9rem] text-[var(--color-inactive)]">Não definida</span>
                    <svg class="w-[10px] h-[10px] fill-[var(--color-inactive)] ml-[1rem] scale-x-[-1]" aria-hidden="true" focusable="false">
                        <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authApi, type User } from '../../services/api'

// 定义props(接收从App.vue传递的属性,但不使用)
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// 定义emits(接收从App.vue传递的事件监听器,但不使用)
defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

const router = useRouter()

// 响应式数据
const userInfo = ref<User | null>(null)
const loading = ref(false)

// 计算属性 - 脱敏手机号
const maskedPhoneNumber = computed(() => {
  if (!userInfo.value?.phone_number) {
    return '--'
  }

  const phone = userInfo.value.phone_number
  // 如果是巴西手机号格式 (11位数字)
  if (phone.length === 11 && /^\d+$/.test(phone)) {
    return `+55-${phone.substring(0, 2)}****${phone.substring(7)}`
  }
  // 其他格式的手机号，保留前3位和后2位
  if (phone.length > 5) {
    return `${phone.substring(0, 3)}****${phone.substring(phone.length - 2)}`
  }
  return phone
})

// 计算属性 - 提现密码状态
const withdrawPasswordStatus = computed(() => {
  if (userInfo.value?.has_withdraw_password) {
    return 'Já Definida'
  }
  return 'Não definida'
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    loading.value = true
    const response = await authApi.getProfile()
    userInfo.value = response.data.player
  } catch (error) {
    console.error('获取用户信息失败:', error)
    // 可以在这里添加错误提示
  } finally {
    loading.value = false
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>