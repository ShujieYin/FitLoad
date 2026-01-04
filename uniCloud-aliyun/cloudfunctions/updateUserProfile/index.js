'use strict'

const auth = require('auth')

exports.main = async (event, context) => {
  const { nickname, avatar } = event

  if (!nickname || !avatar) {
    return {
      errCode: 400,
      errMsg: '参数不完整'
    }
  }

  // 从 token 中解析 uid
  const { uid } = await auth(context) 

  const db = uniCloud.database()
  await db.collection('uni-id-users')
    .doc(uid)
    .update({
      nickname,
      avatar,
      updated_at: Date.now()
    })

  return {
    errCode: 0,
    errMsg: 'ok'
  }
}
