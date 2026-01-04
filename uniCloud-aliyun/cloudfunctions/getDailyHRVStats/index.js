'use strict'
const auth = require('auth')

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const $ = db.command.aggregate
  const { uid } = await auth(context)

  // =====================
  // 1. 时间窗口
  // =====================
  const WEEKS = event.weeks || 8
  const DAYS = WEEKS * 7

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(today)
  startDate.setDate(today.getDate() - DAYS + 1)

  const startStr = startDate.toISOString().slice(0, 10)
  const endStr = today.toISOString().slice(0, 10)

  // =====================
  // 2. DB 内筛选 + 按天聚合（修正点在这里）
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
      _id: '$date',
      sum: $.sum('$hrv'),
      count: $.sum(1)
    })
    .end()

  // =====================
  // 3. 转 map
  // =====================
  const dailyMap = {}
  aggRes.data.forEach(item => {
    dailyMap[item._id] = Number((item.sum / item.count).toFixed(1))
  })

  // =====================
  // 4. 补全时间轴
  // =====================
  const result = []
  const cursor = new Date(startDate)

  while (cursor <= today) {
    const key = cursor.toISOString().slice(0, 10)

    result.push({
      date: key,
      avgHRV: dailyMap[key] ?? null
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
