import {
  wrapFn
} from './share/index'

import * as methodList from './uni-id'

const noWrapList = ['init', 'encryptPwd', 'createToken']
const uniID = {}
for (const key in methodList) {
  if (noWrapList.indexOf(key) > -1) {
    uniID[key] = methodList[key]
    continue
  }
  uniID[key] = wrapFn(methodList[key])
}

export default uniID
