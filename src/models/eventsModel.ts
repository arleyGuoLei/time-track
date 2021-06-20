import { DEFAULT_TAG_ID, PAGE_SIZE, STORE_TAG_ID } from './../utils/constant'
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
  isStore?: number // 1 | 0
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
        .where(
          'status==1 && user_id==$env.uid' +
            (tagId !== DEFAULT_TAG_ID && tagId !== STORE_TAG_ID ? ` && tags in ["${tagId}"]` : '') +
            // 显示到存档的事件，在其他标签下需要可以查询到，否则标签下对应的事件数目得重新计算
            (tagId === DEFAULT_TAG_ID ? ' && isStore!=1' : '') +
            (tagId === STORE_TAG_ID ? ' && isStore==1' : ''),
        )
        .field('eventName,create_time,iconSrc{src},iconColor{color},signNumber,lastTime,status,openCalc,isStore')

        // 当前时间最接近打卡习惯的事件(日期 星期) 打点次数 和 创建时间
        .orderBy('lastTime desc, signNumber desc, create_time desc')
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
        .field('eventName,signNumber,openCalc,tags{_id,name},iconSrc{_id,src},iconColor{_id,color},isStore')
        .get()

      return data
    } catch (error) {
      report(error, 'error')
      throw error
    }
  },
}
