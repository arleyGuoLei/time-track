export function friendlyDate (time) {
  let ms = time - Date.now()
  let num
  let quantifier
  let suffix = '后'
  if (ms < 0) {
    suffix = '前'
    ms = -ms
  }
  const seconds = Math.floor((ms) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  switch (true) {
    case years > 0:
      num = years
      quantifier = '年'
      break
    case months > 0:
      num = months
      quantifier = '月'
      break
    case days > 0:
      num = days
      quantifier = '天'
      break
    case hours > 0:
      num = hours
      quantifier = '小时'
      break
    case minutes > 0:
      num = minutes
      quantifier = '分钟'
      break
    default:
      num = seconds
      quantifier = '秒'
      break
  }
  return `${num}${quantifier}${suffix}`
}
