<template>
  <div class="h-[3.5rem]"></div>
  <div class="fixed bottom-0 left-0 right-0 z-50 max-w-[486px] mx-auto">


    <!-- 正常tabbar容器 -->
    <div class="h-[3.5rem] flex items-center justify-around bg-[var(--color-bg-aside)]" style="
      -webkit-mask: url('/static/tabbar.svg') no-repeat center / contain;
      mask: url('/static/tabbar.svg') no-repeat center / contain;      
  ">
      <!-- 使用v-for渲染tab项 -->
      <div v-for="tab in tabs" :key="tab.key"
        class="h-full flex flex-col items-center cursor-pointer transition-all duration-200 flex-1"
        :class="{ 'text-white font-[700]': activeTab === tab.key, 'text-white/40': activeTab !== tab.key }"
        @click="setActiveTab(tab.key)">

        <div class="h-full flex flex-col items-center justify-center flex-wrap" v-if="tab.key != 'convidar'" :class="{ 'tab-bounce': activeTab === tab.key }">
          <img class="w-[1.5rem] h-auto" :src="'/static/' + tab.icon" alt="">
          <p class="w-full text-[.625rem]">{{ tab.label }}</p>
        </div>

      </div>
    </div>
    <div class="absolute top-[0] left-1/2 -translate-x-1/2 h-[3.5rem]">
      <div
        @click="setActiveTab('convidar')"
        class="relative translate-y-[-1.8rem] w-[3.125rem] h-[3.125rem] border-[.1rem] border-[var(--color-active)] bg-[var(--color-bg-aside)] rounded-[50%] flex items-center justify-center">
        <img class="tabbarlight absolute top-0 right-0 w-[3.125rem] h-[3.125rem]" src="/static/tabbar3_light.png" alt="">
        <img class="absolute mx-auto w-[2.1875rem] h-auto" :class="{ 'tab-bounce': activeTab === 'convidar' }" src="/static/tabbar3.png" alt=""></img>
      </div>
      <p :class="{ 'text-white font-[700]': activeTab === 'convidar', 'text-white/40': activeTab !== 'convidar' }" class="translate-y-[-1.11rem] text-[.625rem] w-full">Convidar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useUiStore } from '../../stores/ui'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

// tab配置数据
const tabs = ref([
  {
    key: 'inicio',
    label: 'Início',
    icon: 'tabbar1.png'
  },
  {
    key: 'promocao',
    label: 'Promoção',
    icon: 'tabbar2.png'
  },
  {
    key: 'convidar',
    label: 'Convidar',
    icon: 'tabbar3.png'
  },
  {
    key: 'deposito',
    label: 'Depósito',
    icon: 'tabbar4.png'
  },
  {
    key: 'perfil',
    label: 'Perfil',
    icon: 'tabbar5.png'
  }
])

// 根据当前路由自动判断激活的tab
const activeTab = computed(() => {
  const path = route.path
  if (path === '/' || path === '/home') return 'inicio'
  if (path.includes('promo')) return 'promocao'
  if (path.includes('convidar')) return 'convidar'
  if (path.includes('deposito')) return 'deposito'
  if (path.includes('perfil')) return 'perfil'
  return 'inicio' // 默认激活首页
})

const setActiveTab = (tab: string) => {
  console.log('Tab changed to:', tab)

  // 根据tab跳转到对应路由
  switch (tab) {
    case 'inicio':
      router.push('/')
      break
    case 'promocao':
      router.push('/promo')
      console.log('Promoção tab clicked - route not implemented yet')
      break
    case 'convidar':
      router.push('/invite')
      break
    case 'deposito':
      console.log('[auth] isLoggedIn:', auth.isLoggedIn, 'token:', auth.token)
      if (!auth.isLoggedIn) {
        ui.openLogin('login')
        break
      }
      router.push('/deposito')      
      break
    case 'perfil':
      console.log('[auth] isLoggedIn:', auth.isLoggedIn, 'token:', auth.token)
      if (!auth.isLoggedIn) {
        ui.openLogin('login')
        break
      }
      router.push('/perfil')      
      break
  }
}
</script>

<style scoped>
/* 添加一些额外的样式优化 */
.tabbar-shadow {
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}
.tabbarlight{
  animation: rotate-light 5s linear infinite;
}
/* 光效旋转动画 */
@keyframes rotate-light {
  0% { 
    transform: rotate(0deg); 
  } 
  100% { 
    transform: rotate(360deg); 
  }
}
/* 激活项缩放弹动动画 */
@keyframes tab-bounce-scale {
  0% { transform: scale(1); }
  30% { transform: scale(1.2); }
  50% { transform: scale(0.6); }
  70% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
.tab-bounce {
  animation: tab-bounce-scale 380ms ease-out;
  will-change: transform;
}
</style>