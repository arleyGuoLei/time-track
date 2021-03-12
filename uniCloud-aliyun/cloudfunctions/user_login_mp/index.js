'use strict'
const uniID = require('uni-id')
const loginMap = require('./code2Session')
const dayjs = require('dayjs')

const db = uniCloud.database()
const dbCmd = db.command

const userModel = db.collection('uni-id-users')
const tagsModel = db.collection('tags')
const eventsModel = db.collection('events')
const dotsModel = db.collection('dots')

/**平台和数据库字段的对应关系 */
const platform2Db = {
  'mp-weixin': openid => {
    return {
      wx_openid: {
        'mp-weixin': openid,
      },
    }
  },
  'mp-alipay': openid => {
    return {
      ali_openid: openid,
    }
  },
  'mp-qq': openid => {
    return {
      qq_openid: {
        'mp-qq': openid,
      },
    }
  },
  'mp-toutiao': openid => {
    return {
      tt_openid: openid,
    }
  },
  'mp-baidu': openid => {
    return {
      bd_openid: openid,
    }
  },
}

async function setDefaultDATA(uid) {
  const dateObj = new Date()
  const timestamp = dateObj.getTime()

  // 默认TAG
  const tags = ['新人引导', '日常', '周卡', '爱情', '其他'].map((tagTitle, index) => ({
    eventNumber: 0,
    status: 1,
    name: tagTitle,
    user_id: uid,
    create_time: new Date().getTime(),
    index,
  }))
  const { ids: tagIds } = await tagsModel.add(tags)

  // 默认事件

  const events = [
    {
      eventName: '快速上车「新朋友」',
      iconSrc: '603cc2ad20be4e00012e3861',
      iconColor: '603cc2ade028a50001cd2ed2',
      // 0 新人引导, 4 其他
      tags: [tagIds[0], tagIds[4]],
      openCalc: true,
      signNumber: 6, // 有6个默认打点
      lastTime: timestamp,
    },
    {
      eventName: '洗澡 🛀',
      iconSrc: '603cc2ad20be4e00012e381b',
      iconColor: '603cc2ade028a50001cd2e82',
      // 1 日常
      tags: [tagIds[1]],
      openCalc: true,
    },
    {
      eventName: '到达公司 💻',
      iconSrc: '603cc2ad20be4e00012e382b',
      iconColor: '603cc2ade028a50001cd2ebf',
      // 1 日常
      tags: [tagIds[1]],
      openCalc: false,
    },
    {
      eventName: '离开公司/下班 🏃',
      iconSrc: '603cc2ad20be4e00012e3831',
      iconColor: '603cc2ade028a50001cd2ed4',
      // 1 日常
      tags: [tagIds[1]],
      openCalc: false,
    },
    {
      eventName: '拉臭臭 💩',
      iconSrc: '603cc2ad20be4e00012e384f',
      iconColor: '603cc2ade028a50001cd2ea2',
      // 1 日常
      tags: [tagIds[1]],
      openCalc: false,
    },
    {
      eventName: '和妈妈打电话',
      iconSrc: '603cc2ad20be4e00012e384d',
      iconColor: '603cc2ade028a50001cd2ec8',
      // 1 日常， 2 周卡
      tags: [tagIds[1], tagIds[2]],
      openCalc: false,
    },
    {
      eventName: '看电影',
      iconSrc: '603cc2ad20be4e00012e3829',
      iconColor: '603cc2ade028a50001cd2edc',
      // 1 日常, 3 爱情
      tags: [tagIds[1], tagIds[3]],
      openCalc: false,
    },
    {
      eventName: '每日三餐',
      iconSrc: '603cc2ad20be4e00012e384a',
      iconColor: '603cc2ade028a50001cd2e96',
      // 1 日常
      tags: [tagIds[1]],
      openCalc: false,
    },
  ].map(e => ({ user_id: uid, create_time: timestamp, signNumber: 0, lastTime: 0, status: 1, ...e }))
  const { ids: eventsIds } = await eventsModel.add(events)

  // tag使用次数新增、图标使用次数新增(使用默认图标，不进行新增，所以没开发)

  const useTags = events.reduce((prev, e) => {
    e.tags.forEach(tag => {
      if (prev[tag]) {
        prev[tag] = prev[tag] + 1
      } else {
        prev[tag] = 1
      }
    })
    return prev
  }, {})

  const dbQueue = []
  Object.keys(useTags).forEach(tagId => {
    dbQueue.push(
      tagsModel.doc(tagId).update({
        eventNumber: dbCmd.inc(useTags[tagId]),
      }),
    )
  })

  const date = dayjs(dateObj).format('YYYY-MM-DD')
  const time = dayjs(dateObj).format('HH:mm')

  // 默认打点
  const dots = [
    {
      describe:
        '核心功能：时间打点，更有效的记录时间小细节 ~ “我啥时候洗的澡呀？”、“咱们一起看过哪些电影了？”、“咱们桶装水多久换一次？”、“一天在公司时间多久呀？”',
      imageList: [
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/7ae04dbb-f3d3-4e42-a3f9-f2d960fc9170.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/66d33090-6ebf-4bfd-a8c8-9b0244fc3ddd.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/f3a87110-41bf-4070-87e1-caf1619ea9f4.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/728d1516-b445-4c06-85fe-343d27812ea4.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/ca233c23-2990-44ab-b87c-0a92118c6693.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/e4b9431d-ab3d-483c-97ee-ed4c9f59cf7a.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/8f446d3c-bb39-454d-a8f1-e898be35211c.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/6ff33f56-4542-4fc5-92f3-a51e43cfe338.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/e4a74986-199b-41ad-842a-a025b13b3d7f.jpg',
      ],
    },
    {
      describe:
        '新增事件：首页点击右下角“+”，可进入事件新增，事件可自定义名称、图标、所属标签；量化值用于统计事件打点和，比如“发工资”事件，每次打点通过量化值记录收入，即可统计总收入。',
      imageList: [
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/30532145-0b4c-47a9-a3d4-5f3f0632030d.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/4dafe039-5986-4e7c-876e-7bef3ffead73.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/1783104f-b799-4f9b-ad97-f73c4c855cba.jpg',
      ],
    },
    {
      describe: '事件打点：打点可以自定义描述、位置、量化值、打点时间(默认为当前时间)，首页长按事件可快速打点。',
      imageList: [
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/c9931833-ec2a-42f3-bc18-2bb0e25b119b.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/a2c650ce-f15f-4f17-a580-5c9bb9b9faa4.jpg',
      ],
    },
    {
      describe: '事件详情：时间动态可以查看该事件所有打点，按照打点时间逆序加载 ~',
      imageList: [
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/d950ddd7-ff51-4940-9488-fdc47d6c9751.jpg',
      ],
    },
    {
      describe:
        '日志：日志页可以查看每日打点动态，点击打点可查看该点和每个打点的时间间隔；比如查看“下班”，可以看到距离“上班”的时间差。',
      imageList: [
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/4b08f450-1c8b-4adb-8b01-4fe3a37a4a7c.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/75ff91d5-113e-499f-8a1a-6a17ec9558cd.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/7ea09b10-1583-4bcf-9313-7e250ba9f27d.jpg',
      ],
    },
    {
      describe:
        '其他：事件可进行删除、更新，事件更新打点将同步修改，事件删除，将删除对应的打点数据；打点也可以进行修改和删除 ~',
      imageList: [
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/8a7e4be1-4d86-46ee-ba81-4b726f9f3a9d.jpg',
        'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-b1cf53e8-922d-4868-8598-5111a35fcab5/83bda8cb-5111-4804-b9a7-e8c977da3251.jpg',
      ],
    },
  ].map((dot, index) => ({
    ...dot,
    dotTimestamp: timestamp - index * 10,
    create_time: timestamp - index * 10,
    status: 1,
    score: index + 1,
    date,
    time,
    event_id: eventsIds[0],
    user_id: uid,
  }))
  dbQueue.push(dotsModel.add(dots))

  await Promise.all(dbQueue)
}

