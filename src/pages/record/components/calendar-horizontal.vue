<template>
  <view>
    <view class="calendar">
      <view class="calendar-horizontal" v-show="week.length !== 0">
        <view class="oneday" @click="onDateClick(item.format)" v-for="item in week" :key="item.format">
          <text class="oneday-title">{{ item.title }}</text>
          <text class="oneday-date" :class="item.format === selectDate ? 'select-date' : ''">{{ item.date }}</text>
          <text class="oneday-dot">{{ item.number }}</text>
        </view>
        <view class="pull-down" @click="onOpenCalendar">
          <img class="pull-down__icon" src="@/static/pulldown.png" />
        </view>
      </view>

      <cl-calendar @change="onChangeCalendar" ref="clCalendar" v-model="selectDate" :customList="timesList" />
    </view>
    <view class="hidden-block"></view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import dayjs from 'dayjs'
import toObject from 'dayjs/plugin/toObject'
import { dotsModel } from '@/models'
dayjs.extend(toObject)

interface DayObject {
  years: number
  months: number
  date: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
  format: string
  title: string
  number: number
}

interface WeekData {
  selectDate: string
  week: DayObject[]
  dots: {
    [index: string]: number
  }
}

@Component
export default class extends Vue {
  /** 周数据 */
  private week: DayObject[] = []
  private selectDate = ''
  private timesList: { date: string; remark: number | string; color?: string }[] = []

  async initWeekTime(date = Date(), backstage = false, updateList = true) {
    const now = dayjs(date)
    const weekDotData: WeekData = {
      selectDate: now.format('YYYY-MM-DD'),
      week: [],
      dots: {},
    }
    const weekTitle = ['日', '一', '二', '三', '四', '五', '六']
    for (let weekday = 0; weekday <= 6; weekday++) {
      weekDotData.week.push({
        ...now.day(weekday).toObject(),
        format: now.day(weekday).format('YYYY-MM-DD'),
        title: weekTitle[weekday],
        number: 0,
      })
    }

    // 请求列表数据
    updateList && this.$emit('date-change', weekDotData.selectDate, backstage)

    weekDotData.dots = await dotsModel.getCountByDate(
      weekDotData.week[0].format,
      weekDotData.week[weekDotData.week.length - 1].format,
    )

    this.selectDate = weekDotData.selectDate

    // 删除weekDots 兼容百度小程序不支持 obj[2020-10-01]的语法，会变成 obj.2020-10-01 所以报错
    this.week = weekDotData.week.map(day => {
      return {
        ...day,
        number: weekDotData.dots[day.format],
      }
    })
    console.log('this.week::', this.week)

    this.getCalendarTimesList(date)
  }

  mounted() {
    ;(this as any).$loading(
      'dotsModel_getCountByDate',
      this.initWeekTime.bind(this),
      true,
      '加载中',
      getApp<App>().globalData.recordDate || Date(),
    )
    uni.$on('dot', this.onDot)
    uni.$on('onCalendarShow', this.onCalendarShow)

    getApp<App>().globalData.recordDate = undefined
  }

  onCalendarShow(date: string) {
    ;(this as any).$loading('dotsModel_getCountByDate', this.initWeekTime.bind(this), true, '加载中', date)
  }

  destroyed() {
    uni.$off('dot', this.onDot)
    uni.$off('onCalendarShow', this.onCalendarShow)
    const app = getApp<App>()
    app.globalData.recordDate = undefined
  }

  onOpenCalendar() {
    ;(this.$refs['clCalendar'] as any).open()
  }

  onChangeCalendar(data: any) {
    const { date } = data
    this.$emit('date-change', date)
    const { week } = this
    if (dayjs(date).isAfter(dayjs(week[week.length - 1].format)) || dayjs(date).isBefore(dayjs(week[0].format))) {
      console.log('选择的日期不在横版日历范围 刷新数据')
      ;(this as any).$loading(
        'dotsModel_getCountByDate',
        this.initWeekTime.bind(this),
        true,
        '加载中',
        date,
        false,
        false,
      )
    }
  }

  onDateClick(date: string) {
    if (this.selectDate === date) {
      return
    }
    this.selectDate = date
    this.$emit('date-change', date)
  }

  /**
   * 监听打点
   */
  onDot({ date, backstage = true }: { date: string; backstage: boolean }) {
    const { week } = this
    if (
      dayjs(date).isAfter(dayjs(week[0].format).subtract(1, 'day')) &&
      dayjs(date).isBefore(dayjs(week[week.length - 1].format).add(1, 'day'))
    ) {
      console.log('打点的日期在横版日历范围 刷新数据')
      this.initWeekTime(date, backstage, true)
    }
  }

  /**
   * 日历组件自定义列表
   * https://docs.cool-js.com/uni/components/advanced/calendar.html
   */
  async getCalendarTimesList(date: string) {
    const monthStartDay = dayjs(date)
      .set('date', 1)
      .format('YYYY-MM-DD')

    const monthEndDay = dayjs(date)
      .set(
        'date',
        +dayjs(date)
          .endOf('month')
          .format('D'),
      )
      .format('YYYY-MM-DD')

    const dotList = await dotsModel.getCountByDate(monthStartDay, monthEndDay)
    this.timesList = Object.keys(dotList).map(date => {
      return {
        date: date,
        remark: dotList[date] || '0',
        color: dotList[date] ? '#EC735D' : '',
      }
    })

    console.log('更新日历打点次数::', dotList)
  }

  deleteDot(date: string) {
    this.week = this.week.map(item => {
      if (item.format !== date) {
        return item
      }
      return {
        ...item,
        number: item['number'] ? item['number'] - 1 : 0,
      }
    })

    this.timesList = this.timesList.map(item => {
      if (item.date !== date) {
        return item
      }
      const remark = +item.remark - 1
      return {
        date,
        remark: remark > 0 ? remark : '0',
        color: remark > 0 ? item.color : '',
      }
    })
  }
}
</script>
<style scoped>
.calendar-horizontal {
  width: 718rpx;
  height: 256rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  padding-top: 28rpx;
  position: fixed;
  top: 28rpx;
  left: 16rpx;
  z-index: 2;
  box-shadow: 0 6rpx 20rpx 0 rgba(0, 0, 0, 0.1);
}

.hidden-block {
  position: fixed;
  width: 750rpx;
  height: 268rpx;
  top: 0;
  left: 0;
  background-color: #f5f5f5;
  z-index: 1;
}

.oneday {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 154rpx;
}

.oneday-title {
  font-size: 34rpx;
  font-weight: 400;
  color: #818181;
}

.oneday-date {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.select-date {
  background-color: #93c0f2;
  color: #ffffff;
}

.oneday-dot {
  font-size: 24rpx;
  font-weight: 500;
  color: #818181;
}

.pull-down {
  position: absolute;
  bottom: 0;
  margin-left: auto;
  margin-right: auto;
  height: 64rpx;
  width: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pull-down__icon {
  height: 32rpx;
  width: 32rpx;
}
</style>
