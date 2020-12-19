import encryptPwd from '../utils/encrypt-pwd'
import {
  userCollection
} from '../utils/config'
import registerExec from '../common/register-exec'

const db = uniCloud.database()
async function register (user) {
  const query = []
  const uniqueParam = [{
    name: 'username',
    desc: '用户名'
  }, {
    name: 'email',
    desc: '邮箱',
    extraCond: {
      email_confirmed: 1
    }
  }, {
    name: 'mobile',
    desc: '手机号',
    extraCond: {
      mobile_confirmed: 1
    }
  }]
  const needPermission = user.needPermission
  if (needPermission !== undefined) {
    delete user.needPermission
  }
  uniqueParam.forEach(item => {
    const paramName = item.name
    if (user[paramName] && user[paramName].trim()) {
      query.push({
        [paramName]: user[paramName],
        ...item.extraCond
      })
    }
  })

  if (query.length === 0) {
    return {
      code: 20101,
      msg: '用户名、邮箱、手机号不可同时为空'
    }
  }

  const {
    username,
    email,
    mobile,
    myInviteCode
  } = user

  const dbCmd = db.command
  const userInDB = await userCollection.where(dbCmd.or(...query)).get()

  // 用户已存在
  if (userInDB && userInDB.data.length > 0) {
    const userToCheck = userInDB.data[0]
    for (let i = 0; i < uniqueParam.length; i++) {
      const paramItem = uniqueParam[i]
      let extraCondMatched = true
      if (paramItem.extraCond) {
        extraCondMatched = Object.keys(paramItem.extraCond).every((key) => {
          return userToCheck[key] === paramItem.extraCond[key]
        })
      }
      if (userToCheck[paramItem.name] === user[paramItem.name] && extraCondMatched) {
        return {
          code: 20102,
          msg: `${paramItem.desc}已存在`
        }
      }
    }
  }
  const {
    passwordHash,
    version
  } = encryptPwd(user.password)
  user.password = passwordHash
  if (version) {
    user.password_secret_version = version
  }
  user.my_invite_code = myInviteCode
  delete user.myInviteCode

  const registerExecResult = await registerExec(user, {
    needPermission
  })
  if (registerExecResult.code !== 0) {
    return registerExecResult
  }

  return {
    ...registerExecResult,
    username,
    email,
    mobile
  }
}

export default register
