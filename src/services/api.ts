/**
 * API服务层
 * 封装所有API调用
 */

import httpClient from './http'
import { API_ENDPOINTS } from '../config/api'
import { virtualPlayerStorage } from './virtualPlayerStorage'

// 获取当前用户信息的函数（需要在store初始化后调用）
let getCurrentUser: () => User | null = () => null

// 设置获取当前用户的函数
export const setGetCurrentUserFunction = (fn: () => User | null) => {
  getCurrentUser = fn
}

// 用户数据类型
export interface User {
  id: number
  username: string
  phone_number: string
  balance: number
  vip_level: number
  player_type: string
  total_deposit: number
  total_withdraw: number
  total_bet: number
  total_win: number
  has_withdraw_password: boolean
  required_betting_amount?: number
  completed_betting_amount?: number
  is_game_banned: number // 是否禁止游戏（0=允许游戏，1=禁止游戏）
}

// 登录响应类型
export interface LoginResponse {
  token: string
  player: User
}

// 游戏提供商类型
export interface GameProvider {
  id: number
  name: string
  image: string
  sort_order: number
}

// 游戏类型
export interface Game {
  id: number
  name: string
  type: string
  provider_id: number
  clicks: number
  image: string
}

// 认证相关API
export const authApi = {
  // 登录
  login: (phone_number: string, password: string) =>
    httpClient.post<LoginResponse>(API_ENDPOINTS.auth.login, {
      phone_number,
      password
    }),

  // 注册
  register: (username: string, phone_number: string, password: string, invite_code: string) =>
    httpClient.post<LoginResponse>(API_ENDPOINTS.auth.register, {
      username,
      phone_number,
      password,
      invite_code
    }),

  // 退出登录
  logout: () =>
    httpClient.post(API_ENDPOINTS.auth.logout),

  // 获取用户信息
  getProfile: () =>
    httpClient.get<{ player: User }>(API_ENDPOINTS.auth.profile),

  // 刷新Token
  refreshToken: () =>
    httpClient.post<{ token: string }>(API_ENDPOINTS.auth.refresh)
}

// 游戏相关API
export const gameApi = {
  // 获取游戏提供商列表
  getProviders: () =>
    httpClient.get<{ providers: GameProvider[] }>(API_ENDPOINTS.games.providers),

  // 获取游戏列表
  getGames: (provider_id?: number, category?: string) => {
    const params = new URLSearchParams()
    if (provider_id) params.append('provider_id', provider_id.toString())
    if (category) params.append('category', category)
    
    const endpoint = params.toString() 
      ? `${API_ENDPOINTS.games.list}?${params.toString()}`
      : API_ENDPOINTS.games.list
    
    return httpClient.get<{ games: Game[] }>(endpoint)
  },

  // 启动游戏
  launchGame: (game_id: number) =>
    httpClient.post<{ game_url: string }>(API_ENDPOINTS.games.launch, {
      game_id
    })
}

// 推荐数据类型
export interface ReferralData {
  id: number
  username: string
  phone_number: string
  vip_level: number
  register_time: string
  last_login_time: string
  total_deposit: number
  total_withdraw: number
  total_bet: number
  total_win: number
  balance: number
  level: number
  is_active: number
  subordinate_count: number
  deposit_orders: Array<{
    order_number: number
    amount: number
  }>
}

export interface ReferralSummary {
  total_count: number
  direct_count: number
  indirect_count: number
  total_deposit: number
  total_bet: number
  total_commission: number
}

export interface ReferralStats {
  level: number
  invited_count: number
  depositor_count: number
  valid_depositor_count: number
  total_deposit: number
  total_bet: number
  commission: number
}

// 邀请奖励数据类型
export interface InvitationReward {
  id: number
  reward_date: string
  invited_count: number
  reward_amount: number
  is_released: number
  released_at: string | null
  created_at: string
}

