<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <NavBar :canReturn="true" :title="'Pesquisar'"></NavBar>
        <div class="p-[.75rem] w-full flex-shrink-0 sticky z-[20] top-[3.2rem] bg-[var(--color-main-bg)]">
            <div
                class="w-full flex justify-center items-center h-[2.5rem] rounded-[.375rem] border border-[var(--color-border-2)] px-[.75rem]">
                <input
                    class="flex-1 !text-white !text-[.75rem] bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="PesquisarJogos" type="text">
                <ion-icon class="text-[1.4rem] text-white/40 ml-auto mr-[.75rem]" name="search-outline"></ion-icon>
            </div>
        </div>

        <!-- 导航栏 -->
        <div class="relative px-[.625rem] border-b border-[var(--color-border-2)] flex items-center">
            <div v-for="(nav, index) in navItems" :key="nav.id" :ref="(el) => setNavRef(el, nav.id)"
                @click="switchNav(nav.id)"
                class="flex items-center flex-1 h-[2.9rem] justify-center cursor-pointer transition-colors duration-200 rounded-t-[.25rem] hover:bg-[var(--color-active)]/10"
                :class="activeNav === nav.id ? 'text-[var(--color-active)]' : 'text-white/60'">
                <ion-icon v-if="nav.icon" :name="nav.icon" class="text-[1rem] mr-[.1rem]"></ion-icon>
                <span class="text-[.875rem] font-medium">{{ nav.label }}</span>
            </div>


            <!-- 滑动底部线 -->
            <div class="absolute bottom-0 h-[2px] bg-[var(--color-active)] transition-all duration-300 ease-out rounded-full"
                :style="{
                    left: indicatorLeft + 'px',
                    width: indicatorWidth + 'px'
                }"></div>
        </div>


        <div v-if="activeNav == 1" class="w-full mt-[10rem]">
            <div
                class="mx-auto w-[10rem] h-[10rem] bg-white/40 mask-[url(/static/game/empty.svg)] mask-no-repeat mask-center mask-contain">
            </div>
            <p class="text-[.875rem] font-medium text-white/40 w-full">Nenhum jogo disponível</p>
        </div>
        <div v-else
            class="flex gap-[.75rem] flex-wrap overflow-y-auto overscroll-contain webkit-overflow-scrolling-touch flex-1 min-h-0 p-[.75rem]">
            <div class="relative w-[calc(25%-0.5625rem)] rounded-[12.5%_/_9.25%] overflow-hidden"
                v-for="(item, idx) in 36" :key="idx">
                <img src="https://game-logo.6-q-r-s.com/prod/style1/en/PG_FortuneTiger.jpg" alt="" />
                <!-- 收藏角标 -->
                <div class="text-[#ff8e04] absolute top-[.5rem] right-[.5rem] cursor-pointer" @click="toggleFav(idx)"
                    :aria-pressed="isFav(idx)" :title="isFav(idx) ? '已收藏' : '未收藏'">
                    <svg class="w-[.875rem] h-[.875rem] text-current" viewBox="0 0 14 14" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="gradient" x1="3.5" y1="14" x2="3.5" y2="0"
                                gradientUnits="userSpaceOnUse">
                                <stop stop-color="white" />
                                <stop offset="1" stop-color="white" />
                            </linearGradient>
                            <clipPath id="clip">
                                <rect width="14" height="14" fill="white" />
                            </clipPath>
                        </defs>

                        <g clip-path="url(#clip)">
                            <!-- 主图形，支持填充/描边两种状态 -->
                            <path
                                d="M6.31455 3.13898C6.62548 2.62232 7.37452 2.62232 7.68545 3.13898L8.47104 4.44436C8.58274 4.62997 8.76494 4.76235 8.97598 4.81122L10.4602 5.15498C11.0477 5.29103 11.2792 6.00341 10.8839 6.45878L9.88513 7.6093C9.74313 7.7729 9.67353 7.98708 9.69226 8.2029L9.82399 9.72074C9.87613 10.3215 9.27014 10.7618 8.71491 10.5265L7.31207 9.93221C7.11261 9.84771 6.8874 9.84771 6.68793 9.93221L5.28509 10.5265C4.72986 10.7618 4.12387 10.3215 4.17601 9.72074L4.30774 8.2029C4.32647 7.98708 4.25687 7.7729 4.11487 7.6093L3.11613 6.45878C2.72085 6.00341 2.95231 5.29103 3.53976 5.15498L5.02402 4.81122C5.23506 4.76235 5.41726 4.62997 5.52896 4.44436L6.31455 3.13898Z"
                                :fill="isFav(idx) ? 'currentColor' : 'none'" fill-opacity="0.93" />

                            <!-- 渐变叠加：收藏时可见，未收藏隐藏以避免覆盖描边 -->
                            <path opacity="0.7"
                                d="M7 0C10.8659 0 14 3.13411 14 7C13.9999 10.8658 10.8658 14 7 14C3.1342 14 0.00010282 10.8658 0 7C0 3.13413 3.13414 2.91211e-05 7 0ZM7.68555 3.13867C7.37459 2.62226 6.62541 2.62226 6.31445 3.13867L5.5293 4.44434C5.41765 4.62985 5.23533 4.76259 5.02441 4.81152L3.54004 5.15527C2.95259 5.29133 2.72092 6.00362 3.11621 6.45898L4.11523 7.60938C4.25711 7.77294 4.32634 7.9874 4.30762 8.20312L4.17578 9.7207C4.12364 10.3214 4.72993 10.7616 5.28516 10.5264L6.6875 9.93262C6.88697 9.84811 7.11303 9.84811 7.3125 9.93262L8.71484 10.5264C9.27007 10.7616 9.87636 10.3214 9.82422 9.7207L9.69238 8.20312C9.67366 7.9874 9.74289 7.77294 9.88477 7.60938L10.8838 6.45898C11.2791 6.00362 11.0474 5.29133 10.46 5.15527L8.97559 4.81152C8.76467 4.76259 8.58235 4.62985 8.4707 4.44434L7.68555 3.13867Z"
                                fill="url(#gradient)" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, type ComponentPublicInstance } from 'vue'

