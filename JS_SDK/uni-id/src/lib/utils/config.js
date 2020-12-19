import fs from 'fs'
import path from 'path'

const db = uniCloud.database()
const userCollectionName = 'uni-id-users'
const userCollection = db.collection(userCollectionName)
const verifyCollectionName = 'opendb-verify-codes'
const verifyCollection = db.collection(verifyCollectionName)
const roleCollectionName = 'uni-id-roles'
const roleCollection = db.collection(roleCollectionName)
const permissionCollectionName = 'uni-id-permissions'
const permissionCollection = db.collection(permissionCollectionName)

let configFileContent = {}
try {
  configFileContent = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json')))
} catch (error) {
  // 不处理错误，提供init方法
}

// 导出方法防止示例复用带来的问题
function getConfig (platform) {
  const platformConfig = Object.assign(configFileContent, configFileContent[platform || __ctx__.PLATFORM]) || {}
  const defaultConfig = {
    bindTokenToDevice: true
  }
  const config = Object.assign(defaultConfig, platformConfig)
  const argsRequired = ['passwordSecret', 'tokenSecret', 'tokenExpiresIn', 'passwordErrorLimit', 'passwordErrorRetryTime']
  argsRequired.forEach((item) => {
    if (!config || !config[item]) {
      throw new Error(`请在公用模块uni-id的config.json或init方法中内添加配置项：${item}`)
    }
  })
  return config
}

function init (config) {
  configFileContent = config
}

export {
  userCollection,
  verifyCollection,
  roleCollection,
  permissionCollection,
  userCollectionName,
  verifyCollectionName,
  roleCollectionName,
  permissionCollectionName,
  getConfig,
  init
}
