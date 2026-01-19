<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Senha de Login'"></NavBar>
    <div class="p-[.75rem]">
      <p class="text-white font-[600] text-[.875rem] text-left">Alterar Senha de Login</p>
      <p class="text-white/40 text-[.75rem] text-left mt-[.8rem] mb-[.5rem]">Senha Atual</p>
      <input
        v-model="oldPassword"
        type="password"
        class="w-full h-[2.75rem] bg-[var(--color-bg-aside)] border border-white/10 rounded-[.375rem] px-[.75rem] text-white text-[.9rem] focus:border-[var(--color-active)] focus:outline-none"
      />
      <p class="text-white/40 text-[.75rem] text-left mt-[1rem] mb-[.5rem]">Nova Senha</p>
      <input
        v-model="newPassword"
        type="password"
        class="w-full h-[2.75rem] bg-[var(--color-bg-aside)] border border-white/10 rounded-[.375rem] px-[.75rem] text-white text-[.9rem] focus:border-[var(--color-active)] focus:outline-none"
      />
      <p class="text-white/40 text-[.75rem] text-left mt-[1rem] mb-[.5rem]">Confirmar Nova Senha</p>
      <input
        v-model="confirmPassword"
        type="password"
        class="w-full h-[2.75rem] bg-[var(--color-bg-aside)] border border-white/10 rounded-[.375rem] px-[.75rem] text-white text-[.9rem] focus:border-[var(--color-active)] focus:outline-none"
      />
      <p class="text-[var(--color-warning)] text-[.65rem] font-[500] mt-[.75rem]">
        A senha deve ter pelo menos 6 caracteres
      </p>
      <div
        @click="handleSubmit"
        class="mt-[1.5rem] w-full h-[2.875rem] rounded-[.375rem] font-[700] text-[.875rem] flex items-center justify-center !bg-[var(--color-active)] cursor-pointer"
        :class="[ 'text-white transition-all duration-200 ease-out', (loading || !canSubmit) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:brightness-110' ]"
      >
        <span v-if="loading">Processando...</span>
        <span v-else>Confirmar Alteração</span>
      </div>
    </div>
  </div>
 </template>
 <script setup lang="ts">
 import { ref, computed } from 'vue'
 import { useRouter } from 'vue-router'
 import { authApi } from '../../services/api'
 import { showToast } from '../../components/toast/service'
 
 const router = useRouter()
 const loading = ref(false)
 const oldPassword = ref('')
 const newPassword = ref('')
 const confirmPassword = ref('')
 
 const canSubmit = computed(() => {
   const o = oldPassword.value.trim()
   const n = newPassword.value.trim()
   const c = confirmPassword.value.trim()
   return o.length > 0 && n.length >= 6 && c.length >= 6 && n === c && n !== o
 })
 
 const handleSubmit = async () => {
   if (!canSubmit.value || loading.value) return
   loading.value = true
   try {
     const o = oldPassword.value.trim()
     const n = newPassword.value.trim()
     const resp = await authApi.changePassword(o, n)
     if ((resp as any).code === 1) {
       showToast('Senha alterada com sucesso')
       setTimeout(() => { router.back() }, 1200)
     } else {
       showToast((resp as any).msg || 'Falha ao alterar senha')
     }
   } catch (e) {
     const msg = e instanceof Error ? e.message : 'Erro ao alterar senha, tente novamente'
     showToast(msg)
   } finally {
     loading.value = false
   }
 }
 </script>
 <style scoped></style>
