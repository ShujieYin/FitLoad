'use strict';

const UniIdCommon = require('uni-id-common');
const uniID = new UniIdCommon();

exports.main = async (event, context) => {
  const { code } = event;
  if (!code) {
    return { errCode: 400, errMsg: 'code required' };
  }

  const APPID = 'wxa8ade32dc4e94503';
  const SECRET = '3283b833514c23156af2f4351d6b0315';

  // 1️⃣ 用 code 换 openid
  const wxRes = await uniCloud.request({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    data: {
      appid: APPID,
      secret: SECRET,
      js_code: code,
      grant_type: 'authorization_code'
    },
    dataType: 'json'
  });

  const wxData = wxRes.data;
  if (wxData.errcode) {
    return {
      errCode: wxData.errcode,
      errMsg: wxData.errmsg
    };
  }

  const { openid, unionid } = wxData;

  // 2️⃣ 查 / 创建用户（你可以替换为自己已有逻辑）
  const db = uniCloud.database();
  const userCollection = db.collection('uni-id-users');

  let user = await userCollection.where({
    wx_openid: openid
  }).get();

  let uid;
  if (user.data.length === 0) {
    const res = await userCollection.add({
      wx_openid: openid,
      unionid,
      register_date: Date.now()
    });
    uid = res.id;
  } else {
    uid = user.data[0]._id;
  }

  // 3️⃣ 生成 token（核心）
  const tokenRes = await uniID.createToken({
    uid,
    needPermission: true
  });

  return {
    errCode: 0,
    ...tokenRes
  };
};
