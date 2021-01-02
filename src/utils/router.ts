import { RouterMount, createRouter } from 'uni-simple-router'
import { report } from './cloud'

async function appLaunched() {
  try {
    await getApp<App>().globalData.$onLaunched
  } catch (error) {
    report(error, 'appLaunchedError')
    // TODO: 跳转错误页 或 重启小程序

    throw error
  }
}

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  keepUniOriginNav: false,
  routes: [...ROUTES],
})

router.beforeEach(async (to, from, next) => {
  await appLaunched()
  next()
})

router.afterEach((to, from) => {
  console.log('跳转结束')
})

export { router, RouterMount }
