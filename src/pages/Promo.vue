<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <div class=" pb-0 flex bg-[var(--color-tabbar)] overflow-x-auto flex-nowrap no-scrollbar">
            <div
                v-for="item in nav"
                :key="item.id"
                :class="{'border-b-[.1rem] border-[var(--color-active)] font-[700] !text-[var(--color-active)]': item.id === activeTab}"
                class="text-white/40 h-[3.1rem] text-[.7rem] flex items-center px-[.625rem] whitespace-nowrap flex-shrink-0 cursor-pointer select-none relative tab-item"
                @click="setActive(item.id)">
                <span class="relative z-10">{{ item.label }}</span>
            </div>
        </div>
        <component :is="currentComp" />
         
         <Tabbar></Tabbar>
     </div>
 
 </template>
 <script setup lang="ts">
import {ref, computed, defineAsyncComponent} from 'vue'
 const activeTab = ref(1)
 
 const setActive = (id: number) => {
   activeTab.value = id
 }

const viewsMap: Record<number, any> = {
  1: defineAsyncComponent(() => import('./promo/eventos.vue')),
  2: defineAsyncComponent(() => import('./promo/rebate.vue')),
  3: defineAsyncComponent(() => import('./promo/vip.vue')),
  4: defineAsyncComponent(() => import('./promo/codigo.vue')),
  5: defineAsyncComponent(() => import('./promo/hist.vue')),
  6: defineAsyncComponent(() => import('./promo/pendente.vue')),
}

const currentComp = computed(() => viewsMap[activeTab.value] ?? viewsMap[1])

const nav = ref([
    {
        label: 'Eventos',
        id: 1
    },
    {
        label: 'Rebate',
        id: 2
    },
    {
        label: 'VIP',
        id: 3
    },
    {
        label: 'Código de Resgate',
        id: 4
    },
    {
        label: 'Histórico',
        id: 5
    },
    {
        label: 'Pendente',
        id: 6
    }
])
</script>
<style scoped>
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

.tab-item { transition: transform 400ms ease, background-color 400ms ease; }
.tab-item:active { transform: scale(0.98); background: rgba(0, 0, 0, 0.22); }
</style>
