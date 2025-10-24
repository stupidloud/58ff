<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Centro de Mensagens'" />

    <div class="p-[.625rem] pb-0 flex border-b-2 border-[var(--color-bg-aside)]">
      <div
        class="h-[2.6rem] font-[700] text-[var(--color-active)] text-[.95rem] border-b border-[var(--color-active)] flex items-center px-[.8rem]">
        Suporte </div>
    </div>

    <div class="px-[.75rem] mt-[.875rem]">
      <div class="flex items-start justify-between bg-[url('/static/kf_bg.png')] bg-no-repeat bg-center bg-cover">
        <img class="w-[8rem] h-[9.43rem]" src="/static/kf.png" alt="">
        <div class="pl-[.75rem] text-left mt-[4px]">
          <p class="text-white font-[700] text-[1rem]">
            Apoio on-line
            <span class="text-[var(--color-highlight)]">7×24 horas</span>
          </p>
          <p class="my-[.25rem] text-white/60 leading-[1.125rem] text-[.75rem]">
            Serviço ao cliente disponível para ajudar a solucionar problemas e responder a dúvidas apresentadas.
          </p>
          <div
            class="mt-[.6rem] w-full h-[2rem] bg-[var(--color-bg-aside)] flex justify-center items-center text-[var(--color-active)] text-[.75rem] font-[700] shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)]">
            Contato
          </div>
        </div>
      </div>

      <div class="mt-[.75rem]">
        <div v-for="item in kfList" :key="item.icon"
          class="flex mb-[.625rem] rounded-[.375rem] items-center justify-start py-[.875rem] px-[.75rem] bg-[var(--color-bg-aside-2)]">
          <img class="w-[2.5rem] h-[2.5rem]" :src="'/static/' + item.icon" alt="">
          <div class="ml-[.75rem] text-left">
            <p class="text-white font-[600] text-[.875rem] leading-[1.325rem]">{{ item.title }}</p>
            <p class="text-white/40 text-[.75rem] leading-[1.125rem]">{{ item.desc }}</p>
          </div>
          <div
          class="ml-auto w-[4.5rem] h-[1.8rem] bg-[var(--color-bg-aside)] flex justify-center items-center text-[var(--color-active)] text-[.75rem] font-[700]"
          >Contato</div>
        </div>
      </div>
    </div>



  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const kfList = ref([
  {
    icon: 'te.png',
    title: '58FF-notícias oficiais',
    desc: 'Clique para seguir'
  },
  {
    icon: 'ws.png',
    title: '58FF-notícias oficiais',
    desc: 'Clique para seguir'
  },
  {
    icon: 'face.png',
    title: '58FF-notícias oficiais',
    desc: 'Clique para seguir'
  },
  {
    icon: 'ins.png',
    title: '58FF-notícias oficiais',
    desc: 'Clique para seguir'
  },
])
</script>

<style scoped>
/* 页面特定样式 */
</style>