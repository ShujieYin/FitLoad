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
    <view v-if="debugDay">
      Load on {{ debugDay }}: {{ dailyLoad[debugDay] || 0 }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showCalendar: true,
      dailyLoad: {},  // { "2025-12-01": 120 }
      selected: [],
      debugDay: ""
    }
  },

  onLoad() {
    const today = new Date()
    this.fetchMonthLoad(today.getFullYear(), today.getMonth() + 1)
  },

  methods: {
    /** 拉取当月 load */
    async fetchMonthLoad(year, month) {
      const res = await uniCloud.callFunction({
        name: "getMonthlyRecordOverview",
        data: { year, month }
      })

      if (res.result.code !== 200) return

      this.dailyLoad = res.result.data

      // 根据 dailyLoad 构造 selected 数组 → 让日历显示数字
      this.selected = Object.keys(this.dailyLoad).map(date => ({
        date,
        info: this.dailyLoad[date] > 0 ? `${this.dailyLoad[date]}` : ""
      }))
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

      const hasLoad = this.dailyLoad[date] && this.dailyLoad[date] > 0

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
    }
  }
}
</script>

<style>
.container {
  padding: 10px;
}
</style>
