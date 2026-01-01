const uniIdCo = uniCloud.importObject('uni-id-co')

export async function refreshToken() {
  const token = uni.getStorageSync('uni_id_token')

  const res = await uniIdCo.refreshToken({ token })

  // uni.setStorageSync('token', res.newToken.token)
  // uni.setStorageSync('tokenExpired', res.newToken.tokenExpired)
  // console.log("RES: ", res)
  return res
}
