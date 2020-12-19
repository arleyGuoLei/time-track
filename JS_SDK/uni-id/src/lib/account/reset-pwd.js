import encryptPwd from '../utils/encrypt-pwd'
import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'

async function resetPwd ({
  uid,
  password
}) {
  const {
    passwordHash,
    version
  } = encryptPwd(password)
  const updateData = {
    password: passwordHash,
    token: []
  }
  if (version) {
    updateData.password_secret_version = version
  }
  const upRes = await userCollection.doc(uid).update(updateData)

  log('upRes', upRes)

  return {
    code: 0,
    msg: '密码重置成功'
  }
}

export default resetPwd
