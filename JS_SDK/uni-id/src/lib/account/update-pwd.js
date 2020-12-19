import encryptPwd from '../utils/encrypt-pwd'
import checkPwd from '../utils/check-pwd'
import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'

async function updatePwd (user) {
  const userInDB = await userCollection.doc(user.uid).get()

  if (userInDB && userInDB.data && userInDB.data.length > 0) {
    const checkPwdRes = checkPwd(userInDB.data[0], user.oldPassword)
    if (checkPwdRes.code === 0) { // 旧密码匹配
      const {
        passwordHash,
        version
      } = encryptPwd(user.newPassword)
      const updateData = {
        password: passwordHash,
        token: []
      }
      if (version) {
        updateData.password_secret_version = version
      }
      const upRes = await userCollection.doc(userInDB.data[0]._id).update(updateData)

      log('upRes', upRes)

      return {
        code: 0,
        msg: '修改成功'
      }
    } else {
      return {
        code: 40202,
        msg: '旧密码错误'
      }
    }
  } else {
    return {
      code: 40201,
      msg: '用户不存在'
    }
  }
}

export default updatePwd
