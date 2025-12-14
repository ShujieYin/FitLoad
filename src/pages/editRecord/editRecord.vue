<template>
  <view class="page">

    <!-- 顶部添加记录按钮 -->
    <button class="add-btn" @click="goAddRecord">Add New Record</button>

    <view v-if="loading">Loading...</view>

    <view v-else>
      <view class="title">Training Records on {{ date }}</view>

      <view v-if="records.length === 0" class="no-data">
        No records for this day.
      </view>

      <view
        v-for="(item, index) in records"
        :key="item._id"
        class="card"
      >
        <view class="card-title">Record #{{ index + 1 }}</view>

        <!-- time of day enum -->
        <view class="row">
          <text>Time of Day</text>
          <picker
            mode="selector"
            :range="timeOfDays"
            @change="e => item.timeOfDay = timeOfDays[e.detail.value]"
          >
            <view class="picker-box">{{ item.timeOfDay }}</view>
          </picker>
        </view>

        <!-- Category enum -->
        <view class="row">
          <text>Category</text>
          <picker
            mode="selector"
            :range="categories"
            @change="e => item.category = categories[e.detail.value]"
          >
            <view class="picker-box">{{ item.category }}</view>
          </picker>
        </view>

        <view class="row">
          <text>RPE</text>
          <input type="number" v-model.number="item.rpe" />
        </view>

        <view class="row">
          <text>Duration (min)</text>
          <input type="number" v-model.number="item.duration" />
        </view>

        <view class="row">
          <text>HRV (ms)(optional)</text>
          <input type="number" v-model.number="item.hrv" />
        </view>

        <view class="row">
          <text>Note</text>
          <textarea v-model="item.note"></textarea>
        </view>

        <button class="save-btn" @click="save(item)">Save</button>
      </view>

    </view>
  </view>
</template>

<script>
const app = getApp(); // 获取全局实例

export default {
  
  data() {
    return {
      date: "",
      records: [],
      loading: true,

      // enum options
      timeOfDays: app.globalData.timeOfDays,
      categories: app.globalData.categories
    }
  },

  onLoad(option) {
    this.date = option.date
    this.fetchData()
  },

  methods: {
    /** 新增跳转按钮 */
    goAddRecord() {
      uni.navigateTo({
        url: `/pages/addRecord/addRecord?date=${this.date}`
      })
    },

    async fetchData() {
      const res = await uniCloud.callFunction({
        name: "getDailyRecords",
        data: { date: this.date }
      })

      if (res.result.code === 200) {
        this.records = res.result.data
      }
      this.loading = false
    },

    /** 保存一条记录 */
    async save(item) {
      const res = await uniCloud.callFunction({
        name: "updateRecord",
        data: {
          id: item._id,
          rpe: item.rpe,
          duration: item.duration,
          category: item.category,
          hrv: item.hrv,
          note: item.note,
          timeOfDay: item.timeOfDay
        }
      })

      if (res.result.code === 200) {
        uni.showToast({
          title: "Updated",
          icon: "success"
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 600)
      }
    }
  }
}
</script>

<style>
.page {
  padding: 20px;
}

.add-btn {
  background: #34C759;
  color: white;
  margin-bottom: 16px;
  width: 80%;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
}

.card {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: bold;
}

.row {
  margin-bottom: 14px;
}

input{
  background: #fff;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 95%;
}

textarea{
  height: 120rpx;
  line-height: 1.5;  
  background: #fff;
  width: 95%;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.picker-box {
  padding: 6px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 95%;
}

.save-btn {
  margin-top: 10px;
  background: #007AFF;
  color: white;
  width: 80%;
}
.no-data {
  margin-top: 20px;
  text-align: center;
}
</style>
