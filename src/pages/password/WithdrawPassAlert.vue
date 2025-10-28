<template>
    <div class="fixed top-0 left-0 right-0 bottom-0 z-[99999] bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
      <div class="w-[21.2rem] relative">
        <img class="w-full h-auto rounded-[.625rem]" src="/static/popup_bg.png" alt="">
        <img class="w-full h-auto absolute top-[-4.41rem] left-[50%] translate-x-[-50%]" src="/static/popup_icon001.png" alt="">
        <div class="rounded-b-[.625rem] bg-[var(--color-tabbar)] w-full py-[1.25rem]">        
            <p class="w-[16.25rem] text-[.875rem] text-white/60 mx-auto">
                Para a segurança dos seus fundos, por favor, configure primeiro uma senha de fundo
            </p>
            <div
            @click="() => router.push('/saque')"
            class="text-white text-[.75rem] font-[700] bg-[var(--color-active)] w-[8.1rem] h-[2.2rem] flex items-center justify-center hover:brightness-[1.1] cursor-pointer mx-auto mt-[1rem] rounded-[.375rem]">
                Confirmar
            </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<style lang="css" scoped>

</style>