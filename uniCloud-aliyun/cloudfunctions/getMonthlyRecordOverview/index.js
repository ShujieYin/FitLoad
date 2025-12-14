'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const userId = context.auth?.uid || "demo"  // 你本地调试可以改成固定 uid

  const { year, month } = event
  if (!year || !month) {
    return { code: 400, msg: "missing year or month" }
  }

  // month 1-12，生成当月日期范围
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${endDate}`

  const _ = db.command

  // 查询用户本月所有记录
  const res = await db.collection("training_record")
    .where({
      user_id: userId,
      date: _.gte(start).and(_.lte(end))
    })
    .get()

  const dailyLoad = {}

  res.data.forEach(rec => {
    if (!dailyLoad[rec.date]) {
      dailyLoad[rec.date] = 0
    }
    dailyLoad[rec.date] += rec.load
  })

  return {
    code: 200,
    data: dailyLoad
  }
}
