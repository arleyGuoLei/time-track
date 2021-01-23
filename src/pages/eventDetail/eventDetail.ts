import { Component, Mixins } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cList from '@/components/cList.vue'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'
import uCharts from '@/utils/uCharts.js'

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

  private number = 999
  private count = 999

  private historyList = [
    {
      year: '2021',
      data: [
        {
          time: {
            year: '2021',
            day: '16',
            month: '1',
            hour: '16:40',
          },
          count: 999,
          content: {
            text:
              '我是很长的备注信息，我是备注信息，我是很长的备注信息，我是备注信息，我是很长的备注信息，我是备注信息，我是很长的备注信息，我是备注信息，我是很长的备注信息，我是备注信息，我是很长的备注信息，我是备注信息，我是很长的备注信息。',
            imgList: ['http://img.i7xy.cn/20210113232214.png', 'http://img.i7xy.cn/20210113232214.png'],
            location: '北京市昌平区北京市昌平区北京市昌平区北京市昌平区北京市昌平区',
          },
        },
      ],
    },
  ]
  private charts = null

  onLoad() {
    this.initData()

    // DEMO
    this.initLineChart()
  }

  initData() {
    const { eventName, eventId } = this.$Route.query
    uni.setNavigationBarTitle({
      title: eventName,
    })
    this.eventName = eventName
    this.eventId = eventId
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
}
