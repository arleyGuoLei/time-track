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
