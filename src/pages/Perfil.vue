<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <div class="bg-[url('/static/profile/headerBg.png')] bg-[var(--color-bg-aside-2)] pt-[.6875rem] px-[.75rem] pb-[1rem] static top-0">
            <div class="flex items-center h-[5.5rem]">
                <img class="w-[3.25rem] h-[3.25rem] rounded-[100px]" src="/static/profile/avatar.jpg" alt="">
                <div class="ml-[1rem]">
                    <div class="flex items-center">
                        <p class="text-white font-[600] text-[.875rem] text-left">11965864233 </p>
                        <div class="flex items-center relative h-[1.5rem] ml-[.4375rem]">
                            <img class="w-[1.5rem] h-[1.5rem] relative z-2" src="/static/profile/vip1.png" alt="">
                            <div class="ml-[-1rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[3.125rem] h-[1.105rem] text-[.65rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                                VIP 1
                            </div>
                        </div>                        
                    </div>
                    <div class="flex items-center">
                        <p class="text-white/40 text-[.75rem]"> ID: {{ userId }} </p>
                        <ion-icon class="text-[var(--color-active)] text-[1rem] ml-[.4375rem] cursor-pointer" name="copy-outline" @click="copyId" aria-label="Copiar ID"></ion-icon>
                    </div>
                </div>
            </div>
            <div class="flex gap-[.75rem] items-center">
                <div class="flex-1 w-full relative pb-[.6rem] overflow-hidden">
                  <div class="absolute rounded-full w-[100.58px] h-[35px] top-[60px] left-[32px] bg-[#CB5563] blur-[24px] z-2"></div>
                    <p class="text-white/40 text-[.6rem]">Saldo</p>
                    <div class="flex items-center justify-between w-full">
                        <p class="text-[1rem] font-[700] text-white w-full mt-[.15rem] flex items-center justify-center">
                            <span class="ml-[.25rem] !text-[var(--color-warning)]">R$</span>
                            <span class="ml-[.25rem] w-[3rem]">{{ formattedBalance }}</span>
                            <span class="ml-[1rem] inline-flex" :class="{ 'animate-[spin_0.2s_linear_4]': isRefreshing }" @click="onRefresh" aria-label="Atualizar saldo">
                                <ion-icon class="text-[1rem] text-white cursor-pointer" name="refresh"></ion-icon>
                            </span>
                        </p>                        
                    </div>
                </div>
                 <div class="flex-1 w-full relative pb-[.6rem] overflow-hidden">
                  <div class="absolute rounded-full w-[100.58px] h-[35px] top-[60px] left-[32px] bg-[#CB5563] blur-[24px] z-2"></div>
                    <p class="text-white/40 text-[.6rem]">O bônus recebido hoje</p>
                    <div class="flex items-center justify-between w-full">
                        <p class="text-[1rem] font-[700] text-white w-full mt-[.15rem] flex items-center justify-center">
                            <span>0.10</span>
                        </p>
                    </div>
                </div>
            </div>            
            <div class="h-[1px] w-full bg-[var(--color-border-2 )]"></div>
        </div>
        <Tabbar></Tabbar>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'

const userId = ref('1867190766')

const copyId = async () => {
  const text = userId.value
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    window.showToast?.('Cópia Bem-sucedida')
    console.log('Copied to clipboard:', text)
  } catch (err) {
    window.showToast?.('Cópia Falhou')
    console.error('Copy failed:', err)
  }
}

// Balance animation state
const isRefreshing = ref(false)
const targetBalance = ref(0.20)
const animatedBalance = ref<number>(targetBalance.value)

const numberFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formattedBalance = computed(() => numberFormatter.format(animatedBalance.value))

function animateNumber(from: number, to: number, duration: number, onUpdate: (val: number) => void, onDone?: () => void) {
  const start = performance.now()
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1)
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad
    onUpdate(from + (to - from) * eased)
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      onDone && onDone()
    }
  }
  requestAnimationFrame(tick)
}

function onRefresh() {
  if (isRefreshing.value) return
  isRefreshing.value = true
  animatedBalance.value = 0
  animateNumber(0, targetBalance.value, 800, (v) => {
    animatedBalance.value = v
  }, () => {
    isRefreshing.value = false
  })
}
</script>
<style scoped>

</style>
