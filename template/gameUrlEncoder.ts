/**
 * 游戏URL编码/解码工具
 * 使用Base64编码隐藏游戏URL
 */

export class GameUrlEncoder {
  private static readonly PREFIX = 'gurl_'
  
  /**
   * 编码游戏URL
   * @param url 原始游戏URL
   * @returns 编码后的token
   */
  static encode(url: string): string {
    try {
      // 添加时间戳防止缓存
      const timestamp = Date.now()
      const payload = JSON.stringify({
        url,
        timestamp,
        // 添加简单的校验字段
        checksum: this.generateChecksum(url, timestamp)
      })
      
      // Base64编码
      const encoded = btoa(encodeURIComponent(payload))
      
      // 添加前缀标识
      return `${this.PREFIX}${encoded}`
    } catch (error) {
      console.error('编码游戏URL失败:', error)
      throw new Error('URL编码失败')
    }
  }
  
  /**
   * 解码游戏URL
   * @param token 编码后的token
   * @returns 原始游戏URL
   */
  static decode(token: string): string {
    try {
      // 检查前缀
      if (!token.startsWith(this.PREFIX)) {
        throw new Error('无效的token格式')
      }
      
      // 移除前缀
      const encoded = token.substring(this.PREFIX.length)
      
      // Base64解码
      const payload = decodeURIComponent(atob(encoded))
      const data = JSON.parse(payload)
      
      // 验证数据结构
      if (!data.url || !data.timestamp || !data.checksum) {
        throw new Error('token数据不完整')
      }
      
      // 验证校验和
      const expectedChecksum = this.generateChecksum(data.url, data.timestamp)
      if (data.checksum !== expectedChecksum) {
        throw new Error('token校验失败')
      }
      
      // 检查token是否过期（可选，这里设置1小时过期）
      const now = Date.now()
      const tokenAge = now - data.timestamp
      const maxAge = 1 * 60 * 60 * 1000 // 1小时
      
      if (tokenAge > maxAge) {
        throw new Error('token已过期')
      }
      
      return data.url
    } catch (error) {
      console.error('解码游戏URL失败:', error)
      throw new Error('URL解码失败')
    }
  }
  
  /**
   * 验证token是否有效
   * @param token 编码后的token
   * @returns 是否有效
   */
  static isValid(token: string): boolean {
    try {
      this.decode(token)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * 生成简单的校验和
   * @param url 游戏URL
   * @param timestamp 时间戳
   * @returns 校验和
   */
  private static generateChecksum(url: string, timestamp: number): string {
    // 简单的校验和算法
    const combined = `${url}_${timestamp}_salt_key`
    let hash = 0
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    
    return Math.abs(hash).toString(36)
  }
  
  /**
   * 从编码token中提取游戏ID（如果URL中包含）
   * @param token 编码后的token
   * @returns 游戏ID或null
   */
  static extractGameId(token: string): number | null {
    try {
      const url = this.decode(token)
      // 尝试从URL中提取游戏ID（根据实际URL格式调整）
      const match = url.match(/game[/_](\d+)/i)
      return match ? parseInt(match[1]) : null
    } catch {
      return null
    }
  }
}
