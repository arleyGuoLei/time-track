import { DEFAULT_TAG_ID, PAGE_SIZE } from './../../utils/constant'
import { Component, Mixins } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cList from '@/components/cList.vue'
import tag from '@/pages/home/components/tag.vue'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'
import { eventsModel } from '@/models'

@Component({
  components: {
    cHeader,
    tag,
    cList,
  },
})
export default class extends Mixins(scrollTopMixin) {
  private imgAnimation = {}
  private eventList = []
  private sticky = false
  // 为了优化onload生命周期还没执行，页面就渲染了一些元素的问题，因顶部计算导致闪硕
  private load = false
<<<<<<< HEAD
  private isLoading = false
=======
>>>>>>> 42dc621fb9059f808b08e6fb034bd50fc0530910

  /* ----分页数据---- */
  private onBottom = false
  private page = 1
  private eventTotal = 0
  private pageSize = PAGE_SIZE
  /* ############## */

  private tagId = DEFAULT_TAG_ID

  onLoad() {
    this.load = true
    console.log('home onLoad')
    ;(this as any).$loading('getList', this.getList.bind(this))
  }

  /**
   * 吸顶回调操作，添加事件显示/隐藏
   * @param state 吸顶状态
   */
  onSticky(state: boolean) {
    const data = state ? { translateY: 64, opacity: 0, duration: 800 } : { translateY: -64, opacity: 1, duration: 800 }
    const animation = uni.createAnimation({
      duration: data.duration,
      timingFunction: 'ease-in-out',
    })

    animation
      .translateY(uni.upx2px(data.translateY))
      .opacity(data.opacity)
      .step()
    this.imgAnimation = animation.export()
    this.sticky = !this.sticky
  }

  onTagChange(tagId: string) {
    this.tagId = tagId
    this.onBottom = false
    this.page = 1
    this.eventTotal = 0
    this.pageSize = PAGE_SIZE
    this.eventList = []
    ;(this as any).$loading('getList', this.getList.bind(this), true, '加载中', tagId, 1)
  }

  async getList(tagId = DEFAULT_TAG_ID, page = 1) {
<<<<<<< HEAD
    this.isLoading = true
=======
>>>>>>> 42dc621fb9059f808b08e6fb034bd50fc0530910
    const { data, count, size } = await eventsModel.getList(tagId, page)
    if (page === 1) {
      this.eventList = data
    } else {
      this.eventList = this.eventList.concat(data)
    }

    // 数据总和小于查询的size
    if (count <= size) {
      this.onBottom = true
    } else {
      /**
       * 有更多数据 且 是第一页则进行预取
        if (page === 1) {
          setTimeout(() => {
            this.getList(tagId, page + 1)
          }, 200)
        }
       */
    }

    this.eventTotal = count
    this.pageSize = size
    this.page = page + 1
<<<<<<< HEAD
    this.isLoading = false
  }

  onLongPressSign() {
    console.log('长按')
    uni.vibrateShort({})
  }

  onTapSign() {
    console.log('点击')
=======
>>>>>>> 42dc621fb9059f808b08e6fb034bd50fc0530910
  }

  onReachBottom() {
    const { page, eventTotal, pageSize: size, tagId, onBottom } = this
    const pageSize = Math.ceil(eventTotal / size)
    if (!onBottom && page <= pageSize) {
      ;(this as any).$loading('getList', this.getList.bind(this), true, '加载中', tagId, page)
    } else {
      this.onBottom = true
    }
<<<<<<< HEAD
  }

  async onPullDownRefresh() {
    this.onBottom = false
    this.page = 1
    this.eventTotal = 0
    this.pageSize = PAGE_SIZE
    await (this as any).$loading('getList', this.getList.bind(this), true, '加载中', this.tagId, 1)
    await (this as any).$loading('getTagList', (this.$refs.tag as any).getTagList)
    uni.stopPullDownRefresh()
=======
>>>>>>> 42dc621fb9059f808b08e6fb034bd50fc0530910
  }
}
