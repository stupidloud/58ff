import type { Game, GameProvider } from './api'

export interface GameRecord {
  game_id: number
  game_name: string
  game_type: string
  game_image: string
  provider_id: number
  provider_name?: string
  click_count: number
  last_played_at?: number
  is_favourite: number
  created_at: number
  updated_at: number
}

export interface ProviderRecord {
  provider_id: number
  provider_name: string
  provider_image: string
  sort_order: number
  created_at: number
  updated_at: number
}

export type GameData = Game & { lastPlayedAt?: number; isFavourite: boolean }

class GameStorageService {
  private dbName = 'GameDatabase'
  private dbVersion = 4
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      request.onerror = () => reject(new Error('Failed to open IndexedDB'))
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (db.objectStoreNames.contains('games')) db.deleteObjectStore('games')
        if (db.objectStoreNames.contains('providers')) db.deleteObjectStore('providers')
        const gameStore = db.createObjectStore('games', { keyPath: 'game_id' })
        gameStore.createIndex('provider_id', 'provider_id', { unique: false })
        gameStore.createIndex('game_type', 'game_type', { unique: false })
        gameStore.createIndex('last_played_at', 'last_played_at', { unique: false })
        gameStore.createIndex('is_favourite', 'is_favourite', { unique: false })
        gameStore.createIndex('game_name', 'game_name', { unique: false })
        const providerStore = db.createObjectStore('providers', { keyPath: 'provider_id' })
        providerStore.createIndex('provider_name', 'provider_name', { unique: false })
        providerStore.createIndex('sort_order', 'sort_order', { unique: false })
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' })
        }
      }
    })
  }

  private apiGameToRecord(apiGame: Game, existingRecord?: GameRecord, providerName?: string): GameRecord {
    const now = Date.now()
    return {
      game_id: apiGame.id,
      game_name: apiGame.name,
      game_type: apiGame.type,
      game_image: apiGame.image,
      provider_id: apiGame.provider_id,
      click_count: apiGame.clicks,
      last_played_at: existingRecord?.last_played_at,
      is_favourite: existingRecord?.is_favourite || 0,
      provider_name: providerName || existingRecord?.provider_name,
      created_at: existingRecord?.created_at || now,
      updated_at: now
    }
  }

  private recordToApiGame(record: GameRecord): GameData {
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

  private apiProviderToRecord(apiProvider: GameProvider): ProviderRecord {
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

  private recordToApiProvider(record: ProviderRecord): GameProvider {
    return {
      id: record.provider_id,
      name: record.provider_name,
      image: record.provider_image,
      sort_order: record.sort_order
    }
  }

  async saveGames(games: Game[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    const existingRecords = await this.getAllGameRecords()
    const existingRecordMap = new Map(existingRecords.map(record => [record.game_id, record]))
    const providerRecords = await this.getAllProviderRecords()
    const providerMap = new Map(providerRecords.map(provider => [provider.provider_id, provider.provider_name]))
    const transaction = this.db.transaction(['games'], 'readwrite')
    const store = transaction.objectStore('games')
    const apiGameIds = new Set(games.map(game => game.id))
    for (const existingRecord of existingRecords) {
      if (!apiGameIds.has(existingRecord.game_id)) {
        store.delete(existingRecord.game_id)
      }
    }
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

  async getAllGames(): Promise<GameData[]> {
    const records = await this.getAllGameRecords()
    return records.map(record => this.recordToApiGame(record))
  }

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

  async getFavouriteGames(): Promise<GameData[]> {
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

  async getRecentGames(limit: number = 20): Promise<GameData[]> {
    if (!this.db) throw new Error('Database not initialized')
    const transaction = this.db.transaction(['games'], 'readonly')
    const store = transaction.objectStore('games')
    const index = store.index('last_played_at')
    const request = index.openCursor(null, 'prev')
    const list: GameData[] = []
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor && list.length < limit) {
          const record: GameRecord = cursor.value
          if (record.last_played_at) list.push(this.recordToApiGame(record))
          cursor.continue()
        } else {
          resolve(list)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

  async getGamesByType(gameType: string): Promise<GameData[]> {
    if (!this.db) throw new Error('Database not initialized')
    const transaction = this.db.transaction(['games'], 'readonly')
    const store = transaction.objectStore('games')
    const index = store.index('game_type')
    const request = index.getAll(gameType)
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const records: GameRecord[] = request.result
        const list = records.map(record => this.recordToApiGame(record))
        resolve(list)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async saveProviders(providers: GameProvider[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')
    const transaction = this.db.transaction(['providers'], 'readwrite')
    const store = transaction.objectStore('providers')
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear()
      clearRequest.onsuccess = () => resolve()
      clearRequest.onerror = () => reject(clearRequest.error)
    })
    for (const apiProvider of providers) {
      const providerRecord = this.apiProviderToRecord(apiProvider)
      store.put(providerRecord)
    }
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }

  async getAllProviders(): Promise<GameProvider[]> {
    if (!this.db) throw new Error('Database not initialized')
    const transaction = this.db.transaction(['providers'], 'readonly')
    const store = transaction.objectStore('providers')
    const index = store.index('sort_order')
    const request = index.openCursor()
    const records: ProviderRecord[] = []
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          records.push(cursor.value)
          cursor.continue()
        } else {
          const providers = records.map(record => this.recordToApiProvider(record))
          resolve(providers)
        }
      }
      request.onerror = () => reject(request.error)
    })
  }

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

export const gameStorage = new GameStorageService()
