import { dateFormat, time2Timestamp } from '@/utils/utils'
import { report } from '@/utils/cloud'
import { PAGE_SIZE } from '@/utils/constant'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
dayjs.extend(minMax)

export interface DotItem {
  _id?: string
  event_id?: string
  describe?: string
  imageList?: string[]
  date: string
  time: string
  score?: number
  position?: {
    point: {
      longitude: number
      latitude: number
    }
    address: string
    name: string
  }
  status?: 1 | 0
  dotTimestamp: number
}

interface TotalDots {
  date: string
  totalDots: number
}

function getDatesByRange(openTime: string, closeTime: string) {
  const startOfRange = dayjs.min(dayjs(openTime), dayjs(closeTime))
  const endOfRange = dayjs.max(dayjs(openTime), dayjs(closeTime))
  const ranges: string[] = []

  let currentDate = dayjs(startOfRange)

  while (currentDate.isSame(startOfRange) || currentDate.isBefore(endOfRange) || currentDate.isSame(endOfRange)) {
    ranges.push(currentDate.format('YYYY-MM-DD'))
    currentDate = currentDate.add(1, 'day')
  }

  return ranges
}

function formatDotData(data: TotalDots[], dates: string[] = []) {
  const dbData = data.reduce((prev: any, current) => {
    prev[current['date']] = current['totalDots']
    return prev
  }, {})
  return dates.reduce((prev: any, key) => {
    prev[key] = dbData[key] || 0
    return prev
  }, {})
}

