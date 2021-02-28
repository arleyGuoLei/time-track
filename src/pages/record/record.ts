import { PAGE_SIZE } from './../../utils/constant'
import { dotsModel } from '@/models'
import { Vue, Component } from 'vue-property-decorator'
import calendarHorizontal from './components/calendar-horizontal.vue'
import item from './components/item.vue'
import dotDetail from './components/dot-detail.vue'

export interface Position {
  point: {
    type: string
    coordinates: number[]
  }
  address: string
  name: string
}

interface EventItem {
  _id: string
  eventName: string
  iconSrc: {
    _id: string
    src: string
  }[]
  iconColor: {
    _id: string
    color: string
  }
  openCalc: boolean
}

export interface DotItem {
  _id: string
  describe: string
  dotTimestamp: number
  time: string
  event_id: EventItem[]
  score?: number
  imageList?: string[]
  position?: Position
  date: string
}

interface UpdateDotItem {
  id?: string
  eventName: string
  eventId: string
  date?: string
  time: string
  dotTimestamp: number
  timeDuration?: string
  describe?: string
  imageList?: string[]
  position?: Position
  score?: number
}

@Component({
  components: {
    calendarHorizontal,
    item,
    dotDetail,
  },
})
export default class extends Vue {
  private isLoading = true
  private dotList: DotItem[] = []

  private date = ''
  private detailInfo = {
    show: false,
    id: '',
    index: -1,
  }

  /* ----分页数据---- */
  private onBottom = false
  private page = 1
  private dotTotal = 0
  private pageSize = PAGE_SIZE
  /* ############## */

  onLoad() {
    console.log('record')
    /**监听list数据被其他页面修改，比如打点、新增事件等 */
    uni.$on('onDeleteDot', this.onDelete)
  }

  onUnload() {
    uni.$off('onDeleteDot', this.onDelete)
  }

  onHide() {
    setTimeout(() => {
      if (this.$Route.path !== '/pages/record/record') {
        this.detailInfo = {
          show: false,
          id: '',
          index: -1,
        }
      }
    }, 200)
  }

  /**
   * 选择日期后更新列表
   * @param date 日期
   */
  async onDateChange(date: string, backstage = false) {
    uni.setNavigationBarTitle({ title: date })

    this.onBottom = false
    this.page = 1
    this.dotTotal = 0
    this.pageSize = PAGE_SIZE

    backstage
      ? await this.getList(date, 1)
      : await (this as any).$loading('getList', this.getList.bind(this), true, '加载中', date, 1)

    this.date = date
  }

  async getList(date: string, page = 1) {
    this.isLoading = true
    const { data, count, size } = await dotsModel.getDotListByDate(date, page)
    console.log('getList::', data)

    if (page === 1) {
      this.dotList = data
    } else {
      this.dotList = this.dotList.concat(data)
    }

    // 数据总和小于查询的size
    if (count <= size) {
      this.onBottom = true
    }

    this.dotTotal = count
    this.pageSize = size
    this.page = page + 1
    this.isLoading = false
  }

  onReachBottom() {
    const { page, dotTotal, pageSize: size, date, onBottom } = this
    const pageSize = Math.ceil(dotTotal / size)

    if (!onBottom && page <= pageSize) {
      ;(this as any).$loading('getList', this.getList.bind(this), true, '加载中', date, page)
    } else {
      this.onBottom = true
    }
  }

  async onPullDownRefresh() {
    await Promise.all([
      this.onDateChange(this.date, false),
      (this.$refs['calendarHorizontal'] as any).initWeekTime(this.date, false, false),
    ])
    uni.stopPullDownRefresh()
  }

  onShowDetail(data: { id: string; index: number }) {
    this.detailInfo = {
      show: true,
      id: data.id,
      index: data.index,
    }
  }

  onCloseDetail() {
    this.detailInfo = {
      show: false,
      id: '',
      index: -1,
    }
  }

  /**
   * 更新打点信息
   */
  onUpdateDot(data: UpdateDotItem) {
    console.log('详情卡片编辑，addDot更新打点数据, onUpdateDot::', data)
    this.dotList = this.dotList.map(item => {
      if (item._id !== data.id) {
        return item
      } else {
        const { id, describe = '', dotTimestamp, time, score, imageList, date = this.date, position } = data
        return {
          _id: id,
          describe,
          dotTimestamp,
          time,
          event_id: item.event_id,
          score,
          imageList,
          date,
          position,
        }
      }
    })
  }

  onDelete({ id, date }: { id: string; date: string }): void {
    this.dotList = this.dotList.filter(item => id !== item._id)
    ;(this.$refs['calendarHorizontal'] as any).deleteDot(date)
  }
}
