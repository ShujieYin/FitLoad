import { weixinLogin } from './login.js'
import { refreshToken } from './token.js'

export async function initAuth() {
  const token = uni.getStorageSync('token')
  const expired = uni.getStorageSync('tokenExpired')

  // 第一次进小程序
  if (!token) {
    return await weixinLogin()
  }

  // token 即将过期（提前 5 分钟）
  if (Date.now() > expired - 5 * 60 * 1000) {
    try {
      await refreshToken()
    } catch (e) {
      // refresh 失败 → 重新登录
      return await weixinLogin()
    }
  }
}
