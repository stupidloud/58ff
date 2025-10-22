<template>
  <div v-show="state.visible" class="fixed inset-0 z-[10020] pointer-events-auto">
    <!-- 全屏半透明遮罩 -->
    <div class="absolute inset-0 bg-black/60" @click="close"></div>

    <!-- 居中内容容器 -->
    <div class="relative h-full flex items-center justify-center">
      <div>
        <img class="w-[21.875rem] h-[23.75rem]" :src="currentPop === 1 ? '/variable/pop1.png' : '/variable/pop2.png'" alt="">
        <div class="mx-auto w-[9.5rem] flex items-center justify-between bg-[var(--color-main-bg)] rounded-[.3125rem] border-[1px] border-[var(--color-border-1)] px-[.75rem] h-[2.25rem] my-[1rem] cursor-pointer" @click="toggleCheck" :class="{ 'animate-bounce-once': isAnimating }">
          <ion-icon 
            :name="isChecked ? 'checkbox-outline' : 'square-outline'"             
            class="text-[1rem] transition-all duration-200 transform text-[var(--color-active)]"
          ></ion-icon>
          <p class="text-white text-[.7rem]">Sem lembretes hoje</p>
        </div>
        <div class="flex justify-center items-center" @click="close">
          <ion-icon class="text-[1.6rem] text-white/60 cursor-pointer" name="close-circle-outline" ></ion-icon>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue'

export default defineComponent({
  name: 'Pop',
  setup() {
    const state = inject<{ visible: boolean; title?: string; subtitle?: string; code?: string; lines: string[]; buttonText?: string; onClick?: () => void; onClose?: () => void }>('popState')!
    const isChecked = ref(false)
    const isAnimating = ref(false)
    const currentPop = ref(1)

    // 弹窗每次打开重置为第一张
    watch(() => state.visible, (v) => { if (v) currentPop.value = 1 })

    const toggleCheck = () => {
      isChecked.value = !isChecked.value
      // 触发动画
      isAnimating.value = true
      setTimeout(() => {
        isAnimating.value = false
      }, 300)
    }

    const close = () => {
      // 第一次关闭只切换到 pop2，不真正关闭
      if (currentPop.value === 1) {
        currentPop.value = 2
        return
      }
      try { state.onClose?.() } catch {}
      state.visible = false
    }
    const primary = () => {
      try { state.onClick?.() } catch {}
      try { state.onClose?.() } catch {}
      state.visible = false
    }

    return { state, isChecked, isAnimating, currentPop, toggleCheck, close, primary }
  }
})
</script>

<style scoped>
.drop-shadow { text-shadow: 0 3px 6px rgba(0,0,0,0.4); }

@keyframes bounce-once {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.animate-bounce-once {
  animation: bounce-once 0.3s ease-in-out;
}
</style>