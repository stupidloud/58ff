// IndexedDB 游戏数据管理服务

// 数据库游戏表结构
export interface GameRecord {
  game_id: number           // 游戏ID (主键)
  game_name: string         // 游戏名称
  game_type: string         // 游戏类型 (slot, mini, fh等)
  game_image: string        // 游戏图片路径
  provider_id: number       // 提供商ID
  provider_name?: string    // 提供商名称 (冗余字段，便于查询)
  click_count: number       // 点击次数
  last_played_at?: number   // 上次游玩时间戳
  is_favourite: number      // 是否收藏 (0=否, 1=是)
  created_at: number        // 创建时间戳
  updated_at: number        // 更新时间戳
}

// 数据库提供商表结构
export interface ProviderRecord {
  provider_id: number       // 提供商ID (主键)
  provider_name: string     // 提供商名称
  provider_image: string    // 提供商图片路径
  sort_order: number        // 排序字段
  created_at: number        // 创建时间戳
  updated_at: number        // 更新时间戳
}

// API返回的游戏数据类型 (用于类型转换)
export interface ApiGameData {
  id: number
  name: string
  type: string
  image: string
  provider_id: number
  clicks: number
}

// API返回的提供商数据类型 (用于类型转换)
export interface ApiProviderData {
  id: number
  name: string
  image: string
  sort_order: number // 排序字段
}

class GameStorageService {
  private dbName = 'GameDatabase'
  private dbVersion = 4  // 增加版本号以触发数据库升级（添加game_type字段）
  private db: IDBDatabase | null = null

  // 初始化数据库
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 删除旧表（如果存在）
        if (db.objectStoreNames.contains('games')) {
          db.deleteObjectStore('games')
        }
        if (db.objectStoreNames.contains('providers')) {
          db.deleteObjectStore('providers')
        }

        // 创建游戏表 - 使用规范化的字段名
        const gameStore = db.createObjectStore('games', { keyPath: 'game_id' })
        gameStore.createIndex('provider_id', 'provider_id', { unique: false })
        gameStore.createIndex('game_type', 'game_type', { unique: false })
        gameStore.createIndex('last_played_at', 'last_played_at', { unique: false })
        gameStore.createIndex('is_favourite', 'is_favourite', { unique: false })
        gameStore.createIndex('game_name', 'game_name', { unique: false })

        // 创建提供商表 - 使用规范化的字段名
        const providerStore = db.createObjectStore('providers', { keyPath: 'provider_id' })
        providerStore.createIndex('provider_name', 'provider_name', { unique: false })
        providerStore.createIndex('sort_order', 'sort_order', { unique: false }) // 为排序字段创建索引

