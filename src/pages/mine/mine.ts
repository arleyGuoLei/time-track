import { dotsModel } from '@/models'
import { authSetting, showTip } from '@/utils/utils'
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { onShareAppMessageMixin } from '@/plugins/shareAppMessage.mixin'

const DEFAULT_NICKNAME = '小日常'
const DEFAULT_AVATARURL = ''

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
    // #ifdef MP-QQ || MP-WEIXIN
    {
      iconName: 'advice',
      title: '意见反馈',
      openType: 'feedback',
    },
    // #endif
    // #ifdef MP-QQ
    {
      iconName: 'qqGroup',
      title: '添加QQ群',
      openType: 'openGroupProfile',
      groupId: '153066693',
    },
    // #endif
    // #ifdef MP-WEIXIN
    {
      iconName: 'about',
      title: '关于我们',
      method: 'aboutUS',
    },
    // #endif
  ]

  private signDays = 0
  private signTimes = 0

  private nickName = ''
  private avatarUrl = ''

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

  onShow() {
    // #ifdef MP-TOUTIAO
    this.getUserInfo()
    // #endif
  }

  async getUserInfo() {
    if (this.nickName !== DEFAULT_NICKNAME && this.nickName !== '') {
      return
    }
    try {
      await authSetting('scope.userInfo', '用户授权失败，将为你打开授权设置', '打开', '请授权获取用户基本信息')
      const {
        userInfo: { nickName, avatarUrl },
      } = await new Promise((success, fail) =>
        uni.getUserInfo({
          success,
          fail,
        }),
      )
      this.nickName = nickName
      this.avatarUrl = avatarUrl
    } catch (error) {
      console.log(error)
      this.nickName = DEFAULT_NICKNAME
      this.avatarUrl = DEFAULT_AVATARURL
    }
  }
}
