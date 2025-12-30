export async function weixinLogin() {
  const loginRes = await uni.login({ provider: 'weixin' })
  const code = loginRes.code

  const res = await uniCloud.callFunction({
    name: 'login-weixin',
    data: { code }
  })

  if (res.result.code !== 0) {
    throw new Error('login failed')
  }

  const { token, tokenExpired } = res.result.data

  uni.setStorageSync('token', token)
  uni.setStorageSync('tokenExpired', tokenExpired)
}
