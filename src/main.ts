import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { mountGiftAlert } from './components/giftAlert/service'
import { mountPop } from './components/pop/service'
import { mountInstall } from './components/install/service'
import { mountOpenTime } from './components/openTime/service'
import { mountToast } from './components/toast/service'
import NavBar from './components/NavBar/NavBar.vue'
import Tabbar from './components/tabbar/Tabbar.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
// 注册 NavBar 为全局组件
app.component('NavBar', NavBar)
// 注册 Tabbar 为全局组件
app.component('Tabbar', Tabbar)
app.mount('#app')

// 在 body 上挂载 GiftAlert、Pop、Install、OpenTime 全局服务组件（初始不可见）
mountGiftAlert()
mountPop()
mountInstall()
mountOpenTime()
mountToast()
