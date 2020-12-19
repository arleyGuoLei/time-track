import {
  userCollection
} from '../utils/config'
import getAlipayApi from '../common/alipay-api'

async function bindAlipay ({
  uid,
  code,
  platform
}) {
  const clientPlatform = platform || __ctx__.PLATFORM
  const {
    openid
  } = await getAlipayApi({
    platform: clientPlatform
  }).code2Session(code)
  if (!openid) {
    return {
      code: 60401,
      msg: '获取openid失败'
    }
  }
  const userList = await userCollection.where({
    ali_openid: openid
  }).get()
  // openid已注册
  if (userList && userList.data && userList.data.length > 0) {
    return {
      code: 60402,
      msg: '支付宝绑定失败，此账号已被绑定'
    }
  }
  await userCollection.doc(uid).update({
    ali_openid: openid
  })
  return {
    code: 0,
    msg: '绑定成功'
  }
}

export default bindAlipay
