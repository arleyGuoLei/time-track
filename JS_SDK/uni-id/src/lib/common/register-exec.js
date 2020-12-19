import {
  getConfig,
  userCollection
} from '../utils/config'
import {
  createToken
} from '../utils/uni-token'

import getValidInviteCode from './get-valid-Invite-code'

async function addUser (user, options = {}) {
  const addData = {
    ...user,
    register_date: Date.now(),
    register_ip: __ctx__.CLIENTIP
  }
  const addRes = await userCollection.add(addData)

  const uid = addRes.id

  const {
    token,
    tokenExpired
  } = createToken({
    uid,
    needPermission: options.needPermission
  })

  await userCollection.doc(uid).update({
    token: [token]
  })

  return {
    token,
    tokenExpired,
    uid,
    type: 'register',
    userInfo: Object.assign({}, addData, { token })
  }
}

export default async function (user, options = {}) {
  const {
    my_invite_code: myInviteCode
  } = user
  const config = getConfig()

  if (config.autoSetInviteCode || myInviteCode) {
    const validResult = await getValidInviteCode({
      inviteCode: myInviteCode
    })
    if (validResult.code > 0) {
      return validResult
    }
    user.my_invite_code = validResult.inviteCode
  }

  const registerResult = await addUser(user, options)

  return {
    code: 0,
    msg: '注册成功',
    ...registerResult
  }
}
