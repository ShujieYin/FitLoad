export function getWxCode() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: res => resolve(res.code),
      fail: reject
    })
  })
}

const uniIdCo = uniCloud.importObject('uni-id-co')

export async function loginByWeixin() {
  const code = await getWxCode()

  const res = await uniIdCo.loginByWeixin({ code })

  // 官方返回结构
  // { errCode, newToken.token, newToken.tokenExpired, uid, ... }
  // token & tokenExpired 自动存储到uni_id_token & uni_id_token_expired 里
  // console.log("login succeeded")
  return res
}
