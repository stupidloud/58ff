<template>
  <div class="flex h-full flex-col relative z-10 bg-[var(--color-bg-main)]">
    <CommonHeader>
      Convidar
    </CommonHeader>

    <!-- Tab组件固定在标题栏下方 -->
    <div class="top-[4.5rem] w-full max-w-[516px] z-10">
      <!-- 顶部基线 -->
      <div
        class="w-full h-[.1px]"
        :style="{
          backgroundColor: 'var(--color-inactive)'
        }"
      ></div>
      <ScrollableTab :tabs="agentTabs" :default-tab="currentTab" @tab-change="handleTabChange" />
    </div>

    <!-- 主内容区域 -->
    <main class="flex-1 flex flex-col items-center justify-start overflow-hidden text-white bg-[var(--color-bg-main)]">
      <!-- 滑动容器 -->
      <div class="w-full h-full relative overflow-hidden">
        <Transition :name="slideDirection">
          <div :key="currentTab" class="w-full h-full overflow-y-auto">
            <component :is="currentComponent" />
          </div>
        </Transition>
      </div>
    </main>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTabSlide } from '../../composables/useTabSlide'

import LinkConvite from '../features/LinkConvite.vue'
import MeusDados from '../features/MeusDados.vue'
import TodosDados from '../features/TodosDados.vue'
import DadosSubordinado from '../features/DadosSubordinado.vue'
import Bonus from '../features/Bonus.vue'

const route = useRoute()

// Tab顺序
const tabOrder = ['link-convite', 'meus-dados', 'todos-dados', 'dados-subordinado', 'bonus']
const { currentTab, previousTab, slideDirection, handleTabChange: updateTab } = useTabSlide(tabOrder)

// 定义props(接收从App.vue传递的属性,但不使用)
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// 定义事件
const emit = defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

// 代理页面的tab数据（不含图标，支持横向滑动）
const agentTabs = [
  {
    id: 'link-convite',
    label: 'Link de Convite'
  },
  {
    id: 'meus-dados',
    label: 'Meus Dados'
  },
  {
    id: 'todos-dados',
    label: 'Todos os Dados'
  },
  {
    id: 'dados-subordinado',
    label: 'Dados do Subordinado'
  },
  {
    id: 'bonus',
    label: 'Bônus'
  }
]

// 获取初始tab（优先使用查询参数）
const getInitialTab = () => {
  const queryTab = route.query.tab as string
  if (queryTab && tabOrder.includes(queryTab)) {
    return queryTab
  }
  return tabOrder[0]
}

// 初始化currentTab
currentTab.value = getInitialTab()

// 监听路由查询参数变化
watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string' && tabOrder.includes(newTab)) {
    updateTab(newTab)
  }
})

// 组件映射
const componentMap = {
  'link-convite': LinkConvite,
  'meus-dados': MeusDados,
  'todos-dados': TodosDados,
  'dados-subordinado': DadosSubordinado,
  'bonus': Bonus
}

// 当前组件
const currentComponent = computed(() => {
  return componentMap[currentTab.value as keyof typeof componentMap]
})

// 处理tab切换
const handleTabChange = (tabId: string) => {
  updateTab(tabId)
  console.log('代理页面切换到tab:', tabId)
}

// 处理返回按钮点击
const handleReturn = () => {
  emit('return')
  console.log('代理页面返回按钮被点击')
}
</script>

<style scoped>
@import '../../styles/tabSlide.css';

/* 确保动画容器正确定位 */
:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active),
:deep(.slide-right-enter-active),
:deep(.slide-right-leave-active) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
