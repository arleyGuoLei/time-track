import {
  userCollection
} from '../utils/config'

export default async function ({
  uid,
  field
}) {
  const fieldObj = {}
  if (field && field.length) {
    for (let i = 0; i < field.length; i++) {
      fieldObj[field[i]] = true
    }
  }
  let res
  if (field && field.length) {
    res = await userCollection.doc(uid).field(fieldObj).get()
  } else {
    res = await userCollection.doc(uid).get()
  }
  if (res.data.length === 0) {
    return {
      code: 80301,
      msg: '未查询到用户信息'
    }
  }
  return {
    code: 0,
    msg: '获取用户信息成功',
    userInfo: res.data[0]
  }
}
