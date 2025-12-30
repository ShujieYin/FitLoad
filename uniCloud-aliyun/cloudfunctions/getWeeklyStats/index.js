'use strict'
// const { getISOWeek } = require('../common/utils.js')
const { getISOWeek } = require('utils')

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const userId = context.auth?.uid || 'demo'

  // =====================
  // 1. 生成最近 11 周
  // =====================
  const weeks = []

  for (let i = 0; i < 11; i++) {
    // 计算前 i 周的日期
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);
    
    const weekInfo = getISOWeek(date);
    weeks.unshift({ year: weekInfo.year, week: weekInfo.week });
  }

  // =====================
  // 2. 查询数据库
  // =====================
  const res = await db.collection('training_record')
    .where({
      user_id: userId,
      $or: weeks.map(w => ({
        year: w.year,
        yearWeek: w.week
      }))
    })
    .get()

  const records = res.data || []

  // =====================
  // 3. 按周聚合
  // =====================
  const weeklyMap = {}

  records.forEach(r => {
    const key = `${r.year}-${r.yearWeek}`
    if (!weeklyMap[key]) {
      weeklyMap[key] = {
        year: r.year,
        week: r.yearWeek,
        totalLoad: 0,
        totalRpe: 0,
        count: 0
      }
    }
    weeklyMap[key].totalLoad += r.load
    weeklyMap[key].totalRpe += r.rpe
    weeklyMap[key].count++
  })

  const weeklyStats = weeks.map(w => {
    const key = `${w.year}-${w.week}`
    const data = weeklyMap[key]
    return {
      label: `CW${w.week}`,
      totalLoad: data ? data.totalLoad : 0,
      avgRpe: data
        ? Number((data.totalRpe / data.count).toFixed(2))
        : 0
    }
  })

  // =====================
  // 4. 计算 ACWR
  // =====================
  const coupled = []
  const uncoupled = []

  weeklyStats.forEach((w, idx) => {
    if (idx < 3) {
      coupled.push(null)
      uncoupled.push(null)
      return
    }

    const loadThisWeek = w.totalLoad

    const last3 = weeklyStats
      .slice(idx - 3, idx)
      .map(i => i.totalLoad)

    const last4 = [...last3, loadThisWeek]

    const avgLast3 =
      last3.reduce((a, b) => a + b, 0) / 3

    const avgLast4 =
      last4.reduce((a, b) => a + b, 0) / 4

    uncoupled.push(
      avgLast3 === 0 ? null : Number((loadThisWeek / avgLast3).toFixed(2))
    )

    coupled.push(
      avgLast4 === 0 ? null : Number((loadThisWeek / avgLast4).toFixed(2))
    )
  })

  // =====================
  // 5. 前端只用最近 8 周
  // =====================
  const displayStart = weeklyStats.length - 8

  return {
    code: 200,
    data: {
      categories: weeklyStats.slice(displayStart).map(i => i.label),
      loadData: weeklyStats.slice(displayStart).map(i => i.totalLoad),
      avgRpeData: weeklyStats.slice(displayStart).map(i => i.avgRpe),
      acwrCoupled: coupled.slice(displayStart),
      acwrUncoupled: uncoupled.slice(displayStart)
    }
  }
}
