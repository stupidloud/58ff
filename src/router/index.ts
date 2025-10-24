import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/Home.vue') },
    { path: '/notification', name: 'notification', component: () => import('../pages/Notification.vue') },
    { path: '/invite', name: 'invite', component: () => import('../pages/Invite.vue') },
    { path: '/promo', name: 'promo', component: () => import('../pages/Promo.vue') },
  ],
})

export default router