<template>
  <view>
    <button @click="getWechatCode">获取微信 code</button>
  </view>
</template>

<script>
export default {
  methods: {
    async getWechatCode() {
      try {
        // 1. 先获取微信登录的code
        const loginRes = await new Promise((resolve, reject) => {
          uni.login({
            provider: 'weixin',
            success: resolve,
            fail: reject
          });
        });

        if (loginRes.code) {
          console.log('微信登录 code:', loginRes.code);
          
          // 2. 将code传给云函数获取openid
          const cloudRes = await uniCloud.callFunction({
            name: 'getWexinOpenID',
            data: {
              code: loginRes.code  // 使用正确的变量
            }
          });

          console.log('云函数返回:', cloudRes.result);
          
          // 这里可以根据业务需求处理返回的数据
          // 例如：存储openid、用户信息等
        } else {
          console.error('未获取到code字段', loginRes);
        }
      } catch (err) {
        console.error('获取微信code失败:', err);
        uni.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    }
  }
}
</script>