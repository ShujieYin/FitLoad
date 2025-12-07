exports.main = async (event, context) => {
  const { date } = event;
  const userId = context.auth.uid;
  const db = uniCloud.database();

  const res = await db.collection('training_record')
    .where({
      user_id: userId,
      date: date
    })
    .get();

  return res.data;
}