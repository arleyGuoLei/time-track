import {
  userCollection
} from '../utils/config'
import {
  verifyCode
} from '../verify/verify'

const db = uniCloud.database()
async function unbindEmail ({
  uid,
  email,
  // 不传递code时不进行验证码校验
  code
}) {
  if (code) {
    const verifyRes = await verifyCode({
      email,
      code,
      type: 'unbind'
    })
    if (verifyRes.code !== 0) {
      return verifyRes // 验证失败
    }
  }
  const dbCmd = db.command
  const upRes = await userCollection.where({
    _id: uid,
    email
  }).update({
    email: dbCmd.remove(),
    email_confirmed: dbCmd.remove()
  })
  if (upRes.updated === 1) {
    return {
      code: 0,
      msg: '邮箱解绑成功'
    }
  } else {
    return {
      code: 70201,
      msg: '邮箱解绑失败，请稍后再试'
    }
  }
}

export default unbindEmail
