/**
 * 虚拟玩家数据管理服务
 * 用于管理虚拟玩家的提现历史记录和账户信息
 * 使用 localStorage 进行持久化存储
 */

import type { User, WithdrawRecord, WithdrawAccount } from './api'

// localStorage 存储键名
const STORAGE_KEYS = {
  WITHDRAW_HISTORY: 'virtual_player_withdraw_history',
  WITHDRAW_ACCOUNTS: 'virtual_player_withdraw_accounts',
  USERNAMES: 'virtual_player_usernames'
} as const

// 提现历史存储格式
interface VirtualWithdrawHistoryStorage {
  [userId: string]: WithdrawRecord[]
}

// 提现账户存储格式
interface VirtualWithdrawAccountStorage {
  [userId: string]: WithdrawAccount[]
}

// 用户名存储格式
interface VirtualUsernameStorage {
  [userId: string]: string
}

class VirtualPlayerStorageService {

  /**
   * 判断是否为虚拟玩家
   * @param user 用户信息
   * @returns 是否为虚拟玩家
   */
  isVirtualPlayer(user: User | null): boolean {
    if (!user) return false

    // 通过 player_type 字段判断
    if (user.player_type === 'virtual') {
      return true
    }

    // 备用判断：通过用户ID范围判断（虚拟用户ID通常小于1000）
    if (user.id < 1000) {
      return true
    }

    return false
  }

  /**
   * 生成模拟订单号
   * @returns 订单号字符串
   */
  generateMockOrderNo(): string {
    // 生成8位随机数字
    const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(8, '0')
    return `W25${randomNum}`
  }

  /**
   * 生成模拟账户ID
   * @returns 账户ID
   */
  generateMockAccountId(): number {
    return Date.now() % 100000 + Math.floor(Math.random() * 1000)
  }



