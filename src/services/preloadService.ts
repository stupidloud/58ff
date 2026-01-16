import { gameApi, type GameProvider, type Game } from './api'
import { gameStorage, type GameData } from './gameStorage'
import { TOKEN_STORAGE_KEY } from '../config/api'
import { useAuthStore } from '../stores/auth'

export interface PreloadStatus {
  games: 'idle' | 'loading' | 'loaded' | 'error'
  providers: 'idle' | 'loading' | 'loaded' | 'error'
  tokenValidation: 'idle' | 'validating' | 'valid' | 'invalid' | 'error'
}

class PreloadService {
  private status: PreloadStatus = {
    games: 'idle',
    providers: 'idle',
    tokenValidation: 'idle'
  }
  private listeners: Array<(status: PreloadStatus) => void> = []
  addStatusListener(callback: (status: PreloadStatus) => void) {
    this.listeners.push(callback)
    callback(this.status)
  }
  removeStatusListener(callback: (status: PreloadStatus) => void) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) this.listeners.splice(index, 1)
  }
  private notifyStatusChange() {
    this.listeners.forEach(callback => callback(this.status))
  }
  private updateStatus<K extends keyof PreloadStatus>(key: K, value: PreloadStatus[K]) {
    this.status[key] = value
    this.notifyStatusChange()
  }
  getStatus(): PreloadStatus {
    return { ...this.status }
  }
  isAllLoaded(): boolean {
    return this.status.games === 'loaded' && this.status.providers === 'loaded'
  }
  isTokenValid(): boolean {
    return this.status.tokenValidation === 'valid'
  }
  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!token) {
      this.updateStatus('tokenValidation', 'invalid')
      return false
    }
    this.updateStatus('tokenValidation', 'validating')
    try {
      const auth = useAuthStore()
      const ok = await auth.validateStoredToken()
      this.updateStatus('tokenValidation', ok ? 'valid' : 'invalid')
      return ok
    } catch {
      this.updateStatus('tokenValidation', 'invalid')
      return false
    }
  }
  async preloadProviders(): Promise<GameProvider[]> {
    if (this.status.providers === 'loading' || this.status.providers === 'loaded') return []
    this.updateStatus('providers', 'loading')
    try {
      await gameStorage.init()
      const cachedProviders = await gameStorage.getAllProviders()
      const lastUpdate = await gameStorage.getMetadata('providers_last_update')
      const isExpired = !lastUpdate || (Date.now() - lastUpdate) > 2 * 60 * 60 * 1000
      if (cachedProviders.length > 0 && !isExpired) {
        this.updateStatus('providers', 'loaded')
        return cachedProviders
      }
      const response = await gameApi.getProviders()
      if (response.code === 1) {
        const providers = response.data.providers || []
        await gameStorage.saveProviders(providers)
        await gameStorage.saveMetadata('providers_last_update', Date.now())
        this.updateStatus('providers', 'loaded')
        return providers
      } else {
        const errorMsg = response.msg || 'Falha ao carregar provedores'
        throw new Error(errorMsg)
      }
    } catch (error) {
      try {
        const cachedProviders = await gameStorage.getAllProviders()
        if (cachedProviders.length > 0) {
          this.updateStatus('providers', 'loaded')
          return cachedProviders
        }
      } catch {}
      this.updateStatus('providers', 'error')
      throw error
    }
  }
  async preloadGames(): Promise<GameData[]> {
    if (this.status.games === 'loading' || this.status.games === 'loaded') return []
    this.updateStatus('games', 'loading')
    try {
      await gameStorage.init()
      const cachedGames = await gameStorage.getAllGames()
      const lastUpdate = await gameStorage.getMetadata('games_last_update')
      const isExpired = !lastUpdate || (Date.now() - lastUpdate) > 2 * 60 * 60 * 1000
      if (cachedGames.length > 0 && !isExpired) {
        this.updateStatus('games', 'loaded')
        return cachedGames
      }
      const response = await gameApi.getGames()
      if (response.code === 1) {
        const apiGames: Game[] = response.data.games || []
        await gameStorage.saveGames(apiGames)
        await gameStorage.saveMetadata('games_last_update', Date.now())
        const updatedGames = await gameStorage.getAllGames()
        this.updateStatus('games', 'loaded')
        return updatedGames
      } else {
        const errorMsg = response.msg || 'Falha ao carregar jogos'
        throw new Error(errorMsg)
      }
    } catch (error) {
      try {
        const cachedGames = await gameStorage.getAllGames()
        if (cachedGames.length > 0) {
          this.updateStatus('games', 'loaded')
          return cachedGames
        }
      } catch {}
      this.updateStatus('games', 'error')
      throw error
    }
  }
  async startPreload(): Promise<void> {
    const promises = [
      this.validateToken().catch(() => {}),
      this.preloadProviders().catch(() => {}),
      this.preloadGames().catch(() => {})
    ]
    await Promise.allSettled(promises)
  }
  async forceRefresh(): Promise<void> {
    this.status = { games: 'idle', providers: 'idle', tokenValidation: 'idle' }
    await gameStorage.init()
    await gameStorage.saveMetadata('games_last_update', 0)
    await gameStorage.saveMetadata('providers_last_update', 0)
    await this.startPreload()
  }
  async getCachedGames(): Promise<GameData[]> {
    try {
      await gameStorage.init()
      return await gameStorage.getAllGames()
    } catch {
      return []
    }
  }
  async getCachedProviders(): Promise<GameProvider[]> {
    try {
      await gameStorage.init()
      return await gameStorage.getAllProviders()
    } catch {
      return []
    }
  }
}

export const preloadService = new PreloadService()
export type { GameData, GameProvider }
