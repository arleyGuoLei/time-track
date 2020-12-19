import { callWxOpenApi, buildUrl } from '../normalize'

export default class Auth {
  constructor (options) {
    this.options = Object.assign({
      baseUrl: 'https://api.weixin.qq.com',
      timeout: 5000
    }, options)
  }

  async _requestWxOpenapi ({ name, url, data, options }) {
    const defaultOptions = {
      method: 'GET',
      dataType: 'json',
      dataAsQueryString: true,
      timeout: this.options.timeout
    }
    const result = await callWxOpenApi({
      name: `auth.${name}`,
      url: `${this.options.baseUrl}${buildUrl(url, data)}`,
      data,
      options,
      defaultOptions
    })
    return result
  }

  async code2Session (code) {
    const url = '/sns/jscode2session'
    const result = await this._requestWxOpenapi({
      name: 'code2Session',
      url,
      data: {
        grant_type: 'authorization_code',
        appid: this.options.appId,
        secret: this.options.secret,
        js_code: code
      }
    })
    return result
  }

  async getOauthAccessToken (code) {
    const url = '/sns/oauth2/access_token'
    const result = await this._requestWxOpenapi({
      name: 'getOauthAccessToken',
      url,
      data: {
        grant_type: 'authorization_code',
        appid: this.options.appId,
        secret: this.options.secret,
        code: code
      }
    })
    return result
  }
}
