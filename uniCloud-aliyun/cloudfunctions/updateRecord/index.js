'use strict';

exports.main = async (event, context) => {
  const { id, rpe, duration, category, hrv, note, timeOfDay } = event

  if (!id) {
    return { code: 400, msg: "missing id" }
  }

  const db = uniCloud.database()
  const userId = context.auth?.uid || "demo"

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
