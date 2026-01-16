import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/Home.vue') },
    { path: '/notification', name: 'notification', component: () => import('../pages/Notification.vue') },
    { path: '/invite', name: 'invite', component: () => import('../pages/Invite.vue') },
    { path: '/promo', name: 'promo', component: () => import('../pages/Promo.vue') },    
    { path: '/perfil', name: 'perfil', component: () => import('../pages/Perfil.vue') },
    { path: '/deposito', name: 'deposito', component: () => import('../pages/Deposito.vue') },
    { path: '/saque', name: 'saque', component: () => import('../pages/password/AddWithdrawPass.vue') },
    { path: '/senha-saque', name: 'senha-saque', component: () => import('../pages/password/SetPassOk.vue') },
    { path: '/withdraw', name: 'withdraw', component: () => import('../pages/Withdraw.vue') },
    { path: '/convidar', name: 'convidar', component: () => import('../pages/Convidar.vue') },
    { path: '/event2', name: 'event2', component: () => import('../pages/convidar/Event2.vue') },
    { path: '/game/:id', name: 'game', component: () => import('../pages/Game.vue') },
    { path: '/promo/event/vip', name: 'promo-event-vip', component: () => import('../pages/promo/event/Vip.vue') },
    { path: '/promo/event/deposit-bonus', name: 'promo-event-deposit-bonus', component: () => import('../pages/promo/event/DepositBonus.vue') },
  ],
})

export default router
