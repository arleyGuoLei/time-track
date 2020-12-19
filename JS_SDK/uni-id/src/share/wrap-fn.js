import {
  isPlainObject
} from './utils'

export function wrapFn (fn) {
  return async function () {
    const res = await fn(...arguments)
    if (isPlainObject(res) && res.msg) {
      res.message = res.msg
    }
    return res
  }
}
