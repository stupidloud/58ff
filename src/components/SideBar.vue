<template>
    <teleport to="#app">
        <div v-if="open" class="sidebar-overlay" :class="{ open }" @click.self="close" aria-hidden="true">
            <div class="sidebar-panel bg-[var(--color-main-bg)] p-[.75rem] pt-0" :class="{ open }" role="dialog"
                aria-modal="true">
                <div class="sidebar-fixed-top">
                    <div class="flex items-center justify-between pt-[.75rem]">
                        <div @click="close"
                            class="w-[2rem] h-[2rem] flex items-center justify-center rounded-[.625rem] !bg-[var(--color-bg-aside)]">
                            <ion-icon class="text-[1.2rem] cursor-pointer text-white font-[700]"
                                name="close-outline"></ion-icon>
                        </div>
                        <img class="h-[1.75rem] w-auto" src="/variable/logo.png" alt="">
                    </div>
                    <div v-if="!auth.isLoggedIn" class="flex items-center justify-between gap-[.5rem] py-[1.0625rem]">
                        <div
                            class="hover:brightness-120 transition-all duration-50 flex-1 h-[2.6rem] font-[700] text-[.875rem] cursor-pointer bg-[linear-gradient(90deg,rgb(55,35,128)_-27.5%,rgb(110,95,162)_127.5%)] text-[var(--color-highlight)] flex items-center justify-center">
                            Entrar
                        </div>
                        <div
                            class="hover:brightness-120 transition-all duration-50 flex-1 h-[2.6rem] font-[700] text-[.875rem] cursor-pointer bg-[linear-gradient(90deg,rgb(214,66,88)_-27.5%,rgb(214,66,88)_127.5%)] text-white flex items-center justify-center">
                            Registro
                        </div>
                    </div>
                    <div 
                    v-else
                    class="flex items-center py-[1.0625rem]">
                        <img class="w-[2.375rem] h-[2.375rem] mx-[.25rem]" src="/static/withdraw.png" alt="">
                        <div class="mr-[.25rem]">
                            <p class="text-shadow-[var(--currency-shadow,0_0_.625rem_var(--color-active))] text-white  text-[.875rem] font-[700] skew-x-[-10deg]">R$0,30</p>
                            <p class="text-[var(--color-active)] text-[.625rem] font-[400] text-left">Saldo</p>
                        </div>
                        <div class="ml-auto h-[2rem] w-[5rem] rounded-[.375rem] relative text-[var(--color-highlight)] bg-[var(--color-bg-aside-2)] flex items-center justify-center  shadow-[inset_0_-0.0625rem_0_0_var(--color-highlight)] text-[.75rem] font-[600] cursor-pointer hover:brightness-110 transition-all duration-50">
                            Depósito
                        </div>
                    </div>
                </div>
                <div
                    class="relative overflow-hidden w-full p-[.9375rem] mt-[.75rem] border border-[var(--color-border-1)] rounded-[.625rem]">
                    <div
                        class="absolute top-0 left-0 z-[-1] w-[6rem] h-[10rem] rotate-[-39.331deg] bg-[rgba(215,251,103,.4)] blur-[4.375rem]">
                    </div>
                    <div class="flex items-center">
                        <img class="w-[1.875rem] h-[1.875rem]" src="/static/fire.png" alt="">
                        <p class="ml-[.375rem] text-white text-[.875rem] font-[600]">Popular</p>
                    </div>
                    <p class="text-left text-[.75rem] font-[400] text-white/40">Seleção de jogos (2000+)</p>
                    <div
                        class="sidebar-scroll flex flex-nowrap rounded-[.625rem] mt-[1.125rem] items-center gap-[.375rem]">
                        <div v-for="item in 10"
                            class="w-[3.1481rem] h-[4.25rem] overflow-hidden rounded-[.625rem] flex-shrink-0">
                            <img class="w-full h-full object-cover"
                                src="https://game-logo.6-q-r-s.com/prod/style1/en/PG_FortuneTiger.jpg" alt=""></img>
                        </div>
                    </div>
                </div>

                <div class="flex items-center relative overflow-hidden !bg-[var(--color-bg-aside)] w-full px-[.875rem] py-[.75rem] mt-[.9375rem] border border-[var(--color-border-1)] rounded-[.625rem] cursor-pointer"
                    @click="providerOpen = !providerOpen">
                    <img class="w-[.9rem] h-auto" src="/static/sidebar/crown.svg" alt="">
                    <p class="text-white ml-[.4375rem] text-[.875rem] font-[600]">Provedor de jogos</p>
                    <div class="chevron-wrap w-[1.4rem] h-[1.4rem] bg-[var(--color-active)] rounded-[.325rem] ml-auto flex items-center justify-center"
                        :class="{ open: providerOpen }">
                        <ion-icon class="text-white text-[1rem]" name="chevron-down-outline"></ion-icon>
                    </div>
                </div>
                <div v-show="providerOpen">
                    <div v-for="item in 7" class="flex items-center py-[.75rem] px-[.875rem]">
                        <img class="w-[1.75rem] h-[1.75rem]" src="https://58ff1.com/icons/platform/ONE_API_HOT-2.png"
                            alt="">
                        <span class="ml-[.5rem] text-white/40 text-[.75rem] font-[400]">Popular</span>
                    </div>
                </div>

                <div
                    class="flex flex-wrap gap-[.75rem] py-[1.4rem] border-y border-[var(--color-border-2)] mt-[1.375rem]">
                    <div v-for="item in icos"
                        class="flex items-center flex-[calc(50%_-_.375rem)] h-[2.125rem] px-[.625rem] py-[.3125rem] gap-[.375rem] !bg-[var(--color-bg-aside)] rounded-[.625rem]">
                        <img class="w-[1.5rem] h-auto" :src="'/static/sidebar/' + item.ico" alt="">
                        <span class="text-white text-[.75rem] font-[600]">{{ item.label }}</span>
                    </div>
                </div>

                <div class="flex items-center justify-center mt-[1rem] gap-[.75rem]">
                    <div
                        class="w-[2.5rem] h-[2.5rem] rounded-[100px] flex items-center justify-center p-[.5rem] bg-[#2AABEE33]">
                        <img class="w-full" src="/static/te.png" alt="">
                    </div>
                    <div
                        class="w-[2.5rem] h-[2.5rem] rounded-[100px] flex items-center justify-center p-[.5rem] bg-[#2AABEE33]">
                        <img class="w-full" src="/static/face.png" alt="">
                    </div>
                    <div
                        class="w-[2.5rem] h-[2.5rem] rounded-[100px] flex items-center justify-center p-[.5rem] bg-[#2AABEE33]">
                        <img class="w-full" src="/static/ws.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { watch, onUnmounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>();

