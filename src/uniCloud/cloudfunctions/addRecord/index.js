exports.main = async (event, context) => {
  const { rpe, duration, category, note, date, "time of day": timeOfDay } = event

  const load = rpe * duration
  const db = uniCloud.database()
  const userId = context.auth.uid
  const d = new Date(date);
  const weekDay = d.getDay();

  await db.collection('training_record').add({
    user_id: userId,
    rpe, duration, category, note,
    date,
    "time of day": timeOfDay,
    weekDay,
    load,
    created_at: Date.now()
  })

  return { code: 0, msg: 'success' }
}