  /**
   * 从 localStorage 读取提现历史
   * @param userId 用户ID
   * @returns 提现记录数组
   */
  getWithdrawHistory(userId: number): WithdrawRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WITHDRAW_HISTORY)
      if (!stored) return []

      const data: VirtualWithdrawHistoryStorage = JSON.parse(stored)
      return data[userId.toString()] || []
    } catch (error) {
      console.error('读取虚拟玩家提现历史失败:', error)
      return []
    }
  }

  /**
   * 保存提现记录到 localStorage
   * @param userId 用户ID
   * @param record 提现记录
   */
  saveWithdrawRecord(userId: number, record: WithdrawRecord): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WITHDRAW_HISTORY)
      const data: VirtualWithdrawHistoryStorage = stored ? JSON.parse(stored) : {}

      const userKey = userId.toString()
      if (!data[userKey]) {
        data[userKey] = []
      }

      // 添加新记录到数组开头（最新的在前面）
      data[userKey].unshift(record)

      // 限制记录数量，最多保存100条
      if (data[userKey].length > 100) {
        data[userKey] = data[userKey].slice(0, 100)
      }

      localStorage.setItem(STORAGE_KEYS.WITHDRAW_HISTORY, JSON.stringify(data))
    } catch (error) {
      console.error('保存虚拟玩家提现记录失败:', error)
    }
  }

  /**
   * 从 localStorage 读取提现账户
   * @param userId 用户ID
   * @returns 提现账户数组
   */
  getWithdrawAccounts(userId: number): WithdrawAccount[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WITHDRAW_ACCOUNTS)
      if (!stored) return []

      const data: VirtualWithdrawAccountStorage = JSON.parse(stored)
      return data[userId.toString()] || []
    } catch (error) {
      console.error('读取虚拟玩家提现账户失败:', error)
      return []
    }
  }

  /**
   * 保存提现账户到 localStorage
   * @param userId 用户ID
   * @param account 提现账户信息
   */
  saveWithdrawAccount(userId: number, account: WithdrawAccount): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WITHDRAW_ACCOUNTS)
      const data: VirtualWithdrawAccountStorage = stored ? JSON.parse(stored) : {}

      const userKey = userId.toString()

      // 虚拟玩家只能有一个提现账户，直接替换
      data[userKey] = [account]

      localStorage.setItem(STORAGE_KEYS.WITHDRAW_ACCOUNTS, JSON.stringify(data))
    } catch (error) {
      console.error('保存虚拟玩家提现账户失败:', error)
    }
  }

  /**
   * 获取虚拟玩家的自定义用户名
   * @param userId 用户ID
   * @returns 自定义用户名，如果没有则返回null
   */
  getCustomUsername(userId: number): string | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERNAMES)
      if (!stored) return null

      const data: VirtualUsernameStorage = JSON.parse(stored)
      return data[userId.toString()] || null
    } catch (error) {
      console.error('读取虚拟玩家用户名失败:', error)
      return null
    }
  }

  /**
   * 保存虚拟玩家的自定义用户名
   * @param userId 用户ID
   * @param username 用户名
   */
  saveCustomUsername(userId: number, username: string): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERNAMES)
      const data: VirtualUsernameStorage = stored ? JSON.parse(stored) : {}

      const userKey = userId.toString()
      data[userKey] = username

      localStorage.setItem(STORAGE_KEYS.USERNAMES, JSON.stringify(data))
    } catch (error) {
      console.error('保存虚拟玩家用户名失败:', error)
    }
  }

  /**
   * 将 Date 格式化为本地时间字符串：YYYY-MM-DD HH:mm:ss
   */
  formatLocalDateTime(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }




  /**
   * 创建模拟提现记录
   * @param amount 提现金额
   * @param channelCode 通道代码
   * @returns 模拟提现记录
   */
  createMockWithdrawRecord(amount: number, channelCode: string = 'PIX'): WithdrawRecord {
    return {
      merchant_order_no: this.generateMockOrderNo(),
      amount: amount,
      created_at: this.formatLocalDateTime(new Date()),
      audit_status: 4, // 直接使用状态4（成功）
      channel_code: channelCode
    }
  }

  /**
   * 创建模拟提现账户
   * @param accountData 账户数据
   * @returns 模拟提现账户
   */
  createMockWithdrawAccount(accountData: {
    pix_type: string
    pix_number: string
    account_name: string
    cpf?: string
  }): WithdrawAccount {
    return {
      id: this.generateMockAccountId(),
      pix_type: accountData.pix_type,
      pix_number: accountData.pix_number,
      account_name: accountData.account_name,
      cpf: accountData.cpf || ''
    }
  }

  /**
   * 清除指定用户的所有数据
   * @param userId 用户ID
   */
  clearUserData(userId: number): void {
    try {
      const userKey = userId.toString()

      // 清除提现历史
      const historyStored = localStorage.getItem(STORAGE_KEYS.WITHDRAW_HISTORY)
      if (historyStored) {
        const historyData: VirtualWithdrawHistoryStorage = JSON.parse(historyStored)
        delete historyData[userKey]
        localStorage.setItem(STORAGE_KEYS.WITHDRAW_HISTORY, JSON.stringify(historyData))
      }

      // 清除提现账户
      const accountStored = localStorage.getItem(STORAGE_KEYS.WITHDRAW_ACCOUNTS)
      if (accountStored) {
        const accountData: VirtualWithdrawAccountStorage = JSON.parse(accountStored)
        delete accountData[userKey]
        localStorage.setItem(STORAGE_KEYS.WITHDRAW_ACCOUNTS, JSON.stringify(accountData))
      }

      // 清除自定义用户名
      const usernameStored = localStorage.getItem(STORAGE_KEYS.USERNAMES)
      if (usernameStored) {
        const usernameData: VirtualUsernameStorage = JSON.parse(usernameStored)
        delete usernameData[userKey]
        localStorage.setItem(STORAGE_KEYS.USERNAMES, JSON.stringify(usernameData))
      }

    } catch (error) {
      console.error('清除虚拟玩家数据失败:', error)
    }
  }

  /**
   * 清除所有虚拟玩家数据
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.WITHDRAW_HISTORY)
      localStorage.removeItem(STORAGE_KEYS.WITHDRAW_ACCOUNTS)
      localStorage.removeItem(STORAGE_KEYS.USERNAMES)
    } catch (error) {
      console.error('清除所有虚拟玩家数据失败:', error)
    }
  }


}

// 创建单例实例
export const virtualPlayerStorage = new VirtualPlayerStorageService()

// 导出类型
export type { VirtualWithdrawHistoryStorage, VirtualWithdrawAccountStorage, VirtualUsernameStorage }
