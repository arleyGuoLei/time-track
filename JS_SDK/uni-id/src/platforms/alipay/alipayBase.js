import {
  camel2snakeJson,
  snake2camelJson,
  getOffsetDate,
  getFullTimeStr
} from '../../share/index'
import crypto from 'crypto'
import querystring from 'querystring'

const ALIPAY_ALGORITHM_MAPPING = {
  RSA: 'RSA-SHA1',
  RSA2: 'RSA-SHA256'
}

export default class AlipayBase {
  constructor (options = {}) {
    if (!options.appId) throw new Error('appId required')
    if (!options.privateKey) throw new Error('privateKey required')
    const defaultOptions = {
      gateway: 'https://openapi.alipay.com/gateway.do',
      timeout: 5000,
      charset: 'utf-8',
      version: '1.0',
      signType: 'RSA2',
      timeOffset: -new Date().getTimezoneOffset() / 60,
      keyType: 'PKCS8'
    }

    if (options.sandbox) {
      options.gateway = 'https://openapi.alipaydev.com/gateway.do'
    }

    this.options = Object.assign({}, defaultOptions, options)

    const privateKeyType =
      this.options.keyType === 'PKCS8' ? 'PRIVATE KEY' : 'RSA PRIVATE KEY'

    this.options.privateKey = this._formatKey(
      this.options.privateKey,
      privateKeyType
    )
    if (this.options.alipayPublicKey) {
      this.options.alipayPublicKey = this._formatKey(
        this.options.alipayPublicKey,
        'PUBLIC KEY'
      )
    }
  }

  _formatKey (key, type) {
    return `-----BEGIN ${type}-----\n${key}\n-----END ${type}-----`
  }

  _formatUrl (url, params) {
    let requestUrl = url
    // 需要放在 url 中的参数列表
    const urlArgs = [
      'app_id',
      'method',
      'format',
      'charset',
      'sign_type',
      'sign',
      'timestamp',
      'version',
      'notify_url',
      'return_url',
      'auth_token',
      'app_auth_token'
    ]

    for (const key in params) {
      if (urlArgs.indexOf(key) > -1) {
        const val = encodeURIComponent(params[key])
        requestUrl = `${requestUrl}${
          requestUrl.includes('?') ? '&' : '?'
        }${key}=${val}`
        // 删除 postData 中对应的数据
        delete params[key]
      }
    }

    return { execParams: params, url: requestUrl }
  }

  _getSign (method, params) {
    const bizContent = params.bizContent || null
    delete params.bizContent

    const signParams = Object.assign({
      method,
      appId: this.options.appId,
      charset: this.options.charset,
      version: this.options.version,
      signType: this.options.signType,
      timestamp: getFullTimeStr(getOffsetDate(this.options.timeOffset))
    }, params)

    if (bizContent) {
      signParams.bizContent = JSON.stringify(camel2snakeJson(bizContent))
    }

    // params key 驼峰转下划线
    const decamelizeParams = camel2snakeJson(signParams)

    // 排序
    const signStr = Object.keys(decamelizeParams)
      .sort()
      .map((key) => {
        let data = decamelizeParams[key]
        if (Array.prototype.toString.call(data) !== '[object String]') {
          data = JSON.stringify(data)
        }
        return `${key}=${data}`
      })
      .join('&')

    // 计算签名
    const sign = crypto
      .createSign(ALIPAY_ALGORITHM_MAPPING[this.options.signType])
      .update(signStr, 'utf8')
      .sign(this.options.privateKey, 'base64')

    return Object.assign(decamelizeParams, { sign })
  }

  async _exec (method, params = {}, option = {}) {
    // 计算签名
    const signData = this._getSign(method, params)
    const { url, execParams } = this._formatUrl(this.options.gateway, signData)
    const { status, data } = await uniCloud.httpclient.request(url, {
      method: 'POST',
      data: execParams,
      // 按 text 返回（为了验签）
      dataType: 'text',
      timeout: this.options.timeout
    })
    if (status !== 200) throw new Error('request fail')
    /**
     * 示例响应格式
     * {"alipay_trade_precreate_response":
     *  {"code": "10000","msg": "Success","out_trade_no": "111111","qr_code": "https:\/\/"},
     *  "sign": "abcde="
     * }
     * 或者
     * {"error_response":
     *  {"code":"40002","msg":"Invalid Arguments","sub_code":"isv.code-invalid","sub_msg":"授权码code无效"},
     * }
     */
    const result = JSON.parse(data)
    const responseKey = `${method.replace(/\./g, '_')}_response`
    const response = result[responseKey]
    const errorResponse = result.error_response
    if (response) {
      // 按字符串验签
      const validateSuccess = option.validateSign ? this._checkResponseSign(data, responseKey) : true
      if (validateSuccess) {
        if (!response.code || response.code === '10000') {
          const errCode = 0
          const errMsg = response.msg || ''
          return {
            errCode,
            errMsg,
            ...snake2camelJson(response)
          }
        }
        const msg = response.sub_code ? `${response.sub_code} ${response.sub_msg}` : `${response.msg || 'unkonwn error'}`
        throw new Error(msg)
      } else {
        throw new Error('返回结果签名错误')
      }
    } else if (errorResponse) {
      throw new Error(errorResponse.sub_msg || errorResponse.msg || '接口返回错误')
    }

    throw new Error('request fail')
  }

