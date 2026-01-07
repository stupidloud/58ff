import { defineStore } from 'pinia'
import httpClient from '../services/http'
import { authApi, setGetCurrentUserFunction, type User } from '../services/api'
import { TOKEN_STORAGE_KEY } from '../config/api'
import { useSiteStore } from './site'

const STORAGE_KEYS = {
  USER: 'auth_user',
  IS_AUTHENTICATED: 'is_authenticated',
  DEV_WITHDRAW_PASSWORD: 'WITHDRAW_PASSWORD_SET_DEV',
}

const initialToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
if (initialToken) {
  httpClient.setToken(initialToken)
}

const getStoredAuth = () => {
  if (typeof window === 'undefined') return { token: null, user: null, isAuthenticated: false }
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true'
  const devWithdraw = localStorage.getItem(STORAGE_KEYS.DEV_WITHDRAW_PASSWORD) === 'true'
  return {
    token,
    user: userStr ? (JSON.parse(userStr) as User) : null,
    isAuthenticated: !!token && isAuthenticated,
    devWithdraw,
  }
}

const saveAuth = (token: string | null, user: User | null, isAuthenticated: boolean) => {
  if (typeof window === 'undefined') return
  if (token && user && isAuthenticated) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true')
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED)
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const stored = getStoredAuth()
    return {
      token: (stored.token || null) as string | null,
      user: (stored.user || null) as User | null,
      isAuthenticated: !!stored.token && stored.isAuthenticated,
      loading: false as boolean,
      error: null as string | null,
      devWithdrawPassword: stored.devWithdraw as boolean,
    }
  },
  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.token,
    hasWithdrawPassword: (state) => {
      if (state.user?.has_withdraw_password !== undefined) return !!state.user.has_withdraw_password
      return state.devWithdrawPassword
    },
    username: (state) => state.user?.username || '',
    balance: (state) => state.user?.balance || 0,
    vipLevel: (state) => state.user?.vip_level || 0,
    isGameBanned: (state) => state.user?.is_game_banned || 0,
  },
  actions: {
    setToken(token: string) {
      this.token = token
      this.isAuthenticated = true
      httpClient.setToken(token)
      saveAuth(token, this.user, true)
    },
    clearToken() {
      this.token = null
      this.isAuthenticated = false
      httpClient.clearToken()
      saveAuth(null, null, false)
    },
    toggleLogin() {
      if (this.token) {
        this.clearToken()
      } else {
        const t = `dev-token-${Date.now()}`
        this.setToken(t)
      }
    },
    setWithdrawPassword(hasPassword: boolean) {
      if (this.user) {
        this.user = { ...this.user, has_withdraw_password: hasPassword }
        saveAuth(this.token, this.user, this.isAuthenticated)
      }
      this.devWithdrawPassword = hasPassword
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.DEV_WITHDRAW_PASSWORD, hasPassword.toString())
      }
    },
    toggleWithdrawPassword() {
      this.setWithdrawPassword(!this.hasWithdrawPassword)
    },
    async login({ phone_number, password }: { phone_number: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        const res = await authApi.login(phone_number, password)
        if (res.code === 1) {
          const { token, player } = res.data
          this.token = token
          this.user = player
          this.isAuthenticated = true
          this.error = null
          httpClient.setToken(token)
          saveAuth(token, player, true)
          setGetCurrentUserFunction(() => this.user)
          const site = useSiteStore()
          try {
            await site.fetchSiteInfo({ forceRefresh: true })
          } catch {}
          return { success: true, data: res.data }
        } else {
          this.error = res.msg || '登录失败'
          return { success: false, error: this.error, errorCode: res.code }
        }
      } catch (e: any) {
        this.error = e instanceof Error ? e.message : '网络错误'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    async register(payload: { username: string; phone_number: string; password: string; invite_code: string }) {
      this.loading = true
      this.error = null
      try {
        const res = await authApi.register(payload.username, payload.phone_number, payload.password, payload.invite_code)
        if (res.code === 1) {
          const { token, player } = res.data
          this.token = token
          this.user = player
          this.isAuthenticated = true
          this.error = null
          httpClient.setToken(token)
          saveAuth(token, player, true)
          setGetCurrentUserFunction(() => this.user)
          const site = useSiteStore()
          try {
            await site.fetchSiteInfo({ forceRefresh: true })
          } catch {}
          return { success: true, data: res.data }
        } else {
          this.error = res.msg || '注册失败'
          return { success: false, error: this.error, errorCode: res.code }
        }
      } catch (e: any) {
        this.error = e instanceof Error ? e.message : '网络错误'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      try {
        try {
          await authApi.logout()
        } catch {}
      } finally {
        this.token = null
        this.user = null
        this.isAuthenticated = false
        this.error = null
        httpClient.clearToken()
        saveAuth(null, null, false)
        this.loading = false
      }
    },
    async fetchUserProfile() {
      if (!this.isAuthenticated) return { success: false, error: '未登录' }
      this.loading = true
      this.error = null
      try {
        const res = await authApi.getProfile()
        if (res.code === 1) {
          this.user = res.data.player
          saveAuth(this.token, this.user, this.isAuthenticated)
          return { success: true, data: res.data.player }
        } else {
          const msg = res.msg || '获取用户信息失败'
          this.error = msg
          this.token = null
          this.user = null
          this.isAuthenticated = false
          httpClient.clearToken()
          saveAuth(null, null, false)
          return { success: false, error: msg }
        }
      } catch (e: any) {
        this.error = e instanceof Error ? e.message : '网络错误'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    async validateStoredToken() {
      if (!this.token || !this.isAuthenticated) return false
      try {
        const res = await authApi.getProfile()
        if (res.code === 1) {
          this.user = res.data.player
          saveAuth(this.token, this.user, this.isAuthenticated)
          return true
        } else {
          this.token = null
          this.user = null
          this.isAuthenticated = false
          httpClient.clearToken()
          saveAuth(null, null, false)
          return false
        }
      } catch {
        return false
      }
    },
    async updateBalance(balance: number) {
      if (this.user) {
        this.user = { ...this.user, balance }
        saveAuth(this.token, this.user, this.isAuthenticated)
      }
    },
    clearError() {
      this.error = null
    },
  },
})
