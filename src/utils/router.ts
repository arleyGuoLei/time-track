import { RouterMount, createRouter } from 'node_modules/uni-simple-router/src/index'

const router = createRouter({
  platform: process.env.VUE_APP_PLATFORM,
  keepUniOriginNav: false,
  routes: [...ROUTES],
})

router.beforeEach((to, from, next) => {
  console.log('beforeEach', to)

  next()
})
router.afterEach((to, from) => {
  console.log('跳转结束')
})

export { router, RouterMount }
