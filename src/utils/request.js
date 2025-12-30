import { refreshToken } from './token.js'
import { weixinLogin } from './login.js'

export async function callFunction(name, data = {}) {
  let token = uni.getStorageSync('token')

  let res = await uniCloud.callFunction({
    name,
    data,
    header: {
      Authorization: token
    }
  })

  // token 失效（uni-id 标准错误码）
  if (res.result?.code === 30201) {
    try {
      await refreshToken()
    } catch (e) {
      await weixinLogin()
    }

    // 重试一次
    return callFunction(name, data)
  }

  return res
}
