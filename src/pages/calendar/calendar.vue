<template>
  <view>
    <view class="container" v-if="showCalendar">
      <view @tap.stop>
        <uni-calendar
          ref="calendar"
          class="uni-calendar--hook"
          :selected="info.selected"
          :showMonth="false"
          @change="change"
          @monthSwitch="monthSwitch"
        />
      </view>
    </view>
  </view>
</template>

<script>
function getDate(date, AddDayCount = 0) {
  if (!date) date = new Date();
  if (typeof date !== 'object') date = date.replace(/-/g, '/');
  const dd = new Date(date);
  dd.setDate(dd.getDate() + AddDayCount);

  const y = dd.getFullYear();
  const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1;
  const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
  return {
    fullDate: `${y}-${m}-${d}`,
    year: y,
    month: m,
    date: d,
    day: dd.getDay()
  };
}

export default {
  data() {
    return {
      showCalendar: false,
      info: {
        lunar: true,
        range: false,
        insert: false,
        selected: []
      }
    };
  },

  onReady() {
    this.$nextTick(() => {
      this.showCalendar = true;
    });

    setTimeout(() => {
      this.info.selected = [
        { date: getDate(new Date(), -3).fullDate, info: "打卡" },
        { date: getDate(new Date(), -1).fullDate, info: "已打卡" }
      ];
    }, 500);
  },

  methods: {
    // 点击日期
    change(e) {
      console.log("日期点击事件:", e);

      const date = e.fulldate;

      const isExisting = this.info.selected.some(
        item => item.date === date
      );

      // 🔥 必须是实际存在的页面路径！
      const url = isExisting
        ? `/pages/editRecord/editRecord?date=${date}`
        : `/pages/addRecord/addRecord?date=${date}`;

      console.log("跳转路径:", url);

      uni.navigateTo({ url });
    },

    monthSwitch(e) {
      console.log("月份切换:", e);
    }
  }
};
</script>

<style lang="scss">
.container {
  padding: 20rpx;
}
</style>