// 玩家相关API
export const playerApi = {
  // 获取余额
  getBalance: () =>
    httpClient.get<{
      balance: number
    }>(API_ENDPOINTS.player.balance),

  // 获取推荐数据
  getReferrals: (level?: number) => {
    const params = new URLSearchParams()
    if (level) params.append('level', level.toString())

    const endpoint = params.toString()
      ? `${API_ENDPOINTS.player.referrals}?${params.toString()}`
      : API_ENDPOINTS.player.referrals

    return httpClient.get<{
      referrals: ReferralData[]
      summary: ReferralSummary
    }>(endpoint)
  },

  // 获取推荐统计数据（用于MeusDados页面）
  getReferralStats: () =>
    httpClient.get<{
      total_stats: ReferralStats
      level_stats: ReferralStats[]
    }>(API_ENDPOINTS.player.referralStats),

  // 获取下注记录列表
  getBetRecords: () =>
    httpClient.get<{
      records: BetRecord[]
      total: number
    }>(API_ENDPOINTS.player.betRecords),

  // 获取邀请奖励记录
  getInvitationRewards: () =>
    httpClient.get<{
      rewards: InvitationReward[]
    }>(API_ENDPOINTS.player.invitationRewards),

  // 设置提现密码
  setWithdrawPassword: (password: string) =>
    httpClient.post(API_ENDPOINTS.player.setWithdrawPassword, {
      password
    }),

  // 验证提现密码
  verifyWithdrawPassword: (password: string) =>
    httpClient.post<{ verified: boolean }>(API_ENDPOINTS.player.verifyWithdrawPassword, {
      password
    }),

  // 获取提现账户列表
  getWithdrawAccounts: async () => {
    const user = getCurrentUser()
    if (virtualPlayerStorage.isVirtualPlayer(user)) {
      // 虚拟玩家从本地存储获取
      const accounts = virtualPlayerStorage.getWithdrawAccounts(user!.id)
      return Promise.resolve({
        code: 1,
        msg: '获取成功',
        time: Date.now(),
        data: { accounts }
      })
    }
    // 真实玩家调用API
    return httpClient.get<{ accounts: WithdrawAccount[] }>(API_ENDPOINTS.player.withdrawAccounts)
  },

  // 设置提现账户
  setWithdrawAccount: async (accountData: {
    pix_type: string
    pix_number: string
    account_name: string
    cpf?: string
  }) => {
    const user = getCurrentUser()
    if (virtualPlayerStorage.isVirtualPlayer(user)) {
      // 虚拟玩家保存到本地存储
      const mockAccount = virtualPlayerStorage.createMockWithdrawAccount(accountData)
      virtualPlayerStorage.saveWithdrawAccount(user!.id, mockAccount)
      return Promise.resolve({
        code: 1,
        msg: '提现账户设置成功',
        time: Date.now(),
        data: { account_id: mockAccount.id.toString() }
      })
    }
    // 真实玩家调用API
    return httpClient.post<{ account_id: string }>(API_ENDPOINTS.player.withdrawAccounts, accountData)
  }
}

// VIP等级数据类型
export interface VipLevel {
  level: number
  turnover_requirement: number
  deposit_requirement: number
  daily_max_withdraw_amount: number
  daily_withdrawal_times: number
  max_withdraw_amount: number
  single_withdraw_limit: number
  daily_deposit_rebate_rate: number
  level_up_bonus: number
  daily_bonus: number
  weekly_bonus: number
  monthly_bonus: number
}



// 站点信息数据类型
export interface SiteInfo {
  site_name: string
  valid_treasure_box_threshold: number
  if_show_cert: number
  vapid_public_key?: string // VAPID 公钥（用于 Web Push）
}

// 下注记录数据类型
export interface BetRecord {
  id: number
  game_name: string
  bet_time: string
  serial_number: string
  bet_amount: number
  transfer_amount: number
}

// 充值历史记录数据类型
export interface DepositRecord {
  merchant_order_no: string
  amount: number
  created_at: string
  payment_status: number
  channel_code: string
}

// 提现历史记录数据类型
export interface WithdrawRecord {
  merchant_order_no: string
  amount: number
  created_at: string
  audit_status: number
  channel_code: string
}

// 提现账户数据类型
export interface WithdrawAccount {
  id: number
  pix_type: string
  pix_number: string
  account_name: string
  cpf: string
}

// VIP相关API
export const vipApi = {
  // 获取VIP福利
  getBenefits: () =>
    httpClient.get(API_ENDPOINTS.vip.benefits),

  // 获取VIP要求
  getRequirements: () =>
    httpClient.get<{ levels: VipLevel[] }>(API_ENDPOINTS.vip.requirements)
}

