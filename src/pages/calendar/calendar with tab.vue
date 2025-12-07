<template>
  <!-- <view class="tabs">
    <view
      v-for="item in tabs"
      :key="item.path"
      class="tab-item"
      :class="{ active: current === item.path }"
      @click="go(item.path)"
    >
      {{ item.name }}
    </view>
  </view> -->
  <view>Calendar</view>
	<view class="container" v-if="showCalendar">
		<view>
			<uni-calendar class="uni-calendar--hook" :selected="info.selected" :showMonth="false" @change="change" @monthSwitch="monthSwitch" />
		</view>
	</view>
</template>

<script>
/**
 * 获取任意时间
 */
function getDate(date, AddDayCount = 0) {
	if (!date) {
		date = new Date();
	}
	if (typeof date !== 'object') {
		date = date.replace(/-/g, '/');
	}
	const dd = new Date(date);

	dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期

	const y = dd.getFullYear();
	const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
	const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
	return {
		fullDate: y + '-' + m + '-' + d,
		year: y,
		month: m,
		date: d,
		day: dd.getDay()
	};
}

export default {
	components: {},
	data() {
		return {
			tabs: [
				{ name: "Calendar", path: "/pages/calendar/calendar" },
				{ name: "Statistic", path: "/pages/stats/stats" }
      		],
      		current: "",
			showCalendar: false,
			info: {
				lunar: true,
				range: true,
				insert: false,
				selected: []
			}
		};
	},
	onLoad() {
    	this.updateCurrent()
  	},
	onShow() {
		this.updateCurrent()
	},
	onReady() {
		this.$nextTick(() => {
			this.showCalendar = true;
		});
		// TODO 模拟请求异步同步数据
		setTimeout(() => {
			this.info.date = getDate(new Date(), -30).fullDate;
			this.info.startDate = getDate(new Date(), -60).fullDate;
			this.info.endDate = getDate(new Date(), 30).fullDate;
			this.info.selected = [
				{
					date: getDate(new Date(), -3).fullDate,
					info: '打卡'
				},
				{
					date: getDate(new Date(), -2).fullDate,
					info: '签到',
					data: {
						custom: '自定义信息',
						name: '自定义消息头'
					}
				},
				{
					date: getDate(new Date(), -1).fullDate,
					info: '已打卡'
				}
			];
		}, 2000);
	},
	methods: {
		updateCurrent() {
      		this.current = getCurrentPages().pop().route   // 当前页面路径
    	},
    	go(path) {
      		uni.navigateTo({
        		url: path
			})
    	},
		open() {
			this.$refs.calendar.open();
		},
		close() {
			console.log('弹窗关闭');
		},
		change(e) {
			console.log('change 返回:', e);
			// 模拟动态打卡
			if (this.info.selected.length > 5) return;
			this.info.selected.push({
				date: e.fulldate,
				info: '打卡'
			});
		},
		confirm(e) {
			console.log('confirm 返回:', e);
		},
		monthSwitch(e) {
			console.log('monthSwitchs 返回:', e);
		}
	}
};
</script>

<style lang="scss">
.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  background: #fff;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #42b983;
  font-weight: bold;
  border-bottom: 4rpx solid #42b983;
}

.example-body {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}

.calendar-button {
	flex: 1;
	font-weight: bold;
	font-size: 32rpx;
}
</style>
