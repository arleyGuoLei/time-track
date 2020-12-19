import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'

const db = uniCloud.database()
async function unbindAlipay (uid) {
  const dbCmd = db.command
  const upRes = await userCollection.doc(uid).update({
    ali_openid: dbCmd.remove()
  })
  log('upRes:', upRes)
  if (upRes.updated === 1) {
    return {
      code: 0,
      msg: '支付宝解绑成功'
    }
  } else {
    return {
      code: 70401,
      msg: '支付宝解绑失败，请稍后再试'
    }
  }
}

export default unbindAlipay
