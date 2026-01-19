<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Segurança'"></NavBar>
    <div class="p-[1rem]">
      <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] px-[1rem] mb-[1rem]">
        <div class="flex items-center h-[3.2rem] border-b border-[var(--color-border-2)]">
          <span class="ml-[.5rem] text-white text-[.9rem]">Conta do Membro</span>
          <span class="ml-auto text-[.8rem] text-[var(--color-text-link)]">{{ userId }}</span>
        </div>
        <div class="flex items-center h-[3.2rem] border-b border-[var(--color-border-2)]">
          <span class="ml-[.5rem] text-white text-[.9rem]">Telefone Celular</span>
          <span class="ml-auto text-[.8rem] text-[var(--color-text-link)]">{{ maskedPhone }}</span>
        </div>
        <div class="flex items-center h-[3.2rem] border-b border-[var(--color-border-2)]">
          <span class="ml-[.5rem] text-white text-[.9rem]">Email</span>
          <span class="ml-auto text-[.8rem] text-[var(--color-text-link)]">Não vinculado</span>
        </div>
        <div class="flex items-center h-[3.2rem]">
          <span class="ml-[.5rem] text-white text-[.9rem]">Google Authenticator</span>
          <span class="ml-auto text-[.8rem] text-[var(--color-text-link)]">Não vinculado</span>
        </div>
      </div>

      <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] px-[1rem]">
        <div v-show="false" class="flex items-center h-[3.2rem] border-b border-[var(--color-border-2)] cursor-pointer" @click="router.push('/senha-login')">
          <span class="ml-[.5rem] text-white text-[.9rem]">Senha de Login</span>
          <span class="ml-auto text-[.8rem] text-[var(--color-text-link)]"></span>
        </div>
        <div class="flex items-center h-[3.2rem] border-b border-[var(--color-border-2)] cursor-pointer" @click="router.push('/saque')">
          <span class="ml-[.5rem] text-white text-[.9rem]">Senha de Saque</span>
          <span class="ml-auto text-[.8rem] text-[var(--color-text-link)]">{{ withdrawStatus }}</span>
        </div>
        <div class="flex items-center h-[3.2rem]">
          <span class="ml-[.5rem] text-white text-[.9rem]">Pergunta de Segurança</span>
          <span class="ml-auto text-[.8rem] text-[var(--color-text-link)]">Não definida</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
const auth = useAuthStore()
const router = useRouter()
const userId = computed(() => auth.user?.id ?? '--')
const maskedPhone = computed(() => {
  const p = auth.user?.phone_number || ''
  if (!p) return '--'
  if (p.length === 11 && /^\d+$/.test(p)) return `+55-${p.substring(0, 2)}****${p.substring(7)}`
  if (p.length > 5) return `${p.substring(0, 3)}****${p.substring(p.length - 2)}`
  return p
})
const withdrawStatus = computed(() => (auth.hasWithdrawPassword ? 'Já Definida' : 'Não definida'))
</script>

<style scoped></style>
