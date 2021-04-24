import { Vue, Component } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cList from '@/components/cList.vue'
import { showTip } from '@/utils/utils'
import userModel from '@/models/userModel'

// 百度小程序登录，其他小程序无需手动调起登录

@Component({
  components: {
    cHeader,
    cList,
  },
})
export default class extends Vue {
  onLogin(e: any) {
    console.log('登录信息:', e)
    if (e.detail.errCode === '10004' || e.detail.errCode === '904') {
      showTip('请登录后使用', 1200)
      return
    }

    // 立即跳转 登录get code 会不成功
    setTimeout(async () => {
      await userModel.loginMP()
      this.$Router.replaceAll({
        path: '/pages/home/home',
      })
    }, 200)
  }
}
