import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'
import {
  verifyCode
} from '../verify/verify'

async function bindMobile ({
  uid,
  mobile,
  // 兼容旧版逻辑不传递code时不进行验证码校验
  code
}) {
  const countRes = await userCollection.where({
    mobile: mobile,
    mobile_confirmed: 1
  }).count()
  if (countRes && countRes.total > 0) {
    return {
      code: 60101,
      msg: '此手机号已被绑定'
    }
  }
  if (code) {
    const verifyRes = await verifyCode({
      mobile,
      code,
      type: 'bind'
    })
    if (verifyRes.code !== 0) {
      return verifyRes // 验证失败
    }
  }
  const upRes = await userCollection.doc(uid).update({
    mobile: mobile,
    mobile_confirmed: 1
  })

  log('bindMobile -> upRes', upRes)

  return {
    code: 0,
    msg: '手机号码绑定成功'
  }
}

export default bindMobile
