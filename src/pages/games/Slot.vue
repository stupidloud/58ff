<template>
    <div class="h-screen bg-[var(--color-main-bg)] flex flex-col overflow-hidden">
        <NavBar :canReturn="true" :title="'Slot'"></NavBar>

        <div class="p-[.75rem] w-full flex-shrink-0">
            <div
                class="w-full flex justify-center items-center h-[2.5rem] rounded-[.375rem] border border-[var(--color-border-2)] px-[.75rem]">
                <input
                    class="flex-1 !text-white !text-[.75rem] bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="PesquisarJogos" type="text">
                <ion-icon class="text-[1.4rem] text-white/40 ml-auto mr-[.75rem]" name="search-outline"></ion-icon>
            </div>
        </div>
        <div class="flex flex-1 min-h-0 mb-[1rem]">
            <div class="w-[5.3125rem] overflow-y-auto overflow-x-hidden overscroll-contain webkit-overflow-scrolling-touch px-[.75rem] rounded-[.625rem] flex-shrink-0 pb-[1rem]">
                <div v-for="item in 20"
                    class="rounded-[.625rem] py-[.25rem] w-[4.7rem] bg-[var(--color-bg-aside-2)] mb-[1rem] cursor-pointer"
                    :class="{ 'bg-gradient-to-tr from-[var(--color-bg-aside)] to-white/20': item === 1 }">
                    <img class="w-[2.35rem] h-auto mx-auto" src="https://58ff1.com/icons/sort/ELECTRONIC_on.png" alt="">
                    <p class="text-white font-[500] text-[.75rem] w-full mx-auto">TodosSlot</p>
                </div>
            </div>
            <div class="flex-1 px-[.75rem] flex flex-col">
                <div class="flex items-center justify-between flex-shrink-0 mb-[.75rem]">
                    <div v-for="method in types" :key="method.id" @click="selectMethod(method.id)"
                        class="h-[1.6rem] border-1 border-[var(--color-border-1)] w-[4rem] flex items-center justify-center rounded-[.315rem] font-[500] text-[.65rem] cursor-pointer hover:brightness-105 transition-all duration-200"
                        :class="selectedMethod === method.id ?
                            'bg-[var(--color-active)] text-white !border-0' :
                            'bg-transparent text-white/40'">
                        {{ method.label }}
                    </div>
                </div>
                <div class="flex gap-[.75rem] flex-wrap overflow-y-auto overscroll-contain webkit-overflow-scrolling-touch flex-1 min-h-0 py-[.75rem]">
                    <div class="relative w-[calc(33.33%-0.5rem)] rounded-[12.5%_/_9.25%] overflow-hidden"
                        v-for="(item, idx) in 16" :key="idx">
                        <img src="https://game-logo.6-q-r-s.com/prod/style1/en/PG_FortuneTiger.jpg" alt="" />
                        <!-- 收藏角标 -->
                        <div class="text-[#ff8e04] absolute top-[.5rem] right-[.5rem] cursor-pointer"
                            @click="toggleFav(idx)" :aria-pressed="isFav(idx)" :title="isFav(idx) ? '已收藏' : '未收藏'">
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
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// 定义组件名称，用于 keep-alive exclude
defineOptions({
  name: 'Slot'
})

const types = ref([
    { id: 1, label: 'Todos' },
    { id: 2, label: 'Popular' },
    { id: 3, label: 'Recente' },
    { id: 4, label: 'Favoritos' },
])
const selectedMethod = ref(1)
const selectMethod = (id: number) => {
    selectedMethod.value = id
}
const favorites = ref<Record<number, boolean>>({});
const isFav = (idx: number) => !!favorites.value[idx];
const toggleFav = (idx: number) => {
    favorites.value[idx] = !isFav(idx);
};
</script>
<style lang="css" scoped>
/* 确保滚动在各种设备上都能正常工作 */
.webkit-overflow-scrolling-touch {
    -webkit-overflow-scrolling: touch;
}

/* 为iOS设备优化滚动性能 */
@supports (-webkit-overflow-scrolling: touch) {
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
    }
}

/* 确保在所有设备上都有平滑滚动 */
.overflow-y-auto {
    scroll-behavior: smooth;
    /* 确保滚动容器有明确的高度 */
    height: 100%;
    max-height: 100%;

    /* 隐藏滚动条 - Webkit浏览器 (Chrome, Safari, Edge) */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 和 Edge */
}

/* 隐藏滚动条 - Webkit浏览器 */
.overflow-y-auto::-webkit-scrollbar {
    display: none;
}

/* 防止滚动时的橡皮筋效果影响布局 */
.overscroll-contain {
    overscroll-behavior: contain;
}

/* 确保flex容器正确计算高度 */
.flex.flex-1.min-h-0 {
    height: 0;
    flex-grow: 1;
}
</style>