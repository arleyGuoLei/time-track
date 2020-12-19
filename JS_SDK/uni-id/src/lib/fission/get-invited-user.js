import {
  userCollection
} from '../utils/config'

export default async function ({
  uid,
  level = 1,
  limit = 20,
  offset = 0,
  needTotal = false
}) {
  const res = await userCollection.where({
    [`inviter_uid.${level - 1}`]: uid
  })
    .field({
      _id: true,
      username: true,
      mobile: true,
      invite_time: true
    })
    .orderBy('invite_time', 'desc')
    .skip(offset)
    .limit(limit)
    .get()
  const result = {
    code: 0,
    msg: '获取邀请列表成功',
    invitedUser: res.data
  }
  if (needTotal) {
    const totalRes = await userCollection.where({
      [`inviter_uid.${level - 1}`]: uid
    })
      .count()
    result.total = totalRes.total
  }
  return result
}
