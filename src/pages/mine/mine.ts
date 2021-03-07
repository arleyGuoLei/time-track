import { dotsModel } from '@/models'
import { showTip } from '@/utils/utils'
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { onShareAppMessageMixin } from '@/plugins/shareAppMessage.mixin'

declare module 'vue/types/vue' {
  interface Vue {
    CustomBar: number
    StatusBar: number
  }
}
@Component
export default class extends Mixins(onShareAppMessageMixin) {
  private list = [
    {
      iconName: 'share',
      title: '分享给朋友',
      openType: 'share',
    },
    {
      iconName: 'advice',
      title: '意见反馈',
      openType: 'feedback',
    },
    {
      iconName: 'about',
      title: '关于我们',
      method: 'aboutUS',
    },
    // #ifndef MP-TOUTIAO
    // #endif
  ]

  private signDays = 0
  private signTimes = 0

  onLoad() {
    ;(this as any).$loading('getInfo', this.getInfo.bind(this))

    uni.$on('onMineRefresh', this.getInfo)
  }

  async onPullDownRefresh() {
    await (this as any).$loading('getInfo', this.getInfo.bind(this))
    uni.stopPullDownRefresh()
  }

  async getInfo() {
    const [signDays, signTimes] = await Promise.all([dotsModel.getSignDays(), dotsModel.getSignTimes()])
    this.signTimes = signTimes
    this.signDays = signDays
  }

  methods(fn: string) {
    typeof (this as any)[fn] === 'function' && (this as any)[fn]()
  }

  aboutUS() {
    console.log('aboutUS')
    showTip('微信公众号：前端面试之道')
  }
}
