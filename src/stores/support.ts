import { defineStore } from 'pinia'
import { supportApi, type SupportContact } from '../services/api'

const STORAGE_KEYS = {
  SUPPORT_CONTACTS: 'support_contacts',
  SUPPORT_LAST_FETCHED: 'support_last_fetched',
}

const getStoredSupport = () => {
  if (typeof window === 'undefined') return { contacts: [], lastFetched: null }
  const contactsStr = localStorage.getItem(STORAGE_KEYS.SUPPORT_CONTACTS)
  const lastFetchedStr = localStorage.getItem(STORAGE_KEYS.SUPPORT_LAST_FETCHED)
  return {
    contacts: contactsStr ? (JSON.parse(contactsStr) as SupportContact[]) : [],
    lastFetched: lastFetchedStr ? parseInt(lastFetchedStr, 10) : null,
  }
}

const saveSupport = (contacts: SupportContact[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.SUPPORT_CONTACTS, JSON.stringify(contacts))
  localStorage.setItem(STORAGE_KEYS.SUPPORT_LAST_FETCHED, Date.now().toString())
}

export const useSupportStore = defineStore('support', {
  state: () => {
    const s = getStoredSupport()
    return {
      contacts: s.contacts as SupportContact[],
      lastFetched: (s.lastFetched || null) as number | null,
      loading: false as boolean,
      error: null as string | null,
    }
  },
  getters: {
    contacts: (state) => state.contacts,
    loading: (state) => state.loading,
    error: (state) => state.error,
    lastFetched: (state) => state.lastFetched,
    instagramContact: (state) => state.contacts.find((c) => c.link_type === '官方Instagram'),
    telegramContact: (state) => state.contacts.find((c) => c.link_type === '官方Telegram'),
    whatsappContact: (state) => state.contacts.find((c) => c.link_type === '官方WhatsApp'),
    contactsMap: (state) => {
      const map: Record<string, SupportContact> = {}
      state.contacts.forEach((c) => {
        map[c.link_type] = c
      })
      return map
    },
  },
  actions: {
    async fetchContacts() {
      const CACHE_DURATION = 30 * 60 * 1000
      const now = Date.now()
      if (this.lastFetched && now - this.lastFetched < CACHE_DURATION && this.contacts.length > 0) {
        return { success: true, data: { contacts: this.contacts } }
      }
      this.loading = true
      this.error = null
      try {
        const res = await supportApi.getContacts()
        if (res.code === 1) {
          this.contacts = res.data.contacts
          this.lastFetched = Date.now()
          this.error = null
          saveSupport(this.contacts)
          return { success: true, data: res.data }
        } else {
          this.error = res.msg || '获取客服联系方式失败'
          return { success: false, error: this.error }
        }
      } catch (e: any) {
        this.error = e instanceof Error ? e.message : '网络错误'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },
    findContactByType(linkType: string) {
      return this.contacts.find((c) => c.link_type === linkType)
    },
    clearError() {
      this.error = null
    },
  },
})