// 充值相关API
export const depositApi = {
  // 获取充值通道
  getChannels: () =>
    httpClient.get(API_ENDPOINTS.deposit.channels),

  // 获取充值金额选项
  getPlans: () =>
    httpClient.get(API_ENDPOINTS.deposit.plans),

  /**
   * 创建充值订单并获取支付链接
   * @param amount 充值金额（范围：10-50000）
   * @param channel_code 支付通道代码（可选，默认"PIX"）
   * @param use_bonus 是否使用首充奖励（可选，默认true）
   * @returns 充值订单信息和支付链接
   * @throws {400} 参数错误（金额无效、超出范围等）
   * @throws {401} 未登录或token无效
   * @throws {403} 虚拟玩家不支持充值功能
   * @throws {404} 玩家信息不存在
   * @throws {500} 创建订单失败或支付系统异常
   */
  create: (amount: number, channel_code: string, use_bonus?: boolean) =>
    httpClient.post(API_ENDPOINTS.deposit.create, {
      amount,
      channel_code,
      use_bonus
    }),

  // 获取充值历史记录
  getHistory: () =>
    httpClient.get<{ deposits: DepositRecord[] }>(API_ENDPOINTS.deposit.history),

  // 增加虚拟玩家余额
  addVirtualBalance: (amount: number) =>
    httpClient.post(API_ENDPOINTS.deposit.addVirtualBalance, { amount })
}

// 提现相关API
export const withdrawApi = {
  // 创建提现申请
  create: async (amount: number, withdraw_password: string) => {
    const user = getCurrentUser()

    // 调用真实API（虚拟玩家和真实玩家都调用）
    const response = await httpClient.post<{
      order_id: string
      amount: number
      status: string
    }>(API_ENDPOINTS.withdraw.create, {
      amount,
      withdraw_password
    })

    // 如果是虚拟玩家且提现成功，保存记录到本地存储
    if (virtualPlayerStorage.isVirtualPlayer(user) && response.code === 1) {
      const mockRecord = virtualPlayerStorage.createMockWithdrawRecord(amount, 'PIX')
      virtualPlayerStorage.saveWithdrawRecord(user!.id, mockRecord)
    }

    return response
  },

  // 获取提现历史
  getHistory: async () => {
    const user = getCurrentUser()
    if (virtualPlayerStorage.isVirtualPlayer(user)) {
      // 虚拟玩家从本地存储获取
      const withdrawals = virtualPlayerStorage.getWithdrawHistory(user!.id)
      return Promise.resolve({
        code: 1,
        msg: '获取成功',
        time: Date.now(),
        data: { withdrawals }
      })
    }
    // 真实玩家调用API
    return httpClient.get<{ withdrawals: WithdrawRecord[] }>(API_ENDPOINTS.withdraw.history)
  }
}

// 客服联系方式数据类型
export interface SupportContact {
  id: number
  title: string
  link_type: string
  link_url: string
}

// 客服相关API
export const supportApi = {
  // 获取客服联系方式
  getContacts: () =>
    httpClient.get<{ contacts: SupportContact[] }>(API_ENDPOINTS.support.contacts)
}

// 公告数据类型
export interface Announcement {
  id: number
  title: string
  content: string
  start_time: string
  end_time: string
  sort_order: number
  created_at: string
  updated_at: string
}

// 公告相关API
export const announcementApi = {
  // 获取公告列表
  getList: () =>
    httpClient.get<{ announcements: Announcement[] }>(API_ENDPOINTS.announcements)
}

// 站点相关API
export const siteApi = {
  // 获取站点信息
  getInfo: () =>
    httpClient.get<SiteInfo>(API_ENDPOINTS.site.info)
}

// 宝箱数据类型
export interface TreasureBox {
  id: number
  invite_count: number
  reward_amount: number
  is_claimed: number | null
}

// 宝箱列表响应类型
export interface TreasureBoxListResponse {
  treasure_boxes: TreasureBox[]
}

// 领取宝箱响应类型
export interface ClaimTreasureBoxResponse {
  reward_amount: number
  new_balance: number
}

// 宝箱相关API
export const treasureBoxApi = {
  // 获取宝箱列表
  getList: () =>
    httpClient.get<TreasureBoxListResponse>(API_ENDPOINTS.player.treasureBoxes),

  // 领取宝箱奖励
  claim: (treasure_box_id: number) =>
    httpClient.post<ClaimTreasureBoxResponse>(API_ENDPOINTS.player.claimTreasureBox, {
      treasure_box_id
    })
}


