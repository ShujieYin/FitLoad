'use strict';
const auth = require('auth')

exports.main = async (event, context) => {
  const db = uniCloud.database()
  const { uid } = await auth(context) 
  const userId = uid

  const { date } = event   // 期望格式：yyyy-mm-dd

  if (!date) {
    return {
      code: 400,
      msg: "Missing 'date', expected yyyy-mm-dd"
    }
  }

  // console.log("=== Fetching Records ===")
  // console.log("UserId:", userId)
  // console.log("Date:", date)

  try {
    const res = await db.collection('training_record')
      .where({
        user_id: userId,
        date: date
      })
      .orderBy("timeOfDay", "asc")
      .get()

    console.log("userID:", userId)
    console.log("DB Result:", res.data)

    return {
      code: 200,
      msg: "success",
      data: res.data
    }

  } catch (error) {
    console.error("DB Error:", error)

    return {
      code: 500,
      msg: "database error",
      error: error.message
    }
  }
}
