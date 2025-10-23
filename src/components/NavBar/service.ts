import { createApp } from 'vue'
import type { App } from 'vue'
import NavBar from './NavBar.vue'

let navBarApp: App<Element> | null = null
let navBarInstance: any = null

// 挂载 NavBar 组件到 body
export function mountNavBar() {
  if (navBarApp) {
    console.warn('NavBar is already mounted')
    return
  }

  // 创建容器
  const container = document.createElement('div')
  container.id = 'navbar-container'
  document.body.appendChild(container)

  // 创建 Vue 应用实例
  navBarApp = createApp(NavBar)
  
  // 挂载组件
  const vm = navBarApp.mount(container)
  navBarInstance = vm

  console.log('NavBar mounted successfully')
}

// 卸载 NavBar 组件
export function unmountNavBar() {
  if (navBarApp && navBarInstance) {
    navBarApp.unmount()
    navBarApp = null
    navBarInstance = null
    
    // 移除容器
    const container = document.getElementById('navbar-container')
    if (container) {
      document.body.removeChild(container)
    }
    
    console.log('NavBar unmounted successfully')
  }
}

// 显示导航栏
export function showNavBar(options: { canReturn?: boolean; title?: string } = {}) {
  if (navBarInstance && navBarInstance.show) {
    navBarInstance.show(options)
  } else {
    console.warn('NavBar instance not found or show method not available')
  }
}

// 隐藏导航栏
export function hideNavBar() {
  if (navBarInstance && navBarInstance.hide) {
    navBarInstance.hide()
  } else {
    console.warn('NavBar instance not found or hide method not available')
  }
}

// 导出类型定义
export interface NavBarOptions {
  canReturn?: boolean
  title?: string
}

// 全局方法，方便在任何地方调用
declare global {
  interface Window {
    showNavBar: (options?: NavBarOptions) => void
    hideNavBar: () => void
  }
}

// 将方法挂载到 window 对象上，方便全局调用
if (typeof window !== 'undefined') {
  window.showNavBar = showNavBar
  window.hideNavBar = hideNavBar
}