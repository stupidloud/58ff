import { defineStore } from 'pinia'
import { siteApi } from '../services/api'

const STORAGE_KEYS = {
  SITE_NAME: 'site_name',
  SITE_THRESHOLD: 'site_threshold',
  SITE_SHOW_CERT: 'site_show_cert',
  SITE_VAPID_PUBLIC_KEY: 'site_vapid_public_key',
  SITE_LAST_FETCHED: 'site_last_fetched',
}

const getStoredSite = () => {
  if (typeof window === 'undefined') {
    return { siteName: 'Ondas-777', validTreasureBoxThreshold: 25, ifShowCert: 1, vapidPublicKey: null, lastFetched: null }
  }
  const siteName = localStorage.getItem(STORAGE_KEYS.SITE_NAME) || 'Ondas-777'
  const thresholdStr = localStorage.getItem(STORAGE_KEYS.SITE_THRESHOLD)
  const showCertStr = localStorage.getItem(STORAGE_KEYS.SITE_SHOW_CERT)
  const vapidPublicKey = localStorage.getItem(STORAGE_KEYS.SITE_VAPID_PUBLIC_KEY)
  const lastFetchedStr = localStorage.getItem(STORAGE_KEYS.SITE_LAST_FETCHED)
  return {
    siteName,
    validTreasureBoxThreshold: thresholdStr ? parseInt(thresholdStr, 10) : 25,
    ifShowCert: showCertStr ? parseInt(showCertStr, 10) : 1,
    vapidPublicKey: vapidPublicKey || null,
    lastFetched: lastFetchedStr ? parseInt(lastFetchedStr, 10) : null,
  }
}

const saveSite = (siteName: string, validTreasureBoxThreshold: number, ifShowCert: number, vapidPublicKey?: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.SITE_NAME, siteName)
  localStorage.setItem(STORAGE_KEYS.SITE_THRESHOLD, validTreasureBoxThreshold.toString())
  localStorage.setItem(STORAGE_KEYS.SITE_SHOW_CERT, ifShowCert.toString())
  if (vapidPublicKey) localStorage.setItem(STORAGE_KEYS.SITE_VAPID_PUBLIC_KEY, vapidPublicKey)
  localStorage.setItem(STORAGE_KEYS.SITE_LAST_FETCHED, Date.now().toString())
}

export const useSiteStore = defineStore('site', {
  state: () => {
    const s = getStoredSite()
    return {
      siteName: s.siteName as string,
      validTreasureBoxThreshold: s.validTreasureBoxThreshold as number,
      ifShowCert: s.ifShowCert as number,
      vapidPublicKey: (s.vapidPublicKey || null) as string | null,
      lastFetched: (s.lastFetched || null) as number | null,
      loading: false as boolean,
      error: null as string | null,
    }
  },
  actions: {
    async fetchSiteInfo({ forceRefresh = false }: { forceRefresh?: boolean } = {}) {
      if (!forceRefresh) {
        const CACHE_DURATION = 5 * 60 * 1000
        const now = Date.now()
        if (this.lastFetched && now - this.lastFetched < CACHE_DURATION) {
          return {
            success: true,
            data: {
              site_name: this.siteName,
              valid_treasure_box_threshold: this.validTreasureBoxThreshold,
              if_show_cert: this.ifShowCert,
              vapid_public_key: this.vapidPublicKey || undefined,
            },
          }
        }
      }
      this.loading = true
      this.error = null
      try {
        const res = await siteApi.getInfo()
        if (res.code === 1) {
          this.siteName = res.data.site_name
          this.validTreasureBoxThreshold = res.data.valid_treasure_box_threshold
          this.ifShowCert = res.data.if_show_cert
          this.vapidPublicKey = res.data.vapid_public_key || null
          this.lastFetched = Date.now()
          saveSite(this.siteName, this.validTreasureBoxThreshold, this.ifShowCert, this.vapidPublicKey || undefined)
          return { success: true, data: res.data }
        } else {
          this.error = res.msg || '获取站点信息失败'
          return { success: false, error: this.error }
        }
      } catch (e: any) {
        this.error = e instanceof Error ? e.message : '网络错误'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    clearError() {
      this.error = null
    },
  },
})
