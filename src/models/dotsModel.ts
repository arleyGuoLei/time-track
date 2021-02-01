import { dateFormat, time2Timestamp } from '@/utils/utils'
import { report } from '@/utils/cloud'
import { PAGE_SIZE } from '@/utils/constant'

export interface DotItem {
  event_id: string
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

export default {
  addDotQuick(eventId: string) {
    const now = new Date()
    const time = dateFormat('HH:MM', now)
    const date = dateFormat('YYYY-mm-dd', now)
    return this.addDot({
      event_id: eventId,
      time,
      date,
      dotTimestamp: time2Timestamp(date, time),
    })
  },
  addDot(item: DotItem) {
    try {
      const db = getApp<App>().globalData.db
      return db
        .action('update-dot')
        .collection('dots')
        .add(item)
    } catch (error) {
      report(error)
      throw report
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
        .where(`event_id=='${eventId}'`)
        .orderBy('dotTimestamp desc')
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
}
