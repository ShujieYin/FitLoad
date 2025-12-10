'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const _ = db.command
  const userId = context.auth?.uid || "demo"  // 测试用

  // -------- 获取当前 ISO 年/周 --------
  const now = new Date()
  const getISOWeek = (date) => {
    const _date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = _date.getUTCDay() || 7
    _date.setUTCDate(_date.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(_date.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(((_date - yearStart) / 86400000 + 1) / 7)
    return { year: _date.getUTCFullYear(), week: weekNo }
  }

  const current = getISOWeek(now)

  // -------- 生成最近 8 周的 year/week 列表 --------
  const weekList = []
  let year = current.year
  let week = current.week

  for (let i = 0; i < 8; i++) {
    weekList.push({ year, yearWeek: week })
    week--
    if (week === 0) { 
      year--
      const lastWeekOfPrevYear = getISOWeek(new Date(year, 11, 31)).week
      week = lastWeekOfPrevYear
    }
  }

  // -------- 查询数据库 --------
  const query = _.or(weekList.map(w => ({ year: w.year, yearWeek: w.yearWeek })))
  const res = await db.collection('training_record')
    .where({
      user_id: userId,
      $or: weekList.map(w => ({ year: w.year, yearWeek: w.yearWeek }))
    })
    .get()

  const records = res.data || []

  // -------- 按 week 聚合 totalLoad 和 avgRpe --------
  const weeklyMap = {}

  records.forEach(r => {
    const key = `${r.year}-W${r.yearWeek}`
    if (!weeklyMap[key]) {
      weeklyMap[key] = { totalLoad: 0, totalRpe: 0, count: 0, year: r.year, week: r.yearWeek }
    }
    weeklyMap[key].totalLoad += r.load
    weeklyMap[key].totalRpe += r.rpe
    weeklyMap[key].count += 1
  })

  const weeklyStats = Object.values(weeklyMap)
    .sort((a, b) => (a.year - b.year) || (a.week - b.week))
    .map(item => ({
      // label: `${item.year}-W${item.week}`,
      label: `CW${item.week}`,
      totalLoad: item.totalLoad,
      avgRpe: Number((item.totalRpe / item.count).toFixed(2))
    }))

  // -------- 返回你想要的格式 --------
  const categories = weeklyStats.map(i => i.label)
  const loadData = weeklyStats.map(i => i.totalLoad)
  const avgRpeData = weeklyStats.map(i => i.avgRpe)

  return {
    code: 0,
    msg: "success",
    data: {
      Column: {
        categories,
        series: [
          {
            name: "Load",
            data: loadData
          }
        ]
      },
      Line: {
        categories,
        series: [
          {
            name: "avgRPE",
            data: avgRpeData
          }
        ]
      }
    }
  }
}
