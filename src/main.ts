import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { mountGiftAlert } from './components/giftAlert/service'
import { mountPop, showPop } from './components/pop/service'
import { mountInstall } from './components/install/service'
import { mountOpenTime } from './components/openTime/service'
import { mountToast } from './components/toast/service'
import NavBar from './components/NavBar/NavBar.vue'
import Tabbar from './components/tabbar/Tabbar.vue'
import Empty from './components/empty/Empty.vue'
import { createPinia } from 'pinia'
import { setGetCurrentUserFunction } from './services/api'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
// 注册 NavBar 为全局组件
app.component('NavBar', NavBar)
// 注册 Tabbar 为全局组件
app.component('Tabbar', Tabbar)
// 注册 Empty 为全局组件
app.component('Empty', Empty)
app.mount('#app')

setGetCurrentUserFunction(() => useAuthStore().user)

// 在 body 上挂载 GiftAlert、Pop、Install、OpenTime 全局服务组件（初始不可见）
mountGiftAlert()
mountPop()
mountInstall()
mountOpenTime()
mountToast()

try {
  const key = 'pop_no_reminder'
  const dontShow = localStorage.getItem(key) === '1'
  if (!dontShow) {
    showPop()
  }
} catch {}

try {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  if (id && /^\d+$/.test(id)) {
    localStorage.setItem('invite_code', `id:${id}`)
  }
} catch {}

declare global {
  interface Window {
    deferredPrompt?: any
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
}

window.addEventListener('beforeinstallprompt', (e: Event) => {
  e.preventDefault()
  // @ts-ignore
  window.deferredPrompt = e
})

window.addEventListener('appinstalled', () => {
})
