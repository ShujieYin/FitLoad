'use strict'

const { createInstance } = require('uni-id-common')

module.exports = async function auth(context) {
  if (!context || !context.uniIdToken) {
    throw { code: 401, msg: '未登录（缺少 token）' }
  }

  // 🔴 关键：必须把 context 传进去
  const uniID = createInstance({ context })

  let res
  try {
    res = await uniID.checkToken(context.uniIdToken)
  } catch (err) {
    throw {
      code: 401,
      msg: 'token 校验失败',
      detail: err
    }
  }

  if (res.code !== 0) {
    throw {
      code: 401,
      msg: '登录状态已失效',
      detail: res
    }
  }

  return {
    uid: res.uid,
    role: res.role || [],
    permission: res.permission || []
  }
}
