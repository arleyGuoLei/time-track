import {
  userCollection
} from '../utils/config'

const db = uniCloud.database()
const dbCmd = db.command

export default async function ({
  uid,
  inviteCode
}) {
  const inviter = await userCollection.where({
    _id: dbCmd.neq(uid),
    inviter_uid: dbCmd.not(dbCmd.all([uid])),
    my_invite_code: inviteCode
  }).get()
  if (inviter.data.length !== 1) {
    return {
      code: 80501,
      msg: '邀请码无效'
    }
  }
  const inviterUid = ([inviter.data[0]._id]).concat(inviter.data[0].inviter_uid || [])

  const userInfo = await userCollection.doc(uid).field({
    my_invite_code: true,
    inviter_uid: true
  }).get()

  if (userInfo.data.length === 0) {
    return {
      code: 80502,
      msg: 'uid错误用户不存在'
    }
  }

  if (userInfo.data[0].inviter_uid && userInfo.data[0].inviter_uid.length > 0) {
    return {
      code: 80503,
      msg: '邀请码不可修改'
    }
  }

  const now = Date.now()
  await userCollection.doc(uid).update({
    inviter_uid: inviterUid,
    invite_time: now
  })
  await userCollection.where({
    inviter_uid: uid
  }).update({
    inviter_uid: dbCmd.push(inviterUid)
  })
  return {
    code: 0,
    msg: '邀请码填写成功'
  }
}
