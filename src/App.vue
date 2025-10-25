<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useUiStore } from './stores/ui'
import Login from './pages/login/Login.vue'

const transitionName = ref('route-forward')
const debugOpen = ref(import.meta.env.VITE_DEBUG_OPEN === 'true')
const auth = useAuthStore()
const ui = useUiStore()

function handleRouteChange(direction: string) {
  transitionName.value = direction === 'forward' ? 'route-forward' : 'route-back'
}
</script>

<template>
  <div class="route-container">
    <RouterView v-slot="{ Component, route }">
      <transition :name="transitionName">
        <keep-alive>
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </RouterView>

    <!-- 调试按钮（屏幕右侧） -->
    <div
      class="fixed top-1/2 right-0 translate-y-[-50%] z-[2000] cursor-pointer bg-[var(--color-active)] text-white px-[.75rem] py-[.5rem] rounded-l-[.5rem] shadow-lg"
      @click="debugOpen = !debugOpen"
      aria-label="打开调试窗"
    >
      调试
    </div>

    <!-- 调试面板：切换 Pinia 登录状态 -->
    <div
      v-if="debugOpen"
      class="fixed top-[1rem] right-[1rem] z-[2000] w-[18rem] rounded-[.5rem] border border-[var(--color-border-1)] bg-[var(--color-main-bg)] p-[.75rem] shadow-xl"
      role="dialog"
      aria-label="调试面板"
    >
      <div class="flex items-center justify-between">
        <p class="text-white/90 text-[.9rem] font-[700]">开发调试</p>
        <div class="flex items-center gap-[.4rem]">
          <span class="text-[.75rem] text-white/50">状态：</span>
          <span class="text-[.75rem] font-[700]" :class="auth.isLoggedIn ? 'text-[#61D669]' : 'text-[#E84F46]'">
            {{ auth.isLoggedIn ? '已登录' : '未登录' }}
          </span>
        </div>
      </div>
      <div class="mt-[.5rem] text-[.75rem] text-white/70 break-all">token: {{ auth.token || 'null' }}</div>
      <div class="flex items-center gap-[.5rem] mt-[.75rem]">
        <button
          class="px-[.75rem] h-[2rem] rounded-[.375rem] text-white font-[700] text-[.75rem] bg-[var(--color-active)]"
          @click="auth.setToken(`dev-token-${Date.now()}`)"
        >
          登录
        </button>
        <button
          class="px-[.75rem] h-[2rem] rounded-[.375rem] text-white font-[700] text-[.75rem] bg-[#E84F46]"
          @click="auth.clearToken()"
        >
          登出
        </button>
        <button
          class="px-[.75rem] h-[2rem] rounded-[.375rem] text-white font-[700] text-[.75rem] bg-white/20"
          @click="auth.toggleLogin()"
        >
          切换
        </button>
      </div>
    </div>

    <!-- 全局挂载登录弹窗（使用 Pinia UI store 控制） -->
    <Login v-model:open="ui.loginOpen" :initialMode="ui.loginDefaultMode" />

  </div>
</template>

<style>
/* 路由容器 */
.route-container {
  position: relative;
  min-height: 100vh;
  overflow: visible;
}

/* 前进/后退动画：淡入淡出 */
.route-forward-enter-active,
.route-back-enter-active {
  transition: opacity 300ms ease-out;  
}

.route-forward-leave-active,
.route-back-leave-active {
  transition: opacity 300ms ease-out;
}

.route-forward-enter-from,
.route-back-enter-from {
  opacity: 0;
}

.route-forward-enter-to,
.route-back-enter-to {
  opacity: 1;
}

.route-forward-leave-from,
.route-back-leave-from {
  opacity: 1;
}

.route-forward-leave-to,
.route-back-leave-to {
  opacity: 0;
}
</style>
