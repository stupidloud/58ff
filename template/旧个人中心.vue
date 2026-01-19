<template>
  <div class="h-screen flex flex-col relative z-10">
    <!-- 主内容区域 -->
    <main
      class="flex-1 flex flex-col items-center justify-start overflow-y-auto mb-[6rem] text-white bg-[var(--color-bg-primary)]">

      <!-- Header 区块 -->
      <div :style="{ backgroundImage: `url(${getConstantAssetUrl('/profile_bg.png')})` }" class="w-full header-section bg-no-repeat bg-[length:100%] bg-[position:0_0]">
        <!-- Option 区域 - 顶部三个图标 -->
        <div class="option flex justify-end items-center py-2 px-4 pb-0.5">
          <div class="flex items-center gap-6">
            <!-- Suporte -->
            <div
              class="flex flex-col items-center"
              @click="router.push('/support')"
            >
              <div class="w-8 h-8 text-[var(--color-active)]">
                <svg fill="currentColor" class="w-full h-full">
                  <use xlink:href="#style_1_icon_top_kf--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xs">Suporte</span>
            </div>

            <!-- Mensagem -->
            <div
              class="flex flex-col items-center"
              @click="router.push({ path: '/support', query: { tab: 'noticia' } })"
            >
              <div class="w-8 h-8 text-[var(--color-active)]">
                <svg fill="currentColor" class="w-full h-full">
                  <use xlink:href="#style_1_icon_top_xxyd--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xs">Mensagem</span>
            </div>

            <!-- Perfil -->
            <div
              class="flex flex-col items-center"
              @click="router.push('/dados')"
            >
              <div class="w-8 h-8 text-[var(--color-active)]">
                <svg fill="currentColor" class="w-full h-full">
                  <use xlink:href="#style_1_icon_top_grzl--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xs">Perfil</span>
            </div>
          </div>
        </div>

        <!-- 用户信息区域 -->
        <div class="flex items-center px-5 pb-5 gap-5">
          <!-- 用户头像 -->
          <div class="w-18 h-18 overflow-hidden">
            <img :src="avatarSrc" alt="Avatar do usuário" class="w-full h-full object-cover" />
          </div>

          <!-- 用户信息 -->
          <div class="flex-1">
            <div v-if="userProfile" class="flex items-center gap-2 mb-1">
              <span class="text-lg font-medium text-[var(--color-highlight-text)]">Conta:</span>
              <span class="text-lg font-medium text-white">{{ displayUsername }}</span>
            </div>
            <div v-if="userProfile" class="flex items-center gap-2 mb-2">
              <span class="text-xl font-medium text-[var(--color-highlight-text)]">ID:</span>
              <span class="text-xl font-medium text-white">{{ userProfile.id }}</span>
              <button @click="handleCopy(userProfile.id.toString())" class="ml-1">
                <svg class="w-6 h-6 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_copy--svgSprite:all"></use>
                </svg>
              </button>
              <!-- 巴西国旗 -->
              <div class="w-6 h-6 overflow-hidden ml-4">
                <img :src="getConstantAssetUrl('/flag_br.png')" alt="巴西国旗" class="w-full h-full object-cover" />
              </div>
              <span class="text-xl font-medium text-white">{{ formatCurrency(userBalance) }}</span>
              <button @click="spin" :style="spinStyle" :class="{ 'opacity-50 pointer-events-none': isRefreshing }" class="ml-1 transition-transform duration-1500 ease-in-out">
                <svg class="w-6 h-6 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#comm_icon_sx--svgSprite:all"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 功能按钮区域 -->
        <div class="flex justify-between px-4 gap-4">
          <!-- Saque 按钮 -->
          <div @click="router.push('/saque')" class="flex-1 flex flex-col items-center rounded-lg p-3">
            <div class="w-11 h-11 mb-2 text-[var(--color-active)]">
              <svg fill="currentColor" class="w-full h-full">
                <use xlink:href="#style_1_icon_mid_tx--svgSprite:all"></use>
              </svg>
            </div>
            <span class="text-base font-medium">Saque</span>
          </div>

          <!-- Depósito 按钮 -->
          <button class="flex-1 flex flex-col items-center rounded-lg p-3" @click="openDepositModal">
            <div class="w-11 h-11 mb-2 text-[var(--color-active)]">
              <svg fill="currentColor" class="w-full h-full">
                <use xlink:href="#style_1_icon_mid_cz--svgSprite:all"></use>
              </svg>
            </div>
            <span class="text-base font-medium">Depósito</span>
          </button>
        </div>
      </div>

      <!-- VIP 区块 -->
      <div class="w-full vip-section">
        <div class="rounded-lg p-4 mx-4 bg-[var(--color-active)]">
          <div @click="router.push({ path: '/promotion', query: { tab: 'vip' } })" class="flex items-center justify-between pb-4 border-b border-black/10">
            <div class="flex items-center">
              <span
                class="h-[1.6rem] leading-[1.6rem] px-4 bg-[#24b299] rounded-tl-[0.7rem] rounded-br-[0.7rem] mr-4 text-white font-semibold flex items-center">VIP{{ userProfile?.vip_level || 0 }}</span>
              <span class="pr-[4rem] leading-tight text-lg text-[var(--color-inactive)]">Restante <span
                  class="text-[var(--color-bg-primary)]">VIP{{ (userProfile?.vip_level || 0) + 1 }}</span> Valor restante para depósito <span
                  class="text-[var(--color-bg-primary)]">{{ formatCurrency(Math.max(0, getVipProgress.deposit.max - getVipProgress.deposit.current)) }}</span> Valor restante para aposta <span
                  class="text-[var(--color-bg-primary)]">{{ formatCurrency(Math.max(0, getVipProgress.bet.max - getVipProgress.bet.current)) }}</span></span>
            </div>
            <svg class="rotate-180 w-6 h-6 fill-[var(--color-bg-primary)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <div class="flex items-start mt-4 gap-4">
            <!-- VIP 徽章 -->
            <VipBadge :vip-level="userProfile?.vip_level || 0" size="large" />

            <!-- 进度信息 -->
            <div class="flex-1">
              <div class="flex items-center mb-4 gap-x-3">
                <div class="w-32 leading-[1.1] text-base text-[var(--color-inactive)]">Depósito para Promoção</div>
                <Progress
                  :current="getVipProgress.deposit.current"
                  :max="getVipProgress.deposit.max"
                  width="100%"
                  container-class="flex-1"
                />
              </div>

              <div class="flex items-center mb-4 gap-x-3">
                <div class="w-32 leading-[1.1] text-base text-[var(--color-inactive)]">Aposta para Promoção</div>
                <Progress
                  :current="getVipProgress.bet.current"
                  :max="getVipProgress.bet.max"
                  width="100%"
                  container-class="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第一个菜单板块 -->
      <div class="w-full menu-section-1 px-4 mt-4">
        <div class="flex flex-col gap-3">
          <!-- Recuperar o saldo -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push('/saque')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[rgb(255,240,187)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_zhye--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Recuperar o saldo</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Conta -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push({ path: '/saque', query: { tab: 'Registro' } })"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-warning)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_zhmx--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Conta</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Apostas -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push('/apostas')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-success)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_tzjl--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Apostas</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Gestão de Saques -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push({ path: '/saque', query: { tab: 'Gerenciar' } })"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-error)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_txgl--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Gestão de Saques</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>
        </div>
      </div>

      <!-- 板块间隔线 -->
      <div class="w-full h-4 flex-shrink-0 min-h-4 block bg-[var(--color-bg-main)]">&nbsp;</div>

      <!-- 第二个菜单板块 -->
      <div class="w-full menu-section-2 px-4 mb-40">
        <div class="flex flex-col gap-3">
          <!-- Convidar -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push('/agent')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_tgzq--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Convidar</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Dados -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push('/dados')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#icon_wd_grzl--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Dados</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Segurança -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push('/seguranca')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_aqzx--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Segurança</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Música -->
          <div class="flex items-center justify-between p-4" @click="openMusicModal">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_yy--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Música</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- FAQ -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push('/support')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_cjwt--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">FAQ</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Bônus de Sugestão -->
          <div
            class="flex items-center justify-between p-4"
            @click="router.push({ path: '/support', query: { tab: 'bonus-sugestao' } })"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_yjfk--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">Bônus de Sugestão</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </div>

          <!-- Sair -->
          <button
            class="flex items-center justify-between p-4"
            @click="handleLogout"
            :disabled="loading"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-8 h-8 text-[var(--color-active)]" fill="currentColor">
                  <use xlink:href="#style_1_icon_list_aqtc--svgSprite:all"></use>
                </svg>
              </div>
              <span class="text-xl">{{ loading ? 'Saindo...' : 'Sair' }}</span>
            </div>
            <svg class="rotate-180 w-5 h-5 fill-[var(--color-inactive)]">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </button>
        </div>
      </div>

    </main>






  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'
