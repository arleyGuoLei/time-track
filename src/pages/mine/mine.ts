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
    },
  ]
  onLoad() {
    ;(this as any).$loading('getInfo', this.getInfo.bind(this))
  }
  getInfo() {
    console.log('getUserInfo')
  }
}
