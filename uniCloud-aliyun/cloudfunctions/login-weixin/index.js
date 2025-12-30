'use strict'

const uniID = require('uni-id-common')
const db = uniCloud.database()

const uniIDIns = uniID.createInstance({
  context: this
})

exports.main = async (event, context) => {
  const { code, userInfo } = event

  if (!code) {
    return { code: 400, msg: 'missing code' }
  }

  // 用 code 换 openid
  const res = await uniIDIns.loginByWeixin({
    code
  })

  if (res.code !== 0) {
    return res
  }

  const { uid, openid } = res

  // 更新用户信息（可选）
  await db.collection('uni-id-users')
    .doc(uid)
    .update({
      last_login_at: new Date(),
      ...(userInfo || {})
    })

  // 返回 token
  return {
    code: 0,
    msg: 'login success',
    data: {
      token: res.token,
      tokenExpired: res.tokenExpired,
      uid
    }
  }
}
