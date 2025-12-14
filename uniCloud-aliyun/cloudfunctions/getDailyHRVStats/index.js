'use strict'

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const userId = context.auth?.uid || 'demo'

  // =====================
  // 1. 时间窗口（可配置）
  // =====================
  const WEEKS = event.weeks || 8
  const DAYS = WEEKS * 7

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(today)
  startDate.setDate(today.getDate() - DAYS + 1)

  // =====================
  // 2. 粗筛：查相关年份
  // =====================
  const startYear = startDate.getFullYear()
  const endYear = today.getFullYear()

  const res = await db.collection('training_record')
    .where({
      user_id: userId,
      year: db.command.in(
        startYear === endYear
          ? [startYear]
          : [startYear, endYear]
      )
    })
    .get()

  const records = res.data || []

  // =====================
  // 3. JS 精确过滤 + 按天聚合
  // =====================
  const dailyMap = {}

  records.forEach(r => {
    const d = new Date(r.year, r.month - 1, r.day)
    d.setHours(0, 0, 0, 0)

    if (d < startDate || d > today) return

    const key = `${r.year}-${String(r.month).padStart(2, '0')}-${String(r.day).padStart(2, '0')}`

    if (!dailyMap[key]) {
      dailyMap[key] = { sum: 0, count: 0 }
    }

    dailyMap[key].sum += r.hrv
    dailyMap[key].count++
  })

  // =====================
  // 4. 补全时间轴
  // =====================
  const result = []
  const cursor = new Date(startDate)

  while (cursor <= today) {
    const y = cursor.getFullYear()
    const m = cursor.getMonth() + 1
    const d = cursor.getDate()

    const key = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const data = dailyMap[key]

    result.push({
      date: key,
      avgHRV: data
        ? Number((data.sum / data.count).toFixed(1))
        : null
    })

    cursor.setDate(cursor.getDate() + 1)
  }

  return {
    code: 200,
    data: {
      weeks: WEEKS,
      days: result
    }
  }
}
