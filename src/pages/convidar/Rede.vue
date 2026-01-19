<template>
  <div class="w-full">
    <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)]">
      <div class="p-[.75rem] border-b border-[var(--color-border-2)]">
        <p class="text-white text-[1rem] font-[700]">Resumo</p>
      </div>
      <div class="p-[.75rem]">
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Convidados</span>
          <span class="text-white">{{ totalStats?.invited_count ?? 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depositante</span>
          <span class="text-white">{{ totalStats?.depositor_count ?? 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depositante válido</span>
          <span class="text-white">{{ totalStats?.valid_depositor_count ?? 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depósito Total</span>
          <span class="text-white">{{ formatCurrency(totalStats?.total_deposit ?? 0) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Total de apostas</span>
          <span class="text-white">{{ formatCurrency(totalStats?.total_bet ?? 0) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem]">
          <span class="text-white/60">Comissão</span>
          <span class="text-[var(--color-warning)]">{{ formatCurrency(totalStats?.commission ?? 0) }}</span>
        </div>
      </div>
    </div>

    <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] mt-[.75rem]">
      <div class="p-[.75rem] border-b border-[var(--color-border-2)]">
        <p class="text-white text-[1rem] font-[700]">Nível 1</p>
      </div>
      <div class="p-[.75rem]">
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Convidados</span>
          <span class="text-white">{{ getStatsByLevel(1)?.invited_count || 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depositante</span>
          <span class="text-white">{{ getStatsByLevel(1)?.depositor_count || 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depositante válido</span>
          <span class="text-white">{{ getStatsByLevel(1)?.valid_depositor_count || 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depósito Total</span>
          <span class="text-white">{{ formatCurrency(getStatsByLevel(1)?.total_deposit || 0) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem]">
          <span class="text-white/60">Total de apostas</span>
          <span class="text-white">{{ formatCurrency(getStatsByLevel(1)?.total_bet || 0) }}</span>
        </div>
      </div>
    </div>

    <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] mt-[.75rem]">
      <div class="p-[.75rem] border-b border-[var(--color-border-2)]">
        <p class="text-white text-[1rem] font-[700]">Nível 2</p>
      </div>
      <div class="p-[.75rem]">
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Convidados</span>
          <span class="text-white">{{ getStatsByLevel(2)?.invited_count || 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depositante</span>
          <span class="text-white">{{ getStatsByLevel(2)?.depositor_count || 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depositante válido</span>
          <span class="text-white">{{ getStatsByLevel(2)?.valid_depositor_count || 0 }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem] border-b border-[var(--color-border-2)]">
          <span class="text-white/60">Depósito Total</span>
          <span class="text-white">{{ formatCurrency(getStatsByLevel(2)?.total_deposit || 0) }}</span>
        </div>
        <div class="flex items-center justify-between text-[.9rem] py-[.5rem]">
          <span class="text-white/60">Total de apostas</span>
          <span class="text-white">{{ formatCurrency(getStatsByLevel(2)?.total_bet || 0) }}</span>
        </div>
      </div>
    </div>
  </div>
 </template>
 <script setup lang="ts">
 import { ref, onMounted } from 'vue'
 import { playerApi, type ReferralStats } from '../../services/api'
 
 const totalStats = ref<ReferralStats | null>(null)
 const levelStats = ref<ReferralStats[]>([])
 
 const formatCurrency = (amount: number) => {
   return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
 }
 
 const getStatsByLevel = (level: number): ReferralStats | null => {
   return levelStats.value.find(stat => stat.level === level) || null
 }
 
 const fetchReferralStats = async () => {
   try {
     const response = await playerApi.getReferralStats()
     if ((response as any).code === 1) {
       totalStats.value = (response as any).data.total_stats
       levelStats.value = (response as any).data.level_stats || []
     }
   } catch {}
 }
 
 onMounted(() => {
   fetchReferralStats()
 })
 </script>
 <style scoped></style>
