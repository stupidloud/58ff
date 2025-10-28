import { defineStore } from 'pinia'

const TOKEN_KEY = 'AUTH_TOKEN_DEV'
const WITHDRAW_PASSWORD_KEY = 'WITHDRAW_PASSWORD_SET_DEV'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null) as string | null,
    hasWithdrawPassword: (typeof window !== 'undefined' ? localStorage.getItem(WITHDRAW_PASSWORD_KEY) === 'true' : false) as boolean,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    setToken(t: string) {
      this.token = t
      if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, t)
    },
    clearToken() {
      this.token = null
      if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY)
    },
    toggleLogin() {
      if (this.token) {
        this.clearToken()
      } else {
        this.setToken(`dev-token-${Date.now()}`)
      }
    },
    setWithdrawPassword(hasPassword: boolean) {
      this.hasWithdrawPassword = hasPassword
      if (typeof window !== 'undefined') {
        localStorage.setItem(WITHDRAW_PASSWORD_KEY, hasPassword.toString())
      }
    },
    toggleWithdrawPassword() {
      this.setWithdrawPassword(!this.hasWithdrawPassword)
    },
  },
})