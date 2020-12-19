import {
  userCollection
} from '../utils/config'
import loginExec from '../common/login-exec'
import getAlipayApi from '../common/alipay-api'
import registerExec from '../common/register-exec'

async function loginByAlipay (code) {
  let params = code
  if (typeof code === 'string') {
    params = {
      code
    }
  }
  const needPermission = params.needPermission
  const clientPlatform = params.platform || __ctx__.PLATFORM
  const {
    openid
  } = await getAlipayApi({
    platform: clientPlatform
  }).code2Session(params.code)
  if (!openid) {
    return {
      code: 10501,
      msg: '获取openid失败'
    }
  }
  const userList = await userCollection.where({
    ali_openid: openid
  }).get()
  // openid已注册
  if (userList && userList.data && userList.data.length > 0) {
    const userMatched = userList.data[0]

    const loginExecRes = await loginExec(userMatched, {
      needPermission
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
      mobileConfirmed: userInfo.mobile_confirmed === 1,
      emailConfirmed: userInfo.email_confirmed === 1
    }
  } else {
    const user = {
      ali_openid: openid
    }
    user.my_invite_code = params.myInviteCode
    const registerExecResult = await registerExec(user, {
      needPermission
    })
    if (registerExecResult.code !== 0) {
      return registerExecResult
    }
    return {
      ...registerExecResult,
      openid,
      mobileConfirmed: false,
      emailConfirmed: false
    }
  }
}

export default loginByAlipay
