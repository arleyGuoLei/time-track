const _toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

export function isFn (fn) {
  return typeof fn === 'function'
}

export function getType (val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

export function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

// 获取文件后缀，只添加几种图片类型供客服消息接口使用
export const mime2ext = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/bmp': 'bmp',
  'image/webp': 'webp'
}

export function getExtension (contentType) {
  return mime2ext[contentType]
}

const isSnakeCase = /_(\w)/g
const isCamelCase = /[A-Z]/g

export function snake2camel (value) {
  return value.replace(isSnakeCase, (_, c) => (c ? c.toUpperCase() : ''))
}

export function camel2snake (value) {
  return value.replace(isCamelCase, str => '_' + str.toLowerCase())
}

function parseObjectKeys (obj, type) {
  let parserReg, parser
  switch (type) {
    case 'snake2camel':
      parser = snake2camel
      parserReg = isSnakeCase
      break
    case 'camel2snake':
      parser = camel2snake
      parserReg = isCamelCase
      break
  }
  for (const key in obj) {
    if (hasOwn(obj, key)) {
      if (parserReg.test(key)) {
        const keyCopy = parser(key)
        obj[keyCopy] = obj[key]
        delete obj[key]
        if (isPlainObject(obj[keyCopy])) {
          obj[keyCopy] = parseObjectKeys(obj[keyCopy], type)
        } else if (Array.isArray(obj[keyCopy])) {
          obj[keyCopy] = obj[keyCopy].map((item) => {
            return parseObjectKeys(item, type)
          })
        }
      }
    }
  }
  return obj
}

export function snake2camelJson (obj) {
  return parseObjectKeys(obj, 'snake2camel')
}

export function camel2snakeJson (obj) {
  return parseObjectKeys(obj, 'camel2snake')
}

export function getOffsetDate (offset) {
  return new Date(
    Date.now() + (new Date().getTimezoneOffset() + (offset || 0) * 60) * 60000
  )
}

export function getDateStr (date, separator = '-') {
  date = date || new Date()
  const dateArr = []
  dateArr.push(date.getFullYear())
  dateArr.push(('00' + (date.getMonth() + 1)).substr(-2))
  dateArr.push(('00' + date.getDate()).substr(-2))
  return dateArr.join(separator)
}

export function getTimeStr (date, separator = ':') {
  date = date || new Date()
  const timeArr = []
  timeArr.push(('00' + date.getHours()).substr(-2))
  timeArr.push(('00' + date.getMinutes()).substr(-2))
  timeArr.push(('00' + date.getSeconds()).substr(-2))
  return timeArr.join(separator)
}

export function getFullTimeStr (date) {
  date = date || new Date()
  return getDateStr(date) + ' ' + getTimeStr(date)
}

export function log () {
  if (process.env.NODE_ENV === 'development') {
    console.log(...arguments)
  }
}

export function getSmsCode (len = 6) {
  let code = ''
  for (let i = 0; i < len; i++) {
    code += Math.floor(Math.random() * 10)
  }
  return code
}

export function getDistinctArray (arr) {
  return Array.from(new Set(arr))
}