import VipBadge from '../ui/VipBadge.vue'
import Progress from '../ui/Progress.vue'
import { playerApi, vipApi, type User, type VipLevel } from '../../services/api'
import { virtualPlayerStorage } from '../../services/virtualPlayerStorage'

// 定义props(接收从App.vue传递的属性,但不使用)
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// Vuex store 和 router
const store = useStore()
const router = useRouter()

// 从store获取状态
const loading = computed(() => store.getters['auth/loading'])
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const storeUser = computed(() => store.getters['auth/user'])

// 显示用户名（优先显示虚拟玩家的自定义用户名）
const displayUsername = computed(() => {
  const user = storeUser.value
  if (!user) return ''

  // 如果是虚拟玩家，优先使用自定义用户名
  if (virtualPlayerStorage.isVirtualPlayer(user)) {
    const customUsername = virtualPlayerStorage.getCustomUsername(user.id)
    if (customUsername) {
      return customUsername
    }
  }

  // 否则使用原始用户名
  return user.username || ''
})

// 本地状态
const userProfile = ref<User | null>(null)
const profileLoading = ref(false)
const profileError = ref('')

// VIP相关状态
const vipLevels = ref<VipLevel[]>([])
const vipLoading = ref(false)

// 余额刷新相关状态
const angle = ref(0) // 当前总角度
const isRefreshing = ref(false) // 刷新状态

