import { Component, Mixins } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cList from '@/components/cList.vue'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'
import { DotItem } from '@/models/dotsModel'
import { PAGE_SIZE } from '@/utils/constant'
import { dotsModel, eventsModel } from '@/models'

interface HistoryItem {
  [year: string]: DotItem[]
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

  private dotList = []
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

    this.historyListFormat(data)
  }

  historyListFormat(list: DotItem[]) {
    const { historyList } = this
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

  openMap(coordinates: number[], name: string) {
    uni.openLocation({
      longitude: coordinates[0],
      latitude: coordinates[1],
      name: name,
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
}
