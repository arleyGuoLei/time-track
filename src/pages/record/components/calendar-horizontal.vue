<template>
  <view class="calendar">
    <view class="calendar-horizontal">
      <view class="oneday" @click="onDateClick(item.format)" v-for="(item, index) in week" :key="index">
        <text class="oneday-title">{{ item.title }}</text>
        <text class="oneday-date" :class="item.format === selectDate ? 'select-date' : ''">{{ item.date }}</text>
        <text class="oneday-dot">{{ weekDots[item.format] }}</text>
      </view>
      <view class="pull-down" @click="onOpenCalendar">
        <img class="pull-down__icon" src="@/static/pulldown.png" />
      </view>
    </view>

    <cl-calendar @change="onChangeCalendar" ref="clCalendar" v-model="selectDate" />
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
  private weekDots = {}

  async initWeekTime(date = Date(), backstage = false) {
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
      })
    }

    weekDotData.dots = await dotsModel.getCountByDate(
      weekDotData.week[0].format,
      weekDotData.week[weekDotData.week.length - 1].format,
    )
    this.week = weekDotData.week
    this.selectDate = weekDotData.selectDate
    this.weekDots = weekDotData.dots

    this.$emit('date-change', weekDotData.selectDate, backstage)
  }

  mounted() {
    // TODO: 日历面板需要显示每一天有多少次打点数据
    ;(this as any).$loading('dotsModel_getCountByDate', this.initWeekTime.bind(this), true)
    uni.$on('dot', this.onDot)
  }

  destroyed() {
    uni.$off('dot', this.onDot)
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
      ;(this as any).$loading('dotsModel_getCountByDate', this.initWeekTime.bind(this), true, '加载中', date)
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
  onDot(date: string) {
    const { week } = this
    if (
      dayjs(date).isAfter(dayjs(week[0].format).subtract(1, 'day')) &&
      dayjs(date).isBefore(dayjs(week[week.length - 1].format).add(1, 'day'))
    ) {
      console.log('打点的日期在横版日历范围 刷新数据')
      this.initWeekTime(date, true)
    }
  }
}
</script>
<style scoped>
.calendar-horizontal {
  width: 718rpx;
  height: 256rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding-top: 28rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  position: relative;
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
