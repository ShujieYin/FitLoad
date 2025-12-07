exports.main = async (event, context) => {
  const { month } = event
  const userId = context.auth.uid
  const db = uniCloud.database()

  const start = `${month}-01`
  const end = `${month}-31`

  const res = await db.collection('training_record')
    .where({
      user_id: userId,
      date: db.command.gte(start).and(db.command.lte(end))
    })
    .get()

  return res.data
}