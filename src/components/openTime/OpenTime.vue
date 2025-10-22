<template>
  <div v-show="state.visible" class="fixed inset-0 z-[10030] pointer-events-auto">
    <!-- 全屏半透明遮罩 -->
    <div class="absolute inset-0 bg-black/60" @click="onMask"></div>

    <!-- 居中白色占位块（你可自行填充内容） -->
    <div class="relative h-full flex items-center justify-center">
      <div class="w-[22.5rem] h-[27rem] bg-[var(--color-main-bg)] rounded-[20px] overflow-hidden">
        <div class="w-full relative">
          <img class="w-full h-auto" src="/static/runtime_bg.png" alt="">
          <img class="w-[7.5rem] h-[7.5rem] absolute top-[6.25rem] right-[5rem] animate-scale-light" src="/static/runtime_light.png" alt="">
          <p class="absolute top-[0rem] left-[0rem] right-0 flex justify-center items-center text-white text-center text-[1.2rem] font-[var(--ep-font-weight-bold,700)] leading-[3rem] capitalize [text-shadow:0rem_0.0469rem_0.0625rem_rgba(0,0,0,0.45)] [-webkit-text-stroke-width:0.0625rem] [-webkit-text-stroke-color:var(--ep-color-border-warning,#FA8313)]">
            Mina Misteriosa
          </p>
          <ion-icon name="close-outline" class="absolute top-[5px] right-[4px] font-[700] text-white text-[2rem] cursor-pointer" @click="onClose"></ion-icon>
        </div>
        <div class="w-[18.75rem] mx-auto -translate-y-[1.6rem]">
          <p class="h-[2.875rem] bg-[var(--color-active-2)] flex items-center justify-center text-[.85rem] font-[700] rounded-[.375rem] text-white/40">Minerado</p>
          <p class="text-[.84rem] font-[700] text-[var(--color-active)] text-center mt-[.4rem]">Mina abre 12X por dia, máx queda 7.777,00</p>
          <div class="mb-[.75rem] h-[3.1875rem] rounded-[6px] border-[.0625rem] border-[var(--color-warning)] overflow-hidden mt-[.6rem] overflow-y-auto scrollbar-hide">
            <div class="grid grid-cols-3">
              <div 
                v-for="item in 24"
                :key="item"
                class="text-center text-[.75rem] pt-[.375rem] text-white/40"
                :class="{'!text-[var(--color-warning)]': item < 5}"
              >              
                {{ String(Math.floor((item - 1) * 2)).padStart(2, '0') }}:00-{{ String(Math.floor((item - 1) * 2) + 1).padStart(2, '0') }}:59
              </div>
            </div>
          </div>
          <p class="text-[.75rem] text-white/60">Colete até 100.000,00 cristais.</p>
          <p class="text-[.75rem] text-white/60">Grátis para usuários de depósito hoje.</p>
          <p class="text-[.75rem] text-white/60">Os cristais minerados serão automaticamente</p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'OpenTime',
  setup() {
    const state = inject<{ visible: boolean; onClose?: () => void }>('openTimeState')!

    const onMask = () => {
      try { state.onClose?.() } catch {}
      state.visible = false
    }
    const onClose = () => {
      try { state.onClose?.() } catch {}
      state.visible = false
    }

    return { state, onMask, onClose }
  }
})
</script>

<style scoped>
/* 可选：淡入动画（如需使用可给容器加类） */
@keyframes fade-in {
  from { opacity: 0 }
  to   { opacity: 1 }
}
.animate-fade-in { animation: fade-in 200ms ease-out; }

/* 缩放闪光动画 */
@keyframes scaleAnimation-954b3991 {
  0% { transform: scale(2); }
  50% { transform: scale(1); }
  100% { transform: scale(2); }
}
.animate-scale-light {
  animation: scaleAnimation-954b3991 1.5s ease-in-out infinite;
  will-change: transform;
}

@keyframes scaleAnimation-954b3991 {
  0% { transform: scale(2); }
  50% { transform: scale(1); }
  100% { transform: scale(2); }
}

/* 隐藏滚动条 */
.scrollbar-hide {
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Safari and Chrome */
}
</style>