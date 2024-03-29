import { report } from '@/utils/cloud'

export interface Tag {
  name: string
  index: number
  eventNumber: number
}

export interface ListItem extends Tag {
  _id: string
}

export default {
  async getList(): Promise<ListItem[]> {
    const db = getApp<App>().globalData.db
    try {
      const {
        result: { data = [] },
      } = await db
        .collection('tags')
        .field('index,name,_id,eventNumber')
        .where('status==1 && user_id==$env.uid')
        .orderBy('index asc')
        .get()

      return data
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
  async addTag(item: Tag) {
    const db = getApp<App>().globalData.db
    return db.collection('tags').add(item)
  },
  async deleteTag(_id: string) {
    const db = getApp<App>().globalData.db
    try {
      return await db
        .action('delete-event-tag')
        .collection('tags')
        .where({
          _id,
        })
        .update({
          status: 0,
        })
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
  async updateTag(item: ListItem) {
    const db = getApp<App>().globalData.db
    const targetItem = {
      name: item.name,
      index: item.index,
      eventNumber: item.eventNumber,
    }
    try {
      return await db
        .collection('tags')
        .doc(item._id)
        .update(targetItem)
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
}
