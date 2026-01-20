<template>
  <div class="flex items-center space-x-3">
    <!-- 未登录状态 -->
    <template v-if="!isAuthenticated">
      <Button variant="primary" class="px-[2rem] py-[0.8rem] text-[1.1rem]" @click="$emit('open-modal', 'login')">
        Login
      </Button>
      <Button variant="outline" class="px-[2rem] py-[0.8rem] text-[1.1rem]" @click="$emit('open-modal', 'register')">
        Registro
      </Button>
    </template>

    <!-- 已登录状态 -->
    <template v-else>
      <div class="flex items-center space-x-2">
        <div
          class="flex rounded-[15rem] h-[2.2rem] px-[.2rem] items-center border-[0.1px] border-[var(--color-inactive66)] justify-between">
          <img class="w-[1.6rem] h-[1.6rem]" :src="getConstantAssetUrl('/flag_br.png')" alt="">
          <span :class="[
            'mx-[.5rem] border-b-1 transition-colors duration-200',
            isRefreshing
              ? 'text-[var(--color-inactive)] border-[var(--color-inactive)] text-[1rem]'
              : 'text-[var(--color-warning)] border-[var(--color-warning)] text-[1.2rem]'
          ]">
            {{ isRefreshing ? 'Carregando...' : formatCurrency(balance) }}
          </span>
          <svg @click="spin" :style="spinStyle" :class="{ ' pointer-events-none': isRefreshing }"
            class="transition-transform duration-1500 ease-in-out !text-[1.4rem] fill-[var(--color-active)] w-6 h-6 cursor-pointer"
            aria-hidden="true" focusable="false">
            <use xlink:href="#comm_icon_sx--svgSprite:all"></use>
          </svg>

        </div>
        <div class="relative">
          <Button variant="primary" class="flex items-center text-[1.1rem]">
            <span @click="$emit('open-deposit-modal')" class="pl-[1rem] py-[0.8rem] cursor-pointer">Depósito</span>
            <div class="w-[1px] h-[1.2rem] bg-[var(--color-bg-primary)] ml-[.5rem]"></div>
            <div @click.stop="deposMoreShow=!deposMoreShow" class="h-full px-[.7rem]">
              <svg class="w-[.7rem] h-[.7rem] fill-[var(--color-bg-primary)]" aria-hidden="true"
                focusable="false">
                <use xlink:href="#comm_icon_sort--svgSprite:all"></use>
              </svg>
            </div>
          </Button>
          <div v-show="deposMoreShow" class="rounded-[.5rem] absolute top-[3.0rem] left-[.4rem] right-[.4rem] bg-[var(--color-bg-primary)] z-10 p-[1rem] border border-[var(--color-inactive66)]">
            <p @click="router.push('/saque')" class="flex h-[3rem] text-[1.1rem] text-[white] items-center">Saque</p>

          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import Button from './Button.vue'
import { playerApi } from '../../services/api'
import { useRouter } from 'vue-router'
import { eventBus } from '../../utils/eventBus'
import { getConstantAssetUrl } from '../../utils/assets'
import { $confirm } from '../../components/common/confirmDialog/confirmDialog'
import { $toast } from '../../components/common/toast/toast'
import { formatCurrency } from '../../utils/dateUtils'
import { virtualPlayerStorage } from '../../services/virtualPlayerStorage'
const router = useRouter();
const emit = defineEmits(['open-modal', 'open-deposit-modal'])

const store = useStore()

// 从store获取状态
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const balance = computed(() => store.getters['auth/balance'])
const user = computed(() => store.getters['auth/user'])

// 判断是否为真实玩家
const isRealPlayer = computed(() => {
  return user.value ? !virtualPlayerStorage.isVirtualPlayer(user.value) : false
})

// 旋转刷新相关状态
const angle = ref(0) // 当前总角度
const isRefreshing = ref(false) // 刷新状态

const deposMoreShow = ref(false);

const spinStyle = computed(() => ({
  transform: `rotate(${angle.value}deg)`,
}))

// 刷新余额函数
async function refreshBalance(fromGameReturn = false) {
  if (isRefreshing.value) return // 防止重复请求

  try {
    isRefreshing.value = true
    console.log('正在刷新余额...')

    const response = await playerApi.getBalance()

    if (response.code === 1) {
      // 更新store中的用户余额
      await store.dispatch('auth/updateBalance', response.data.balance)
      console.log('余额刷新成功:', response.data.balance)

      // 如果是从游戏返回且余额少于0.5，执行特殊操作
      if (fromGameReturn && response.data.balance < 0.5) {
        await handleLowBalanceFromGame(response.data.balance)
      }
    } else {
      console.error('刷新余额失败:', response.msg)
    }
  } catch (error) {
    console.error('刷新余额错误:', error)
  } finally {
    isRefreshing.value = false
  }
}

// 手动点击刷新按钮
function spin() {
  angle.value += 1080 // 每次加三圈（360 x 3）
  refreshBalance()
}

// 处理从游戏返回时余额不足的情况
async function handleLowBalanceFromGame(currentBalance: number) {
  try {
    // 虚拟玩家不显示任何充值提醒，静默处理
    if (!isRealPlayer.value) {
      console.log('虚拟玩家余额不足，静默处理:', currentBalance)
      return
    }

    // 仅对真实玩家显示诱导性充值提醒
    const confirmed = await $confirm({
      title: '🎰 Oportunidade de Sorte!',
      message: `Seu saldo atual é R$ ${formatCurrency(currentBalance)}. Você estava tão perto da vitória! Faça um depósito agora e a próxima rodada pode ser a sua grande chance de ganhar! 🍀`,
      confirmText: '💰 Depositar e Ganhar',
      cancelText: 'Mais Tarde'
    })

    if (confirmed) {
      // 用户选择充值，触发充值模态框
      emit('open-deposit-modal')

      // 显示成功提示
      $toast.success('🎯 Preparando sua próxima vitória...')
    } else {
      // 用户选择稍后充值，显示友好提示
      $toast.error('⭐ Não perca sua sorte! Deposite e ganhe hoje!')
    }
  } catch (error) {
    console.error('处理余额不足确认框错误:', error)
  }
}

// 处理从游戏页面返回主页的事件
const handleGameReturnToHome = () => {
  // 只有在用户已登录时才触发刷新
  if (isAuthenticated.value) {
    // 播放动画并刷新余额，标记这是从游戏返回的刷新
    angle.value += 1080 // 每次加三圈（360 x 3）
    refreshBalance(true)
  }
}

// 组件挂载时监听事件
onMounted(() => {
  eventBus.on('game-return-to-home', handleGameReturnToHome)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  eventBus.off('game-return-to-home', handleGameReturnToHome)
})
</script>