// 导航项数据
const navItems = ref([
    { id: 1, label: 'Pesquisar', icon: 'search-outline' },
    { id: 2, label: 'Popular', icon: 'flame-outline' },
    { id: 3, label: 'Recente', icon: 'time-outline' },
    { id: 4, label: 'Favoritos', icon: 'heart-outline' }
])
const favorites = ref<Record<number, boolean>>({});
const isFav = (idx: number) => !!favorites.value[idx];
const toggleFav = (idx: number) => {
    favorites.value[idx] = !isFav(idx);
};
// 当前激活的导航
const activeNav = ref(1)

// 导航项的 ref 引用 - 使用 Map 来存储
const navRefs = new Map<number, HTMLElement>()

// 底部指示线的位置和宽度
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

// 设置 ref 的函数
const setNavRef = (el: Element | ComponentPublicInstance | null, navId: number) => {
    if (el && '$el' in el) {
        // 如果是组件实例，获取其根元素
        navRefs.set(navId, el.$el as HTMLElement)
    } else if (el) {
        // 如果是普通元素
        navRefs.set(navId, el as HTMLElement)
    }
}

// 切换导航
const switchNav = (navId: number) => {
    activeNav.value = navId
    updateIndicator()
}

// 更新指示线位置
const updateIndicator = () => {
    const activeElement = navRefs.get(activeNav.value)
    if (!activeElement) return

    const container = activeElement.parentElement
    if (container) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = activeElement.getBoundingClientRect()

        indicatorLeft.value = activeRect.left - containerRect.left
        indicatorWidth.value = activeRect.width
    }
}

// 初始化指示线位置
onMounted(() => {
    nextTick(() => {
        updateIndicator()
    })
})
</script>
<style lang="css" scoped>
div {
    box-sizing: border-box;
}
</style>