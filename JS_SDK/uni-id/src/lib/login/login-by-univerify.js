/* eslint-disable camelcase */
import {
  userCollection,
  getConfig
} from '../utils/config'
import loginExec from '../common/login-exec'
import encryptPwd from '../utils/encrypt-pwd'
import registerExec from '../common/register-exec'

const provider = 'univerify'

/**
 *
 * @param {String} access_token      uni.login返回的access_token
 * @param {String} openid           uni.login返回的openid
 * @param {String} inviteCode       邀请人的邀请码，type为register时生效
 * @param {String} myInviteCode     设置当前注册用户自己的邀请码，type为register时生效
 * @param {String} type             指定操作类型，可选值为login、register，不传此参数时表现为手机号已注册则登录，手机号未注册则进行注册
 * @param {Boolean} needPermission  设置为true时会在checkToken时返回用户权限（permission），建议在管理控制台中使用
 */
export default async function ({
  openid,
  access_token,
  password,
  inviteCode,
  myInviteCode,
  type,
  needPermission
}) {
  const config = getConfig()
  const univerifyConfig = config && config.service && config.service.univerify

  // univerifyConfig配置错误处理
  if (!univerifyConfig) {
    throw new Error('请在config.json或init方法中配置service.univerify下一键登录相关参数')
  }
  const paramRequired = ['apiKey', 'apiSecret']
  for (let i = 0, len = paramRequired.length; i < len; i++) {
    const paramName = paramRequired[i]
    if (!univerifyConfig[paramName]) {
      throw new Error(`请在config.json或init方法中service.univerify下配置${paramName}`)
    }
  }

  if (config.forceInviteCode && !type) {
    throw new Error('[loginByUniverify] 强制使用邀请码注册时，需指明type为register还是login')
  }

  if (!(openid && access_token)) {
    throw new Error('[loginByUniverify] 一键登录需要传递openid和access_token')
  }

  // 换取手机号
  const phoneInfo = await getPhoneNumber({
    ...univerifyConfig,
    openid,
    access_token
  })
  if (phoneInfo.code !== 0) {
    return phoneInfo
  }

  const mobile = String(phoneInfo.phoneNumber)
  const userInDB = await userCollection.where({ mobile }).get()

  /**
   * 以下为登录
   */
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
  }

  /**
   * 以下为注册
   */
  if (type === 'login') {
    return {
      code: 10203,
      msg: '此手机号尚未注册'
    }
  }

  const now = Date.now()
  const user = {
    mobile,
    mobile_confirmed: 1
  }

  // 密码
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

  // 邀请码
  if (inviteCode) {
    let inviter = await userCollection.where({
      my_invite_code: inviteCode
    }).get()
    if (inviter.data.length !== 1) {
      return {
        code: 10202,
        msg: '邀请码无效'
      }
    }
    inviter = inviter.data[0]
    // 倒序排列全部邀请人
    user.inviter_uid = ([inviter._id]).concat(inviter.inviter_uid || [])
    user.invite_time = now
  } else if (config.forceInviteCode) {
    return {
      code: 10202,
      msg: '邀请码无效'
    }
  }
  user.my_invite_code = myInviteCode

  // 注册用户，返回信息
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

/**
 * @param {Object} params
 *
 * 在config中配置
 * @param {String} appid        应用的appid
 * @param {String} apiKey       一键登录控制台的apiKey
 * @param {String} apiSecret    一键登录控制台的apiSecret
 * uni.login返回
 * @param {String} access_token  uni.login返回的access_token
 * @param {String} openid       uni.login返回的openid
 */
async function getPhoneNumber (params) {
  const res = await uniCloud.getPhoneNumber({
    provider,
    ...params
  })

  return getPhoneNumberError(res)
}

/**
 * getPhoneNumber错误处理
 */
function getPhoneNumberError (res) {
  const ErrorCollection = {
    0: '成功',
    4000: '缺失参数',
    4001: 'apiKey不存在',
    4002: 'sign校验不通过',
    4003: 'appid不存在',
    4004: '应用未开通一键登录服务',
    4005: '应用开通的一键登录服务正在审核中',
    4006: '服务空间不在白名单中',
    4100: '账户余额不足',
    5000: '获取手机号失败，请稍后重试(或其他未知错误)'
  }

  return {
    ...res,
    msg: ErrorCollection[res.code]
      ? `[getPhoneNumber] 获取手机号: ${ErrorCollection[res.code]}`
      : res.errMsg
  }
}