export default {
  addDotQuick(eventId: string) {
    const now = new Date()
    const time = dateFormat('HH:mm', now)
    const date = dateFormat('YYYY-MM-DD', now)

    // MOCK
    // for (const date of getDatesByRange('2020-11-01', '2021-02-27')) {
    //   this.addDot({
    //     event_id: eventId,
    //     time,
    //     date,
    //     dotTimestamp: time2Timestamp(date, time),
    //   })
    // }

    return this.addDot({
      event_id: eventId,
      time,
      date,
      dotTimestamp: time2Timestamp(date, time),
    })
  },
  async addDot(item: DotItem) {
    try {
      const db = getApp<App>().globalData.db
      const dotRes = await db
        .action('update-dot')
        .collection('dots')
        .add(item)
      uni.$emit('dot', { date: item.date, backstage: true })
      uni.$emit('onMineRefresh')

      return dotRes
    } catch (error) {
      report(error)
      throw report
    }
  },

  async deleteDot(dotId: string): Promise<{ result: { updated: number } }> {
    const db = getApp<App>().globalData.db
    try {
      const res = await db
        .action('update-dot')
        .collection('dots')
        .where(`status == 1 && user_id==$env.uid && _id=="${dotId}"`)
        .update({
          status: 0,
        })

      uni.$emit('onMineRefresh')

      return res
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },

  /**
   * 根据id更新打点数据
   * @param item 待更新的数据
   * @param dotId dotId
   */
  async updateDot(item: Partiall<DotItem>, dotId: string) {
    try {
      const db = getApp<App>().globalData.db
      console.log('updateDot::', item)
      const res = await db
        .action('update-dot')
        .collection('dots')
        .where(`user_id==$env.uid && _id=="${dotId}"`)
        .update(item)
      uni.$emit('onMineRefresh')
      return res
    } catch (error) {
      report(error)
      throw report
    }
  },

  /**
   * 根据日期查询打点数据
   * @param date 日期
   * @param page 页码
   */
  async getDotListByDate(date: string, page: number) {
    const db = getApp<App>().globalData.db
    const size = PAGE_SIZE
    try {
      // 多表嵌套联表查询
      const {
        result: { data = [], count },
      } = await db
        .collection('dots,events,icon_images,icon_colors')
        .where(`event_id.status==1 && status==1 && user_id==$env.uid && date == "${date}"`)
        // 主表：_id,time 事件表：event_id{eventName,iconSrc{src},iconColor{color}}
        .field(
          '_id,date,time,describe,imageList,score,dotTimestamp,position,event_id{_id,status,eventName,iconSrc{src},iconColor{color},openCalc}',
        )
        .orderBy('dotTimestamp')
        .skip(size * (page - 1))
        .limit(size)
        .get({
          getCount: true,
        })

      return {
        data,
        count,
        size,
      }
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },

  /**
   * 根据开始日期和结束日期获取数据
   * ('2020-01-10', '2021-01-31')
   * @param startTime 开始日期
   * @param endTime 结束日期
   * [{date: "2021-01-31", totalDots: 4}, {date: "2021-01-30", totalDots: 12}]
   */
  async getCountByDate(startTime: string, endTime: string) {
    const db = getApp<App>().globalData.db
    try {
      const {
        result: { data = [] },
      } = await db
        .collection('dots,events')
        .where(
          `event_id.status==1 && status==1 && user_id==$env.uid && dotTimestamp >= ${dayjs(
            startTime,
          ).valueOf()} && dotTimestamp <= ${dayjs(endTime)
            .add(1, 'day')
            .valueOf()}`,
        )
        .field('date,dotTimestamp,status,event_id{_id,status}')
        .groupBy('date')
        .groupField('count(*) as totalDots')
        .orderBy('date desc')
        .get()

      const dates = getDatesByRange(startTime, endTime)
      return formatDotData(data, dates)
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },

  /**
   * 根据日期字符串数组获取数据
   * ['2021-01-23', '2021-01-31', '2021-01-24', '2021-01-26', '2021-01-25']
   * @param dates 日期字符串数组
   */
  async getCountByDates(dates: string[] = []) {
    const db = getApp<App>().globalData.db

    try {
      const {
        result: { data = [] },
      } = await db
        .collection('dots')
        .where(`status==1 && user_id==$env.uid && date in ["${dates.join('","')}"]`)
        .groupBy('date')
        .groupField('count(*) as totalDots')
        .orderBy('date desc')
        .get()

      return formatDotData(data, dates)
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },

  /**
   * 根据事件id和日期范围获取数据
   * @param eventId 事件ID
   * @param startTime 开始日期
   * @param endTime 结束日期
   */
  async getDotListByEventIdAndDateRange(eventId: string, startTime: string, endTime: string) {
    const db = getApp<App>().globalData.db
    try {
      const {
        result: { data = [] },
      } = await db
        .collection('dots')
        .where(
          `status==1 && user_id==$env.uid && dotTimestamp >= ${dayjs(startTime).valueOf()} && dotTimestamp <= ${dayjs(
            endTime,
          )
            .add(1, 'day')
            .valueOf()} && event_id == "${eventId}"`,
        )
        .orderBy('dotTimestamp desc')
        .get()

      const dates = getDatesByRange(startTime, endTime)
      console.log(data)
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },

  async getDotList(eventId: string, page: number) {
    const size = PAGE_SIZE
    const db = getApp<App>().globalData.db

    try {
      const {
        result: { data = [], count },
      } = await db
        .collection('dots')
        .where(`status==1 && user_id==$env.uid && event_id=='${eventId}'`)
        .orderBy('dotTimestamp desc, create_time desc')
        .field({
          user_id: false,
        })
        .skip(size * (page - 1))
        .limit(size)
        .get({
          getCount: true,
        })

      return {
        data,
        count,
        size,
      }
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },

  async getTotalScoreByEventId(eventId: string) {
    const db = getApp<App>().globalData.db
    const $ = getApp<App>().globalData.db.command.aggregate

    let totalScore = 0
    try {
      const { result } = await db
        .collection('dots')
        .aggregate()
        .match(`status==1 && user_id==$env.uid && event_id == "${eventId}"`)
        .group({
          _id: '$event_id',
          totalScore: $.sum('$score'),
        })
        .end()

      totalScore = result.data[0].totalScore
    } catch (error) {
      console.log(error)
    }

    return totalScore
  },

  async getSignDays() {
    const db = getApp<App>().globalData.db

    let signDays = 0
    try {
      const {
        result: { count },
      } = await db
        .collection('dots,events')
        .where(`event_id.status==1 && status==1 && user_id==$env.uid`)
        .field('date,status,event_id{_id,status}')
        .groupBy('date')
        // 前端只需要条数，不需要数据 所以限制返回条数
        .limit(1)
        .get({
          getCount: true,
        })

      signDays = count
    } catch (error) {
      console.log(error)
    }

    return signDays
  },

  async getSignTimes() {
    const db = getApp<App>().globalData.db

    let times = 0
    try {
      const {
        result: { count },
      } = await db
        .collection('dots,events')
        .where(`event_id.status==1 && status==1 && user_id==$env.uid`)
        .field('status,event_id{_id,status}')
        // 前端只需要条数，不需要数据 所以限制返回条数
        .limit(1)
        .get({
          getCount: true,
        })

      times = count
    } catch (error) {
      console.log(error)
    }

    return times
  },
}
