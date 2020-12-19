import {
  userCollection
} from '../utils/config'
import {
  verifyCode
} from '../verify/verify'

const db = uniCloud.database()
async function unbindMobile ({
  uid,
  mobile,
  // 不传递code时不进行验证码校验
  code
}) {
  if (code) {
    const verifyRes = await verifyCode({
      mobile,
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
    mobile
  }).update({
    mobile: dbCmd.remove(),
    mobile_confirmed: dbCmd.remove()
  })
  if (upRes.updated === 1) {
    return {
      code: 0,
      msg: '手机号解绑成功'
    }
  } else {
    return {
      code: 70101,
      msg: '手机号解绑失败，请稍后再试'
    }
  }
}

export default unbindMobile
