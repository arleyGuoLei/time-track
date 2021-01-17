import { DEFAULT_TAG_ID, PAGE_SIZE } from './../utils/constant'
import { report } from '@/utils/cloud'

export interface ListItem {
  eventName: string
  iconSrc: string // id
  iconColor: string // id
  tags: string[]
  openCalc: boolean
  status?: 1 | 0
}

export default {
  addEvent(item: ListItem) {
    const db = getApp<App>().globalData.db
    return db
      .action('save-event')
      .collection('events')
      .add(item)
  },
  async getList(tagId: string, page: number) {
    const size = PAGE_SIZE
    const db = getApp<App>().globalData.db

    try {
      const {
        result: { data = [], count },
      } = await db
        .collection('events,icon_images,icon_colors')
        .where('status==1 && user_id==$env.uid' + (tagId !== DEFAULT_TAG_ID ? ` && tags in ["${tagId}"]` : ''))
        .field('eventName,iconSrc{src},iconColor{color}')
        .orderBy('create_time asc')

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