const auth = useAuthStore();

const providerOpen = ref(false);

const close = () => emit('update:open', false);
const icos = ref([
    {
        ico: 'ico1.png',
        label: 'Agente'
    },
    {
        ico: 'ico2.png',
        label: 'Afiliado'
    },
    {
        ico: 'ico3.png',
        label: 'Ganhar'
    },
    {
        ico: 'ico4.png',
        label: 'VIP'
    },
    {
        ico: 'ico5.png',
        label: 'Cashback'
    },
    {
        ico: 'ico6.png',
        label: 'Check-in'
    },
])
watch(() => props.open, (newVal) => {
    if (newVal) {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }
}, { immediate: true });

onUnmounted(() => {
    document.body.classList.remove('no-scroll');
});
</script>

<style scoped>
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100vh;
    width: min(100vw, 486px);
    z-index: 1000;
    background: rgba(0, 0, 0, 0.35);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
}

@supports (height: 100svh) {
    .sidebar-overlay {
        height: 100svh;
    }
}

.sidebar-overlay.open {
    opacity: 1;
    pointer-events: auto;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.sidebar-panel {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    width: 78%;
    max-width: 19.6rem;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
}

.sidebar-panel.open {
    transform: translateX(0);
}

/* 顶部区域固定在侧栏顶部，随内容滚动不移位 */
.sidebar-fixed-top {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--color-main-bg);
}

/* 箭头旋转动画（应用于外层容器） */
.chevron-wrap {
    transition: transform 0.2s ease;
}

.chevron-wrap.open {
    transform: rotate(180deg);
}

/* 保留旧类以防外部引用，但不再使用 */
.chevron {
    transition: transform 0.2s ease;
}

.chevron-open {
    transform: rotate(180deg);
}

/* 隐藏侧栏面板的竖向滚动条 */
.sidebar-panel {
    scrollbar-width: none;
    /* Firefox 隐藏滚动条 */
}

.sidebar-panel::-webkit-scrollbar {
    display: none;
    /* WebKit 隐藏滚动条 */
}

.sidebar-scroll {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x;
    scrollbar-width: none;
    /* Firefox 隐藏滚动条 */
}

.sidebar-scroll::-webkit-scrollbar {
    display: none;
    /* WebKit 隐藏滚动条 */
}
</style>