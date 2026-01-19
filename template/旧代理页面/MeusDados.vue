<template>
  <div class="MyData pb-48 leading-[1.1] font-medium m-4">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-[var(--color-inactive)]">Carregando dados...</div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <button
        @click="fetchReferralStats"
        class="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Tentar novamente
      </button>
    </div>

    <!-- 数据内容 -->
    <div v-else class="Box">
      <!-- Tudo (总计) -->
      <div class="dataBox rounded-lg mb-4" style="background-color: var(--color-bg-primary);">
        <div class="title flex justify-between items-center p-4 border-b border-b-[var(--color-inactive)]">
          <span class="text-[1.2rem] text-white">Tudo</span>
        </div>
        <div class="box">
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Convidados</span>
            <span class="right">{{ totalStats?.invited_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante</span>
            <span class="right">{{ totalStats?.depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante válido</span>
            <span class="right">{{ totalStats?.valid_depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depósito Total</span>
            <span class="right">{{ formatCurrency(totalStats?.total_deposit || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Total de apostas</span>
            <span class="right">{{ formatCurrency(totalStats?.total_bet || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Comissão</span>
            <span class="right c2">{{ formatCurrency(totalStats?.commission || 0) }}</span>
          </div>
        </div>
      </div>
      <!-- Nível 1 -->
      <div class="dataBox rounded-lg mb-4" style="background-color: var(--color-bg-primary);">
        <div class="title flex justify-between items-center p-4 border-b border-b-[var(--color-inactive)]">
          <span class="text-[1.2rem] text-white">Nível 1</span>
        </div>
        <div class="box">
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Convidados</span>
            <span class="right">{{ getStatsByLevel(1)?.invited_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante</span>
            <span class="right">{{ getStatsByLevel(1)?.depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante válido</span>
            <span class="right">{{ getStatsByLevel(1)?.valid_depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depósito Total</span>
            <span class="right">{{ formatCurrency(getStatsByLevel(1)?.total_deposit || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Total de apostas</span>
            <span class="right">{{ formatCurrency(getStatsByLevel(1)?.total_bet || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Comissão</span>
            <span class="right c2">{{ formatCurrency(getStatsByLevel(1)?.commission || 0) }}</span>
          </div>
        </div>
      </div>
      <!-- Nível 2 -->
      <div class="dataBox rounded-lg mb-4" style="background-color: var(--color-bg-primary);">
        <div class="title flex justify-between items-center p-4 border-b border-b-[var(--color-inactive)]">
          <span class="text-[1.2rem] text-white">Nível 2</span>
        </div>
        <div class="box">
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Convidados</span>
            <span class="right">{{ getStatsByLevel(2)?.invited_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante</span>
            <span class="right">{{ getStatsByLevel(2)?.depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante válido</span>
            <span class="right">{{ getStatsByLevel(2)?.valid_depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depósito Total</span>
            <span class="right">{{ formatCurrency(getStatsByLevel(2)?.total_deposit || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Total de apostas</span>
            <span class="right">{{ formatCurrency(getStatsByLevel(2)?.total_bet || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Comissão</span>
            <span class="right c2">{{ formatCurrency(getStatsByLevel(2)?.commission || 0) }}</span>
          </div>
        </div>
      </div>
      <!-- Nível 3 -->
      <div class="dataBox rounded-lg mb-4" style="background-color: var(--color-bg-primary);">
        <div class="title flex justify-between items-center p-4 border-b border-b-[var(--color-inactive)]">
          <span class="text-[1.2rem] text-white">Nível 3</span>
        </div>
        <div class="box">
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Convidados</span>
            <span class="right">{{ getStatsByLevel(3)?.invited_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante</span>
            <span class="right">{{ getStatsByLevel(3)?.depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depositante válido</span>
            <span class="right">{{ getStatsByLevel(3)?.valid_depositor_count || 0 }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Depósito Total</span>
            <span class="right">{{ formatCurrency(getStatsByLevel(3)?.total_deposit || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Total de apostas</span>
            <span class="right">{{ formatCurrency(getStatsByLevel(3)?.total_bet || 0) }}</span>
          </div>
          <div class="flex justify-between items-center text-[1.1rem] py-[1.2rem] px-4 border-b border-b-[var(--color-inactive)]">
            <span class="left text-[var(--color-inactive)]">Comissão</span>
            <span class="right c2">{{ formatCurrency(getStatsByLevel(3)?.commission || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { playerApi, type ReferralStats } from '../../services/api'
import { eventBus } from '../../utils/eventBus'

const router = useRouter()

// 响应式数据
const loading = ref(true)
const error = ref('')
const totalStats = ref<ReferralStats | null>(null)
const levelStats = ref<ReferralStats[]>([])

// 格式化货币
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 获取推荐统计数据
const fetchReferralStats = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await playerApi.getReferralStats()

    if (response.code === 1) {
      totalStats.value = response.data.total_stats
      levelStats.value = response.data.level_stats
      console.log('推荐统计数据:', response.data)
    } else {
      // 检查是否是认证相关错误
      if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
        // 认证错误：跳转到首页并显示登录模态框
        router.push('/')
        eventBus.emit('open-login-modal', 'login')
        return // 不设置error，避免显示错误UI
      }

      error.value = response.msg || '获取数据失败'
      console.error('获取推荐统计失败:', response.msg, 'code:', response.code)
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : '网络错误'

    // 注意：认证错误现在通过response.code处理，catch块主要处理网络错误
    // 如果是网络错误等，正常显示错误信息

    error.value = errorMsg
    console.error('获取推荐统计错误:', err)
  } finally {
    loading.value = false
  }
}

// 根据级别获取统计数据
const getStatsByLevel = (level: number): ReferralStats | null => {
  return levelStats.value.find(stat => stat.level === level) || null
}

// 组件挂载时获取数据
onMounted(() => {
  fetchReferralStats()
})
</script>

<style scoped></style>
