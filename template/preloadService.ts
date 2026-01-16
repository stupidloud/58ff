/**
 * 数据预加载服务
 * 在应用启动时预加载游戏数据，提升用户体验
 * 包含token验证功能
 */

import { gameApi, type GameProvider } from './api'
import { gameStorage, type GameData } from './gameStorage'

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

  // 添加状态监听器
  addStatusListener(callback: (status: PreloadStatus) => void) {
    this.listeners.push(callback)
    // 立即调用一次，返回当前状态
    callback(this.status)
  }

  // 移除状态监听器
  removeStatusListener(callback: (status: PreloadStatus) => void) {
    const index = this.listeners.indexOf(callback)
    if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }

  // 通知状态变化
  private notifyStatusChange() {
    this.listeners.forEach(callback => callback(this.status))
  }

  // 更新单个状态
  private updateStatus<K extends keyof PreloadStatus>(key: K, value: PreloadStatus[K]) {
    this.status[key] = value
    this.notifyStatusChange()
  }

  // 获取当前状态
  getStatus(): PreloadStatus {
    return { ...this.status }
  }

  // 检查是否所有数据都已加载
  isAllLoaded(): boolean {
    return this.status.games === 'loaded' && this.status.providers === 'loaded'
  }

  // 检查token是否有效
  isTokenValid(): boolean {
    return this.status.tokenValidation === 'valid'
  }

  // 验证存储的token是否有效
  async validateToken(store?: any): Promise<boolean> {
    // 检查localStorage中是否有token
    const token = localStorage.getItem('auth_token')
    if (!token) {
      this.updateStatus('tokenValidation', 'invalid')
      console.log('Token验证: 未找到token')
      return false
    }

    this.updateStatus('tokenValidation', 'validating')
    console.log('开始验证token...')

    try {
      // 如果提供了store，使用store的验证方法
      if (store) {
        const isValid = await store.dispatch('auth/validateStoredToken')
        this.updateStatus('tokenValidation', isValid ? 'valid' : 'invalid')
        return isValid
      } else {
        // 如果没有store，直接标记为有效（在应用启动时会由store处理）
        this.updateStatus('tokenValidation', 'valid')
        return true
      }
    } catch (error) {
      this.updateStatus('tokenValidation', 'invalid')
      console.log('Token验证错误1:', error instanceof Error ? error.message : '未知错误')
      return false
    }
  }

  // 预加载游戏提供商数据
  async preloadProviders(): Promise<GameProvider[]> {
    if (this.status.providers === 'loading' || this.status.providers === 'loaded') {
      return []
    }

    this.updateStatus('providers', 'loading')

    try {
      // 初始化IndexedDB
      await gameStorage.init()

      // 先从缓存获取数据
      const cachedProviders = await gameStorage.getAllProviders()
      
      // 检查缓存是否过期（2小时）
      const lastUpdate = await gameStorage.getMetadata('providers_last_update')
      const isExpired = !lastUpdate || (Date.now() - lastUpdate) > 2 * 60 * 60 * 1000

      if (cachedProviders.length > 0 && !isExpired) {
        this.updateStatus('providers', 'loaded')
        console.log('使用缓存的游戏提供商数据:', cachedProviders.length, '个')
        return cachedProviders
      }

      // 从API获取最新数据
      const response = await gameApi.getProviders()
      if (response.code === 1) {
        const providers = response.data.providers || []

        // 保存到IndexedDB
        await gameStorage.saveProviders(providers)
        await gameStorage.saveMetadata('providers_last_update', Date.now())

        this.updateStatus('providers', 'loaded')
        console.log('预加载游戏提供商完成:', providers.length, '个')
        return providers
      } else {
        const errorMsg = response.msg || '获取提供商失败'
        console.error('获取游戏提供商失败:', errorMsg, 'code:', response.code)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('预加载游戏提供商失败:', error)

      // 回落机制：尝试使用已有的缓存数据
      try {
        const cachedProviders = await gameStorage.getAllProviders()
        if (cachedProviders.length > 0) {
          this.updateStatus('providers', 'loaded')
          console.log('API失败，回落到缓存的游戏提供商数据:', cachedProviders.length, '个')
          return cachedProviders
        }
      } catch (cacheError) {
        console.error('获取缓存提供商数据也失败:', cacheError)
      }

      // 如果缓存也没有数据，设置错误状态
      this.updateStatus('providers', 'error')
      throw error
    }
  }

  // 预加载游戏数据
  async preloadGames(): Promise<GameData[]> {
    if (this.status.games === 'loading' || this.status.games === 'loaded') {
      return []
    }

    this.updateStatus('games', 'loading')

    try {
      // 初始化IndexedDB
      await gameStorage.init()

      // 先从缓存获取数据
      const cachedGames = await gameStorage.getAllGames()
      
      // 检查缓存是否过期（2小时）
      const lastUpdate = await gameStorage.getMetadata('games_last_update')
      const isExpired = !lastUpdate || (Date.now() - lastUpdate) > 2 * 60 * 60 * 1000

      if (cachedGames.length > 0 && !isExpired) {
        this.updateStatus('games', 'loaded')
        console.log('使用缓存的游戏数据:', cachedGames.length, '个')
        return cachedGames
      }

      // 从API获取最新数据
      const response = await gameApi.getGames()
      if (response.code === 1) {
        const apiGames = response.data.games || []

        // 转换API数据为GameData格式
        const gameDataList: GameData[] = apiGames.map(game => ({
          ...game,
          isFavourite: false,
          lastPlayedAt: undefined
        }))

        // 保存到IndexedDB
        await gameStorage.saveGames(gameDataList)
        await gameStorage.saveMetadata('games_last_update', Date.now())

        // 重新从IndexedDB获取数据（保留用户自定义字段）
        const updatedGames = await gameStorage.getAllGames()

        this.updateStatus('games', 'loaded')
        console.log('预加载游戏数据完成:', updatedGames.length, '个')
        return updatedGames
      } else {
        const errorMsg = response.msg || '获取游戏失败'
        console.error('获取游戏列表失败:', errorMsg, 'code:', response.code)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('预加载游戏数据失败:', error)

      // 回落机制：尝试使用已有的缓存数据
      try {
        const cachedGames = await gameStorage.getAllGames()
        if (cachedGames.length > 0) {
          this.updateStatus('games', 'loaded')
          console.log('API失败，回落到缓存的游戏数据:', cachedGames.length, '个')
          return cachedGames
        }
      } catch (cacheError) {
        console.error('获取缓存游戏数据也失败:', cacheError)
      }

      // 如果缓存也没有数据，设置错误状态
      this.updateStatus('games', 'error')
      throw error
    }
  }



  // 开始预加载所有数据
  async startPreload(store?: any): Promise<void> {
    console.log('开始预加载数据...')

    // 并行加载所有数据，包括token验证
    const promises = [
      this.validateToken(store).catch(err => console.error('Token验证失败:', err)),
      this.preloadProviders().catch(err => console.error('提供商预加载失败:', err)),
      this.preloadGames().catch(err => console.error('游戏预加载失败:', err))
    ]

    await Promise.allSettled(promises)

    console.log('数据预加载完成，状态:', this.status)
  }

  // 强制刷新所有数据
  async forceRefresh(): Promise<void> {
    // 重置状态
    this.status = {
      games: 'idle',
      providers: 'idle',
      tokenValidation: 'idle'
    }

    // 清除缓存时间戳
    await gameStorage.init()
    await gameStorage.saveMetadata('games_last_update', 0)
    await gameStorage.saveMetadata('providers_last_update', 0)

    // 重新开始预加载
    await this.startPreload()
  }

  // 获取缓存的游戏数据（用于组件快速获取）
  async getCachedGames(): Promise<GameData[]> {
    try {
      await gameStorage.init()
      return await gameStorage.getAllGames()
    } catch (error) {
      console.error('获取缓存游戏数据失败:', error)
      return []
    }
  }

  // 获取缓存的提供商数据（用于组件快速获取）
  async getCachedProviders(): Promise<GameProvider[]> {
    try {
      await gameStorage.init()
      return await gameStorage.getAllProviders()
    } catch (error) {
      console.error('获取缓存提供商数据失败:', error)
      return []
    }
  }
}

// 创建单例实例
export const preloadService = new PreloadService()

// 导出类型
export type { GameData, GameProvider }
