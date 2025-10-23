import { createApp, reactive } from 'vue'
import Tabbar from './Tabbar.vue'

// tabbar 状态管理
const tabbarState = reactive({
  visible: false,
  activeTab: 'inicio',
  onTabChange: undefined as ((tab: string) => void) | undefined,
  onCenterClick: undefined as (() => void) | undefined
})

let tabbarApp: any = null

/**
 * 挂载 Tabbar 组件到 body
 */
export function mountTabbar() {
  if (tabbarApp) return

  const container = document.createElement('div')
  container.id = 'tabbar-container'
  document.body.appendChild(container)

  tabbarApp = createApp(Tabbar)
  tabbarApp.provide('tabbarState', tabbarState)
  tabbarApp.mount(container)
}

/**
 * 显示 Tabbar
 * @param options 配置选项
 */
export function showTabbar(options?: {
  activeTab?: string
  onTabChange?: (tab: string) => void
  onCenterClick?: () => void
}) {
  if (options?.activeTab) {
    tabbarState.activeTab = options.activeTab
  }
  if (options?.onTabChange) {
    tabbarState.onTabChange = options.onTabChange
  }
  if (options?.onCenterClick) {
    tabbarState.onCenterClick = options.onCenterClick
  }
  
  tabbarState.visible = true
}

/**
 * 隐藏 Tabbar
 */
export function hideTabbar() {
  tabbarState.visible = false
}

/**
 * 设置当前激活的 tab
 * @param tab tab 名称
 */
export function setActiveTab(tab: string) {
  tabbarState.activeTab = tab
}

/**
 * 获取当前激活的 tab
 */
export function getActiveTab() {
  return tabbarState.activeTab
}

/**
 * 销毁 Tabbar 组件
 */
export function unmountTabbar() {
  if (tabbarApp) {
    tabbarApp.unmount()
    tabbarApp = null
    
    const container = document.getElementById('tabbar-container')
    if (container) {
      document.body.removeChild(container)
    }
  }
}