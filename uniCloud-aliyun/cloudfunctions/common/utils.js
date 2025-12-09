  // ---------- ISO 周计算 ----------
  module.exports = {
  getISOWeek(date) {
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
  }