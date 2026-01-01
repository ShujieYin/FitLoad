<template>
  <view class="container">
    <!-- 头像选择 -->
    <button
      class="avatar-wrapper"
      open-type="chooseAvatar"
      @chooseavatar="onChooseAvatar"
    >
      <image class="avatar" :src="avatarUrl" />
    </button>

    <!-- 昵称输入 -->
    <input
      class="weui-input"
      type="nickname"
      placeholder="请输入昵称"
      v-model="nickname"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'

/**
 * 默认头像
 * 微信官方建议的默认头像地址
 */
const defaultAvatarUrl =
  'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

// 响应式数据
const avatarUrl = ref(defaultAvatarUrl)
const nickname = ref('')

// 选择头像回调
function onChooseAvatar(e) {
  const { avatarUrl: selectedAvatarUrl } = e.detail
  avatarUrl.value = selectedAvatarUrl
}
</script>

<style scoped>
.container {
  padding: 32rpx;
}

.avatar-wrapper {
  width: 160rpx;
  height: 160rpx;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.weui-input {
  margin-top: 24rpx;
  padding: 20rpx;
  border: 1px solid #eee;
  border-radius: 8rpx;
}
</style>
