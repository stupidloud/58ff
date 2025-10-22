<template>
  <div v-show="state.visible" class="fixed inset-0 z-[10015] pointer-events-auto">
    <!-- 全屏半透明遮罩 -->
    <div class="absolute inset-0 bg-black/60" @click="onMask"></div>

    <!-- 底部弹窗容器：居中、圆角、上升动画 -->
    <div class="absolute left-0 right-0 bottom-0 pb-[env(safe-area-inset-bottom)] p-[1.2rem]">
      <div class="mx-auto max-w-[486px] w-full rounded-t-[1.25rem]  bg-[var(--color-main-bg)]/95 backdrop-blur border  shadow-2xl overflow-hidden animate-slide-up">
        <div class="flex items-start gap-3 p-4">
          <img src="/variable/favicon_38.png" alt="app" class="w-[3.75rem] h-auto rounded-[.75rem] shadow" />
          <div class="text-white/90">
            <p class="text-[.85rem] leading-[1.35rem]">Gostaríamos de adicionar o {{ appName }} à sua tela inicial para as últimas apostas grátis e atualizações de bônus.</p>
          </div>
        </div>
        <div class="flex items-center justify-end px-[1.2rem] pb-[1.2rem]">
          <div class="rounded-[.75rem] text-white text-[.9375rem] leading-[2rem] mr-[1rem]" @click="cancel">Cancelar</div>
          <div class="rounded-[.425rem] py-[.2rem] px-[1.4rem] bg-[var(--color-active)] text-white text-[.9375rem] font-black hover:opacity-100 opacity-90 transition" @click="confirm">Instalar</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'InstallPrompt',
  setup() {
    const state = inject<{
      visible: boolean
      onCancel?: () => void
      onConfirm?: () => void
      onClose?: () => void
    }>('installState')!

    const appName = import.meta.env.VITE_APP_NAME

    const cancel = () => {
      try { state.onCancel?.() } catch {}
      try { state.onClose?.() } catch {}
      state.visible = false
    }
    const confirm = () => {
      try { state.onConfirm?.() } catch {}
      try { state.onClose?.() } catch {}
      state.visible = false
    }
    const onMask = () => {
      try { state.onClose?.() } catch {}
      state.visible = false
    }

    return { state, cancel, confirm, onMask, appName }
  }
})
</script>

<style scoped>
@keyframes slide-up {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
.animate-slide-up { animation: slide-up 220ms ease-out; }
</style>