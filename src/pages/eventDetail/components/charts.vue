<template>
  <view class="charts">
    <canvas
      canvas-id="timeCharts"
      id="timeCharts"
      class="timeCharts"
      :style="{
        width: cWidth * pixelRatio + 'px',
        height: cHeight * pixelRatio + 'px',
        transform: 'scale(' + 1 / pixelRatio + ')',
      }"
    ></canvas>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import uCharts from '@/utils/uCharts.js'

const WIDTH = 686
const HEIGHT = 380
const CANVAS_ID = 'timeCharts'

@Component
export default class extends Vue {
  private cWidth = 0
  private cHeight = 0
  private pixelRatio = 1

  mounted() {
    console.log('mounted')
  }

  created() {
    this.initUI()
  }

  initUI() {
    const { pixelRatio } = uni.getSystemInfoSync()
    //#ifdef MP-ALIPAY
    this.pixelRatio = pixelRatio > 1 ? 2 : 1
    //#endif
    this.cWidth = uni.upx2px(WIDTH)
    this.cHeight = uni.upx2px(HEIGHT)

    new uCharts({
      $this: this,
      canvasId: CANVAS_ID,
      type: 'mix',
      width: this.cWidth * this.pixelRatio,
      height: this.cHeight * this.pixelRatio,
      pixelRatio: this.pixelRatio,
      fontSize: 11,
      background: '#FFFFFF',
      animation: false,

      dataLabel: false,
      dataPointShape: true,

      legend: {
        show: false, // 隐藏图例
      },

      categories: ['02-08', '02-09', '02-10', '02-11', '02-12', '02-13', '02-14'],

      series: [
        {
          name: '曲线',
          color: '#1890ff',
          style: 'curve',
          type: 'line',
          data: [0.5, 1.5, null, 4, 5, 12.5, 22.5],
        },
        {
          name: '面',
          type: 'area',
          color: '#1890ff',
          style: 'curve',
          data: [0.5, 1.5, null, 4, 5, 12.5, 22.5],
        },
        {
          name: '点',
          data: [null, 1.2, 2.5, null, 3, 7, 22],
          type: 'point',
          color: '#f04864',
        },
        {
          name: '点',
          data: [null, 1.6, 2.3, 2, null, 9, null],
          type: 'point',
          color: '#f04864',
        },
      ],

      yAxis: {
        disableGrid: false,
        gridType: 'dash',
        format: val => {
          console.log(val)
          return '00:00'
        },
        // 24小时分隔
        splitNumber: 8,
        min: 0,
        max: 24,
      },

      xAxis: {
        type: 'grid',
        gridType: 'dash',

        // 不绘制网格线
        disableGrid: true,
      },
    })
  }
}
</script>
<style scoped>
.charts {
  width: 686rpx;
  height: 380rpx;
}
.timeCharts {
  transform-origin: top left;
}
</style>
