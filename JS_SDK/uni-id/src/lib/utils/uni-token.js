import jwt from 'jsonwebtoken'
import {
  log,
  getDistinctArray
} from '../../share/index'
import {
  userCollection,
  getConfig,
  roleCollection,
  permissionCollection
} from '../utils/config'
import crypto from 'crypto'

const db = uniCloud.database()
const dbCmd = db.command

function getClientUaHash () {
  const hash = crypto.createHash('md5')
  const hashContent = /MicroMessenger/i.test(__ctx__.CLIENTUA) ? __ctx__.CLIENTUA.replace(/(MicroMessenger\S+).*/i, '$1') : __ctx__.CLIENTUA
  hash.update(hashContent)
  return hash.digest('hex')
}

function createToken ({
  uid,
  needPermission
}) {
  const config = getConfig()
  const signContent = {
    uid
  }
  if (needPermission) {
    signContent.needPermission = needPermission
  }
  if (config.bindTokenToDevice) {
    signContent.clientId = getClientUaHash()
  }
  const token = jwt.sign(signContent, config.tokenSecret, {
    expiresIn: config.tokenExpiresIn
  })

  return {
    token,
    tokenExpired: Date.now() + config.tokenExpiresIn * 1000
  }
}
function refreshToken () {
  // TODO
}

async function checkToken (token) {
  const config = getConfig()
  try {
    const payload = jwt.verify(token, config.tokenSecret)
    if (config.bindTokenToDevice && payload.clientId !== getClientUaHash()) {
      return {
        code: 30201,
        msg: 'token不合法，请重新登录'
      }
    }

    const {
      uid,
      needPermission
    } = payload
    const userInDB = await userCollection.doc(uid).get()

    if (!userInDB.data || userInDB.data.length === 0 || !userInDB.data[0].token) {
      return {
        code: 30202,
        msg: 'token不合法，请重新登录'
      }
    }
    const userMatched = userInDB.data[0]
    if (userMatched.status === 1) {
      return {
        code: 10001,
        msg: '账号已禁用'
      }
    }
    let tokenList = userMatched.token
    if (typeof tokenList === 'string') {
      tokenList = [tokenList]
    }
    if (tokenList.indexOf(token) === -1) {
      return {
        code: 30202,
        msg: 'token不合法，请重新登录'
      }
    }
    const result = {
      code: 0,
      msg: 'token校验通过',
      uid,
      role: userMatched.role || [],
      permission: [],
      userInfo: userMatched
    }
    if (result.role.length > 0 && needPermission) {
      if (result.role.includes('admin')) {
        const permissionRecord = await permissionCollection.limit(10000).get()
        result.permission = permissionRecord.data.map(item => item.permission_id)
      } else {
        const roleRecord = await roleCollection.where({
          role_id: dbCmd.in(result.role)
        }).get()

        const permission = []
        roleRecord.data.forEach(item => {
          Array.prototype.push.apply(permission, item.permission)
        })
        result.permission = getDistinctArray(permission)
      }
    }
    // 达到设置的token过期阈值，需要重新下发一个token
    if (config.tokenExpiresThreshold && payload.exp - Date.now() / 1000 < config.tokenExpiresThreshold) {
      const newTokeninfo = createToken({
        uid,
        needPermission
      })
      // 去除过期token防止文档过大
      const expiredToken = getExpiredToken(tokenList)
      tokenList = tokenList.filter(item => {
        return expiredToken.indexOf(item) === -1
      })
      tokenList.push(newTokeninfo.token)
      await userCollection.doc(uid).update({
        token: tokenList,
        last_login_date: Date.now(),
        last_login_ip: __ctx__.CLIENTIP
      })
      return {
        ...result,
        ...newTokeninfo
      }
    }

    log('checkToken payload', payload)

    return result
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return {
        code: 30203,
        msg: 'token已过期，请重新登录',
        err: err
      }
    }

    return {
      code: 30204,
      msg: '非法token',
      err: err
    }
  }
}
function getExpiredToken (tokenList) {
  const config = getConfig()
  const tokenExpired = []
  tokenList.forEach(token => {
    try {
      jwt.verify(token, config.tokenSecret)
    } catch (error) {
      tokenExpired.push(token)
    }
  })
  return tokenExpired
}

export {
  createToken,
  refreshToken,
  checkToken,
  getExpiredToken
}
