module.exports = {
  oauth: {
    'mp-qq': {
      appid: 'QQ小程序 appid',
      secret: 'QQ小程序 secret',
      loginUrl: 'https://api.q.qq.com/sns/jscode2session',
    },
    'mp-toutiao': {
      appid: '字节跳动小程序 appid',
      secret: '字节跳动小程序 secret',
      loginUrl: 'https://developer.toutiao.com/api/apps/jscode2session',
      getAccessTokenUrl: 'https://developer.toutiao.com/api/apps/token',
      censorImgaeUrl: 'https://developer.toutiao.com/api/apps/censor/image',
    },
    'mp-baidu': {
      appid: '百度小程序 appid',
      secret: '百度小程序 secret',
      loginUrl: 'https://spapi.baidu.com/oauth/jscode2sessionkey',
    },
  },
}
