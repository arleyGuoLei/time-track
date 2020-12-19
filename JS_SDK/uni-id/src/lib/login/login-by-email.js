import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'
import {
  verifyCode
} from '../verify/verify'
import loginExec from '../common/login-exec'
import encryptPwd from '../utils/encrypt-pwd'
import registerExec from '../common/register-exec'

async function loginByEmail ({
  email,
  code,
  password,
  myInviteCode,
  type,
  needPermission
}) {
  const verifyRes = await verifyCode({
    email,
    code,
    type: type || 'login'
  })
  if (verifyRes.code !== 0) {
    return verifyRes // 验证失败
  }
  const query = {
    email,
    email_confirmed: 1
  }
  const userInDB = await userCollection.where(query).get()

  log('userInDB:', userInDB)

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    if (type === 'register') {
      return {
        code: 10301,
        msg: '此邮箱已注册'
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
      email
    }
  } else {
    // 注册用户
    if (type === 'login') {
      return {
        code: 10302,
        msg: '此邮箱尚未注册'
      }
    }
    const user = {
      email,
      email_confirmed: 1
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
    user.my_invite_code = myInviteCode

    const registerExecResult = await registerExec(user, {
      needPermission
    })
    if (registerExecResult.code !== 0) {
      return registerExecResult
    }
    return {
      ...registerExecResult,
      email
    }
  }
}

export default loginByEmail
