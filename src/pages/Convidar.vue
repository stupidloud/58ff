<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <NavBar :canReturn="true" :title="'ConvidarCentro'"></NavBar>        

        <div class="sticky top-[3.1rem] z-[20] bg-[var(--color-main-bg)]">
            <div ref="navContainer"
                class="pt-[.75rem] flex items-center border-b border-[var(--color-bg-aside)] pl-[.625rem] overflow-x-auto scrollbar-hide bg-black/5 relative">
                <div v-for="item in navs" :key="item.id" ref="navItems"
                    :class="{ 'bg-[var(--color-bg-aside-2)] !text-[var(--color-active)] border-[var(--color-active)]': item.id === activeNav }"
                    class="flex items-center justify-center px-[.8rem] rounded-t-[.375rem] cursor-pointer h-[2.6rem] text-white/40 text-[.85rem] font-[700] whitespace-nowrap flex-shrink-0 transition-all duration-300"
                    @click="switchNav(item.id)">
                    {{ item.label }}
                </div>
                <div class="absolute bottom-0 h-[2px] bg-[var(--color-active)] transition-all duration-300 ease-out"
                    :style="{ left: indicatorLeft + 'px', width: indicatorWidth + 'px' }" v-show="indicatorWidth > 0">
                </div>
            </div>
        </div>

        <!-- 内容区域 -->
        <div class="px-[.75rem] pt-[1.25rem]">
            <component :is="currentComponent" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import Link from './convidar/Link.vue'
import Rede from './convidar/Rede.vue'
import Desem from './convidar/Desem.vue'
import Comi from './convidar/Comi.vue'
import Taxa from './convidar/Taxa.vue'
import DadosSubordinado from './convidar/DadosSubordinado.vue'

const navs = ref([
    {
        id: 1,
        label: 'Link de Convite'
    },
    {
        id: 2,
        label: 'Rede de Agentes'
    },
    {
        id: 3,
        label: 'Desempenho'
    },
    {
        id: 4,
        label: 'Comissão'
    },
    {
        id: 5,
        label: 'Taxa de Bônus do Agente'
    },
    {
        id: 6,
        label: 'Dados do Subordinado'
    }
])

const activeNav = ref(1)
const navContainer = ref<HTMLElement>()
const navItems = ref<HTMLElement[]>([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)
const route = useRoute()

// 计算指示线位置和宽度
const updateIndicator = () => {
    if (!navItems.value || !navContainer.value) return

    const activeIndex = navs.value.findIndex(nav => nav.id === activeNav.value)
    if (activeIndex === -1) return

    const activeItem = navItems.value[activeIndex]
    if (!activeItem) return

    const containerStyle = getComputedStyle(navContainer.value)
    const paddingLeft = parseFloat(containerStyle.paddingLeft)

    indicatorLeft.value = activeItem.offsetLeft
    indicatorWidth.value = activeItem.offsetWidth
}

// 切换导航
const switchNav = (navId: number) => {
    activeNav.value = navId
    nextTick(() => {
        updateIndicator()
        scrollToActiveItem()
    })
}

// 滚动到激活的项目
const scrollToActiveItem = () => {
    if (!navContainer.value || !navItems.value) return

    const activeIndex = navs.value.findIndex(nav => nav.id === activeNav.value)
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

// 动态组件映射
const componentMap: Record<number, any> = {
    1: Link,
    2: Rede,
    3: Desem,
    4: Comi,
    5: Taxa,
    6: DadosSubordinado
}

// 当前组件计算属性
const currentComponent = computed(() => {
    return componentMap[activeNav.value] || Link
})

onMounted(async () => {
    const q = route.query?.tab
    const id = typeof q === 'string' ? Number(q) : Array.isArray(q) ? Number(q[0]) : NaN
    if (!Number.isNaN(id) && componentMap[id]) {
        activeNav.value = id
        await nextTick()
        updateIndicator()
        scrollToActiveItem()
        return
    }
    nextTick(() => {
        updateIndicator()
    })
})
</script>
<style lang="css" scoped></style>
