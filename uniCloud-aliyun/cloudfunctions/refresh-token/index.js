'use strict'
const uniID = require('uni-id-common')

const uniIDIns = uniID.createInstance({
  context: this
})

exports.main = async (event, context) => {
  return await uniIDIns.refreshToken({
    token: context.AUTHORIZATION
  })
}
