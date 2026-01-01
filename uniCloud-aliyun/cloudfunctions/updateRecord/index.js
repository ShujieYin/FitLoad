'use strict';
const auth = require('auth')

exports.main = async (event, context) => {
  const { id, rpe, duration, category, hrv, note, timeOfDay } = event

  if (!id) {
    return { code: 400, msg: "missing id" }
  }

  const db = uniCloud.database()
  const { uid } = await auth(context) 
  const userId = uid

  // 先查询记录，确认所有权
  const record = await db.collection("training_record").doc(id).get()
  if (record.data[0].user_id !== userId) {
    return { code: 403, msg: "无权限修改此记录" }
  }
  // console.log("tokenID:", userId)
  // console.log("recordID:", record.data[0].user_id)

  const load = rpe * duration

  await db.collection("training_record").doc(id).update({
    rpe,
    duration,
    category,
	  hrv,
    note,
    timeOfDay,
    load
  })

  return {
    code: 200,
    msg: "update success"
  }
}
