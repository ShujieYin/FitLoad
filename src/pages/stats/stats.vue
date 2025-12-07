<template>
  <view class="stats-container">
    <view class="header">
      <text class="title">Training Statistics</text>
      <view class="date-selector">
        <text @click="prevMonth" class="date-btn">&lt;</text>
        <text class="current-month">{{ currentMonth }}</text>
        <text @click="nextMonth" class="date-btn">&gt;</text>
      </view>
    </view>

    <view class="chart-section">
      <text class="chart-title">Weekly Load Trend</text>
      <view class="chart-container">
        <view v-for="(load, index) in weeklyLoad" :key="index" class="bar"
              :style="{ height: `${load * 0.5}px`, backgroundColor: loadColor(load) }">
          <text class="bar-label">{{ load }}</text>
        </view>
      </view>
    </view>

    <view class="chart-section">
      <text class="chart-title">Weekly RPE Trend</text>
      <view class="line-chart">
        <view v-for="(rpe, index) in avgRPEweekly" :key="index" class="line-point"
              :style="{ left: `${index * 20}%`, height: `${rpe * 3}px` }">
          <text class="point-label">{{ rpe }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentMonth: '',
      weeklyLoad: [],
      avgRPEweekly: []
    }
  },

  created() {
    this.currentMonth = this.formatDate(new Date())
    this.fetchStats()
  },

  methods: {
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    },

    async fetchStats() {
      const res = await uniCloud.callFunction({
        name: 'getMonthlySummary',
        data: { month: this.currentMonth }
      })

      if (res.result && res.result.length > 0) {
        const summary = res.result[0]
        this.weeklyLoad = summary.weeklyLoad || []
        this.avgRPEweekly = summary.avgRPEweekly || []
      }
    },

    prevMonth() {
      const [year, month] = this.currentMonth.split('-').map(Number)
      const newDate = new Date(year, month - 2, 1)
      this.currentMonth = this.formatDate(newDate)
      this.fetchStats()
    },

    nextMonth() {
      const [year, month] = this.currentMonth.split('-').map(Number)
      const newDate = new Date(year, month, 1)
      this.currentMonth = this.formatDate(newDate)
      this.fetchStats()
    },

    loadColor(load) {
      if (load === 0) return '#EEEEEE'
      if (load < 50) return '#CDE7FF'
      if (load < 150) return '#6FB5FF'
      return '#1F78FF'
    }
  }
}
</script>

<style>
.stats-container {
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.date-selector {
  display: flex;
  align-items: center;
}

.date-btn {
  margin: 0 10rpx;
  font-size: 32rpx;
}

.current-month {
  font-weight: bold;
}

.chart-section {
  margin-bottom: 40rpx;
}

.chart-title {
  display: block;
  margin-bottom: 15rpx;
  font-weight: bold;
}

.chart-container {
  display: flex;
  justify-content: space-between;
  height: 200rpx;
  margin-top: 10rpx;
}

.bar {
  width: 12%;
  background-color: #1F78FF;
  border-radius: 4rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  margin: 0 2rpx;
}

.bar-label {
  position: absolute;
  bottom: 5rpx;
  font-size: 12rpx;
}

.line-chart {
  height: 200rpx;
  position: relative;
  border-bottom: 1px solid #ccc;
}

.line-point {
  position: absolute;
  bottom: 0;
  width: 16rpx;
  height: 16rpx;
  background-color: #1F78FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12rpx;
  color: white;
}

.point-label {
  position: absolute;
  top: -20rpx;
  font-size: 12rpx;
}
</style>