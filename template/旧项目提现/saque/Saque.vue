<template>
  <div class="h-screen flex flex-col relative z-10 bg-[var(--color-bg-main)]">
    <!-- Tab组件固定在标题栏下方 -->
    <div class="fixed w-full max-w-[516px] z-10 flex items-center">      
        <!-- 返回按钮 -->
      <button @click="router.back()"
        class="w-[3rem] h-[4.5rem] flex items-center justify-center flex-shrink-0 bg-[var(--color-bg-primary)] border-b border-[var(--color-inactive66)] fill-white">
        <svg class="w-6 h-6">
          <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
        </svg>
      </button>
      <div class="flex-1 relative overflow-x-scroll scrollbar-hide">        
        <ScrollableTab :tabs="supportTabs" :default-tab="currentTab" @tab-change="handleTabChange" />
      </div>
    </div>

    <!-- 主内容区域 -->
    <main class="mt-[4.5rem] mb-[6rem] flex-1 flex flex-col items-center justify-start overflow-hidden text-white bg-[var(--color-bg-main)]">
      <!-- 滑动容器 -->
      <div class="w-full h-full relative overflow-hidden">
        <Transition :name="slideDirection">
          <div :key="currentTab" class="w-full h-full overflow-y-auto">
            <component :is="currentComponent" @switch-to-gerenciar="handleSwitchToGerenciar" @switch-to-registro="handleSwitchToRegistro" />
          </div>
        </Transition>
      </div>
    </main>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import saque from './component/saque.vue'
import registro from './component/registro.vue'
import gerenciar from './component/gerenciar.vue'

// 定义props(接收从App.vue传递的属性,但不使用)
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// 定义emits(接收从App.vue传递的事件监听器,但不使用)
defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

const router = useRouter()
const route = useRoute()
const store = useStore()
// 支持页面的tab数据（不含图标，支持横向滑动）
const supportTabs = [
  {
    id: 'Saque',
    label: 'Saque'
  },
  {
    id: 'Registro',
    label: 'Registro de Saques'
  },
  {
    id: 'Gerenciar',
    label: 'Gerenciar Conta'
  },  
]

// 获取初始tab（优先使用查询参数）
const getInitialTab = () => {
  const queryTab = route.query.tab as string
  if (queryTab && ['Saque', 'Registro', 'Gerenciar'].includes(queryTab)) {
    return queryTab
  }
  return 'Saque'
}

// 当前选中的tab
const currentTab = ref(getInitialTab())
const previousTab = ref('Saque')

// 组件映射
const componentMap = {
  'Saque': saque,
  'Registro': registro,
  'Gerenciar': gerenciar
}

// 当前组件
const currentComponent = computed(() => {
  return componentMap[currentTab.value as keyof typeof componentMap]
})

// 滑动方向
const slideDirection = computed(() => {
  const tabOrder = ['Saque', 'Registro', 'Gerenciar']
  const currentIndex = tabOrder.indexOf(currentTab.value)
  const previousIndex = tabOrder.indexOf(previousTab.value)

  return currentIndex > previousIndex ? 'slide-left' : 'slide-right'
})

// 监听路由查询参数变化
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string') {
    // 验证tab是否有效
    const validTabs = ['Saque', 'Registro', 'Gerenciar']
    if (validTabs.includes(newTab)) {
      previousTab.value = currentTab.value
      currentTab.value = newTab
      console.log('从路由查询参数设置tab为:', newTab)
    }
  }
}, { immediate: true })


// 处理tab切换
const handleTabChange = (tabId: string) => {
  previousTab.value = currentTab.value
  currentTab.value = tabId
  console.log('支持页面切换到tab:', tabId)
}

// 处理切换到Gerenciar tab
const handleSwitchToGerenciar = () => {
  previousTab.value = currentTab.value
  currentTab.value = 'Gerenciar'
  console.log('从Saque页面切换到Gerenciar tab')
}

// 处理切换到Registro tab
const handleSwitchToRegistro = () => {
  previousTab.value = currentTab.value
  currentTab.value = 'Registro'
  console.log('从Saque页面切换到Registro tab')
}

// 页面挂载时检查提现密码
onMounted(() => {
  const isAuthenticated = store.getters['auth/isAuthenticated']

  // 如果未登录，跳转到首页
  if (!isAuthenticated) {
    router.push('/')
    return
  }

  // 检查是否设置了提现密码（使用本地状态，不刷新网络）
  const hasWithdrawPassword = store.getters['auth/hasWithdrawPassword']

  if (!hasWithdrawPassword) {
    // 跳转到设置提现密码页面
    // 使用 replace 而非 push，避免在历史记录中留下 /saque
    router.replace({
      path: '/setWithdrawPassword',
      query: {
        redirect: route.fullPath,
        //from: '/profile'  // 告诉设置页面，如果用户取消，应该返回哪里
      }
    })
  }
})

</script>

<style scoped>
/* 支持页面特定样式 */

/* 左滑动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform .3s ease-in-out;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 1;
}

/* 右滑动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform .3s ease-in-out;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

/* 确保动画容器正确定位 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