// 计算属性
const userBalance = computed(() => {
  return userProfile.value?.balance || storeUser.value?.balance || 0
})

const avatarSrc = computed(() => {
  if (userProfile.value && userProfile.value.id) {
    return userProfile.value.id % 2 === 0
      ? getConstantAssetUrl('/avatars/avatar_1.png')
      : getConstantAssetUrl('/avatars/avatar_2.png')
  }
  return getConstantAssetUrl('/avatars/avatar_1.png') // 默认头像
})

const spinStyle = computed(() => ({
  transform: `rotate(${angle.value}deg)`,
}))

import { goCopy } from '../../utils/clipboard'
import { getConstantAssetUrl } from '../../utils/assets'

import { eventBus } from '../../utils/eventBus'

// 格式化货币
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}



// 获取VIP要求数据
const fetchVipRequirements = async () => {
  try {
    vipLoading.value = true

    const response = await vipApi.getRequirements()

    if (response.code === 1) {
      vipLevels.value = response.data.levels || []
      console.log('VIP等级数据加载成功:', vipLevels.value)
    } else {
      console.error('获取VIP数据失败:', response.msg)
    }
  } catch (err) {
    console.error('获取VIP数据错误:', err)
  } finally {
    vipLoading.value = false
  }
}



// 计算VIP进度
const getVipProgress = computed(() => {
  if (!userProfile.value || !vipLevels.value.length) {
    return { deposit: { current: 0, max: 20 }, bet: { current: 0, max: 20 } }
  }

  const currentLevel = userProfile.value.vip_level || 0
  const nextLevel = currentLevel + 1

  // 从VIP等级数据中找到下一级的要求
  const nextLevelData = vipLevels.value.find(level => level.level === nextLevel)

  if (!nextLevelData) {
    // 已达到最高等级
    return {
      deposit: { current: 100, max: 100 },
      bet: { current: 100, max: 100 }
    }
  }

  // 只使用用户数据，不使用VIP信息
  const userDeposit = userProfile.value.total_deposit || 0
  const userBet = userProfile.value.total_bet || 0



  return {
    deposit: {
      current: Number(userDeposit) || 0,
      max: Number(nextLevelData.deposit_requirement) || 0
    },
    bet: {
      current: Number(userBet) || 0,
      max: Number(nextLevelData.turnover_requirement) || 0
    }
  }
})

