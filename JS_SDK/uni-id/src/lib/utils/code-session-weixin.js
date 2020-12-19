import getWeixinApi from '../common/weixin-api'

async function code2SessionWeixin (code) {
  let params = code
  if (typeof code === 'string') {
    params = {
      code
    }
  }
  try {
    const clientPlatform = params.platform || __ctx__.PLATFORM
    const result = await getWeixinApi({
      platform: clientPlatform
    })[clientPlatform === 'mp-weixin' ? 'code2Session' : 'getOauthAccessToken'](params.code)
    if (!result.openid) {
      return {
        code: 80601,
        msg: '获取openid失败'
      }
    }
    return {
      code: 0,
      msg: '',
      ...result
    }
  } catch (error) {
    return {
      code: 80602,
      msg: error.message
    }
  }
}

export default code2SessionWeixin
