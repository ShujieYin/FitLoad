import { loginByWeixin } from './login.js'
import { refreshToken } from './token.js'

export async function initAuth() {
  const token = uni.getStorageSync('uni_id_token')
  const expired = uni.getStorageSync('uni_id_token_expired')

  // 第一次进小程序
  if (!token) {
    return await loginByWeixin()
  }

  // token 即将过期（提前 5 分钟）
  if (Date.now() > expired - 5 * 60 * 1000) {
    try {
      await refreshToken()
    } catch (e) {
      // refresh 失败 → 重新登录
      return await loginByWeixin()
    }
  }
}
