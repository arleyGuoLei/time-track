import { LOCAL_TOKEN_EXPIRED_KEY, LOCAL_TOKEN_KEY } from './constant'

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

export function setLocalToken({ token, tokenExpired }: { token: string; tokenExpired: number }) {
  console.log('log =>  ~ file: cloud.ts ~ line 18 ~ setLocalToken ~ setLocalToken', { token })
  uni.setStorageSync(LOCAL_TOKEN_KEY, token)
  uni.setStorageSync(LOCAL_TOKEN_EXPIRED_KEY, tokenExpired)
}

export function report(data: any, eventname = 'log') {
  if (['log', 'info', 'warn', 'error'].includes(eventname)) {
    console[eventname as 'log' | 'info' | 'warn' | 'error'](`${eventname}::`, data)
  }
  uni.report(eventname, data)
}
