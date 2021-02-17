import { Component, Mixins, Watch } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cList from '@/components/cList.vue'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'
import { PAGE_SIZE } from '@/utils/constant'
import { dotsModel, eventsModel } from '@/models'
import { showTip } from '@/utils/utils'
import { DotItem as DotModelItem } from '@/models/dotsModel'
import { Position } from '@/pages/record/record'

interface HistoryItem {
  [year: string]: DotItem[]
}

interface UpdateItem extends DotModelItem {
  from: string
  id: string
}

interface DotItem {
  _id?: string
  event_id?: string
  describe?: string
  imageList?: string[]
  date: string
  time: string
  score?: number
  status?: 1 | 0
  dotTimestamp: number
  position?: Position
}

@Component({
  components: {
    cHeader,
    cList,
    cTitle,
    cInput,
  },
})
export default class extends Mixins(scrollTopMixin) {
  private eventId = ''
  private eventName = ''
  private signNumber = ''
  private score = 0
  private openCalc = false // 是否开启量化值
  private tags = []
  private iconColor = []
  private iconSrc = []

  private dotList: DotItem[] = []
  private historyList: HistoryItem = {}

  // 为了优化onload生命周期还没执行，页面就渲染了一些元素的问题，因顶部计算导致闪硕
  private load = false
  private isLoading = false

  /* ----分页数据---- */
  private onBottom = false
  private page = 1
  private eventTotal = 0
  private pageSize = PAGE_SIZE
  /* ############## */

  onLoad() {
    ;(this as any).$loading('initData', this.initData.bind(this))
  }

  async initData() {
    const { eventId } = this.$Route.query
    this.eventId = eventId

    const [, baseData] = await Promise.all([this.getHistoryList(eventId), eventsModel.getDetail(eventId)])
    uni.setNavigationBarTitle({ title: baseData[0].eventName })
    this.eventName = baseData[0].eventName
    this.signNumber = baseData[0].signNumber
    this.openCalc = baseData[0].openCalc
    this.tags = baseData[0].tags
    this.iconColor = baseData[0].iconColor[0]
    this.iconSrc = baseData[0].iconSrc[0]
  }

  async getHistoryList(eventId: string, page = 1) {
    const { data, count, size } = await dotsModel.getDotList(eventId, page)
    if (page === 1) {
      this.dotList = data
    } else {
      this.dotList = this.dotList.concat(data)
    }

    this.eventTotal = count
    this.pageSize = size
    this.page = page + 1
    this.isLoading = false
  }

  @Watch('dotList')
  historyListFormat(list: DotItem[]) {
    console.log('dotList watch::', list)
    const historyList: HistoryItem = {}
    list.forEach((item: DotItem) => {
      const [year] = item.date.split('-')
      if (`_${year}` in historyList) {
        historyList[`_${year}`].push(item)
      } else {
        historyList[`_${year}`] = [item]
      }
    })
    this.historyList = historyList
  }

  onPreviewImg(current: string, imageList: string[]) {
    uni.previewImage({
      current,
      urls: imageList,
    })
  }

  openMap(coordinates: number[], name: string, address: string) {
    uni.openLocation({
      longitude: coordinates[0],
      latitude: coordinates[1],
      name,
      address,
    })
  }

  onReachBottom() {
    const { page, eventTotal, pageSize: size, onBottom, eventId } = this
    const pageSize = Math.ceil(eventTotal / size)
    if (!onBottom && page <= pageSize) {
      ;(this as any).$loading('getHistoryList', this.getHistoryList.bind(this), false, '加载中', eventId, page)
    } else {
      this.onBottom = true
    }
  }

  onTapHome(tagId: string) {
    uni.$emit('onTagSelect', tagId)
    this.$Router.pushTab({ path: '/pages/home/home' })
  }

  onSelectAction() {
    const { eventId, eventName, tags, openCalc, iconColor, iconSrc } = this
    uni.showActionSheet({
      itemList: ['编辑', '删除'],
      success: res => {
        if (res.tapIndex === 0) {
          // 编辑事件
          console.log('编辑')
          this.$Router.push({
            path: '/pages/addEvent/addEvent',
            query: { type: 'update', eventId, eventName, tags, openCalc, iconColor, iconSrc },
          })
        } else if (res.tapIndex === 1) {
          // 删除事件
          console.log('删除')
          uni.showModal({
            title: '提示',
            content: '是否确认删除该事件',
            success: async res => {
              if (res.confirm) {
                await (this as any).$loading(
                  'deleteEvent',
                  eventsModel.deleteEvent.bind(this),
                  false,
                  '删除中',
                  eventId,
                )
                uni.$emit('onListUpdate', {
                  type: 'updateItem',
                  id: eventId,
                  data: [
                    {
                      key: 'status',
                      value: 0,
                      updateType: 'replace',
                    },
                  ],
                })
                showTip('删除成功')
                this.$Router.back(1)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            },
          })
        }
      },
      fail: res => {
        console.log(res.errMsg)
      },
    })
  }

  goToRecord(date: string) {
    const app = getApp<App>()
    app.globalData.recordDate = date
    uni.$emit('onCalendarShow', date)
    this.$Router.pushTab({ path: '/pages/record/record' })
  }

  onTapDotDescribe(item: DotItem) {
    console.log('onTapDotDescribe::', item)
    uni.showActionSheet({
      itemList: ['编辑', '删除'],
      success: res => {
        if (res.tapIndex === 0) {
          // 编辑事件
          const dotData = {
            id: item._id,
            score: item.score,
            date: item.date,
            eventName: this.eventName,
            eventId: item.event_id,
            time: item.time,
            dotTimestamp: item.dotTimestamp,
            describe: item.describe,
            imageList: item.imageList,
            position: item.position,
          }

          const from = 'eventDetail'

          uni.$once('onDotDataUpdate', (data: UpdateItem) => {
            console.log('onDotDataUpdate::', data)
            if (data.from === from && this.eventId === data.event_id) {
              this.dotList = this.dotList.map(dot => {
                if (dot._id !== data.id) {
                  return dot
                } else {
                  return {
                    ...data,
                    _id: data.id,
                    position: data.position && {
                      name: data.position.name,
                      address: data.position.address,
                      point: {
                        type: 'Point',
                        coordinates: [data.position.point.longitude, data.position.point.latitude],
                      },
                    },
                  }
                }
              })
            } else {
              if (data.from === from) {
                // 事件id变化
                showTip('更新异常')
              }
            }
          })

          this.$Router.push({
            path: '/pages/addDot/addDot',
            // from区分来源
            query: { type: 'update', dotData, from },
          })
        } else if (res.tapIndex === 1) {
          // 删除事件
          console.log('删除')
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      },
    })
  }
}
