'use strict'
const uniID = require('uni-id')
const loginMap = require('./code2Session')

const db = uniCloud.database()
const userModel = db.collection('uni-id-users')

/**平台和数据库字段的对应关系 */
const platform2Db = {
  'mp-weixin': openid => {
    return {
      wx_openid: {
        'mp-weixin': openid,
      },
    }
  },
  'mp-alipay': openid => {
    return {
      ali_openid: openid,
    }
  },
  'mp-qq': openid => {
    return {
      qq_openid: {
        'mp-qq': openid,
      },
    }
  },
}

/**
 * 注册新用户，调用uni-id
 * @param {string} openid openid
 * @param {stirng} platform 平台
 */
async function register(openid, platform) {
  const { code, message, uid, token, tokenExpired } = await uniID.register({
    username: `${platform}__${openid}`,
    password: '______',
  })
  if (code === 0 && uid) {
    // 注册成功, 删除默认账号和密码
    const { code: updateCode, message: updateMessage } = await uniID.updateUser({
      uid,
      username: '',
      password: '',
      ...platform2Db[platform](openid),
    })
    if (updateCode === 0) {
      return {
        uid,
        token,
        tokenExpired,
      }
    } else {
      throw new Error(updateMessage)
    }
  } else {
    throw new Error(message)
  }
}

/**
 * 更新tokens
 * @param {string} uid _id
 * @param {string} token 新生成的token
 * @param {string[]} oldTokenList 老的token列表
 */
async function updateToken(uid, token, oldTokenList) {
  // 删除无用的token
  const expiredToken = await uniID.getExpiredToken(oldTokenList)
  const tokenList = [
    token,
    ...oldTokenList.filter(item => {
      return expiredToken.indexOf(item) === -1
    }),
  ]
  await userModel.doc(uid).update({
    token: tokenList,
    last_login_date: Date.now(),
    last_login_ip: __ctx__.CLIENTIP,
  })
}

/**
 * 获取token (新用户注册，老用户创建一个新的token 且 删除无用的老token)
 * @param {string} openid openid
 * @param {string} platform 平台
 */
async function getToken(openid, platform) {
  const p2d = platform2Db[platform]
  if (typeof p2d === 'function') {
    const ids = await userModel
      .where({
        ...p2d(openid),
      })
      .field({ _id: true, token: true })
      .get()
    let uid
    // ids.data内才是数据
    if (ids.data.length === 0) {
      return await register(openid, platform)
    } else {
      uid = ids.data[0]._id // _id为uid
      const tokenList = ids.data[0].token

      // createToken未返回code，官方文档有误
      // 创建token后 还需要自己写入数据库
      // 需要对过期token做一次遍历，防止文档过大
      const { message = '创建token失败', token, tokenExpired } = await uniID.createToken({ uid })

      if (token) {
        // 对过期token做一次遍历，并且把新的token更新至数据库
        await updateToken(uid, token, tokenList)
        return {
          uid,
          token,
          tokenExpired,
        }
      } else {
        throw new Error(message)
      }
    }
  } else {
    throw new Error('暂不支持该平台')
  }
}

/**
 * 小程序登录
 * @param {object} event 获取code
 * @param {obejct} context 获取平台
 */
exports.main = async (event, context) => {
  const { code } = event
  const { PLATFORM } = context
  try {
    if (loginMap[PLATFORM]) {
      const { code: errcode, openid, message } = await loginMap[PLATFORM](code)
      if (errcode !== 0 || openid === '') {
        return { code: errcode, message }
      }
      const { token, tokenExpired } = await getToken(openid, PLATFORM)

      return {
        code: 0,
        token,
        tokenExpired,
      }
    } else {
      throw new Error('暂不支持该平台')
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message || error,
    }
  }
}
