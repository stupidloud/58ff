import { defineStore } from 'pinia'

const TOKEN_KEY = 'AUTH_TOKEN_DEV'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null) as string | null,
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
  },
})