import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/Home.vue'), meta: { index: 0 } },
    { path: '/notification', name: 'notification', component: () => import('../pages/Notification.vue'), meta: { index: 1 } },
  ],
})

export default router