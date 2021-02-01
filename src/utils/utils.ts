import dayjs from 'dayjs'

export function getClientRect(select: string, pos: any): Promise<UniApp.NodeInfo> {
  const query = uni.createSelectorQuery().in(pos)
  return new Promise((resolve, reject) => {
    try {
      query
        .select(select)
        .boundingClientRect(data => {
          resolve(data)
        })
        .exec()
    } catch (error) {
      reject(error)
    }
  })
}

export function showTip(title: string, duration = 2000) {
  return new Promise(resolve => {
    uni.showToast({
      title,
      icon: 'none',
      duration,
      complete: () => {
        setTimeout(() => {
          resolve(title)
        }, duration)
      },
    })
  })
}

/**
 * 判断获取授权
 * @param {Stirng} scope 需要获取的权限
 * @param {String} content 打开授权的提示
 * @param {String} confirmText 打开授权提示的确定文本
 * @param {String} showToastTitle 用户在设置页没有开启授权的提示
 */
export const authSetting = (scope: string, content: string, confirmText: string, showToastTitle: string) => {
  return new Promise((resolve, reject) => {
    uni.authorize({
      scope,
      success: resolve,
      fail() {
        uni.showModal({
          title: '提示',
          content,
          confirmText,
          success(res) {
            if (res.confirm) {
              uni.openSetting({
                success(res) {
                  if (res.authSetting && res.authSetting[scope]) {
                    resolve('')
                  } else {
                    uni.showToast({
                      title: showToastTitle,
                      duration: 2000,
                      icon: 'none',
                    })
                    reject('用户在设置页没有打开权限')
                  }
                },
              })
            } else if (res.cancel) {
              reject('用户点击取消打开授权页')
            }
          },
        })
      },
    })
  })
}

/**
 * 格式化时间
 * @param fmt
 * @param date
 * https://day.js.org/docs/zh-CN/display/format
 */
export function dateFormat(fmt = 'YYYY-MM-DD HH:mm:ss', date = new Date()) {
  return dayjs(date).format(fmt)
}

/**
 * 日期+时间转换为时间戳
 * @param date 日期
 * @param time 时间
 */
export function time2Timestamp(date: string, time: string) {
  return Date.parse(`${date} ${time}`.replace(/-/g, '/'))
}
