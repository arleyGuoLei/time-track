import { report } from '@/utils/cloud'

export interface ListItem {
  _id: string
  name: string
  index: number
}

export default {
  async getList(): Promise<ListItem[]> {
    const db = getApp<App>().globalData.db
    try {
      const {
        result: { data = [] },
      } = await db
        .collection('tags')
        .field('index,name,_id')
        .where('status==1 && user_id==$env.uid')
        .orderBy('index asc')
        .get()

      return data
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
}
