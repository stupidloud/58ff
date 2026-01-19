<template>
  <div class="w-full">
    <div class="flex items-center gap-[.5rem] mb-[.75rem]">
      <input
        v-model="searchValue"
        class="flex-1 min-w-0 h-[2rem] rounded-[.375rem] px-[.5rem] bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] text-white text-[.8rem]"
        placeholder="ID do Membro"
      >
      <div
        class="relative overflow-hidden h-[2rem] rounded-[.375rem] px-[.5rem] bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] text-white text-[.8rem] flex items-center justify-between cursor-pointer select-none"
        @click="openStartDatePicker"
      >
        <span class="mr-[.2rem]">{{ startDate || 'Data inicial' }}</span>
        <ion-icon class="text-white/70 text-[1rem]" name="calendar-outline"></ion-icon>
        <input ref="startDateRef" v-model="startDate" type="date" class="absolute left-0 top-0 w-0 h-0 opacity-0 pointer-events-none" tabindex="-1">
      </div>
      <div
        class="relative overflow-hidden h-[2rem] rounded-[.375rem] px-[.5rem] bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] text-white text-[.8rem] flex items-center justify-between cursor-pointer select-none"
        @click="openEndDatePicker"
      >
        <span class="mr-[.2rem]">{{ endDate || 'Data final' }}</span>
        <ion-icon class="text-white/70 text-[1rem]" name="calendar-outline"></ion-icon>
        <input ref="endDateRef" v-model="endDate" type="date" class="absolute left-0 top-0 w-0 h-0 opacity-0 pointer-events-none" tabindex="-1">
      </div>
    </div>

    <div v-if="loading" class="text-center py-[1rem] text-white/60">Carregando dados...</div>
    <div v-else-if="error" class="text-center py-[1rem] text-red-500">{{ error }}</div>

    <div v-else>
      <div v-if="filteredData.length === 0" class="text-center py-[1rem] text-white/60">Sem dados</div>

      <div v-for="(item, index) in filteredData" :key="item.id" class="p-[.5rem] rounded-[.5rem] mb-[.5rem]" :class="index % 2 === 0 ? 'bg-[var(--color-bg-aside-2)]' : 'bg-[var(--color-bg-aside)]'">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-white mr-[.5rem] text-[.85rem]">ID {{ item.memberId }}</span>
            <ion-icon class="text-[var(--color-active)] text-[1rem]" name="copy-outline" @click="copyId(item.memberId)"></ion-icon>
          </div>
          <span class="text-white text-[.85rem]">V{{ item.vipLevel }}</span>
        </div>
        <div class="grid grid-cols-2 gap-[.4rem] mt-[.4rem]">
          <div class="flex items-center justify-between">
            <div class="text-white/60 text-[.8rem]">Seus subordinados</div>
            <div class="text-white text-[.8rem]">{{ item.subordinates }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-white/60 text-[.8rem]">Data de inscrição</div>
            <div class="text-white text-[.8rem]">{{ item.registrationDate }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-white/60 text-[.8rem]">Valor do depósito</div>
            <div class="text-white text-[.8rem]">{{ formatCurrency(item.depositAmount) }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-white/60 text-[.8rem]">Apostas válidas</div>
            <div class="text-white text-[.8rem]">{{ formatCurrency(item.validBets) }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-white/60 text-[.8rem]">Data de login</div>
            <div class="text-white text-[.8rem]">{{ item.loginDate }}</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-white/60 text-[.8rem]">Status</div>
            <div class="text-[.8rem]" :class="getStatusClass(item.status)">{{ item.status }}</div>
          </div>
        </div>
      </div>

      <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] p-[.5rem]">
        <p class="text-white text-[.85rem] font-[700] mb-[.4rem]">Total</p>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Número de inscritos</span>
          <span class="text-white">{{ totalData.registeredCount }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Depósitos</span>
          <span class="text-white">{{ formatCurrency(totalData.deposits) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Primeiros Depósitos</span>
          <span class="text-white">{{ formatCurrency(totalData.firstDeposits) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Depósito</span>
          <span class="text-white">{{ formatCurrency(totalData.deposit) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Apostas Válidas</span>
          <span class="text-white">{{ formatCurrency(totalData.validBets) }}</span>
        </div>
      </div>
    </div>
  </div>
 </template>
 <script setup lang="ts">
 import { ref, computed, onMounted } from 'vue'
 import { playerApi, type ReferralData } from '../../services/api'
 
 interface SubordinadoData {
   id: string
   memberId: string
   vipLevel: number
   subordinates: number
   depositAmount: number
   registrationDate: string
   validBets: number
   loginDate: string
   status: string
 }
 
 const searchValue = ref('')
 const startDate = ref('')
 const endDate = ref('')
 const startDateRef = ref<HTMLInputElement | null>(null)
 const endDateRef = ref<HTMLInputElement | null>(null)
 const loading = ref(false)
 const error = ref('')
 const data = ref<SubordinadoData[]>([])
 const rawData = ref<ReferralData[]>([])
 
 const formatCurrency = (amount: number) => {
   return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 }
 
 const openStartDatePicker = () => {
   const el = startDateRef.value
   if (!el) return
   if (typeof (el as any).showPicker === 'function') {
     ;(el as any).showPicker()
   } else {
     el.focus()
     el.click()
   }
 }
 const openEndDatePicker = () => {
   const el = endDateRef.value
   if (!el) return
   if (typeof (el as any).showPicker === 'function') {
     ;(el as any).showPicker()
   } else {
     el.focus()
     el.click()
   }
 }
 
 const copyId = async (text: string) => {
   try {
     await navigator.clipboard.writeText(text)
     ;(window as any).showToast?.('Cópia Bem-sucedida')
   } catch {
     ;(window as any).showToast?.('Cópia Falhou')
   }
 }
 
 const getStatusClass = (status: string) => {
   if (status === 'Ativo') return 'text-[var(--color-success)]'
   if (status === 'Inativo') return 'text-[var(--color-error)]'
   return 'text-white'
 }
 
 const mapApiDataToSubordinadoData = (apiData: ReferralData[]): SubordinadoData[] => {
   return apiData.map(item => ({
     id: item.id.toString(),
     memberId: item.id.toString(),
     vipLevel: item.vip_level,
     subordinates: item.subordinate_count || 0,
     depositAmount: item.total_deposit,
     registrationDate: item.register_time,
     validBets: item.total_bet,
     loginDate: item.last_login_time,
     status: item.is_active === 1 ? 'Ativo' : 'Inativo'
   }))
 }
 
 const filteredData = computed(() => {
   let filtered = data.value
   if (searchValue.value) {
     filtered = filtered.filter(item => item.memberId.includes(searchValue.value))
   }
   if (startDate.value && endDate.value) {
     filtered = filtered.filter(item => {
       const parts = item.registrationDate.split('/')
       const itemDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : item.registrationDate
       return itemDate >= startDate.value && itemDate <= endDate.value
     })
   }
   return filtered
 })
 
 const totalData = computed(() => {
   const filteredIds = filteredData.value.map(item => item.id)
   const filteredRawData = rawData.value.filter(item => filteredIds.includes(item.id.toString()))
   const firstDepositsSum = filteredRawData.reduce((sum, item) => {
     const firstOrder = item.deposit_orders?.find(order => order.order_number === 1)
     return sum + (firstOrder?.amount || 0)
   }, 0)
   return {
     registeredCount: filteredRawData.length,
     deposits: filteredRawData.reduce((sum, item) => sum + item.total_deposit, 0),
     firstDeposits: firstDepositsSum,
     deposit: filteredRawData.reduce((sum, item) => sum + item.total_deposit, 0),
     validBets: filteredRawData.reduce((sum, item) => sum + item.total_bet, 0)
   }
 })
 
 const fetchData = async () => {
   loading.value = true
   error.value = ''
   try {
     const response = await playerApi.getReferrals()
     if ((response as any).code === 1 && (response as any).data?.referrals) {
       rawData.value = (response as any).data.referrals
       data.value = mapApiDataToSubordinadoData(rawData.value)
     } else {
       error.value = (response as any).msg || 'Erro ao carregar dados'
     }
   } catch (e: any) {
     error.value = e.message || 'Erro ao carregar dados. Tente novamente.'
   } finally {
     loading.value = false
   }
 }
 
 onMounted(() => {
   fetchData()
 })
 </script>
 <style scoped></style>
