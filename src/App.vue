<script lang="ts">
import Vue from 'vue'
import { CLOUD_ENV } from '@/utils/config'
import { userModel } from './models'
import { LOCAL_TOKEN_EXPIREDS_THRESHOLD, LOCAL_TOKEN_EXPIRED_KEY, LOCAL_TOKEN_KEY } from './utils/constant'
import { setLocalToken } from './utils/cloud'

export default {
  mpType: 'app',
  globalData: {
    cloud: null,
    db: null,
    $onLaunched: null,
  },
  methods: {
    async initUI() {
      const e = uni.getSystemInfoSync()
      const { statusBarHeight = 0, titleBarHeight = 0 } = e

      // 非小程序， APP + H5
      // #ifndef MP
      Vue.prototype.StatusBar = statusBarHeight
      if (e.platform === 'android') {
        Vue.prototype.CustomBar = statusBarHeight + 50
      } else {
        Vue.prototype.CustomBar = statusBarHeight + 45
      }
      // #endif

      // 小程序：https://uniapp.dcloud.io/platform?id=%e6%9d%a1%e4%bb%b6%e7%bc%96%e8%af%91
      // #ifdef MP-WEIXIN	|| MP-BAIDU	|| MP-TOUTIAO	|| MP-QQ|| MP-360
      Vue.prototype.StatusBar = statusBarHeight
      const custom = wx.getMenuButtonBoundingClientRect()
      Vue.prototype.Custom = custom
      Vue.prototype.CustomBar = custom.bottom + custom.top - statusBarHeight
      // #endif

      // 支付宝小程序
      // #ifdef MP-ALIPAY
      Vue.prototype.StatusBar = statusBarHeight
      Vue.prototype.CustomBar = statusBarHeight + titleBarHeight
      // #endif

      console.log('initUI 完成')
    },
    async initCloud() {
      const option = process.env.NODE_ENV === 'development' ? CLOUD_ENV.dev : CLOUD_ENV.prod
      const cloud = uniCloud.init(option)
      cloud.database().on('refreshToken', setLocalToken)
      ;((this as any) as App).globalData.cloud = cloud
      ;((this as any) as App).globalData.db = cloud.database()

      console.log('initCloud 完成')
    },
    async login() {
      // #ifdef MP
      const tokenExpired = uni.getStorageSync(LOCAL_TOKEN_EXPIRED_KEY)
      const token = uni.getStorageSync(LOCAL_TOKEN_KEY)
      // 本地没有token 或者 token有效期小于(10分钟)则重新获取
      if (!token || tokenExpired <= Date.now() + LOCAL_TOKEN_EXPIREDS_THRESHOLD) {
        await userModel.loginMP()
      }
      // #endif

      console.log('登录完成')
    },
  },
  onLaunch() {
    ;((this as any) as App).globalData.$onLaunched = Promise.all([
      (this as any).initUI(),
      (this as any).initCloud(),
      (this as any).login(),
    ])
  },
}
</script>

<style>
.text-cut {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
}

button::after,
button::before {
  display: none;
}
</style>
