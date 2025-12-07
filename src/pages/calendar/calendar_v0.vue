<template>
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
			showCalendar: false,
			info: {
				lunar: true,
				range: true,
				insert: false,
				selected: []
			}
		};
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
		open() {
			this.$refs.calendar.open();
		},
		// 点击日历某一天
		change(e) {
			console.log('点击日期:', e);

			const date = e.fulldate; // YYYY-MM-DD

			// 跳转到训练详情页
			const isExisting = this.info.selected.some(item => item.date === date);
			uni.navigateTo({
				url: isExisting ? `pages/editRecord/editRecord?date=${date}` : `pages/addRecord/addRecord?date=${date}`
			});
		}
	}
};
</script>

<style lang="scss">
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
