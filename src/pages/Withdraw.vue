<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Saque'"></NavBar>
    <div class="sticky top-[3.1rem] z-[20] bg-[var(--color-main-bg)]">
      <div class="pt-[.5rem] flex items-center border-b border-[var(--color-bg-aside)] px-[.625rem] overflow-x-auto scrollbar-hide bg-[var(--color-tabbar-2)]">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="flex items-center justify-center px-[.8rem] rounded-t-[.375rem] cursor-pointer h-[2.6rem] text-white/60 text-[.85rem] font-[700] whitespace-nowrap flex-shrink-0 transition-all duration-300"
          :class="tab.id === activeTab ? 'bg-[var(--color-bg-aside-2)] !text-[var(--color-active)] border-b-2 border-[var(--color-active)]' : ''"
          @click="switchTab(tab.id)"
        >
          {{ tab.label }}
        </div>
      </div>
    </div>
    <div class="px-[.75rem] pt-[1rem]">
      <component
        :is="currentComponent"
        @switch-to-gerenciar="activeTab = 'Gerenciar'"
        @switch-to-registro="activeTab = 'Registro'"
      />
    </div>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SaquePage from './saque/Saque.vue'
import RegistroPage from './saque/Registro.vue'
import GerenciarPage from './saque/Gerenciar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = ref([
  { id: 'Saque', label: 'Saque' },
  { id: 'Registro', label: 'Registro de Saques' },
  { id: 'Gerenciar', label: 'Gerenciar Conta' }
])

const initial = (() => {
  const q = route.query?.tab
  const v = typeof q === 'string' ? q : Array.isArray(q) ? (q[0] as string) : 'Saque'
  return ['Saque', 'Registro', 'Gerenciar'].includes(v) ? v : 'Saque'
})()
const activeTab = ref<string>(initial)
const switchTab = (id: string) => { activeTab.value = id }

const map: Record<string, any> = {
  Saque: SaquePage,
  Registro: RegistroPage,
  Gerenciar: GerenciarPage
}
const currentComponent = computed(() => map[activeTab.value] || SaquePage)
</script>

<style scoped></style>