  _checkResponseSign (signStr, responseKey) {
    if (!this.options.alipayPublicKey || this.options.alipayPublicKey === '') {
      console.warn('options.alipayPublicKey is empty')
      // 支付宝公钥不存在时不做验签
      return true
    }

    // 带验签的参数不存在时返回失败
    if (!signStr) { return false }

    // 根据服务端返回的结果截取需要验签的目标字符串
    const validateStr = this._getSignStr(signStr, responseKey)
    // 服务端返回的签名
    const serverSign = JSON.parse(signStr).sign

    // 参数存在，并且是正常的结果（不包含 sub_code）时才验签
    const verifier = crypto.createVerify(ALIPAY_ALGORITHM_MAPPING[this.options.signType])
    verifier.update(validateStr, 'utf8')
    return verifier.verify(this.options.alipayPublicKey, serverSign, 'base64')
  }

  _getSignStr (originStr, responseKey) {
    // 待签名的字符串
    let validateStr = originStr.trim()
    // 找到 xxx_response 开始的位置
    const startIndex = originStr.indexOf(`${responseKey}"`)
    // 找到最后一个 “"sign"” 字符串的位置（避免）
    const lastIndex = originStr.lastIndexOf('"sign"')

    /**
     * 删除 xxx_response 及之前的字符串
     * 假设原始字符串为
     *  {"xxx_response":{"code":"10000"},"sign":"jumSvxTKwn24G5sAIN"}
     * 删除后变为
     *  :{"code":"10000"},"sign":"jumSvxTKwn24G5sAIN"}
     */
    validateStr = validateStr.substr(startIndex + responseKey.length + 1)

    /**
     * 删除最后一个 "sign" 及之后的字符串
     * 删除后变为
     *  :{"code":"10000"},
     * {} 之间就是待验签的字符串
     */
    validateStr = validateStr.substr(0, lastIndex)

    // 删除第一个 { 之前的任何字符
    validateStr = validateStr.replace(/^[^{]*{/g, '{')

    // 删除最后一个 } 之后的任何字符
    validateStr = validateStr.replace(/\}([^}]*)$/g, '}')

    return validateStr
  }

  _notifyRSACheck (signArgs, signStr, signType) {
    const signContent = Object.keys(signArgs).sort().filter(val => val).map((key) => {
      let value = signArgs[key]

      if (Array.prototype.toString.call(value) !== '[object String]') {
        value = JSON.stringify(value)
      }
      return `${key}=${decodeURIComponent(value)}`
    }).join('&')

    const verifier = crypto.createVerify(ALIPAY_ALGORITHM_MAPPING[signType])

    return verifier.update(signContent, 'utf8').verify(this.options.alipayPublicKey, signStr, 'base64')
  }

  _checkNotifySign (postData) {
    const signStr = postData.sign

    // 未设置“支付宝公钥”或签名字符串不存，验签不通过
    if (!this.options.alipayPublicKey || !signStr) {
      return false
    }

    // 先从签名字符串中取 sign_type，再取配置项、都不存在时默认为 RSA2（RSA 已不再推荐使用）
    const signType = postData.sign_type || this.options.signType || 'RSA2'
    const signArgs = { ...postData }
    // 除去 sign
    delete signArgs.sign

    /**
     * 某些用户可能自己删除了 sign_type 后再验签
     * 为了保持兼容性临时把 sign_type 加回来
     * 因为下面的逻辑会验签 2 次所以不会存在验签不同过的情况
     */
    signArgs.sign_type = signType

    // 保留 sign_type 验证一次签名
    const verifyResult = this._notifyRSACheck(signArgs, signStr, signType)

    if (!verifyResult) {
      /**
       * 删除 sign_type 验一次
       * 因为“历史原因”需要用户自己判断是否需要保留 sign_type 验证签名
       * 这里是把其他 sdk 中的 rsaCheckV1、rsaCheckV2 做了合并
       */
      delete signArgs.sign_type
      return this._notifyRSACheck(signArgs, signStr, signType)
    }

    return true
  }

  _verifyNotify (notify) {
    if (!notify.headers) {
      throw new Error('通知格式不正确')
    }
    let contentType
    for (const key in notify.headers) {
      if (key.toLowerCase() === 'content-type') {
        contentType = notify.headers[key]
      }
    }
    if (notify.isBase64Encoded !== false && contentType.indexOf('application/x-www-form-urlencoded') === -1) {
      throw new Error('通知格式不正确')
    }
    const postData = querystring.parse(notify.body)
    if (this._checkNotifySign(postData)) {
      return snake2camelJson(postData)
    }
    throw new Error('通知验签未通过')
  }
}
