import {
  setVerifyCode
} from '../verify/verify'
import {
  getSmsCode
} from '../../share/index'
import {
  getConfig
} from '../utils/config'

export default async function ({
  mobile,
  code,
  type,
  templateId
}) {
  if (!mobile) {
    throw new Error('手机号码不可为空')
  }
  if (!code) {
    code = getSmsCode()
  }
  if (!type) {
    throw new Error('验证码类型不可为空')
  }
  const config = getConfig()
  let smsConfig = config && config.service && config.service.sms
  if (!smsConfig) {
    throw new Error('请在config.json或init方法中配置service.sms下短信相关参数')
  }
  smsConfig = Object.assign({
    codeExpiresIn: 300
  }, smsConfig)
  const paramRequired = ['smsKey', 'smsSecret']
  if (!templateId && !smsConfig.name) {
    throw new Error('不传入templateId时应在config.json或init方法内service.sms下配置name字段以正确使用uniID_code模板')
  }
  for (let i = 0, len = paramRequired.length; i < len; i++) {
    const paramName = paramRequired[i]
    if (!smsConfig[paramName]) {
      throw new Error(`请在config.json或init方法中service.sms下配置${paramName}`)
    }
  }
  const {
    name,
    smsKey,
    smsSecret,
    codeExpiresIn
  } = smsConfig
  let action
  switch (type) {
    case 'login':
      action = '登录'
      break
    default:
      action = '验证手机号'
      break
  }
  try {
    const data = {
      name,
      code,
      action,
      expMinute: '' + Math.round(codeExpiresIn / 60)
    }
    if (name) {
      data.name = name
    }
    await uniCloud.sendSms({
      smsKey,
      smsSecret,
      phone: mobile,
      templateId: templateId || 'uniID_code',
      data
    })
    const setCodeRes = await setVerifyCode({
      mobile,
      code,
      expiresIn: codeExpiresIn,
      type
    })
    if (setCodeRes.code >= 0) {
      return setCodeRes
    }
    return {
      code: 0,
      msg: '验证码发送成功'
    }
  } catch (e) {
    return {
      code: 50301,
      msg: `验证码发送失败, ${e.message}`
    }
  }
}
