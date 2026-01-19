<template>
  <div class="m-4">
    <div class="bg-[var(--color-bg-primary)] rounded-lg p-4 relative">
      <div
        class="absolute top-0 left-0 bg-red-500 px-1.5 py-1 text-xs rounded-tl-lg rounded-tr-[0.1rem] rounded-br-[0.1rem] rounded-bl-none text-white">
        Nível Atual
      </div>
      <div class="flex mt-4">
        <div class="left flex items-center mr-4">
          <VipBadge :vip-level="currentVipLevel" container-class="mr-4" />
          <div class="font-medium max-w-74">
            <div class="t1 flex items-center">
              <span class="text-[1.1rem] text-[var(--color-inactive)]">Restante</span>
              <span class="text-[1.1rem] text-red-500 ml-2">VIP{{ currentVipLevel + 1 }}</span>
            </div>
            <div class="t2 break-all text-[1.1rem] mt-1 leading-[1.4] text-[var(--color-inactive)]">
              Valor para Depósito <span class="text-white">{{ formatCurrency(Math.max(0, vipProgress.depositRequired - vipProgress.currentDeposit)) }}</span> Codificação <span
                class="text-white">{{ formatCurrency(Math.max(0, vipProgress.betRequired - vipProgress.currentBet)) }}</span>
            </div>
          </div>
        </div>
        <div class="right flex-1">
          <Button :disabled="true" class="mb-[0.8rem] min-w-[7rem] p-2 h-[2.5rem] leading-[1.1]">
            Coletar Tudo
          </Button>
          <Button class="min-w-[7rem] p-2 h-[2.5rem]" @click="handleHistoricoClick">
            Histórico
          </Button>
        </div>
      </div>
    </div>
    <p class="Level_List text-[1.4rem] text-white mt-8 mb-4 leading-[1.1] font-medium">Lista De Níveis VIP</p>

    <ScrollableTab :tabs="vipTabs" :default-tab="currentVipTab" :show-background="false" @tab-change="handleVipTabChange" />

    <!-- Tab内容区域 -->
    <div class="tab-content w-full">
      <!-- Bônus De Aumento De Nível tab内容 -->
      <div v-if="currentVipTab === 'bonus-aumento'" class="bonus-aumento-content">
        <div v-if="loading" class="text-center py-8 text-[var(--color-inactive)]">
          Carregando dados VIP...
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-500">
          {{ error }}
        </div>
        <div v-else>
          <!-- 表头 -->
          <ul class="h-20 border-[0.1px] border-[var(--color-inactive)] rounded-lg mt-4 mb-0 flex text-center font-medium text-white">
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[15%]">Nível</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[30%]">Depósito para<br>promoção</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[30%]">Aposta para<br>promoção</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words flex-1">Bônus</li>
          </ul>

          <!-- 动态VIP等级列表 -->
          <ul
            v-for="(level, index) in vipLevels"
            :key="level.level"
            class="py-4 rounded-lg mb-0 flex items-center text-center font-medium text-[var(--color-inactive)]"
            :class="[
              index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : '',
              index === 0 ? 'outline-1 outline-[var(--color-active)]' : ''
            ]"
          >
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words w-[15%]">
              <VipBadge :vip-level="level.level" :w="14" :h="14" />
            </li>
            <li class="flex flex-col justify-center h-full px-4 leading-[1.2] break-words w-[30%]">
              <div class="text-center mb-1">
                {{ level.deposit_requirement > 0 ? formatCurrency(level.deposit_requirement) : '—' }}
              </div>
              <!-- 只在当前级别的下一级显示充值进度条 -->
              <div v-if="isNextLevel(level) && level.deposit_requirement > 0" class="w-full">
                <Progress
                  :current="getLevelProgress(level, 'deposit').current"
                  :max="getLevelProgress(level, 'deposit').max"
                  width="100%"
                  backgroundColor="var(--color-bg-aside)"
                  containerClass="mt-1"
                />
              </div>
            </li>
            <li class="flex flex-col justify-center h-full px-4 leading-[1.2] break-words w-[30%]">
              <div class="text-center mb-1">
                {{ level.turnover_requirement > 0 ? formatCurrency(level.turnover_requirement) : '—' }}
              </div>
              <!-- 只在当前级别的下一级显示投注进度条 -->
              <div v-if="isNextLevel(level) && level.turnover_requirement > 0" class="w-full">
                <Progress
                  :current="getLevelProgress(level, 'bet').current"
                  :max="getLevelProgress(level, 'bet').max"
                  width="100%"
                  backgroundColor="var(--color-bg-aside)"
                  containerClass="mt-1"
                />
              </div>
            </li>
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words flex-1">
              <span v-if="level.level_up_bonus > 0" class="text-[var(--color-warning)]">
                {{ formatCurrency(level.level_up_bonus) }}
              </span>
              <span v-else>—</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bônus Semanal tab内容 -->
      <div v-else-if="currentVipTab === 'bonus-semanal'" class="bonus-semanal-content">
        <div v-if="loading" class="text-center py-8 text-[var(--color-inactive)]">
          Carregando dados VIP...
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-500">
          {{ error }}
        </div>
        <div v-else>
          <!-- 表头 -->
          <ul class="h-20 border-[0.1px] border-[var(--color-inactive)] rounded-lg mt-4 mb-0 flex text-center font-medium text-white">
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[15%]">Nível</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words flex-1">Bônus</li>
          </ul>

          <!-- 动态VIP等级列表 -->
          <ul
            v-for="(level, index) in vipLevels"
            :key="level.level"
            class="py-4 rounded-lg mb-0 flex items-center text-center font-medium text-[var(--color-inactive)]"
            :class="[
              index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : '',
              index === 0 ? 'outline-1 outline-[var(--color-active)]' : ''
            ]"
          >
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words w-[15%]">
              <VipBadge :vip-level="level.level" :w="14" :h="14" />
            </li>
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words flex-1">
              <span v-if="level.weekly_bonus > 0" class="text-[var(--color-warning)]">
                {{ formatCurrency(level.weekly_bonus) }}
              </span>
              <span v-else>—</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bônus Mensal tab内容 -->
      <div v-else-if="currentVipTab === 'bonus-mensal'" class="bonus-mensal-content">
        <div v-if="loading" class="text-center py-8 text-[var(--color-inactive)]">
          Carregando dados VIP...
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-500">
          {{ error }}
        </div>
        <div v-else>
          <!-- 表头 -->
          <ul class="h-20 border-[0.1px] border-[var(--color-inactive)] rounded-lg mt-4 mb-0 flex text-center font-medium text-white">
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[15%]">Nível</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words flex-1">Bônus</li>
          </ul>

          <!-- 动态VIP等级列表 -->
          <ul
            v-for="(level, index) in vipLevels"
            :key="level.level"
            class="py-4 rounded-lg mb-0 flex items-center text-center font-medium text-[var(--color-inactive)]"
            :class="[
              index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : '',
              index === 0 ? 'outline-1 outline-[var(--color-active)]' : ''
            ]"
          >
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words w-[15%]">
              <VipBadge :vip-level="level.level" :w="14" :h="14" />
            </li>
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words flex-1">
              <span v-if="level.monthly_bonus > 0" class="text-[var(--color-warning)]">
                {{ formatCurrency(level.monthly_bonus) }}
              </span>
              <span v-else>—</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Privilégio VIP tab内容 -->
      <div v-else-if="currentVipTab === 'privilegio-vip'" class="privilegio-vip-content">
        <div v-if="loading" class="text-center py-8 text-[var(--color-inactive)]">
          Carregando dados VIP...
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-500">
          {{ error }}
        </div>
        <div v-else>
          <!-- 表头 -->
          <ul class="h-20 border-[0.1px] border-[var(--color-inactive)] rounded-lg mt-4 mb-0 flex text-center font-medium text-white">
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[15%]">Nível</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[25%]">Limite Total Diário de<br>Saque</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words w-[25%]">Limite Diário de Contagem<br>de Saque</li>
            <li class="flex items-center justify-center h-full px-4 leading-[1.2] break-words flex-1">Limite Máximo<br>de Saque</li>
          </ul>

          <!-- 动态VIP等级列表 -->
          <ul
            v-for="(level, index) in vipLevels"
            :key="level.level"
            class="py-4 rounded-lg mb-0 flex items-center text-center font-medium text-[var(--color-inactive)]"
            :class="[
              index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : '',
              index === 0 ? 'outline-1 outline-[var(--color-active)]' : ''
            ]"
          >
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words w-[15%]">
              <VipBadge :vip-level="level.level" :w="14" :h="14" />
            </li>
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words w-[25%]">
              {{ formatCurrency(level.daily_max_withdraw_amount) }}
            </li>
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words w-[25%]">
              {{ level.daily_withdrawal_times }}
            </li>
            <li class="flex justify-center h-full px-4 leading-[1.2] break-words flex-1">
              {{ formatCurrency(level.max_withdraw_amount) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import VipBadge from '../ui/VipBadge.vue'
import Button from '../ui/Button.vue'
import Progress from '../ui/Progress.vue'

import { vipApi, type VipLevel } from '../../services/api'

const store = useStore()

// 定义事件
const emit = defineEmits<{
  'navigate-to-historico': []
}>()

// 响应式数据
const vipLevels = ref<VipLevel[]>([])
const loading = ref(true)
const error = ref('')

// 从store获取用户信息
const user = computed(() => store.getters['auth/user'])

// VIP Tab数据
const vipTabs = [
  {
    id: 'bonus-aumento',
    label: 'Bônus De Aumento De Nível'
  },
  {
    id: 'bonus-semanal',
    label: 'Bônus Semanal'
  },
  {
    id: 'bonus-mensal',
    label: 'Bônus Mensal'
  },
  {
    id: 'privilegio-vip',
    label: 'Privilégio VIP'
  }
]

// 当前选中的VIP tab
const currentVipTab = ref('bonus-aumento')

// 获取VIP要求数据
const fetchVipRequirements = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await vipApi.getRequirements()

    if (response.code === 1) {
      vipLevels.value = response.data.levels || []
      console.log('VIP等级数据加载成功:', vipLevels.value)
    } else {
      error.value = response.msg || '获取VIP数据失败'
      console.error('获取VIP数据失败:', response.msg)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '网络错误'
    console.error('获取VIP数据错误:', err)
  } finally {
    loading.value = false
  }
}



// 处理VIP tab切换
const handleVipTabChange = (tabId: string) => {
  currentVipTab.value = tabId
  console.log('VIP页面切换到tab:', tabId)
}

// 格式化货币显示
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 处理历史记录按钮点击
const handleHistoricoClick = () => {
  emit('navigate-to-historico')
  console.log('VIP历史记录按钮被点击，准备跳转到促销页面的历史记录tab')
}

// 计算当前VIP等级信息
const currentVipLevel = computed(() => {
  return user.value?.vip_level || 0
})

// 计算下一级VIP信息
const nextVipLevel = computed(() => {
  const nextLevel = currentVipLevel.value + 1
  return vipLevels.value.find(level => level.level === nextLevel)
})

// 计算VIP进度信息
const vipProgress = computed(() => {
  if (!nextVipLevel.value) {
    return {
      depositRequired: 0,
      betRequired: 0,
      currentDeposit: 0,
      currentBet: 0
    }
  }

  // 使用用户信息中的数据
  const currentDeposit = user.value?.total_deposit || 0
  const currentBet = user.value?.total_bet || 0

  return {
    depositRequired: nextVipLevel.value.deposit_requirement,
    betRequired: nextVipLevel.value.turnover_requirement,
    currentDeposit,
    currentBet
  }
})

// 计算特定级别的进度
const getLevelProgress = (level: VipLevel, type: 'deposit' | 'bet') => {
  const currentDeposit = user.value?.total_deposit || 0
  const currentBet = user.value?.total_bet || 0

  if (type === 'deposit') {
    return {
      current: Math.min(currentDeposit, level.deposit_requirement),
      max: level.deposit_requirement
    }
  } else {
    return {
      current: Math.min(currentBet, level.turnover_requirement),
      max: level.turnover_requirement
    }
  }
}

// 判断是否是当前级别的下一级
const isNextLevel = (level: VipLevel) => {
  return level.level === currentVipLevel.value + 1
}

// 组件挂载时获取数据
onMounted(async () => {
  await fetchVipRequirements()
})
</script>

<style scoped>
/* VIP组件样式 */
.currently_at {
  border: 1px solid var(--color-active);
}
</style>
