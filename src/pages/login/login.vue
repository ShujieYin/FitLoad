<template>
  <view class="page">
    <view class="card">

      <!-- 头像选择 -->
      <button
        class="avatar-wrapper"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      >
        <image class="avatar" :src="avatarUrl" />
      </button>

      <!-- 昵称输入（微信规范） -->
      <input
        class="weui-input"
        type="nickname"
        placeholder="请输入昵称"
        v-model="nickname"
      />

      <!-- 保存 -->
      <button
        class="btn"
        type="primary"
        :disabled="!canSubmit"
        @click="saveProfile"
      >
        登陆
      </button>

      <!-- 隐私政策 -->
      <view class="privacy">
        <text>登录即表示同意</text>
        <text class="link" @click="openPrivacy">《隐私政策》</text>
      </view>

    </view>
  </view>
</template>

<script>
import { callFunction } from '@/utils/request.js'
const defaultAvatarUrl =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

export default {
  data() {
    return {
      avatarUrl: defaultAvatarUrl,
      cloudAvatarUrl: '',
      nickname: ''
    }
  },

  onLoad() {
    const userInfo = uni.getStorageSync('userInfo')
    if (userInfo?.nickname && userInfo?.avatar) {
      uni.switchTab({ url: '/pages/calendar/calendar' })
    }
  },

  
  computed: {
    canSubmit() {
      // return this.nickname && this.cloudAvatarUrl
      return this.nickname
    }
  },

  methods: {

    // 选择头像（微信官方方式）
    async onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      this.avatarUrl = avatarUrl
      // console.log("avatarUrl:", avatarUrl)
    },

    async uploadAvatar(tempUrl) {
      if (tempUrl === defaultAvatarUrl){
        this.cloudAvatarUrl = "https://mp-b8b227aa-e2e7-400b-9b58-c754859c8291.cdn.bspapp.com/cloudstorage/2a1d4502-6c66-4787-8ea5-c4fac488b684.jpg"
      } else {
        const res = await uniCloud.uploadFile({
          filePath: tempUrl,
          cloudPath: `avatar/${this.nickname}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}.jpg`
        })
  
        this.cloudAvatarUrl = res.fileID
        // console.log("fileID: ", this.cloudAvatarUrl)
      }
    },

    async saveProfile() {
      try {
        // 上传头像到 uniCloud
        await this.uploadAvatar(this.avatarUrl)

        // 更新用户nickname & avatar
        await callFunction(
          'updateUserProfile',
          {
            nickname: this.nickname,
            avatar: this.cloudAvatarUrl
          }
        )
        wx.setStorageSync('userInfo', {
          nickname: this.nickname,
          avatar: this.cloudAvatarUrl
        });
        // console.log(wx.getStorageSync('userInfo'))
        uni.showToast({ title: '登陆成功' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/calendar/calendar' })
        }, 600)
      } catch (err) {
        uni.showToast({
          title: err.message || '登陆失败',
          icon: 'none'
        })
      }
    },

    openPrivacy() {
      uni.navigateTo({
        url: '/pages/privacy/index'
      })
    }
  }
}
</script>

<style scoped>
.page {
  padding: 40rpx;
}

.card {
  background: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
}

.avatar-wrapper {
  width: 160rpx;
  height: 160rpx;
  border: none;
  background: transparent;
  padding: 0;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  /* border-radius: 50%; */
  display: block;
  margin: 0 auto 40rpx;
}

.weui-input {
  border-bottom: 1px solid #eee;
  padding: 20rpx;
  margin-bottom: 40rpx;
}

.btn {
  margin-top: 20rpx;
}

.privacy {
  margin-top: 40rpx;
  text-align: center;
  font-size: 24rpx;
}

.link {
  color: #007aff;
}
</style>
