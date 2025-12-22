'use strict'
const uniID = require('uni-id')
// const uniID = require('../common/uni-id/index.js')

exports.main = async (event, context) => {
  const { code } = event

  if (!code) {
    console.log('400');
    return {
      code: 400,
      msg: '缺少 code'
    }
  }

  // 核心：微信小程序登录
  const res = await uniID.loginByWeixin({
    code
  })
  console.log('200');
  // 你不关心 token，只关心 uid
  return {
    code: 200,
    msg: 'login success',
    uid: res.uid   // 🔥关键
  }
}
