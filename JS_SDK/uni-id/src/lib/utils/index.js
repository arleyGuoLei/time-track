import code2SessionAlipay from './code-session-alipay'
import code2SessionWeixin from './code-session-weixin'
import {
  init
} from './config'
import encryptPwd from './encrypt-pwd'
import {
  checkToken,
  createToken,
  getExpiredToken
} from './uni-token'

export {
  code2SessionAlipay,
  code2SessionWeixin,
  init,
  encryptPwd,
  checkToken,
  createToken,
  getExpiredToken
}
