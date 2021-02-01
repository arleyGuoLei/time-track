import { Component, Mixins } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cList from '@/components/cList.vue'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'
import uCharts from '@/utils/uCharts.js'
import eventsModel from '@/models/eventsModel'
import docsModel, { DotItem } from '@/models/dotsModel'
import { PAGE_SIZE } from '@/utils/constant'

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
  private signNumber = 999
  private score = 0
  private openCalc = false // 是否开启量化值
  private tags = []

  private docList = []
  private historyList: HistoryItem = {}
  private charts = null

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
    // DEMO
    // this.initLineChart()
  }

  async initData() {
    // TODO: 请求不要互相阻塞
    const { eventName, eventId } = this.$Route.query

    const baseData = await eventsModel.getDetail(eventId)
    ;(this as any).$loading('getHistoryList', this.getHistoryList.bind(this), true, '加载中', eventId)

    uni.setNavigationBarTitle({ title: eventName })
    this.eventName = eventName
    this.eventId = eventId
    this.signNumber = baseData[0].signNumber
    this.openCalc = baseData[0].openCalc
    this.tags = baseData[0].tags
  }

  initLineChart() {
    new uCharts({
      $this: this,
      canvasId: 'charts',
      type: 'line',
      fontSize: 2,
      legend: true,
      dataLabel: false,
      dataPointShape: true,
      background: '#FFFFFF',
      pixelRatio: 2,
      categories: ['2012', '2013', '2014', '2015'],
      series: [
        {
          name: '成交量A',
          data: [35, 20, 25, 37, 4, 20],
          color: '#000000',
        },
      ],
      animation: true,
      enableScroll: true,
      xAxis: {
        type: 'grid',
        gridColor: '#CCCCCC',
        gridType: 'dash',
        dashLength: 8,
        itemCount: 4,
        scrollShow: true,
      },
      yAxis: {
        gridType: 'dash',
        gridColor: '#CCCCCC',
        dashLength: 8,
        splitNumber: 5,
        min: 10,
        max: 180,
        format: (val: any) => {
          return val.toFixed(0)
        },
      },
      width: uni.upx2px(686),
      height: uni.upx2px(380),
      extra: {
        line: {
          type: 'straight',
        },
      },
    })
  }

  async getHistoryList(eventId: string, page = 1) {
    const { data, count, size } = await docsModel.getDotList(eventId, page)
    if (page === 1) {
      this.docList = data
    } else {
      this.docList = this.docList.concat(data)
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
