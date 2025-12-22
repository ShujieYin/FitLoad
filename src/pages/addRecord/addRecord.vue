<template>
  <view class="add-record-container">
    <view class="header">
      <text class="title">{{ date ? `Add Record for ${date}` : 'New Training Record' }}</text>
    </view>

    <view class="form-group">
      <text class="label">Time of Day</text>
      <view class="picker-group">
        <picker mode="selector" :range="timeOfDays" @change="timeOfDayChange">
          <view class="picker">{{ timeOfDays[timeOfDayIndex] }}</view>
        </picker>
      </view>
    </view>

    <view class="form-group">
      <text class="label">Training Type</text>
      <view class="picker-group">
        <picker mode="selector" :range="categories" @change="categoryChange">
          <view class="picker">{{ categories[categoryIndex] }}</view>
        </picker>
      </view>
    </view>

    <view class="form-group">
      <text class="label">RPE (1-10)</text>
      <input type="number" v-model.number="rpe" min="1" max="10" class="input" placeholder="Enter RPE" />
    </view>

    <view class="form-group">
      <text class="label">Duration (minutes)</text>
      <input type="number" v-model.number="duration" min="1" class="input" placeholder="Enter duration" />
    </view>

    <view class="form-group">
      <text class="label">HRV (ms)(optional)</text>
      <input type="number" v-model.number="hrv" min="0" class="input" placeholder="Enter HRV value" />
    </view>
    <view class="load-display">
      <text class="load-label">Load: {{ load }} (RPE × Duration)</text>
    </view>

    <view class="form-group">
      <text class="label">Notes</text>
      <textarea v-model="note" class="textarea" placeholder="Add notes" />
    </view>

    <button class="submit-btn" @click="submitRecord">Add Record</button>
  </view>
</template>

<script>
const app = getApp(); // 获取全局实例

export default {
  data() {
    return {
      date: '',
      rpe: "",
      duration: "",
      categoryIndex: 0,
      categories: app.globalData.categories,
      timeOfDayIndex:0,
      timeOfDays: app.globalData.timeOfDays,
      note: '',
      hrv: 0,
      load: 0
    }
  },

  onLoad(options) {
    this.date = options.date || this.getCurrentDate()
    this.updateLoad()
  },

  methods: {
    getCurrentDate() {
      const date = new Date()
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    updateLoad() {
      this.load = this.rpe * this.duration
    },

    categoryChange(e) {
      this.categoryIndex = e.detail.value
    },
    timeOfDayChange(e) {
      this.timeOfDayIndex = e.detail.value
    },

    async submitRecord() {
      try {
        await uniCloud.callFunction({
          name: 'addRecord',
          data: {
            date: this.date,
            rpe: this.rpe,
            duration: this.duration,
            hrv: this.hrv,
            category: this.categories[this.categoryIndex],
            timeOfDay: this.timeOfDays[this.timeOfDayIndex],
            note: this.note,
          }
        })
        uni.showToast({ title: 'Record saved!', icon: 'success' })
        uni.navigateBack()
      } catch (error) {
        uni.showToast({ title: 'Failed to save', icon: 'error' })
        console.error("调用失败", error)
      }

    }
  },

  watch: {
    rpe: 'updateLoad',
    duration: 'updateLoad'
  }
}
</script>

<style>
.add-record-container {
  padding: 20rpx;
  background-color: #f5f5f5;
}

.header {
  font-size: 20px;
  margin-bottom: 10px;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 14px;
}

.picker-group, input {
  background: #fff;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 95%;
}
/* 
.label {
  display: block;
  margin-bottom: 8rpx;
  font-weight: 500;
} */

.textarea {
  height: 120rpx;
  line-height: 1.5;  
  background: #fff;
  width: 95%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.load-display {
  background-color: #e6f7ff;
  padding: 15rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
  width: 95%;
}

.load-label {
  color: #1890ff;
  font-weight: 500;
}

.submit-btn {
  margin-top: 10px;
  background: #007AFF;
  color: white;
  width: 80%;
}
</style>