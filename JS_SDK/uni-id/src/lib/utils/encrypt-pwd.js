import crypto from 'crypto'

import {
  getConfig
} from '../utils/config'
import {
  getType
} from '../../share/index'

function encryptPwd (password, { value: secret, version } = {}) {
  if (!secret) {
    const config = getConfig()
    const {
      passwordSecret
    } = config
    const passwordSecretType = getType(passwordSecret)
    if (passwordSecretType === 'array') {
      const secretList = passwordSecret.sort((a, b) => {
        return a.version - b.version
      })
      secret = secretList[secretList.length - 1].value
      version = secretList[secretList.length - 1].version
    } else {
      secret = passwordSecret
    }
  }
  if (!secret) {
    throw new Error('passwordSecret不正确')
  }
  const hmac = crypto.createHmac('sha1', secret.toString('ascii'))
  hmac.update(password)
  return {
    passwordHash: hmac.digest('hex'),
    version
  }
}

export default encryptPwd
