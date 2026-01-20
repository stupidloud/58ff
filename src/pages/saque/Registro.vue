<template>
  <div>
    <div class="flex justify-between items-center mb-[.75rem]">
      <select v-model="selectedRange" class="h-[2.2rem] rounded-[.375rem] bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)] text-white px-[.5rem]">
        <option v-for="opt in ranges" :key="opt" :value="opt">{{ opt }}</option>
      </select>
      <div class="flex items-center">
        <span class="text-[.9rem] text-white/60">Saque Total</span>
        <span class="text-[.9rem] ml-[.3rem] text-white">{{ formatCurrency(totalWithdrawAmount) }}</span>
      </div>
    </div>

    <div v-if="loading" class="text-center py-[1rem] text-white/60">Carregando...</div>
    <div v-else>
      <div v-if="filteredRecords.length === 0" class="text-center py-[1rem] text-white/60">Sem dados</div>
      <div v-else>
        <div
          v-for="(record, index) in filteredRecords"
          :key="record.merchant_order_no"
          class="p-[.75rem] rounded-[.5rem] mb-[.5rem]"
          :class="index % 2 === 0 ? 'bg-[var(--color-bg-aside-2)]' : 'bg-[var(--color-tabbar)]'"
        >
          <div class="flex justify-between items-start mb-[.25rem]">
            <div>
              <p class="text-white text-[.9rem] font-[600]">{{ getChannelName(record.channel_code) }}</p>
              <p class="text-white/50 text-[.8rem]">{{ record.merchant_order_no || '000000000' }}</p>
            </div>
            <div class="text-right">
              <p class="text-white text-[.9rem] font-[600]">{{ formatCurrency(record.amount) }}</p>
              <p class="text-[.8rem]" :class="getStatusColor(record.audit_status)">{{ getStatusText(record.audit_status) }}</p>
            </div>
          </div>
          <div class="flex justify-between items-center text-[.8rem] text-white/60">
            <span>{{ formatDate(record.created_at) }}</span>
            <span class="text-[var(--color-active)]">Detalhes →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { withdrawApi, type WithdrawRecord, depositApi } from '../../services/api'

const ranges = ['Hoje', 'Ontem', 'Últimos 7 Dias', 'Últimos 15 Dias', 'Últimos 30 Dias', 'Tudo']
const selectedRange = ref('Hoje')
const loading = ref(false)
const allWithdrawRecords = ref<WithdrawRecord[]>([])
const channelMap = ref<Record<string, string>>({})

const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v || 0)
const formatDate = (s: string) => s

const getStatusText = (status: number) => {
  if (status >= 0 && status <= 3) return 'Pendente'
  if (status === 4 || status === 8) return 'Sucesso'
  return 'Falhou'
}
const getStatusColor = (status: number) => {
  if (status >= 0 && status <= 3) return 'text-[var(--color-warning)]'
  if (status === 4 || status === 8) return 'text-[var(--color-success)]'
  return 'text-[var(--color-active)]'
}

const getChannelName = (code: string) => channelMap.value[code] || `Canal ${code}`

const filteredRecords = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return allWithdrawRecords.value.filter(record => {
    const recordDate = new Date(record.created_at)
    switch (selectedRange.value) {
      case 'Hoje': return recordDate >= today
      case 'Ontem': {
        const y = new Date(today); y.setDate(y.getDate() - 1)
        return recordDate >= y && recordDate < today
      }
      case 'Últimos 7 Dias': {
        const w = new Date(today); w.setDate(w.getDate() - 7)
        return recordDate >= w
      }
      case 'Últimos 15 Dias': {
        const d = new Date(today); d.setDate(d.getDate() - 15)
        return recordDate >= d
      }
      case 'Últimos 30 Dias': {
        const m = new Date(today); m.setDate(m.getDate() - 30)
        return recordDate >= m
      }
      case 'Tudo':
      default: return true
    }
  })
})

const totalWithdrawAmount = computed(() =>
  filteredRecords.value
    .filter(r => r.audit_status === 4 || r.audit_status === 8)
    .reduce((sum, r) => sum + r.amount, 0)
)

const fetchChannels = async () => {
  try {
    const response = await depositApi.getChannels()
    if (response.code === 1 && (response.data as any)?.channels) {
      const map: Record<string, string> = {}
      ;(response.data as any).channels.forEach((ch: any) => { map[ch.code] = ch.name })
      channelMap.value = map
    }
  } catch {}
}
const fetchWithdrawHistory = async () => {
  try {
    const response = await withdrawApi.getHistory()
    if (response.code === 1) {
      allWithdrawRecords.value = (response.data as any).withdrawals
    }
  } catch {}
}

onMounted(async () => {
  loading.value = true
  await Promise.all([fetchChannels(), fetchWithdrawHistory()])
  loading.value = false
})
</script>

<style scoped></style>