/**
 * 注册新用户，调用uni-id
 * @param {string} openid openid
 * @param {stirng} platform 平台
 */
async function register(openid, platform) {
  const { code, message, uid, token, tokenExpired } = await uniID.register({
    username: `${platform}__${openid}`,
    password: '______',
  })
  if (code === 0 && uid) {
    // 注册成功, 删除默认账号和密码
    const { code: updateCode, message: updateMessage } = await uniID.updateUser({
      uid,
      username: '',
      password: '',
      ...platform2Db[platform](openid),
    })
    if (updateCode === 0) {
      await setDefaultDATA(uid)
      return {
        uid,
        token,
        tokenExpired,
      }
    } else {
      throw new Error(updateMessage)
    }
  } else {
    throw new Error(message)
  }
}

/**
 * 更新tokens
 * @param {string} uid _id
 * @param {string} token 新生成的token
 * @param {string[]} oldTokenList 老的token列表
 */
async function updateToken(uid, token, oldTokenList) {
  // 删除无用的token
  const expiredToken = await uniID.getExpiredToken(oldTokenList)
  const tokenList = [
    token,
    ...oldTokenList.filter(item => {
      return expiredToken.indexOf(item) === -1
    }),
  ]
  await userModel.doc(uid).update({
    token: tokenList,
    last_login_date: Date.now(),
    last_login_ip: __ctx__.CLIENTIP,
  })
}

/**
 * 获取token (新用户注册，老用户创建一个新的token 且 删除无用的老token)
 * @param {string} openid openid
 * @param {string} platform 平台
 */
async function getToken(openid, platform) {
  const p2d = platform2Db[platform]
  if (typeof p2d === 'function') {
    const ids = await userModel
      .where({
        ...p2d(openid),
      })
      .field({ _id: true, token: true })
      .get()
    let uid
    // ids.data内才是数据
    if (ids.data.length === 0) {
      return await register(openid, platform)
    } else {
      uid = ids.data[0]._id // _id为uid
      const tokenList = ids.data[0].token

      // createToken未返回code，官方文档有误
      // 创建token后 还需要自己写入数据库
      // 需要对过期token做一次遍历，防止文档过大
      const { message = '创建token失败', token, tokenExpired } = await uniID.createToken({ uid })

      if (token) {
        // 对过期token做一次遍历，并且把新的token更新至数据库
        await updateToken(uid, token, tokenList)
        return {
          uid,
          token,
          tokenExpired,
        }
      } else {
        throw new Error(message)
      }
    }
  } else {
    throw new Error('暂不支持该平台')
  }
}

/**
 * 小程序登录
 * @param {object} event 获取code
 * @param {obejct} context 获取平台
 */
exports.main = async (event, context) => {
  const { code } = event
  const { PLATFORM } = context
  try {
    if (loginMap[PLATFORM]) {
      const { code: errcode, openid, message } = await loginMap[PLATFORM](code)
      if (errcode !== 0 || openid === '') {
        return { code: errcode, message }
      }
      const { token, tokenExpired } = await getToken(openid, PLATFORM)

      return {
        code: 0,
        token,
        tokenExpired,
      }
    } else {
      throw new Error('暂不支持该平台')
    }
  } catch (error) {
    return {
      code: -1,
      message: error.message || error,
    }
  }
}
