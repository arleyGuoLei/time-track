import {
  userCollection,
  getConfig
} from '../utils/config'
import {
  verifyCode
} from '../verify/verify'
import loginExec from '../common/login-exec'
import encryptPwd from '../utils/encrypt-pwd'
import registerExec from '../common/register-exec'

async function loginBySms ({
  mobile,
  code,
  password,
  inviteCode,
  myInviteCode,
  type,
  needPermission
}) {
  const config = getConfig()
  if (config.forceInviteCode && !type) {
    // 此类给开发者看的错误应直接抛出
    throw new Error('[loginBySms]强制使用邀请码注册时，需指明type为register还是login')
  }
  const verifyRes = await verifyCode({
    mobile,
    code,
    type: type || 'login'
  })
  if (verifyRes.code !== 0) {
    return verifyRes // 验证失败
  }
  const query = {
    mobile,
    mobile_confirmed: 1
  }
  const userInDB = await userCollection.where(query).get()

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    if (type === 'register') {
      return {
        code: 10201,
        msg: '此手机号已注册'
      }
    }
    const userMatched = userInDB.data[0]
    const loginExecRes = await loginExec(userMatched, {
      needPermission
    })
    if (loginExecRes.code !== 0) {
      return loginExecRes
    }

    return {
      ...loginExecRes,
      mobile
    }
  } else {
    // 注册用户
    const now = Date.now()
    if (type === 'login') {
      return {
        code: 10203,
        msg: '此手机号尚未注册'
      }
    }
    const user = {
      mobile: mobile,
      mobile_confirmed: 1,
      register_ip: __ctx__.CLIENTIP,
      register_date: now
    }
    if (password) {
      const {
        passwordHash,
        version
      } = encryptPwd(password)
      user.password = passwordHash
      if (version) {
        user.password_secret_version = version
      }
    }
    if (inviteCode) {
      const inviter = await userCollection.where({
        my_invite_code: inviteCode
      }).get()
      if (inviter.data.length !== 1) {
        return {
          code: 10202,
          msg: '邀请码无效'
        }
      }
      // 倒序排列全部邀请人
      user.inviter_uid = ([inviter.data[0]._id]).concat(inviter.data[0].inviter_uid || [])
      user.invite_time = now
    } else if (config.forceInviteCode) {
      return {
        code: 10202,
        msg: '邀请码无效'
      }
    }
    user.my_invite_code = myInviteCode

    const registerExecResult = await registerExec(user, {
      needPermission
    })
    if (registerExecResult.code !== 0) {
      return registerExecResult
    }

    return {
      ...registerExecResult,
      mobile
    }
  }
}

export default loginBySms
