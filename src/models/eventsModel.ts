import { report } from '@/utils/cloud'

interface Tag {
  name: string
}
export interface ListItem {
  eventName: string
  iconSrc: string // id
  iconColor: string // id
  tags: Tag[]
  openCalc: boolean
  status?: 1 | 0
}

export default {
  addEvent(item: ListItem) {
    const db = getApp<App>().globalData.db
    return db.collection('events').add(item)
  },
  async getAllEvents() {
    const db = getApp<App>().globalData.db
    try {
      const {
        result: { data = [] },
      } = await db
        .collection('events,icon_images,icon_colors,tags')
        .where('status==1 && user_id==$env.uid')
        .field('eventName,iconSrc{src},iconColor{color},tags{name}')
        .orderBy('create_time asc')
        .get()

      return data
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
}
