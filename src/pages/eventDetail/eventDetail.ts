import { Component, Vue } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cList from '@/components/cList.vue'
// import uCharts from '@/utils/uCharts'

@Component({
  components: {
    cHeader,
    cList,
    cTitle,
    cInput,
  },
})
export default class extends Vue {
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
            hour: '16 : 40',
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
    // this.drawChart()
  }

  // drawChart() {
  //   this.charts = new uCharts({
  //     $this: this,
  //     canvasId: 'charts',
  //     type: 'line',
  //     background: '#FFFFFF',
  //     xAxis: {
  //       disableGrid: true,
  //     },
  //     yAxis: {},
  //   })
  // }
}
