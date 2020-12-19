import {
  userCollection
} from '../utils/config'
import {
  checkToken
} from '../utils/uni-token'

const db = uniCloud.database()
async function logout (token) {
  const payload = await checkToken(token)

  if (payload.code && payload.code > 0) {
    return payload
  }
  const dbCmd = db.command
  await userCollection.doc(payload.uid).update({
    token: dbCmd.pull(token)
  })
  return {
    code: 0,
    msg: '退出成功'
  }
}

export default logout
