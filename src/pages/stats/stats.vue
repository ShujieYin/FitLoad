<template>
  <view class="stats-container">

    <!-- Weekly Load -->
    <view class="chart-section">
      <text class="chart-title">Weekly Load Trend</text>
      <view class="content">
        <view class="charts-box" style="height: 300px;">
          <qiun-data-charts type="column" :chartData="chartsDataColumn1" />
        </view>
      </view>
    </view>

    <!-- Weekly RPE -->
    <view class="chart-section">
      <text class="chart-title">Weekly average RPE Trend</text>
      <view class="content">
        <view class="charts-box" style="height: 200px;">
          <qiun-data-charts type="line" :chartData="chartsDataLine1"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

//下面是演示数据，您的项目不需要引用，数据需要您从服务器自行获取
import demodata from '@/mockdata/demodata.json';

export default {
  data() {
    return {
      chartsDataColumn1:{},
      chartsDataLine1:{}
    }
  },

  onReady() {
    this.getServerData()
  },

  methods: {
    getServerData() {
      setTimeout(() => {
        this.chartsDataColumn1=JSON.parse(JSON.stringify(demodata.Column))
        this.chartsDataLine1=JSON.parse(JSON.stringify(demodata.Line))
      }, 1500);
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.charts-box {
  flex: 1;
  width: 95%;
  height: 200px;
}
</style>
