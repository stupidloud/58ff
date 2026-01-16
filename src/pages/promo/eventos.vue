<template>
    <div>
        <div class="p-[.6rem]">
            <div
              v-for="(item, i) in promos"
              :key="item.src"
              class="mb-[.625rem] rounded-[10px] overflow-hidden cursor-pointer"
              @click="onBannerClick(i)"
            >
                <img class="w-full h-auto" :src="item.src" alt="">
                <div class="flex items-center justify-between h-[3.625rem] w-full px-[.75rem] bg-[var(--color-tabbar-2)]">
                    <p class="font-[700] text-white text-[.875rem] flex-1 text-left">{{ item.title }}</p>
                    <div class="rounded-[.3125rem] flex items-center justify-center w-[6rem] h-[2rem] bg-[var(--color-tabbar)] text-[.75rem] font-[700] text-[var(--color-active)]">{{ item.status }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const promos = ref([
  { src: '/variable/banner1.png', title: '', status: 'Em andamento' },
  { src: '/variable/banner2.png', title: '', status: 'Em andamento' },
  { src: '/variable/banner3.png', title: '', status: 'Em andamento' },
  { src: '/variable/banner4.png', title: '', status: 'Em andamento' },
  { src: '/variable/banner5.png', title: '', status: 'Em andamento' },
])
function onBannerClick(i: number) {
  if (i === 0) {
    router.push('/promo/event/vip')
    return
  }
  if (i === 1) {
    router.push('/convidar')
    return
  }
  if (i === 2) {
    router.push('/promo/event/deposit-bonus')
    return
  }
  console.log('banner click', i)
}

</script>
<style scoped></style>
