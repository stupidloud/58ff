/**
 * HTTP客户端服务
 */

import { API_BASE_URL, REQUEST_TIMEOUT, TOKEN_STORAGE_KEY } from '../config/api'

// 响应数据类型
export interface ApiResponse<T = any> {
  code: number
  msg: string
  time: number
  data: T
}

// 请求配置类型
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

// HTTP客户端类
class HttpClient {
  private baseURL: string
  private defaultTimeout: number

  constructor(baseURL: string, timeout: number = REQUEST_TIMEOUT) {
    this.baseURL = baseURL
    this.defaultTimeout = timeout
  }

  // 获取存储的Token
  private getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  }

  // 设置Token
  public setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  }

  // 清除Token
  public clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  // 构建完整URL
  private buildURL(endpoint: string): string {
    return `${this.baseURL}${endpoint}`
  }

  // 构建请求头
  private buildHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    // 添加认证头
    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  // 处理响应
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    // 注意：API现在总是返回HTTP 200，错误通过业务code字段传递
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`)
    }

    const data: ApiResponse<T> = await response.json()

    // 检查业务状态码 - 认证相关错误时清除本地token
    if (data.code === 1002 || data.code === 1004 || data.code === 1006 || data.code === 1007) {
      // 认证相关错误：未登录、请先登录、请提供认证token、token无效或已过期
      // 清除本地token，但不抛出异常，让上层代码通过response.code判断
      this.clearToken()
    }

    return data
  }

  // 通用请求方法
  public async request<T = any>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout
    } = config

    const url = this.buildURL(endpoint)
    const requestHeaders = this.buildHeaders(headers)

    // 创建AbortController用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时')
        }
        throw error
      }
      
      throw new Error('网络请求失败')
    }
  }

  // GET请求
  public get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  // POST请求
  public post<T = any>(
    endpoint: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, headers })
  }

  // PUT请求
  public put<T = any>(
    endpoint: string, 
    body?: any, 
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers })
  }

  // DELETE请求
  public delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }
}

// 创建HTTP客户端实例
export const httpClient = new HttpClient(API_BASE_URL)

// 导出默认实例
export default httpClient
