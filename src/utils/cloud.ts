function getCloud() {
  return getApp<App>().globalData.cloud
}

export function request<T, RES>(name: string, options: T) {
  name = name.replace(/\//g, '_')
  return getCloud().callFunction<RES>({
    name,
    data: {
      ...options,
    },
  })
}