const { proxy } = getCurrentInstance() as any
const $confirm = proxy.$confirm as (options: any) => Promise<boolean>
// 定义事件(接收从App.vue传递的事件监听器)
const emit = defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

// 打开充值弹窗
const openDepositModal = () => {
  emit('open-deposit-modal')
}

// 打开音乐播放器弹窗
const openMusicModal = () => {
  eventBus.emit('open-music-modal')
}




// 复制
// 刷新余额函数
const refreshBalance = async () => {
  if (isRefreshing.value || !isAuthenticated.value) return // 防止重复请求

  try {
    isRefreshing.value = true
    console.log('正在刷新余额...')

    const response = await playerApi.getBalance()

    if (response.code === 1) {
      // 更新store中的用户余额
      await store.dispatch('auth/updateBalance', response.data.balance)
      // 同时更新本地userProfile
      if (userProfile.value) {
        userProfile.value = { ...userProfile.value, balance: response.data.balance }
      }
      console.log('余额刷新成功:', response.data.balance)
    } else {
      console.error('刷新余额失败:', response.msg)
    }
  } catch (error) {
    console.error('刷新余额错误:', error)
  } finally {
    isRefreshing.value = false
  }
}

// spin 动作函数
const spin = () => {
  angle.value += 1080 // 每次加三圈（360 x 3）
  refreshBalance() // 调用刷新余额API
}

// 获取用户资料
const fetchUserProfile = async () => {
  if (!isAuthenticated.value) {
    return
  }

  try {
    profileLoading.value = true
    profileError.value = ''

    const response = await playerApi.getBalance()

    if (response.code === 1) {
      // 更新用户余额信息
      if (storeUser.value) {
        userProfile.value = {
          ...storeUser.value,
          balance: response.data.balance
        }
      }
      console.log('用户资料更新成功:', userProfile.value)
    } else {
      profileError.value = response.msg || '获取用户信息失败'
      console.error('获取用户资料失败:', response.msg)
    }
  } catch (err) {
    profileError.value = err instanceof Error ? err.message : '网络错误'
    console.error('获取用户资料错误:', err)
  } finally {
    profileLoading.value = false
  }
}

// 使用公用的复制方法
const handleCopy = (text: string) => {
  goCopy(text)
}
// 处理退出登录
const handleLogout = async () => {
  if (!$confirm) {
    console.error('确认框服务未正确初始化')
    return
  }

  try {
    const confirmed = await $confirm({
      title: 'Lembrete',
      message: 'Deseja terminar sessão da conta?',
      confirmText: 'Confirmar saída',
      cancelText: 'Cancelar'
    })
    if (confirmed) {
      // 执行退出登录逻辑
      console.log('用户确认退出登录')

      // 调用store的logout action
      await store.dispatch('auth/logout')
      console.log('退出登录成功')

      // 跳转到首页
      router.push('/')

    }
  } catch (error) {
    // 用户取消或其他错误
    console.log('退出登录被取消')
  }
}



// 组件挂载时获取用户资料
onMounted(async () => {
  // VIP要求数据不需要认证，可以直接获取
  await fetchVipRequirements()

  if (isAuthenticated.value) {
    userProfile.value = storeUser.value
    // 获取需要认证的数据
    await fetchUserProfile()
  }
})
</script>

<style scoped>
/* 个人页面特定样式 */
/* 所有区块的高度由内部内容决定 */
</style>
