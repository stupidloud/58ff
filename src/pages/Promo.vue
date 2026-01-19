<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <div ref="navContainer" class=" pb-0 flex bg-[var(--color-tabbar)] overflow-x-auto flex-nowrap no-scrollbar sticky top-0 z-[20]">
            <div
                v-for="item in nav"
                :key="item.id"
                ref="navItems"
                :class="{'border-b-[.1rem] border-[var(--color-active)] font-[700] !text-[var(--color-active)]': item.id === activeTab}"
                class="text-white/40 h-[3.1rem] text-[.65rem] flex items-center px-[.625rem] whitespace-nowrap flex-shrink-0 cursor-pointer select-none relative tab-item"
                @click="setActive(item.id)">
                <span class="relative z-10">{{ item.label }}</span>
            </div>
        </div>
        <component :is="currentComp" />
         
         <Tabbar></Tabbar>
     </div>
 
 </template>
<script setup lang="ts">
import {ref, computed, defineAsyncComponent, onMounted, nextTick} from 'vue'
import { useRoute } from 'vue-router'
import Tabbar from '../components/tabbar/Tabbar.vue'

const activeTab = ref(1)
const navContainer = ref<HTMLElement>()
const navItems = ref<HTMLElement[]>([])
const route = useRoute()

const setActive = (id: number) => {
  activeTab.value = id
  scrollToActiveItem(id)
}

// 滚动到激活的导航项
const scrollToActiveItem = (activeId: number) => {
  if (!navContainer.value || !navItems.value) return
  
  const activeIndex = nav.value.findIndex(item => item.id === activeId)
  if (activeIndex === -1) return
  
  const activeItem = navItems.value[activeIndex]
  if (!activeItem) return
  
  const container = navContainer.value
  const containerWidth = container.clientWidth
  const itemLeft = activeItem.offsetLeft
  const itemWidth = activeItem.offsetWidth
  
  // 计算滚动位置，让激活项居中显示
  const scrollLeft = itemLeft - (containerWidth - itemWidth) / 2
  
  container.scrollTo({
    left: Math.max(0, scrollLeft),
    behavior: 'smooth'
  })
}

const viewsMap: Record<number, any> = {
  1: defineAsyncComponent(() => import('./promo/eventos.vue')),
  // 2: defineAsyncComponent(() => import('./promo/rebate.vue')),
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
    // {
    //     label: 'Rebate',
    //     id: 2
    // },
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

onMounted(async () => {
  const q = route.query?.tab
  const id = typeof q === 'string' ? Number(q) : Array.isArray(q) ? Number(q[0]) : NaN
  if (!Number.isNaN(id) && viewsMap[id]) {
    activeTab.value = id
    await nextTick()
    scrollToActiveItem(id)
  }
})
</script>
<style scoped>
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

.tab-item { transition: transform 400ms ease, background-color 400ms ease; }
.tab-item:active { transform: scale(0.98); background: rgba(0, 0, 0, 0.22); }
</style>
