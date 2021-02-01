<template>
  <view class="calendar">
    <view class="calendar-horizontal">
      <view class="oneday" v-for="(item, index) in week" :key="index">
        <text class="oneday-title">{{ item.title }}</text>
        <text
          class="oneday-date"
          :class="item.format === selectDate ? 'select-date' : ''"
          @click="onDateClick(item.format)"
          >{{ item.date }}</text
        >
        <text class="oneday-dot">{{ weekDots[item.format] }}</text>
      </view>
      <img @click="onOpenCalendar" class="pull-down" src="@/static/pulldown.png" />
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

  async initWeekTime(date = Date()) {
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

    this.$emit('date-change', weekDotData.selectDate)
  }
  initData() {
    // TODO: 日历面板需要显示每一天有多少次打点数据
    ;(this as any).$loading('dotsModel_getCountByDate', this.initWeekTime.bind(this), true)
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
    this.selectDate = date
    this.$emit('date-change', date)
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
  height: 32rpx;
  width: 32rpx;
  bottom: 12rpx;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}
</style>
