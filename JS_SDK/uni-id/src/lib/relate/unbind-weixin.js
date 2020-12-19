import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'

const db = uniCloud.database()
async function unbindWeixin (uid) {
  const dbCmd = db.command
  const upRes = await userCollection.doc(uid).update({
    wx_openid: dbCmd.remove(),
    wx_unionid: dbCmd.remove()
  })
  log('upRes:', upRes)
  if (upRes.updated === 1) {
    return {
      code: 0,
      msg: '微信解绑成功'
    }
  } else {
    return {
      code: 70301,
      msg: '微信解绑失败，请稍后再试'
    }
  }
}

export default unbindWeixin
