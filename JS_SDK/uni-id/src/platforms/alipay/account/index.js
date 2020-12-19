import AlipayBase from '../alipayBase'
import protocols from './protocols'
export default class Auth extends AlipayBase {
  constructor (options) {
    super(options)
    this._protocols = protocols
  }

  async code2Session (code) {
    const result = await this._exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code
    })
    return result
  }
}
