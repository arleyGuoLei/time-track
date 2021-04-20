import { getLoaingRef } from '@/plugins/loading'
import { RouterMount, createRouter } from 'uni-simple-router'
import { report } from './cloud'

async function appLaunched() {
  async function showLoading(app: App) {
    const loading = getLoaingRef() as any
    if (loading && loading.add) {
      const noop = () => {
        /* 空函数 */
      }
      const key = 'appLaunched'
      loading.add(key, noop, false, '加载中')
      await app.globalData.$onLaunched
      setTimeout(() => {
        loading.remove(key)
      }, 0)
    } else {
      await app.globalData.$onLaunched
    }
  }

  try {
    const app = getApp<App>()
    if (app.globalData.$onLaunched === null) {
      app.globalData.$onLaunched = Promise.all([(app as any).initUI(), (app as any).initCloud(), (app as any).login()])
      await showLoading(app)
    } else {
      await app.globalData.$onLaunched
    }
  } catch (error) {
    report(error, 'appLaunchedError')

    throw error
  }
}

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  keepUniOriginNav: false,
  routes: [...ROUTES],
})

router.beforeEach(async (to, from, next) => {
  // #ifdef MP-BAIDU
  const res = swan.isLoginSync()
  if (res.isLogin) {
    await appLaunched()
    next()
  } else {
    // 没有登录
    const mpLoginPath = '/pages/mpLogin/mpLogin'
    // 要跳转的不是登录页
    if (to.path !== mpLoginPath) {
      const app = getApp<App>()
      ;(app as any).initUI()
      ;(app as any).initCloud()

      // 跳转至登录页
      next({ path: mpLoginPath })
    } else {
      next()
    }
  }
  // #endif

  // #ifndef MP-BAIDU
  await appLaunched()
  next()
  // #endif
})

router.afterEach((to, from) => {
  console.log('跳转结束')
})

export { router, RouterMount }
