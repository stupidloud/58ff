import { defineStore } from 'pinia'
import { announcementApi, type Announcement } from '../services/api'

const STORAGE_KEYS = {
  ANNOUNCEMENTS: 'announcements',
  ANNOUNCEMENTS_LAST_FETCHED: 'announcements_last_fetched',
}

const getStoredAnnouncements = () => {
  if (typeof window === 'undefined') return { announcements: [], lastFetched: null }
  const aStr = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)
  const lfStr = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS_LAST_FETCHED)
  return {
    announcements: aStr ? (JSON.parse(aStr) as Announcement[]) : [],
    lastFetched: lfStr ? parseInt(lfStr, 10) : null,
  }
}

const saveAnnouncements = (announcements: Announcement[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements))
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS_LAST_FETCHED, Date.now().toString())
}

export const useAnnouncementStore = defineStore('announcement', {
  state: () => {
    const s = getStoredAnnouncements()
    return {
      announcements: s.announcements as Announcement[],
      lastFetched: (s.lastFetched || null) as number | null,
      error: null as string | null,
    }
  },
  getters: {
    announcementContents: (state) => state.announcements.map((a) => a.content),
    firstAnnouncementContent: (state) => state.announcements[0]?.content || '',
  },
  actions: {
    async fetchAnnouncements() {
      const hasCached = this.announcements.length > 0
      this.error = null
      try {
        const res = await announcementApi.getList()
        if (res.code === 1) {
          this.announcements = res.data.announcements || []
          this.lastFetched = Date.now()
          this.error = null
          saveAnnouncements(this.announcements)
          return { success: true, data: res.data }
        } else {
          this.error = res.msg || '获取公告失败'
          return { success: false, error: this.error }
        }
      } catch (e: any) {
        this.error = e instanceof Error ? e.message : '网络错误'
        if (hasCached) {
          return { success: true, data: { announcements: this.announcements } }
        }
        return { success: false, error: this.error }
      }
    },
    clearError() {
      this.error = null
    },
  },
})