        // 创建元数据表（存储最后更新时间等）
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' })
        }
      }
    })
  }

  // API数据转换为数据库记录
  private apiGameToRecord(apiGame: ApiGameData, existingRecord?: GameRecord, providerName?: string): GameRecord {
    const now = Date.now()
    return {
      game_id: apiGame.id,
      game_name: apiGame.name,
      game_type: apiGame.type,
      game_image: apiGame.image,
      provider_id: apiGame.provider_id,
      click_count: apiGame.clicks,
      // 保留现有的用户数据
      last_played_at: existingRecord?.last_played_at,
      is_favourite: existingRecord?.is_favourite || 0,
      // 优先使用传入的 providerName，其次使用现有记录的 provider_name
      provider_name: providerName || existingRecord?.provider_name,
      created_at: existingRecord?.created_at || now,
      updated_at: now
    }
  }

  // 数据库记录转换为API格式（用于兼容现有代码）
  private recordToApiGame(record: GameRecord): ApiGameData & { lastPlayedAt?: number; isFavourite: boolean } {
    return {
      id: record.game_id,
      name: record.game_name,
      type: record.game_type,
      image: record.game_image,
      provider_id: record.provider_id,
      clicks: record.click_count,
      lastPlayedAt: record.last_played_at,
      isFavourite: record.is_favourite === 1
    }
  }

  // API提供商数据转换为数据库记录
  private apiProviderToRecord(apiProvider: ApiProviderData): ProviderRecord {
    const now = Date.now()
    return {
      provider_id: apiProvider.id,
      provider_name: apiProvider.name,
      provider_image: apiProvider.image,
      sort_order: apiProvider.sort_order,
      created_at: now,
      updated_at: now
    }
  }

  // 数据库记录转换为API格式
  private recordToApiProvider(record: ProviderRecord): ApiProviderData {
    return {
      id: record.provider_id,
      name: record.provider_name,
      image: record.provider_image,
      sort_order: record.sort_order
    }
  }

  // 保存游戏列表
  async saveGames(games: ApiGameData[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    // 先获取现有数据以保留用户自定义字段
    const existingRecords = await this.getAllGameRecords()
    const existingRecordMap = new Map(existingRecords.map(record => [record.game_id, record]))

    // 获取所有提供商数据，用于填充 provider_name
    const providerRecords = await this.getAllProviderRecords()
    const providerMap = new Map(providerRecords.map(provider => [provider.provider_id, provider.provider_name]))

    // 创建新的事务来保存数据
    const transaction = this.db.transaction(['games'], 'readwrite')
    const store = transaction.objectStore('games')

    // 获取API返回的游戏ID集合
    const apiGameIds = new Set(games.map(game => game.id))

    // 删除API中不存在的游戏（完全同步）
    for (const existingRecord of existingRecords) {
      if (!apiGameIds.has(existingRecord.game_id)) {
        store.delete(existingRecord.game_id)
        console.log(`删除不存在的游戏: ${existingRecord.game_name} (ID: ${existingRecord.game_id})`)
      }
    }

    // 转换API数据为数据库记录
    for (const apiGame of games) {
      const existingRecord = existingRecordMap.get(apiGame.id)
      const providerName = providerMap.get(apiGame.provider_id)
      const gameRecord = this.apiGameToRecord(apiGame, existingRecord, providerName)
      store.put(gameRecord)
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  // 获取所有游戏记录（内部使用）
  private async getAllGameRecords(): Promise<GameRecord[]> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['games'], 'readonly')
    const store = transaction.objectStore('games')
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 获取所有提供商记录（内部使用）
  private async getAllProviderRecords(): Promise<ProviderRecord[]> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['providers'], 'readonly')
    const store = transaction.objectStore('providers')
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // 获取所有游戏（转换为API格式）
  async getAllGames(): Promise<(ApiGameData & { lastPlayedAt?: number; isFavourite: boolean })[]> {
    const records = await this.getAllGameRecords()
    return records.map(record => this.recordToApiGame(record))
  }

  // 更新游戏的上次游玩时间
  async updateLastPlayedAt(gameId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['games'], 'readwrite')
    const store = transaction.objectStore('games')

    const getRequest = store.get(gameId)

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const record: GameRecord = getRequest.result
        if (record) {
          record.last_played_at = Date.now()
          record.updated_at = Date.now()
          const putRequest = store.put(record)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error('Game not found'))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // 切换游戏收藏状态
  async toggleFavourite(gameId: number): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['games'], 'readwrite')
    const store = transaction.objectStore('games')

    const getRequest = store.get(gameId)

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        const record: GameRecord = getRequest.result
        if (record) {
          record.is_favourite = record.is_favourite === 1 ? 0 : 1
          record.updated_at = Date.now()
          const putRequest = store.put(record)
          putRequest.onsuccess = () => resolve(record.is_favourite === 1)
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error('Game not found'))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  // 获取收藏的游戏
  async getFavouriteGames(): Promise<(ApiGameData & { lastPlayedAt?: number; isFavourite: boolean })[]> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['games'], 'readonly')
    const store = transaction.objectStore('games')
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const allRecords: GameRecord[] = request.result
        const favouriteRecords = allRecords.filter(record => record.is_favourite === 1)
        const favouriteGames = favouriteRecords.map(record => this.recordToApiGame(record))
        resolve(favouriteGames)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 获取最近游玩的游戏
  async getRecentGames(limit: number = 20): Promise<(ApiGameData & { lastPlayedAt?: number; isFavourite: boolean })[]> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['games'], 'readonly')
    const store = transaction.objectStore('games')
    const index = store.index('last_played_at')
    const request = index.openCursor(null, 'prev') // 降序

    const games: (ApiGameData & { lastPlayedAt?: number; isFavourite: boolean })[] = []

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor && games.length < limit) {
          const record: GameRecord = cursor.value
          if (record.last_played_at) { // 只包含有游玩记录的游戏
            games.push(this.recordToApiGame(record))
          }
          cursor.continue()
        } else {
          resolve(games)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 按游戏类型获取游戏
  async getGamesByType(gameType: string): Promise<(ApiGameData & { lastPlayedAt?: number; isFavourite: boolean })[]> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['games'], 'readonly')
    const store = transaction.objectStore('games')
    const index = store.index('game_type')
    const request = index.getAll(gameType)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const records: GameRecord[] = request.result
        const games = records.map(record => this.recordToApiGame(record))
        resolve(games)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 保存提供商列表
  async saveProviders(providers: ApiProviderData[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['providers'], 'readwrite')
    const store = transaction.objectStore('providers')

    // 先清空现有数据，确保完全同步
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })

    // 转换API数据为数据库记录
    for (const apiProvider of providers) {
      const providerRecord = this.apiProviderToRecord(apiProvider)
      store.put(providerRecord)
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  // 获取所有提供商（转换为API格式，并按sort_order字段排序）
  async getAllProviders(): Promise<ApiProviderData[]> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['providers'], 'readonly')
    const store = transaction.objectStore('providers')
    const index = store.index('sort_order') // 使用sort_order索引
    const request = index.openCursor() // 按索引顺序打开游标

    const records: ProviderRecord[] = []

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          records.push(cursor.value)
          cursor.continue()
        } else {
          // 所有数据都已获取完毕
          const providers = records.map(record => this.recordToApiProvider(record))
          resolve(providers)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 保存元数据
  async saveMetadata(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['metadata'], 'readwrite')
    const store = transaction.objectStore('metadata')
    
    store.put({ key, value, updatedAt: Date.now() })

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  // 获取元数据
  async getMetadata(key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['metadata'], 'readonly')
    const store = transaction.objectStore('metadata')
    const request = store.get(key)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.value : null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // 清除所有数据
  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    const transaction = this.db.transaction(['games', 'providers', 'metadata'], 'readwrite')

    transaction.objectStore('games').clear()
    transaction.objectStore('providers').clear()
    transaction.objectStore('metadata').clear()

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }


}

// 创建单例实例
export const gameStorage = new GameStorageService()

// 导出兼容类型（用于现有代码）
export type GameData = ApiGameData & { lastPlayedAt?: number; isFavourite: boolean }
export type GameProvider = ApiProviderData
