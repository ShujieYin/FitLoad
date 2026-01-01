'use strict'

const { getISOWeek } = require('utils')
const auth = require('auth')

exports.main = async (event, context) => {
  // console.log("=== Incoming event ===", event)
  // console.log("=== Context ===", context)
  // console.log('完整的context:', JSON.stringify(context))

  const { rpe, duration, category, hrv, note, date, timeOfDay } = event

  const load = rpe * duration
  const db = uniCloud.database()
  
  // const userId = context.auth.uid
  const { uid } = await auth(context) 
  const userId = uid
  // console.log("解析后的context:", auth(context))
  // console.log("UserId:", userId)
  
  // console.log("Load:", load)

  // 日期解析
  const parsedDate = new Date(date)
  // console.log("Parsed date:", parsedDate)

  const weekDay = parsedDate.getDay()
  // console.log("Weekday:", weekDay)

  const month = parsedDate.getMonth() + 1   // ⚠ 月份从 0 开始，记得 +1
  const day = parsedDate.getDate()
  

  const { year, week } = getISOWeek(parsedDate)

  // 即将写入数据库的对象
  const record = {
    user_id: userId,
    rpe, duration, category, hrv, note,
    date,
    timeOfDay,
    weekDay,
    load,
	  day,
	  month,
    year,
    yearWeek: week,
    created_at: Date.now()
  }

  console.log("=== DB Record To Insert ===", record)

  // 写入数据库
  const res = await db.collection('training_record').add(record)

  console.log("DB insert response:", res)

  return { code: 0, msg: 'success', inserted_id: res.id }
}
