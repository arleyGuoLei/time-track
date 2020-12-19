import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'

async function updateUser (params) {
  const uid = params.uid
  if (!uid) {
    return {
      code: 80101,
      msg: '缺少uid参数'
    }
  }
  delete params.uid
  const upRes = await userCollection.doc(uid).update(params)

  log('update -> upRes', upRes)

  return {
    code: 0,
    msg: '修改成功'
  }
}

export default updateUser
