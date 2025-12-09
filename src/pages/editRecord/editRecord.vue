<template>
  <view class="add-record-container">
    <view class="header">
      <text class="title">Edit Training Record</text>
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
      <text class="label">Training Type</text>
      <picker mode="selector" :range="categories" @change="categoryChange">
        <view class="picker">{{ categories[categoryIndex] }}</view>
      </picker>
    </view>

    <view class="form-group">
      <text class="label">HRV (ms)</text>
      <input type="number" v-model.number="hrv" min="0" class="input" placeholder="Enter HRV value" />
    </view>

    <view class="form-group">
      <text class="label">Notes</text>
      <textarea v-model="note" class="textarea" placeholder="Add notes" />
    </view>

    <view class="load-display">
      <text class="load-label">Load: {{ load }} (RPE � Duration)</text>
    </view>

    <button class="submit-btn" @click="submitRecord">Save Changes</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      rpe: 5,
      duration: 60,
      categoryIndex: 0,
      categories: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Full Body'],
      note: '',
      hrv: 0,
      load: 300
    }
  },

  onLoad(options) {
    this.id = options.id;
  this.date = options.date || this.getCurrentDate()
    this.rpe = options.rpe
    this.duration = options.duration
    this.categoryIndex = this.categories.indexOf(options.category)
    this.note = options.note
    this.hrv = options.hrv || 0
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

    async submitRecord() {
      try {
        await uniCloud.callFunction({
          name: 'editRecord',
          data: {
            date: this.date,
            rpe: this.rpe,
            duration: this.duration,
            hrv: this.hrv,
            id: this.id,
            category: this.categories[this.categoryIndex],
            note: this.note
          }
        })
        uni.showToast({ title: 'Record updated!', icon: 'success' })
        uni.navigateBack()
      } catch (error) {
        uni.showToast({ title: 'Failed to update', icon: 'error' })
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
  text-align: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.form-group {
  margin-bottom: 25rpx;
}

.label {
  display: block;
  margin-bottom: 8rpx;
  font-weight: 500;
}

.input, .textarea {
  width: 100%;
  padding: 12rpx;
  background-color: #fff;
  border-radius: 8rpx;
  border: 1px solid #eee;
}

.textarea {
  height: 120rpx;
  line-height: 1.5;
}

.load-display {
  background-color: #e6f7ff;
  padding: 15rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.load-label {
  color: #1890ff;
  font-weight: 500;
}

.submit-btn {
  background-color: #1890ff;
  color: white;
  border-radius: 8rpx;
  padding: 15rpx;
  font-size: 18px;
  width: 100%;
}
</style>