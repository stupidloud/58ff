/**
 * API配置
 */

// 获取API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2900/api_v1'

// 获取当前环境
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development'

// 是否为开发环境
export const isDevelopment = APP_ENV === 'development'

// 是否为生产环境
export const isProduction = APP_ENV === 'production'

// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh'
  },
  
  // 游戏相关
  games: {
    providers: '/games/providers',
    list: '/games/list',
    launch: '/games/launch'
  },
  
  // 玩家相关
  player: {
    balance: '/player/balance',
    referrals: '/player/referrals',
    referralStats: '/player/referrals/stats',
    betRecords: '/player/bet-records',
    invitationRewards: '/player/invitation-rewards',
    setWithdrawPassword: '/player/set-withdraw-password',
    verifyWithdrawPassword: '/player/verify-withdraw-password',
    withdrawAccounts: '/player/withdraw-accounts',
    treasureBoxes: '/player/treasure-boxes',
    claimTreasureBox: '/player/claim-treasure-box'
  },
  
  // VIP相关
  vip: {
    benefits: '/vip/benefits',
    requirements: '/vip/requirements'
  },
  
  // 充值提现
  deposit: {
    channels: '/deposit/channels',
    plans: '/deposit/plans',
    create: '/deposit/create',
    history: '/deposit/history',
    addVirtualBalance: '/deposit/add-virtual-balance'
  },
  
  withdraw: {
    create: '/withdraw/create',
    history: '/withdraw/history'
  },
  
  // 客服相关
  support: {
    contacts: '/support/contacts'
  },

  // 站点相关
  site: {
    info: '/site/info'
  },

  // 公告相关
  announcements: '/announcements'
} as const

// 请求超时时间（毫秒）
export const REQUEST_TIMEOUT = 30000

// Token存储键名
export const TOKEN_STORAGE_KEY = 'auth_token'
