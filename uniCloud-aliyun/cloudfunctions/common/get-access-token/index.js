const config = require('app-config')

const db = uniCloud.database()

const appModel = db.collection('app')

function getAccessTokenClient(url, appid, secret) {
  return uniCloud.httpclient.request(url, {
    method: 'GET',
    data: {
      appid,
      secret,
      grant_type: 'client_credential',
    },
    dataType: 'json',
  })
}

function getAccessToken(platform) {
  const { getAccessTokenUrl, appid, secret } = config.oauth[platform]
  return getAccessTokenClient(getAccessTokenUrl, appid, secret)
}

function addAccessToken(platform, accessToken, expiresInTime) {
  return appModel.add({
    platform,
    accessToken,
    expiresInTime,
  })
}

function updateAccessToken(platform, accessToken, expiresInTime) {
  return appModel
    .where({
      platform,
    })
    .update({
      accessToken,
      expiresInTime,
    })
}

module.exports = async function(platform) {
  let message = '未知错误'
  let accessToken = ''
  try {
    const appData = await appModel
      .where({
        platform,
      })
      .field({ platform: true, accessToken: true, expiresInTime: true })
      .limit(1)
      .get()

    const now = Date.now()
    const buffer = 10 * 60 * 1000 // 10mins

    // expiresInTime为token有效期, 当有效期小于现在时间前buffer分钟时更新
    if (appData.data.length === 0 || appData.data[0].expiresInTime < now) {
      const { data } = await getAccessToken(platform)
      const { access_token, expires_in } = data
      if (access_token && expires_in) {
        accessToken = access_token
        const expiresInTime = now + expires_in * 1000 - buffer
        if (appData.data.length === 0) {
          // 新增 7200 = 120 * 60
          await addAccessToken(platform, access_token, expiresInTime)
        } else {
          // 更新
          await updateAccessToken(platform, access_token, expiresInTime)
          console.log('更新数据库Token::', access_token)
        }
      } else {
        throw new Error('getAccessToken失败')
      }
    } else {
      accessToken = appData.data[0].accessToken
    }

    return {
      code: 0,
      accessToken,
    }
  } catch (error) {
    console.log(error)
    message = error.message || '未知错误'
  }

  return {
    code: -1,
    message,
    accessToken: '',
  }
}
