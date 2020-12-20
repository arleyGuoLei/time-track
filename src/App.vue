<script lang="ts">
import Vue from 'vue'
import { CLOUD_ENV } from '@/utils/config'
import { userModel } from './models'
import { LOCAL_TOKEN_EXPIREDS_THRESHOLD, LOCAL_TOKEN_EXPIRED_KEY, LOCAL_TOKEN_KEY } from './utils/constant'

export default Vue.extend({
  mpType: 'app',
  globalData: {
    cloud: null,
  },
  methods: {
    initUI() {
      uni.getSystemInfo({
        success(e) {
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
        },
      })
    },
    initCloud() {
      const option = process.env.NODE_ENV === 'development' ? CLOUD_ENV.dev : CLOUD_ENV.prod
      ;((this as any) as App).globalData.cloud = uniCloud.init(option)
    },
    login() {
      // #ifdef MP
      const tokenExpired = uni.getStorageSync(LOCAL_TOKEN_EXPIRED_KEY)
      const token = uni.getStorageSync(LOCAL_TOKEN_KEY)

      // 本地没有token 或者 token有效期小于(10分钟)则重新获取
      if (!token || tokenExpired <= Date.now() - LOCAL_TOKEN_EXPIREDS_THRESHOLD) {
        userModel.loginMP()
      }
      // #endif
    },
  },
  onLaunch() {
    this.initUI()
    this.initCloud()
    this.login()
  },
})
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
</style>
