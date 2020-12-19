import {
  userCollection
} from '../utils/config'
import getWeixinApi from '../common/weixin-api'
import loginExec from '../common/login-exec'
import registerExec from '../common/register-exec'

const db = uniCloud.database()
async function loginByWeixin (code) {
  let params = code
  if (typeof code === 'string') {
    params = {
      code
    }
  }
  const needPermission = params.needPermission
  const clientPlatform = params.platform || __ctx__.PLATFORM
  const {
    openid,
    unionid,
    sessionKey
  } = await getWeixinApi({
    platform: clientPlatform
  })[clientPlatform === 'mp-weixin' ? 'code2Session' : 'getOauthAccessToken'](params.code)
  if (!openid) {
    return {
      code: 10401,
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
    const userMatched = userList.data[0]

    const extraData = {
      wx_openid: {
        [clientPlatform]: openid
      }
    }
    if (unionid) {
      extraData.wx_unionid = unionid
    }

    const loginExecRes = await loginExec(userMatched, {
      needPermission,
      extraData
    })

    if (loginExecRes.code !== 0) {
      return loginExecRes
    }

    const {
      userInfo
    } = loginExecRes

    return {
      ...loginExecRes,
      openid,
      unionid,
      sessionKey,
      mobileConfirmed: userInfo.mobile_confirmed === 1,
      emailConfirmed: userInfo.email_confirmed === 1
    }
  } else {
    const user = {
      wx_openid: {
        [clientPlatform]: openid
      },
      wx_unionid: unionid
    }
    const myInviteCode = params.myInviteCode
    user.my_invite_code = myInviteCode

    const registerExecResult = await registerExec(user, {
      needPermission
    })
    if (registerExecResult.code !== 0) {
      return registerExecResult
    }
    return {
      ...registerExecResult,
      openid,
      unionid,
      sessionKey,
      mobileConfirmed: false,
      emailConfirmed: false
    }
  }
}

export default loginByWeixin
