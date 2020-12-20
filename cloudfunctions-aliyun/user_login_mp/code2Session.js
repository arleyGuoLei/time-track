const uniID = require('uni-id')
const config = require('./config.json')

/**
 * 小程序code2Session
 * @param {string} loginUrl code2openid链接
 * @param {Object} data
 */
function code2Session(loginUrl, data) {
  return uniCloud.httpclient.request(loginUrl, {
    method: 'GET',
    data,
    dataType: 'json',
  })
}

async function qq(js_code) {
  const { appid, secret, loginUrl } = config.oauth['mp-qq']
  try {
    const { data } = await code2Session(loginUrl, {
      appid,
      secret,
      js_code,
      grant_type: 'authorization_code',
    })
    return {
      code: data.errcode,
      message: data.errmsg,
      ...data,
    }
  } catch (error) {
    return {
      code: -1,
      message: error,
    }
  }
}

async function toutiao(code) {
  const { appid, secret, loginUrl } = config.oauth['mp-toutiao']
  try {
    const { data } = await code2Session(loginUrl, {
      appid,
      secret,
      code,
    })
    return {
      code: data.errcode || 0,
      message: data.errmsg,
      ...data,
    }
  } catch (error) {
    return {
      code: -1,
      message: error,
    }
  }
}

module.exports = {
  'mp-weixin': code => uniID.code2SessionWeixin(code),
  'mp-alipay': code => uniID.code2SessionAlipay(code),
  'mp-qq': code => qq(code),
  'mp-toutiao': code => toutiao(code),
}
