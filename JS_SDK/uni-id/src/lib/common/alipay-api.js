import {
  getConfig
} from '../utils/config'
import platformApi from '../../platforms/index'
export default function getAlipayApi ({ platform }) {
  const config = getConfig(platform)
  const clientPlatform = platform || __ctx__.PLATFORM
  if (!config.oauth || !config.oauth.alipay) {
    throw new Error(`请在公用模块uni-id的config.json或init方法中添加${clientPlatform}平台支付宝登录配置项`)
  }
  const argsRequired = ['appid', 'privateKey']
  argsRequired.forEach((item) => {
    if (!config.oauth.alipay[item]) {
      throw new Error(`请在公用模块uni-id的config.json或init方法中添加配置项：${clientPlatform}.oauth.alipay.${item}`)
    }
  })
  const alipayApi = platformApi.initAlipay(config.oauth.alipay)
  return alipayApi
}
