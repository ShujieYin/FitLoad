'use strict'

const auth = require('auth')

exports.main = async (event, context) => {
    
    
  const { uid } = await auth(context) 

  const db = uniCloud.database()
  const res = await db.collection('uni-id-users')
    .doc(uid)
    .field({
      nickname: true,
      avatar: true
    })
    .get()

  const user = res.data[0]
  if (!user) {
    return {
      errCode: 404,
      errMsg: '用户不存在'
    }
  }

  // 4. 返回用户信息
  return {
    errCode: 0,
    data: {
      uid,
      nickname: user.nickname || '',
      avatar: user.avatar || ''
    }
  }
}
