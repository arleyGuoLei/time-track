import WxAccount from './weixin/account/index'
import AliAccount from './alipay/account/index'

import { createApi } from '../share/index'

export default {
  initWeixin: function (options = {}) {
    options.clientType = options.clientType || __ctx__.PLATFORM
    options.appId = options.appid
    options.secret = options.appsecret
    return createApi(WxAccount, options)
  },
  initAlipay: function (options = {}) {
    options.clientType = options.clientType || __ctx__.PLATFORM
    options.appId = options.appid
    return createApi(AliAccount, options)
  }
}
