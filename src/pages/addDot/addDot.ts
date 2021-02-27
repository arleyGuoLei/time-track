import { DotItem } from '@/models/dotsModel'
import { dotsModel } from '@/models'
import { Component, Vue } from 'vue-property-decorator'
import cUpload from './components/upload.vue'
import { showTip, authSetting, dateFormat, time2Timestamp } from '@/utils/utils'

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
  if (item.event_id!.length === 0) {
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
  private dotId = '' // 更新的打点id
  private describe = ''
  private date = ''
  private time = ''
  private endDate = ''
  private score = ''
  // TODO: UPDATE区分来源 根据来源处理不同的回调
  // 更新或新增 add, update
  private pageType: 'add' | 'update' = 'add'
  private openCalc = false
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

    this.time = dateFormat('HH:mm', now)
    this.date = dateFormat('YYYY-MM-DD', now)
    uni.setNavigationBarTitle({
      title: this.$Route.query.eventName,
    })
    this.event_id = this.$Route.query.eventId
    this.openCalc = this.$Route.query.openCalc === 'true' || this.$Route.query.openCalc === true
  }

  initUpdateData() {
    const { dotData } = this.$Route.query
    uni.setNavigationBarTitle({
      title: dotData.eventName,
    })
    this.pageType = 'update'
    this.event_id = dotData.eventId
    this.describe = dotData.describe
    this.date = dotData.date
    this.time = dotData.time
    this.score = dotData.score
    this.imageList = dotData.imageList || []
    this.openCalc = dotData.openCalc === 'true' || dotData.openCalc === true
    this.dotId = dotData.id
    this.position = {
      point: {
        longitude: dotData.position?.point.coordinates[0] || 0,
        latitude: dotData.position?.point.coordinates[1] || 0,
      },
      address: dotData.position?.address || '',
      name: dotData.position?.name || (dotData.position?.address ? '' : '选择位置'),
    }
  }

  onLoad() {
    console.log('onLoad')

    this.endDate = dateFormat('YYYY-MM-DD', new Date())
    if (this.$Route.query.type === 'update') {
      this.initUpdateData()
    } else {
      this.initAddData()
    }
  }
  async onSave() {
    const { describe, date, time, score, position, imageList, event_id } = this
    const dotTimestamp = time2Timestamp(date, time)
    const item: DotItem = {
      describe,
      date,
      time,
      score: +score,
      imageList,
      event_id,
      dotTimestamp,
    }
    position.name !== '选择位置' && (item.position = position)
    const v = validateForm(item)
    if (v.status) {
      if (this.pageType === 'add') {
        const {
          result: { id },
        } = await (this as any).$loading('addEvent', dotsModel.addDot.bind(this), false, '打点中', item)
        // 首页列表
        uni.$emit('onListUpdate', {
          type: 'updateItem',
          id: event_id,
          data: [
            {
              key: 'lastTime',
              value: dotTimestamp,
              updateType: 'replace',
            },
            {
              key: 'signNumber',
              value: 1,
              updateType: 'inc',
            },
          ],
        })
        await showTip('打点成功', 800)
        this.$Router.back(1)
        console.log('打点的dotId:', id)
      } else {
        const event_id = item.event_id
        delete item.event_id
        await (this as any).$loading('addEvent', dotsModel.updateDot.bind(this), false, '更新中', item, this.dotId)
        uni.$emit('onDotDataUpdate', {
          ...item,
          id: this.dotId,
          from: this.$Route.query.from,
          event_id,
        })

        // 更新日志页打点详情
        uni.$emit('dot', { date: this.date, backstage: true })

        await showTip('更新成功', 800)
        this.$Router.back(1)
      }
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
