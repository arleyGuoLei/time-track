import { dateFormat, time2Timestamp } from '@/utils/utils'
import { report } from '@/utils/cloud'

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
}
