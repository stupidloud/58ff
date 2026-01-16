export class GameUrlEncoder {
  private static readonly PREFIX = 'gurl_'
  static encode(url: string): string {
    const timestamp = Date.now()
    const payload = JSON.stringify({
      url,
      timestamp,
      checksum: this.generateChecksum(url, timestamp)
    })
    const encoded = btoa(encodeURIComponent(payload))
    return `${this.PREFIX}${encoded}`
  }
  static decode(token: string): string {
    if (!token.startsWith(this.PREFIX)) throw new Error('invalid token')
    const encoded = token.substring(this.PREFIX.length)
    const payload = decodeURIComponent(atob(encoded))
    const data = JSON.parse(payload)
    if (!data.url || !data.timestamp || !data.checksum) throw new Error('invalid token data')
    const expectedChecksum = this.generateChecksum(data.url, data.timestamp)
    if (data.checksum !== expectedChecksum) throw new Error('checksum failed')
    const now = Date.now()
    const tokenAge = now - data.timestamp
    const maxAge = 1 * 60 * 60 * 1000
    if (tokenAge > maxAge) throw new Error('token expired')
    return data.url
  }
  static isValid(token: string): boolean {
    try {
      this.decode(token)
      return true
    } catch {
      return false
    }
  }
  private static generateChecksum(url: string, timestamp: number): string {
    const combined = `${url}_${timestamp}_salt_key`
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }
  static extractGameId(token: string): number | null {
    try {
      const url = this.decode(token)
      const match = url.match(/game[/_](\d+)/i)
      return match ? parseInt(match[1]) : null
    } catch {
      return null
    }
  }
}
