import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { mountGiftAlert } from './components/giftAlert/service'
import { mountPop } from './components/pop/service'
import { mountInstall } from './components/install/service'
import { mountOpenTime } from './components/openTime/service'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 在 body 上挂载 GiftAlert、Pop、Install 全局组件（初始不可见）
mountGiftAlert()
mountPop()
mountInstall()
mountOpenTime()
