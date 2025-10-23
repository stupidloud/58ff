<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const transitionName = ref('route-forward')
let prevIndex = Number(route.meta?.index ?? 0)

watch(() => route.fullPath, () => {
  const currentIndex = Number(route.meta?.index ?? 0)
  if (currentIndex > prevIndex) {
    transitionName.value = 'route-forward'
  } else {
    transitionName.value = 'route-back'
  }
  prevIndex = currentIndex
})
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
