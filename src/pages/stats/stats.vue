<template>
  <view class="stats-container">

    <!-- Weekly Load & avgRPE -->
    <view class="chart-section">
      <text class="chart-title">Weekly Load & avg RPE Trend</text>
      <view class="content">
        <view class="charts-box" style="height: 400px;">
          <qiun-data-charts type="mix" 
          :opts="{
            yAxis:{
              data:[
                // {position: 'right',title: 'avgRPE'},
                // {position: 'left',min: 0,max: 5000,title: 'Load',textAlign: 'left'}
                {position: 'right',min: 0,max: 10,title: 'avgRPE'},
                {position: 'left', min: 0,title: 'Load'}
              ]
            }
          }" 
          :chartData="chartsDataMix"/>
        </view>
      </view>
    </view>

    <!-- Weekly ACWR -->
    <view class="chart-section">
      <text class="chart-title">Weekly ACWR Trend</text>
      <view class="content">
        <view class="charts-box" style="height: 200px;">
          <qiun-data-charts type="line" :chartData="chartsDataACWR"/>
        </view>
      </view>
    </view>

    <!-- Daily avgHRV -->
    <view class="chart-section">
      <text class="chart-title">Daily avgHRV Trend</text>
      <view class="content">
        <view class="charts-box" style="height: 200px;">
          <qiun-data-charts type="mix" 
          :opts="{
            xAxis:{
              disabled:true
            }
          }" 
          :chartData="chartsDataHRV"/>
        </view>
      </view>
    </view>

  </view>
</template>

<script>

//下面是演示数据，您的项目不需要引用，数据需要您从服务器自行获取
// import demodata from '@/mockdata/demodata.json';

export default {
  data() {
    return {
      //charts
      chartsDataMix:{},
      chartsDataACWR:{},
      chartsDataHRV:{},
      
      //load & avgRPE
      dataMix:{},
      categories:[],
      loadData:[],
      avgRpeData:[],
      
      //ACWR
      dataACWR:{},
      acwrCoupled: [],
      acwrUncoupled: [],

      //HRV
      dataHRV:{},
      hrvDates: [],
      hrvAvgData: [],
      hrvWeeks: 8   
    }
  },

  onLoad(){
    this.init()
  },

  methods: {
    async init() {
      try {
        await Promise.all([
          this.fetchWeeklyStats(),
          this.loadHRVStats()
        ])

        this.renderLoad()
        this.renderACWR()
        this.renderHRV()
      } catch (err) {
        console.error('Init failed:', err)
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        })
      }
    },

    async fetchWeeklyStats() {
      const res = await uniCloud.callFunction({
        name: "getWeeklyStats",
        data: {}
      })

      if (res.result.code !== 200) return

      const d = res.result.data
      this.categories = d.categories
      this.loadData = d.loadData
      this.avgRpeData = d.avgRpeData
      this.acwrCoupled = d.acwrCoupled
      this.acwrUncoupled = d.acwrUncoupled
    },

    async loadHRVStats() {
      const res = await uniCloud.callFunction({
        name: 'getDailyHRVStats',
        data: {
          weeks: this.hrvWeeks
        }
      })

      const days = res.result.data.days

      this.hrvDates = days.map(d => d.date)
      this.hrvAvgData = days.map(d => d.avgHRV)
    },

    renderLoad(){
      setTimeout(() => {
        this.dataMix = {
          "categories": this.categories,
          "series": [{
            "name": "Load",
            "index":1,
            "data": this.loadData,
            "type": "column"
          },{
            "name": "avgRPE",
            "data": this.avgRpeData,
            "type": "line",
            "textSize": 1,
            "color": "#2fc25b"
            }
          ]
        }
        this.chartsDataMix=JSON.parse(JSON.stringify(this.dataMix))
      } , 1500);
    },

    renderACWR() {
      setTimeout(() => {
        this.acwr = {
          "categories": this.categories,
          "series": [{
            "name": "耦合ACWR",
            "data": this.acwrCoupled
          }, {
            "name": "非耦合ACWR",
            "data": this.acwrUncoupled,
            "textSize": 1
          }]
        }
        this.chartsDataACWR=JSON.parse(JSON.stringify(this.acwr))
      }, 1500);
    },

    renderHRV() {
      setTimeout(() => {
        this.dataHRV = {
          "categories": this.hrvDates,
          "series": [{
            "name": "avgHRV",
            "type": "point",
            "data": this.hrvAvgData
          }]
        }
        // console.log(JSON.stringify(this.dataHRV))

        this.chartsDataHRV=JSON.parse(JSON.stringify(this.dataHRV))
      }, 1500);
    }
  },

}
</script>

<style>
.chart-section {
  background: #fff;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ddd;
  width: 95%;
}

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
