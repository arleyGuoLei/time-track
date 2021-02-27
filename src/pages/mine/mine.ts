import { dotsModel } from '@/models'
import { showTip } from '@/utils/utils'
import { Vue, Component } from 'vue-property-decorator'

declare module 'vue/types/vue' {
  interface Vue {
    CustomBar: number
    StatusBar: number
  }
}
@Component
export default class extends Vue {
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
  ]

  private signDays = 0
  private signTimes = 0

  onLoad() {
    ;(this as any).$loading('getInfo', this.getInfo.bind(this))

    uni.$on('dot', this.getInfo)
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
    showTip('cool!!!')
  }
}
