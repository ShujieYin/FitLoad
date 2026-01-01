import { refreshToken } from './token.js'
import { loginByWeixin } from './login.js'

const TOKEN_ERROR_CODES = [30202, 30203] // check failed / expired

export async function callFunction(name, data = {}) {
  let token = uni.getStorageSync('uni_id_token')

  let res = await uniCloud.callFunction({
    name,
    data,
    header: token
      ? { Authorization: 'Bearer ' + token }
      : {}
  })

  const errCode = res.result?.code || res.result?.errCode

  if (TOKEN_ERROR_CODES.includes(errCode)) {
    try {
      await refreshToken()
    } catch (e) {
      await loginByWeixin()
    }

    // 🔁 重试一次
    return callFunction(name, data)
  }

  return res
}
