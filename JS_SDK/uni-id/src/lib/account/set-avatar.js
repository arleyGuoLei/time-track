// import uniToken from './uniToken.js'
import {
  log
} from '../../share/index'
import {
  userCollection
} from '../utils/config'

async function setAvatar (params) {
  const upRes = await userCollection.doc(params.uid).update({
    avatar: params.avatar
  })

  log('setAvatar -> upRes', upRes)

  return {
    code: 0,
    msg: '头像设置成功'
  }
}

export default setAvatar
