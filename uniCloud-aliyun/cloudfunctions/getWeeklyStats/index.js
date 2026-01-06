'use strict'

const auth = require('auth')

/**
 * 获取某一年 ISO week 的最大周数（52 或 53）
 * 规则：12 月 28 日一定属于该年的最后一个 ISO 周
 */
function getISOWeeksInYear(year) {
  const d = new Date(Date.UTC(year, 11, 28))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

/**
 * 往前推 n 周，生成 [{ year, week }]
 */
function getLastNWeeks(year, week, n) {
  const res = []
  let y = year
  let w = week

  for (let i = 0; i < n; i++) {
    res.unshift({ year: y, week: w })

    w--
    if (w === 0) {
      y--
      w = getISOWeeksInYear(y)
    }
  }
  return res
}

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const $ = db.command.aggregate
  const { uid } = await auth(context)

  const WEEKS = 11

  // =====================
  // 1. DB 聚合（完全相信 year / yearWeek）
  // =====================
  const aggRes = await db
    .collection('training_record')
    .aggregate()
    .match({
      user_id: uid
    })
    .group({
      _id: {
        year: '$year',
        week: '$yearWeek'
      },
      totalLoad: $.sum('$load'),
      totalRpe: $.sum('$rpe'),
      count: $.sum(1)
    })
    .sort({
      '_id.year': 1,
      '_id.week': 1
    })
    .end()

  if (!aggRes.data.length) {
    return {
      code: 200,
      data: {
        categories: [],
        loadData: [],
        avgRpeData: [],
        acwrCoupled: [],
        acwrUncoupled: []
      }
    }
  }

  // =====================
  // 2. 转成 weekMap
  // =====================
  const weeklyMap = {}
  aggRes.data.forEach(item => {
    const key = `${item._id.year}-${item._id.week}`
    weeklyMap[key] = {
      year: item._id.year,
      week: item._id.week,
      totalLoad: item.totalLoad,
      avgRpe: Number((item.totalRpe / item.count).toFixed(2))
    }
  })

  // =====================
  // 3. 取“最新一周”作为锚点
  // =====================
  const last = aggRes.data[aggRes.data.length - 1]
  const lastYear = last._id.year
  const lastWeek = last._id.week

  const weekList = getLastNWeeks(lastYear, lastWeek, WEEKS)

  // =====================
  // 4. 补全最近 11 周（零 Date 参与）
  // =====================
  const weeklyStats = weekList.map(({ year, week }) => {
    const key = `${year}-${week}`
    const data = weeklyMap[key]

    return {
      label: `CW${week}`,
      totalLoad: data ? data.totalLoad : 0,
      avgRpe: data ? data.avgRpe : 0
    }
  })

  // =====================
  // 5. 计算 ACWR
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

    const avgLast3 = last3.reduce((a, b) => a + b, 0) / 3
    const avgLast4 = last4.reduce((a, b) => a + b, 0) / 4

    uncoupled.push(
      avgLast3 === 0 ? null : Number((loadThisWeek / avgLast3).toFixed(2))
    )

    coupled.push(
      avgLast4 === 0 ? null : Number((loadThisWeek / avgLast4).toFixed(2))
    )
  })

  // =====================
  // 6. 前端只用最近 8 周
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
