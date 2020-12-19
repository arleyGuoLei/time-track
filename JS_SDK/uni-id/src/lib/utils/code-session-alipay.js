import getAlipayApi from '../common/alipay-api'

async function code2SessionAlipay (code) {
  let params = code
  if (typeof code === 'string') {
    params = {
      code
    }
  }
  try {
    const clientPlatform = params.platform || __ctx__.PLATFORM
    const result = await getAlipayApi({
      platform: clientPlatform
    }).code2Session(params.code)
    if (!result.openid) {
      return {
        code: 80701,
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
      code: 80702,
      msg: error.message
    }
  }
}

export default code2SessionAlipay
