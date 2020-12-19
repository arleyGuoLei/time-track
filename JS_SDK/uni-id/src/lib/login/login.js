import {
  log,
  friendlyDate
} from '../../share/index'
import {
  getConfig,
  userCollection
} from '../utils/config'
import loginExec from '../common/login-exec'
import checkPwd from '../utils/check-pwd'

const db = uniCloud.database()
async function login ({
  username,
  password,
  queryField = [],
  needPermission
}) {
  const dbCmd = db.command
  const query = []
  if (!queryField || !queryField.length) {
    queryField = ['username']
  }
  const extraCond = {
    email: {
      email_confirmed: 1
    },
    mobile: {
      mobile_confirmed: 1
    }
  }
  queryField.forEach(item => {
    query.push({
      [item]: username,
      ...extraCond[item]
    })
  })
  const userInDB = await userCollection.where(dbCmd.or(...query)).limit(1).get()
  const clientIP = __ctx__.CLIENTIP
  const {
    passwordErrorLimit,
    passwordErrorRetryTime
  } = getConfig()

  log('userInDB:', userInDB)

  if (userInDB.data.length === 0) {
    return {
      code: 10101,
      msg: '用户不存在'
    }
  }
  const userMatched = userInDB.data[0]

  // 根据ip地址，密码错误次数过多，锁定登录
  let loginIPLimit = userMatched.login_ip_limit || []
  // 清理无用记录
  loginIPLimit = loginIPLimit.filter(item => item.last_error_time > Date.now() - passwordErrorRetryTime * 1000)
  let currentIPLimit = loginIPLimit.find(item => item.ip === clientIP)
  if (currentIPLimit && currentIPLimit.error_times >= passwordErrorLimit) {
    return {
      code: 10103,
      msg: `密码错误次数过多，请${friendlyDate(currentIPLimit.last_error_time + passwordErrorRetryTime * 1000)}再试。`
    }
  }
  const checkPwdRes = checkPwd(userMatched, password)
  if (checkPwdRes.code === 0) {
    // 注意arr.splice(-1,1)也会删除第一个！！！
    const currentIPLimitIndex = loginIPLimit.indexOf(currentIPLimit)
    if (currentIPLimitIndex > -1) {
      loginIPLimit.splice(currentIPLimitIndex, 1)
    }

    const extraData = {
      login_ip_limit: loginIPLimit
    }
    const {
      passwordHash,
      passwordVersion
    } = checkPwdRes
    if (passwordHash && passwordVersion) {
      extraData.password = passwordHash
      extraData.password_secret_version = passwordVersion
    }
    const loginExecRes = await loginExec(userMatched, {
      needPermission,
      extraData
    })
    if (loginExecRes.code !== 0) {
      return loginExecRes
    }

    return loginExecRes
  } else {
    if (!currentIPLimit) {
      currentIPLimit = {
        ip: clientIP,
        error_times: 1,
        last_error_time: Date.now()
      }
      loginIPLimit.push(currentIPLimit)
    } else {
      currentIPLimit.error_times++
      currentIPLimit.last_error_time = Date.now()
    }
    await userCollection.doc(userMatched._id).update({
      login_ip_limit: loginIPLimit
    })
    return {
      code: 10102,
      msg: '密码错误'
    }
  }
}

export default login
