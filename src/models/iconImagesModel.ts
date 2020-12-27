import { report } from '@/utils/cloud'

export interface ListItem {
  src: string
  _id: string
}

export default {
  async getList(): Promise<ListItem[]> {
    const db = getApp<App>().globalData.db
    try {
      const {
        result: { data = [] },
      } = await db
        .collection('icon_images')
        .field('src,_id')
        .where({ status: 1 })
        .orderBy('use_times desc')
        .get()

      return data
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
}
