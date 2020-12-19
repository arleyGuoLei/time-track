import {
  userCollection
} from '../utils/config'
import getValidInviteCode from '../common/get-valid-Invite-code'

export default async function ({
  uid,
  myInviteCode
}) {
  const validResult = await getValidInviteCode({
    inviteCode: myInviteCode
  })
  if (validResult.code > 0) {
    return validResult
  }
  await userCollection.doc(uid).update({
    my_invite_code: validResult.inviteCode
  })
  return {
    code: 0,
    msg: '邀请码设置成功',
    myInviteCode: validResult.inviteCode
  }
}
