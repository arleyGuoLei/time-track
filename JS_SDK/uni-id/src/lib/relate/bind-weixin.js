import {
  userCollection
} from '../utils/config'
import getWeixinApi from '../common/weixin-api'

const db = uniCloud.database()
async function bindWeixin ({
  uid,
  code,
  platform
}) {
  const clientPlatform = platform || __ctx__.PLATFORM
  const {
    openid,
    unionid
  } = await getWeixinApi({
    platform: clientPlatform
  })[clientPlatform === 'mp-weixin' ? 'code2Session' : 'getOauthAccessToken'](code)
  if (!openid) {
    return {
      code: 60301,
      msg: '获取openid失败'
    }
  }
  const dbCmd = db.command
  const queryUser = [{
    wx_openid: {
      [clientPlatform]: openid
    }
  }]
  if (unionid) {
    queryUser.push({
      wx_unionid: unionid
    })
  }
  const userList = await userCollection.where(dbCmd.or(...queryUser)).get()
  // openid 或 unionid已注册
  if (userList && userList.data && userList.data.length > 0) {
    return {
      code: 60302,
      msg: '微信绑定失败，此微信账号已被绑定'
    }
  }
  const updateData = {
    wx_openid: {
      [clientPlatform]: openid
    }
  }
  if (unionid) {
    updateData.wx_unionid = unionid
  }
  await userCollection.doc(uid).update(updateData)
  return {
    code: 0,
    msg: '绑定成功'
  }
}

export default bindWeixin
