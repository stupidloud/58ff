<template>
  <div class="w-full">
    <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] p-[.75rem]">
      <div class="flex items-center justify-between">
        <p class="text-white text-[.95rem] font-[700]">Bônus acumulado (não liberado)</p>
        <p class="text-[var(--color-warning)] text-[.95rem] font-[700]">{{ formatCurrency(totalBonusAmount) }}</p>
      </div>
      <div class="mt-[.75rem] flex items-center justify-end gap-[.5rem]">
        <button class="px-[.75rem] h-[2.25rem] rounded-[.375rem] !bg-[var(--color-bg-aside)] text-white/80 cursor-pointer" @click="showHistory = true">Histórico</button>
        <button class="px-[.75rem] h-[2.25rem] rounded-[.375rem] bg-[var(--color-active)] text-[var(--color-main-bg)] cursor-not-allowed opacity-60">Receber</button>
      </div>
    </div>

    <div v-if="showHistory" class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] p-[.75rem] mt-[.75rem]">
      <p class="text-white text-[.95rem] font-[700] mb-[.5rem]">Histórico de recompensas</p>
      <div v-for="r in invitationRewards" :key="r.id" class="flex items-center justify-between py-[.5rem] border-b border-[var(--color-border-2)]">
        <span class="text-white/60 text-[.9rem]">Dia {{ r.reward_date }}</span>
        <span class="text-white text-[.9rem]">{{ formatCurrency(r.reward_amount) }}</span>
      </div>
      <div v-if="invitationRewards.length === 0" class="text-center py-[.75rem] text-white/50">Sem registros</div>
    </div>
  </div>
 </template>
 <script setup lang="ts">
 import { ref, computed, onMounted } from 'vue'
 import { playerApi, type InvitationReward } from '../../services/api'
 
 const invitationRewards = ref<InvitationReward[]>([])
 const showHistory = ref(false)
 
 const totalBonusAmount = computed(() => {
   return invitationRewards.value.reduce((sum, r) => sum + (r.is_released === 0 ? r.reward_amount : 0), 0)
 })
 
 const formatCurrency = (amount: number) => {
   return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 }
 
 const fetchInvitationRewards = async () => {
   try {
     const response = await playerApi.getInvitationRewards()
     if ((response as any).code === 1 && (response as any).data?.rewards) {
       invitationRewards.value = (response as any).data.rewards
     }
   } catch {}
 }
 
 onMounted(() => {
   fetchInvitationRewards()
 })
 </script>
 <style scoped></style>
