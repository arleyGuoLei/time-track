<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mpType: 'app',
  globalData: {},
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
  },
  onLaunch() {
    this.initUI()
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
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
