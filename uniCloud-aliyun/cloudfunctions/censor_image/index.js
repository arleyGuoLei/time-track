const getAccessToken = require('get-access-token')
const config = require('app-config')

async function censorImage(image, accessToken, appid, censorImgaeUrl) {
  const { data } = await uniCloud.httpclient.request(censorImgaeUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    data: {
      app_id: appid,
      access_token: accessToken,
      image,
    },
    dataType: 'json',
  })

  return data
}

exports.main = async (event, context) => {
  const { PLATFORM } = context
  const { images } = event

  const { code, accessToken, message } = await getAccessToken(PLATFORM)

  if (code !== 0) {
    return {
      code: -1,
      message,
    }
  }
  const { censorImgaeUrl, appid } = config.oauth[PLATFORM]
  const censorRes = await Promise.all(
    images.map(url => {
      return censorImage(url, accessToken, appid, censorImgaeUrl)
    }),
  )

  return censorRes.map((res, index) => {
    return {
      url: images[index],
      // hit为true 说明有非法数据
      hit: !res.predicts.every(predict => {
        return !predict.hit
      }),
    }
  })
}
