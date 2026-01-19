<template>
  <div class="w-full">
    <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] p-[.75rem]">
      <p class="text-white text-[1rem] font-[700] mb-[.5rem]">Registrar Subordinados</p>
      <p class="text-white/70 text-[.9rem] mb-[.5rem]">
        Compartilhe seu link de convite para que seus subordinados se registrem. Você pode alternar entre formatos de link conforme necessário.
      </p>
      <div class="flex items-center justify-between border border-[var(--color-border-2)] rounded-[.375rem] p-[.5rem]">
        <span class="text-[var(--color-text-link)] text-[.85rem]">{{ inviteLink }}</span>
        <div class="flex items-center gap-[.5rem]">
          <button class="px-[.5rem] h-[2rem] rounded-[.375rem] bg-[var(--color-bg-aside)] text-white/80" @click="toggleLinkFormat">
            Alternar formato
          </button>
          <button class="px-[.5rem] h-[2rem] rounded-[.375rem] bg-[var(--color-active)] text-[var(--color-main-bg)]" @click="copyLink">
            Copiar
          </button>
        </div>
      </div>
    </div>
  </div>
 </template>
 <script setup lang="ts">
 import { computed, ref } from 'vue'
 import { useAuthStore } from '../../stores/auth'
 
 const auth = useAuthStore()
 const useOldLinkFormat = ref(true)
 const getSiteUrl = () => {
   try {
     const fromEnv = (import.meta.env.VITE_SHARE_BASE_URL as string) || ''
     return fromEnv || (typeof window !== 'undefined' ? window.location.origin : 'https://dtfl.com')
   } catch {
     return 'https://dtfl.com'
   }
 }
 const inviteLink = computed(() => {
   const user = auth.user
   if (user?.player_type === 'virtual') return ''
   const id = String(user?.id ?? '')
   const baseUrl = getSiteUrl()
   return useOldLinkFormat.value ? `${baseUrl}/?id=${id}&currency=BRL&type=2` : `${baseUrl}/${id}`
 })
 const toggleLinkFormat = () => { useOldLinkFormat.value = !useOldLinkFormat.value }
 const copyLink = async () => {
   try {
     await navigator.clipboard.writeText(inviteLink.value)
     window.showToast?.('Cópia Bem-sucedida')
   } catch {
     window.showToast?.('Cópia Falhou')
   }
 }
 </script>
 <style scoped></style>
