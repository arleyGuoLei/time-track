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
    this.initLineChart()
  }

  async initData() {
    const { eventName, eventId } = this.$Route.query

    const baseData = await eventsModel.getDetail(eventId)
    this.getHistoryList(eventId)

    uni.setNavigationBarTitle({ title: eventName })
    this.eventName = eventName
    this.eventId = eventId
    this.signNumber = baseData[0].signNumber
    this.openCalc = baseData[0].openCalc
  }

  initLineChart() {
    new uCharts({
      $this: this,
      canvasId: 'charts',
      type: 'line',
      fontSize: 11,
      legend: true,
      dataLabel: false,
      dataPointShape: true,
      background: '#FFFFFF',
      pixelRatio: 2,
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [
        {
          name: '成交量A',
          data: [35, 20, 25, 37, 4, 20],
          color: '#000000',
        },
        {
          name: '成交量B',
          data: [70, 40, 65, 100, 44, 68],
        },
        {
          name: '成交量C',
          data: [100, 80, 95, 150, 112, 132],
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
          return val.toFixed(0) + '元'
        },
      },
      width: uni.upx2px(1372),
      height: uni.upx2px(760),
      extra: {
        line: {
          type: 'straight',
        },
      },
    })
  }

  async getHistoryList(eventId: string, page = 1) {
    const { data } = await docsModel.getDocList(eventId, page)
    if (page === 1) {
      this.docList = data
    } else {
      this.docList = this.docList.concat(data)
    }

    this.historyListFormat(data)
  }

  historyListFormat(list: DotItem[]) {
    const { historyList } = this
    list.forEach((item: DotItem) => {
      const [year] = item.date.split('-')
      if (year in historyList) {
        historyList[year].push(item)
      } else {
        historyList[year] = [item]
      }
    })

    this.historyList = historyList
  }

  // onReachBottom() {
  //   const { page, eventTotal, pageSize: size, onBottom } = this
  //   const pageSize = Math.ceil(eventTotal / size)
  //   if (!onBottom && page <= pageSize) {
  //     ;(this as any).$loading('getHistoryList', this.getHistoryList.bind(this), true, '加载中', page)
  //   } else {
  //     this.onBottom = true
  //   }
  // }
}
