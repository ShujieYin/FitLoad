<script>
export default {
  globalData: {
    categories: ['Full Body', 'Upper Body','Lower Body',"Basketball", "Cycling","Jogging", 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
    timeOfDays: ["morning", "afternoon", "night"]
  },
  // async onLaunch() {
  //   console.log("App launched")
	
  //   try {
  //     const res = await uniCloud.callFunction({
  //       name: 'uni-id-common',
  //       data: {
  //         action: 'login',
  //         params: {
  //           loginType: 'weixin'
  //         }
  //       }
  //     })

  //     // uni-id 成功一定是 code === 0
  //     if (res.result.code === 0) {
  //       console.log('微信自动登录成功')
  //     } else {
  //       console.warn('微信自动登录未成功', res.result)
  //     }
  //   } catch (e) {
  //     console.warn('微信自动登录异常', e)
  //   }
  // },
  
//   onLaunch() {
//   uni.login({
//     provider: 'weixin',
//     success: (res) => {
//       uniCloud.callFunction({
//         name: 'wx-login',
//         data: { code: res.code }
//       })
//     }
//   })
// }
}
</script>

<style>
/*每个页面公共css */
</style>
