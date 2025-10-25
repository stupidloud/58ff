import { defineStore } from 'pinia'

export type LoginMode = 'login' | 'register'

export const useUiStore = defineStore('ui', {
  state: () => ({
    loginOpen: false as boolean,
    loginDefaultMode: 'login' as LoginMode,
  }),
  actions: {
    openLogin(mode: LoginMode = 'login') {
      this.loginDefaultMode = mode
      this.loginOpen = true
    },
    closeLogin() {
      this.loginOpen = false
    },
  },
})