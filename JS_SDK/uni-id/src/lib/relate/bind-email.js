import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'
import {
  verifyCode
} from '../verify/verify'

async function bindEmail ({
  uid,
  email,
  // 不传递code时不验证直接绑定
  code
}) {
  const countRes = await userCollection.where({
    email,
    email_confirmed: 1
  }).count()
  if (countRes && countRes.total > 0) {
    return {
      code: 60201,
      msg: '此邮箱已被绑定'
    }
  }
  if (code) {
    const verifyRes = await verifyCode({
      email,
      code,
      type: 'bind'
    })
    if (verifyRes.code !== 0) {
      return verifyRes // 验证失败
    }
  }
  const upRes = await userCollection.doc(uid).update({
    email,
    email_confirmed: 1
  })

  log('bindEmail -> upRes', upRes)

  return {
    code: 0,
    msg: '邮箱绑定成功'
  }
}

export default bindEmail
