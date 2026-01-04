<template>
  <view class="container" v-if="showCalendar">
    <uni-calendar
      class="uni-calendar--hook"
      :selected="selected"
      :showMonth="false"
      @change="onDateChange"
      @monthSwitch="onMonthSwitch"
    />

    <!-- 示例：显示一天负载 -->
    <!-- <view v-if="debugDay">
      Load on {{ debugDay }}: {{ dailyLoad[debugDay] || 0 }}
    </view> -->
  </view>

  <view class="page">
    <!-- 用户信息区 -->
    <view class="user-bar" @click="goUserProfile">
      <image class="avatar" :src="user.avatar"></image>
      <text class="nickname">{{ user.nickname }}</text>
    </view>

    <!-- 下面是你的 calendar 其他内容 -->
  </view>
</template>

<script>
import { callFunction } from '@/utils/request.js'

export default {
  data() {
    return {
      showCalendar: true,
      dailyLoad: {},  // { "2025-12-01": 120 }
      selected: [],
      debugDay: "",
      user:{
        nickname: '',
        avatar: ''
      }
    }
  },

  onLoad() {
    const today = new Date()
    // 监听刷新事件
    uni.$on('refreshRecords', () => {
      this.fetchMonthLoad(today.getFullYear(), today.getMonth() + 1)
    })
    this.fetchMonthLoad(today.getFullYear(), today.getMonth() + 1)

    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo) {
      // console.log("no userInfo")
      this.fetchUserProfile()
    }
  },

  onShow() {
    // 页面每次显示时刷新（防止用户信息被修改）
    this.loadUserInfo()
  },

  onUnload() {
    // 移除监听刷新事件
    const today = new Date()
    uni.$off('refreshRecords', () => {
      this.fetchMonthLoad(today.getFullYear(), today.getMonth() + 1)
    })
  },

  methods: {
    /** 拉取当月 load */
    async fetchMonthLoad(year, month) {
      const res = await callFunction(
        "getMonthlyRecordOverview",
        { year, month }
      )

      if (res.result.code !== 200) return

      this.dailyLoad = res.result.data

      // 根据 dailyLoad 构造 selected 数组 → 让日历显示数字
      this.selected = Object.keys(this.dailyLoad).map(date => ({
        date,
        info: this.dailyLoad[date] >= 0 ? `${this.dailyLoad[date]}` : ""
      }))
    },

    async fetchUserProfile() {
      const res = await callFunction(
        'getUserProfile',
        {}
      )

      if (res.result.errCode !== 0) {
        throw new Error(res.result.errMsg || '获取用户信息失败')
      }

      const userInfo = res.result.data

      // 保存到本地
      uni.setStorageSync('userInfo', {
        nickname: userInfo.nickname,
        avatar: userInfo.avatar
      });

      return userInfo
    },

    /** 切换月份时触发 */
    onMonthSwitch(e) {
      const { year, month } = e
      this.fetchMonthLoad(year, Number(month))
    },

    /** 点击日期 */
    onDateChange(e) {
      const date = e.fulldate   // YYYY-MM-DD
      this.debugDay = date

      const hasLoad = this.dailyLoad[date] >= 0

      if (hasLoad) {
        // 有记录 → EDIT 页面
        uni.navigateTo({
          url: `/pages/editRecord/editRecord?date=${date}`
        })
      } else {
        // 无记录 → ADD 页面
        uni.navigateTo({
          url: `/pages/addRecord/addRecord?date=${date}`
        })
      }
    },

    loadUserInfo() {
      const userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.user.nickname = userInfo.nickname
        this.user.avatar = userInfo.avatar
      }
    },

    goUserProfile() {
      uni.navigateTo({
        url: '/pages/userInfo/userInfo'
      })
    }
  }
}
</script>

<style>
.container {
  padding: 10px;
}

.user-bar {
  display: flex;
  align-items: center;
  padding: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.nickname {
  font-size: 32rpx;
  font-weight: 500;
}
</style>
