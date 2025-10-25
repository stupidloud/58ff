<template>
  <teleport to="body">
    <Transition name="mask">
      <div v-if="open" class="login-mask" @click="close" aria-hidden="true"></div>
    </Transition>
    <Transition name="overlay">
      <div
        v-if="open"
        class="login-overlay relative"        
        aria-hidden="true"
      >
        <div class="flex p-[1rem] items-center justify-between">
            <img class="h-[1.75rem] w-auto" src="/variable/logo.png" alt="">
            <div @click="close"
                class="w-[2rem] h-[2rem] flex items-center justify-center rounded-[100px] bg-white/20">
                <ion-icon class="text-[1.2rem] cursor-pointer text-white font-[700]"
                    name="close-sharp"></ion-icon>
            </div>
        </div>
        <Transition name="panel">
          <div
            class="login-panel shadow-[inset_0_2px_0_0_var(--color-active)] rounded-t-[1.4rem] px-[1rem]"
            role="dialog"
            aria-modal="true"
          >
            <KeepAlive>
              <component :is="activeForm === 'login' ? LoginForm : RegisterForm" @switch-form="toggleForm" />
            </KeepAlive>
          </div>
        </Transition>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const props = defineProps<{ 
  open: boolean,
  initialMode: 'login' | 'register'
}>();

const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>();

const activeForm = ref(props.initialMode || 'login');

watch(() => props.initialMode, (newMode) => {
  if (newMode) {
    activeForm.value = newMode;
  }
});

const toggleForm = () => {
  activeForm.value = activeForm.value === 'login' ? 'register' : 'login';
}

const close = () => emit('update:open', false);
</script>

<style scoped>
/* 毛玻璃背景：覆盖 #app 宽度并固定 */
.login-overlay {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100vh;
  width: min(100vw, 486px);
  z-index: 1100;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: auto;
}
@supports (height: 100svh) {
  .login-overlay {
    height: 100svh;
  }
}

/* 底部上升的弹窗面板 */
.login-panel {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  max-height: 90%;
  height: calc(100% - 8.06rem);
  overflow-y: auto;
  will-change: transform;  
  background: var(--color-bg-aside);
}

/* 纯色内容区域占位，后续由你填充 */
.login-content {
  min-height: 30vh;
}
/* 进入/离开过渡：背景淡入淡出 */
.overlay-enter-active, .overlay-leave-active {
  transition: opacity 0.35s ease-out;
}
.overlay-enter-from, .overlay-leave-to {
  opacity: 0;
}
.overlay-enter-to, .overlay-leave-from {
  opacity: 1;
}

/* 进入/离开过渡：面板自下而上 */
.panel-enter-active, .panel-leave-active {
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.panel-enter-from, .panel-leave-to {
  transform: translateY(100%);
}
.panel-enter-to, .panel-leave-from {
  transform: translateY(0);
}

/* 全屏黑色遮罩 */
.login-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1090; /* 低于 .login-overlay 的 1100，确保在其下方 */
  background: rgba(0, 0, 0, 0.55);
  pointer-events: auto;
}
@supports (height: 100svh) {
  .login-mask {
    height: 100svh;
  }
}

/* 遮罩淡入淡出过渡 */
.mask-enter-active, .mask-leave-active {
  transition: opacity 0.35s ease-out;
}
.mask-enter-from, .mask-leave-to {
  opacity: 0;
}
.mask-enter-to, .mask-leave-from {
  opacity: 1;
}
</style>