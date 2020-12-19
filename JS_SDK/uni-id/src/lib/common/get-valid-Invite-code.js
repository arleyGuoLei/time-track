import {
  userCollection
} from '../utils/config'

// 邀请码由大写字母加数字组成，由于存在手动输入邀请码的场景，从可选字符中去除 0、1、I、O
function getRandomInviteCode (len = 6) {
  const charArr = ['2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let code = ''
  for (let i = 0; i < len; i++) {
    code += charArr[Math.floor(Math.random() * charArr.length)]
  }
  return code
}

export default async function ({
  inviteCode
}) {
  let retry = 10
  let code
  if (inviteCode) {
    retry = 1
    code = inviteCode
  } else {
    code = getRandomInviteCode()
  }
  let codeValid = false
  try {
    while (retry > 0 && !codeValid) {
      retry--
      const codeInDb = await userCollection.where({
        invite_code: code
      }).get()
      if (codeInDb.data.length === 0) {
        codeValid = true
        break
      }
      code = getRandomInviteCode()
    }
    if (!codeValid) {
      if (inviteCode) {
        return {
          code: 80401,
          msg: '邀请码重复，设置失败'
        }
      } else {
        return {
          code: 80402,
          msg: '邀请码设置失败稍后再试'
        }
      }
    }
    return {
      code: 0,
      inviteCode: code
    }
  } catch (error) {
    return {
      code: 90001,
      msg: '数据库读写异常'
    }
  }
}
