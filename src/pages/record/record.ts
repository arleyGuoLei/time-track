import { PAGE_SIZE } from './../../utils/constant'
import { dotsModel } from '@/models'
import { Vue, Component } from 'vue-property-decorator'
import calendarHorizontal from './components/calendar-horizontal.vue'
import item from './components/item.vue'

@Component({
  components: {
    calendarHorizontal,
    item,
  },
})
export default class extends Vue {
  private isLoading = false
  private dotList = []

  private date = ''

  /* ----分页数据---- */
  private onBottom = false
  private page = 1
  private dotTotal = 0
  private pageSize = PAGE_SIZE
  /* ############## */

  onLoad() {
    console.log('record')
  }

  /**
   * 选择日期后更新列表
   * @param date 日期
   */
  async onDateChange(date: string, backstage = false) {
    uni.setNavigationBarTitle({ title: date })

    this.date = date
    this.onBottom = false
    this.page = 1
    this.dotTotal = 0
    this.pageSize = PAGE_SIZE

    backstage
      ? await this.getList(date, 1)
      : await (this as any).$loading('getList', this.getList.bind(this), true, '加载中', date, 1)
  }

  async getList(date: string, page = 1) {
    this.isLoading = true
    const { data, count, size } = await dotsModel.getDotListByDate(date, page)

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
}
