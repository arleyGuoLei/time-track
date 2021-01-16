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

export function showTip(title: string) {
  uni.showToast({
    title,
    icon: 'none',
    duration: 2000,
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

export function dateFormat(fmt = 'YYYY-mm-dd HH:MM:SS', date = new Date()) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
  }
  type K = 'Y+' | 'm+' | 'd+' | 'H+' | 'M+' | 'S+'
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k as K] : opt[k as K].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}
