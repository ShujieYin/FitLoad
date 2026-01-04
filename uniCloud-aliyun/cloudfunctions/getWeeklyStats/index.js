'use strict'

const auth = require('auth')

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const $ = db.command.aggregate
  const { uid } = await auth(context)

  // =====================
  // 1. 计算最近 11 周时间范围
  // =====================
  const WEEKS = 11
  const DAYS = WEEKS * 7

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(today)
  startDate.setDate(today.getDate() - DAYS + 1)

  const startStr = startDate.toISOString().slice(0, 10)
  const endStr = today.toISOString().slice(0, 10)

  // =====================
  // 2. DB 内：date 范围筛选 + 按周聚合
  // =====================
  const aggRes = await db.collection('training_record')
    .aggregate()
    .match({
      user_id: uid,
      $and: [
        { date: $.gte(startStr) },
        { date: $.lte(endStr) }
      ]
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

  // =====================
  // 3. 转成 week map
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
  // 4. 补全最近 11 周（防断周）
  // =====================
  const weeklyStats = []
  const cursor = new Date(startDate)

  while (weeklyStats.length < WEEKS) {
    const temp = new Date(cursor)
    temp.setDate(temp.getDate() + 6)

    const year = temp.getFullYear()

    // ISO week 计算（不依赖 utils）
    const firstThursday = new Date(year, 0, 4)
    const week =
      Math.ceil(
        ((temp - firstThursday) / 86400000 +
          firstThursday.getDay() + 1) / 7
      )

    const key = `${year}-${week}`
    const data = weeklyMap[key]

    weeklyStats.push({
      label: `CW${week}`,
      totalLoad: data ? data.totalLoad : 0,
      avgRpe: data ? data.avgRpe : 0
    })

    cursor.setDate(cursor.getDate() + 7)
  }

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
