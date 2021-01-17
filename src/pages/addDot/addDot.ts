import { dateFormat } from './../../utils/utils'
import { DotItem } from '../../models/dotsModel'
import { dotsModel } from '../../models'
import { Component, Vue } from 'vue-property-decorator'
import cUpload from './components/upload.vue'
import { showTip, authSetting } from '@/utils/utils'

function validateForm(item: DotItem) {
  const fail = (msg: string) => {
    return {
      status: false,
      msg,
    }
  }
  if (item.describe?.length === 0) {
    return fail('请输入打点备注')
  }
  if (isNaN(item.score as number)) {
    return fail('量化值应为数字')
  }
  if (item.event_id.length === 0) {
    return fail('事件获取失败，请重新进入打点页面')
  }
  return {
    status: true,
    msg: '',
  }
}

@Component({
  components: {
    cUpload,
  },
})
export default class extends Vue {
  private event_id = ''
  private describe = ''
  private date = ''
  private time = ''
  private score = ''
  private position = {
    point: {
      longitude: 0,
      latitude: 0,
    },
    address: '',
    name: '选择位置',
  }
  private imageList: string[] = []

  initAddData() {
    const now = new Date()
    this.time = dateFormat('HH:MM', now)
    this.date = dateFormat('YYYY-mm-dd', now)
    uni.setNavigationBarTitle({
      title: this.$Route.query.eventName,
    })
    this.event_id = this.$Route.query.eventId
  }

  onLoad() {
    console.log('onLoad')
    if (this.$Route.query.type === 'update') {
      // TODO: 更新打点事件数据初始化 数据库查询
    } else {
      this.initAddData()
    }
  }
  async onSave() {
    const { describe, date, time, score, position, imageList, event_id } = this
    const item: DotItem = {
      describe,
      date,
      time,
      score: +score,
      imageList,
      event_id,
    }
    position.name !== '选择位置' && (item.position = position)
    const v = validateForm(item)
    if (v.status) {
      const {
        result: { id },
      } = await (this as any).$loading('addEvent', dotsModel.addDot.bind(this), false, '打点中', item)
      showTip('打点成功')
      console.log('id:', id)
    } else {
      showTip(v.msg)
    }
  }

  onDateChange(event: UniEvent) {
    this.date = event.detail.value
  }

  onTimeChange(event: UniEvent) {
    this.time = event.detail.value
  }

  async onChooseLocation() {
    await authSetting('scope.userLocation', '无位置信息获取权限，将为你打开授权设置', '打开', '请打开位置权限设置')
    uni.chooseLocation({
      success: position => {
        if (position.address || position.name) {
          const { longitude, latitude, address, name } = position
          const db = getApp<App>().globalData.db
          this.position = {
            point: new (db as any).Geo.Point(longitude, latitude),
            address,
            name,
          }
        }
      },
    })
  }

  onUploaded(list: string[]) {
    this.imageList = list
  }

  onDeleteImage(index: number) {
    this.imageList.splice(index, 1)
  }
}
