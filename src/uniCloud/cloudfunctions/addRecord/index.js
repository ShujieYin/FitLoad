exports.main = async (event, context) => {
  console.log("=== Incoming event ===", event)
  console.log("=== Context ===", context)

  const { rpe, duration, category, note, date, "time of day": timeOfDay } = event

  const load = rpe * duration
  const db = uniCloud.database()
  const userId = context.auth?.uid || "NO_UID"

  console.log("UserId:", userId)
  console.log("Load:", load)

  // 日期解析
  const d = new Date(date)
  console.log("Parsed date:", d)

  const weekDay = d.getDay()
  console.log("Weekday:", weekDay)

  // ---------- ISO 周计算 ----------
  function getISOWeek(date) {
    const _date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = _date.getUTCDay() || 7
    _date.setUTCDate(_date.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(_date.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(((_date - yearStart) / 86400000 + 1) / 7)
    return {
      year: _date.getUTCFullYear(),
      week: weekNo
    }
  }

  const { year, week } = getISOWeek(d)
  console.log("ISO Year:", year)
  console.log("ISO Week:", week)

  // 即将写入数据库的对象
  const record = {
    user_id: userId,
    rpe, duration, category, note,
    date,
    "time of day": timeOfDay,
    weekDay,
    load,
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
