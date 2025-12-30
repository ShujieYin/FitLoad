export async function refreshToken() {
  const res = await uniCloud.callFunction({
    name: 'refresh-token',
    header: {
      Authorization: uni.getStorageSync('token')
    }
  })

  if (res.result.code !== 0) {
    throw new Error('refresh failed')
  }

  uni.setStorageSync('token', res.result.token)
  uni.setStorageSync('tokenExpired', res.result.tokenExpired)
}
