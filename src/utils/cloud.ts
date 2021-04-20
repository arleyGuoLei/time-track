import { LOCAL_TOKEN_EXPIRED_KEY, LOCAL_TOKEN_KEY } from './constant'
import { CLOUD_ENV } from '@/utils/config'

interface CloudError {
  code: string
}

export function setLocalToken({ token, tokenExpired }: { token: string; tokenExpired: number }) {
  console.log('log =>  ~ file: cloud.ts ~ line 18 ~ setLocalToken ~ setLocalToken', { token })
  uni.setStorageSync(LOCAL_TOKEN_KEY, token)
  uni.setStorageSync(LOCAL_TOKEN_EXPIRED_KEY, tokenExpired)
}

function initEvent(cloud: UniCloud.UniCloud) {
  cloud.database().on('refreshToken', setLocalToken) // 自动刷新token后需要保存
  cloud.database().on('error', (err: CloudError) => {
    const { code = '' } = err

    // 错误码：https://uniapp.dcloud.io/uniCloud/clientdb?id=returnvalue
    // 这些错误码需要刷新token
    const refreshList = [
      'TOKEN_INVALID_INVALID_CLIENTID',
      'TOKEN_INVALID',
      'TOKEN_INVALID_TOKEN_EXPIRED',
      'TOKEN_INVALID_WRONG_TOKEN',
      'TOKEN_INVALID_ANONYMOUS_USER',
    ]
    if (refreshList.includes(code)) {
      setLocalToken({ token: '', tokenExpired: -1 })
      getApp().login(true) // 强制刷新token
    }
  })
}

/**
 * 初始化uniCloud
 */
export function initCloud() {
  const option = process.env.NODE_ENV === 'development' ? CLOUD_ENV.dev : CLOUD_ENV.prod
  const cloud = uniCloud.init(option)
  initEvent(cloud)
  return cloud
}

function getCloud() {
  return getApp<App>().globalData.cloud
}

export function request<T, RES>(name: string, options?: T) {
  name = name.replace(/\//g, '_')
  return getCloud().callFunction<RES>({
    name,
    data: {
      ...options,
    },
  })
}

export function report(data: any, eventname = 'log') {
  if (['log', 'info', 'warn', 'error'].includes(eventname)) {
    console[eventname as 'log' | 'info' | 'warn' | 'error'](`${eventname}::`, data)
  }
  uni.report(eventname, data)
}
