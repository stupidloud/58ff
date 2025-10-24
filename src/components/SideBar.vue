<template>
    <teleport to="#app">
        <div class="sidebar-overlay" :class="{ open }" aria-hidden="true">
            <div class="sidebar-panel bg-[var(--color-main-bg)] p-[.75rem]" :class="{ open }" role="dialog"
                aria-modal="true">
                <div class="flex items-center justify-between">
                    <div @click="close"
                        class="w-[2rem] h-[2rem] flex items-center justify-center rounded-[.625rem] bg-[var(--color-bg-aside)]">
                        <ion-icon class="text-[1.2rem] cursor-pointer text-white font-[700]"
                            name="close-outline"></ion-icon>
                    </div>
                    <img class="h-[1.75rem] w-auto" src="/variable/logo.png" alt="">
                </div>
                <div class="flex items-center justify-between gap-[.5rem] py-[1.0625rem]">
                    <div
                        class="hover:brightness-120 transition-all duration-50 flex-1 h-[2.6rem] font-[700] text-[.875rem] cursor-pointer bg-[linear-gradient(90deg,rgb(55,35,128)_-27.5%,rgb(110,95,162)_127.5%)] text-[var(--color-highlight)] flex items-center justify-center">
                        Entrar
                    </div>
                    <div
                        class="hover:brightness-120 transition-all duration-50 flex-1 h-[2.6rem] font-[700] text-[.875rem] cursor-pointer bg-[linear-gradient(90deg,rgb(214,66,88)_-27.5%,rgb(214,66,88)_127.5%)] text-white flex items-center justify-center">
                        Registro
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>();

const close = () => emit('update:open', false);
</script>

<style scoped>
.sidebar-overlay {
    position: absolute;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.35);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
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
    width: 78%;
    max-width: 19.6rem;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
}

.sidebar-panel.open {
    transform: translateX(0);
}
</style>