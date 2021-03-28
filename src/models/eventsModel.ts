import { DEFAULT_TAG_ID, PAGE_SIZE } from './../utils/constant'
import { report } from '@/utils/cloud'

export interface ListItem {
  _id?: string
  eventName: string
  iconSrc: string // id
  iconColor: string // id
  tags: string[]
  openCalc: boolean
  signNumber?: number
  lastTime?: number
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
  async updateEvent(id: string, item: ListItem) {
    const db = getApp<App>().globalData.db
    try {
      return await db
        .action('save-event')
        .collection('events')
        // 修改此条件会影响action参数的获取，所以需要同步修改
        .where(`status == 1 && user_id==$env.uid && _id=="${id}"`)
        .update(item)
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
  async deleteEvent(id: string) {
    const db = getApp<App>().globalData.db
    try {
      const res = await db
        .action('save-event')
        .collection('events')
        // 修改此条件会影响action参数的获取，所以需要同步修改
        .where(`status == 1 && user_id==$env.uid && _id=="${id}"`)
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
  async getList(tagId: string, page: number) {
    const size = PAGE_SIZE
    const db = getApp<App>().globalData.db

    try {
      const {
        result: { data = [], count },
      } = await db
        .collection('events,icon_images,icon_colors')
        .where('status==1 && user_id==$env.uid' + (tagId !== DEFAULT_TAG_ID ? ` && tags in ["${tagId}"]` : ''))
        .field('eventName,create_time,iconSrc{src},iconColor{color},signNumber,lastTime,status,openCalc')
        // 打点次数字段 、 最后一次打点时间 (时间戳)
        // 打点次数 和当前时间最接近打卡习惯的事件(日期 星期) 创建时间
        .orderBy('signNumber desc, lastTime asc, create_time desc')
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
  async getDetail(eventId: string) {
    const db = getApp<App>().globalData.db
    try {
      const {
        result: { data },
      } = await db
        .collection('events,tags,icon_images,icon_colors')
        .where(`_id=='${eventId}' && user_id==$env.uid`)
        .field('eventName,signNumber,openCalc,tags{_id,name},iconSrc{_id,src},iconColor{_id,color}')
        .get()

      return data
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
}
