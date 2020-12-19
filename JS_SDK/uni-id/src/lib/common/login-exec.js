import {
  getExpiredToken,
  createToken
} from '../utils/uni-token'
import {
  userCollection
} from '../utils/config'

export default async function (user, options = {}) {
  if (user.status === 1) {
    return {
      code: 10001,
      msg: '账号已禁用'
    }
  }

  // 过期token清理
  let tokenList = user.token || []
  // 兼容旧版逻辑
  if (typeof tokenList === 'string') {
    tokenList = [tokenList]
  }
  const expiredToken = getExpiredToken(tokenList)
  tokenList = tokenList.filter(item => {
    return expiredToken.indexOf(item) === -1
  })

  const {
    token,
    tokenExpired
  } = createToken({
    uid: user._id,
    needPermission: options.needPermission
  })
  tokenList.push(token)
  user.token = tokenList

  const updateData = {
    last_login_date: Date.now(),
    last_login_ip: __ctx__.CLIENTIP,
    token: tokenList,
    ...options.extraData
  }
  await userCollection.doc(user._id).update(updateData)

  const userInfo = Object.assign({}, user, updateData)

  return {
    code: 0,
    msg: '登录成功',
    token,
    uid: userInfo._id,
    username: userInfo.username,
    type: 'login',
    userInfo,
    tokenExpired
  }
}
