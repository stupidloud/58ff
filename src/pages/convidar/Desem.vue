<template>
  <div class="w-full">
    <div class="flex items-center gap-[.5rem] mb-[.75rem]">
      <input v-model="searchValue" class="flex-1 min-w-0 h-[2rem] rounded-[.375rem] px-[.5rem] !bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] text-white text-[.8rem]" placeholder="ID do Membro">
      <div class="relative overflow-hidden h-[2rem] rounded-[.375rem] px-[.5rem] !bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] text-white text-[.8rem] flex items-center justify-between cursor-pointer select-none" @click="openStartDatePicker">
        <span class="mr-[.2rem]">{{ startDate || 'Data inicial' }}</span>
        <ion-icon class="text-white/70 text-[1rem]" name="calendar-outline"></ion-icon>
        <input ref="startDateRef" v-model="startDate" type="date" class="absolute left-0 top-0 w-0 h-0 opacity-0 pointer-events-none" tabindex="-1">
      </div>
      <div class="relative overflow-hidden h-[2rem] rounded-[.375rem] px-[.5rem] !bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] text-white text-[.8rem] flex items-center justify-between cursor-pointer select-none" @click="openEndDatePicker">
        <span class="mr-[.2rem]">{{ endDate || 'Data final' }}</span>
        <ion-icon class="text-white/70 text-[1rem]" name="calendar-outline"></ion-icon>
        <input ref="endDateRef" v-model="endDate" type="date" class="absolute left-0 top-0 w-0 h-0 opacity-0 pointer-events-none" tabindex="-1">
      </div>
    </div>

    <div v-if="loading" class="text-center py-[1rem] text-white/60">Carregando dados...</div>
    <div v-else-if="error" class="text-center py-[1rem] text-red-500">{{ error }}</div>

    <div v-else>
      <div v-for="(item, index) in filteredData" :key="item.id" class="p-[.5rem] rounded-[.5rem] mb-[.5rem]" :class="index % 2 === 0 ? 'bg-[var(--color-bg-aside-2)]' : '!bg-[var(--color-bg-aside)]'">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-white mr-[.5rem] text-[.85rem]">ID {{ item.memberId }}</span>
            <ion-icon class="text-[var(--color-active)] text-[1rem]" name="copy-outline" @click="copyId(item.memberId)"></ion-icon>
          </div>
          <span class="text-white text-[.85rem]">V{{ item.vipLevel }}</span>
        </div>
        <div class="flex items-center justify-between mt-[.4rem]">
          <div class="text-white/60 text-[.8rem]">Data</div>
          <div class="text-white text-[.8rem]">{{ item.date }}</div>
        </div>
        <div class="flex items-center justify-between mt-[.2rem]">
          <div class="text-white/60 text-[.8rem]">Apostas válidas</div>
          <div class="text-white text-[.8rem]">{{ formatCurrency(item.validBets) }}</div>
        </div>
        <div class="flex items-center justify-between mt-[.2rem]">
          <div class="text-white/60 text-[.8rem]">Depósito</div>
          <div class="text-white text-[.8rem]">{{ formatCurrency(item.deposit) }}</div>
        </div>
      </div>

      <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] p-[.5rem]">
        <p class="text-white text-[.85rem] font-[700] mb-[.4rem]">Total</p>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Valor de recarga direta</span>
          <span class="text-white">{{ formatCurrency(totalStats.directRechargeValue) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Número de usuários de recarga direta</span>
          <span class="text-white">{{ totalStats.directRechargeUsers }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Valor de outras recargas</span>
          <span class="text-white">{{ formatCurrency(totalStats.otherRechargeValue) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Número de usuários de outras recargas</span>
          <span class="text-white">{{ totalStats.otherRechargeUsers }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Valor total de recarga</span>
          <span class="text-white">{{ formatCurrency(totalStats.totalRechargeValue) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Número total de usuários de recarga</span>
          <span class="text-white">{{ totalStats.totalRechargeUsers }}</span>
        </div>
        <div class="flex items-center justify-between text-[.85rem] py-[.2rem]">
          <span class="text-white/60">Recarga média</span>
          <span class="text-white">{{ formatCurrency(totalStats.averageRecharge) }}</span>
        </div>
      </div>
    </div>
  </div>
 </template>
 <script setup lang="ts">
 import { ref, computed, onMounted } from 'vue'
 import { playerApi, type ReferralData } from '../../services/api'
 
 interface MemberData {
   id: string
   memberId: string
   vipLevel: number
   date: string
   validBets: number
   deposit: number
 }
 
 const searchValue = ref('')
 const startDate = ref('')
 const endDate = ref('')
 const startDateRef = ref<HTMLInputElement | null>(null)
 const endDateRef = ref<HTMLInputElement | null>(null)
 const loading = ref(false)
 const error = ref('')
 const data = ref<MemberData[]>([])
 const rawData = ref<ReferralData[]>([])
 
 const filteredData = computed(() => {
   let filtered = data.value.filter(item => item.deposit > 0)
   if (searchValue.value) {
     filtered = filtered.filter(item => item.memberId.includes(searchValue.value))
   }
   if (startDate.value && endDate.value) {
     filtered = filtered.filter(item => {
       const parts = item.date.split('/')
       const itemDate = `${parts[2]}-${parts[1]}-${parts[0]}`
       return itemDate >= startDate.value && itemDate <= endDate.value
     })
   }
   return filtered
 })
 
 const totalStats = computed(() => {
   const filteredIds = filteredData.value.map(item => item.id)
   const filteredRaw = rawData.value.filter(item => filteredIds.includes(item.id.toString()))
   const level1 = filteredRaw.filter(item => item.level === 1)
   const others = filteredRaw.filter(item => item.level !== 1)
   const directRechargeUsers = level1.filter(i => i.total_deposit > 0).length
   const directRechargeValue = level1.reduce((sum, i) => sum + i.total_deposit, 0)
   const otherRechargeUsers = others.filter(i => i.total_deposit > 0).length
   const otherRechargeValue = others.reduce((sum, i) => sum + i.total_deposit, 0)
   const totalRechargeValue = directRechargeValue + otherRechargeValue
   const totalRechargeUsers = directRechargeUsers + otherRechargeUsers
   const averageRecharge = totalRechargeUsers > 0 ? totalRechargeValue / totalRechargeUsers : 0
   return {
     directRechargeValue,
     directRechargeUsers,
     otherRechargeValue,
     otherRechargeUsers,
     totalRechargeValue,
     totalRechargeUsers,
     averageRecharge,
   }
 })
 
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
     window.showToast?.('Cópia Bem-sucedida')
   } catch {
     window.showToast?.('Cópia Falhou')
   }
 }
 
 const mapApiData = (apiData: ReferralData[]): MemberData[] => {
   return apiData.map(item => ({
     id: item.id.toString(),
     memberId: item.id.toString(),
     vipLevel: item.vip_level,
     date: item.register_time,
     validBets: item.total_bet,
     deposit: item.total_deposit,
   }))
 }
 
 const fetchData = async () => {
   loading.value = true
   error.value = ''
   try {
     const response = await playerApi.getReferrals()
     if ((response as any).code === 1 && (response as any).data?.referrals) {
       rawData.value = (response as any).data.referrals
       data.value = mapApiData(rawData.value)
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
