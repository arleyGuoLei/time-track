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

  /* ----分页数据---- */
  private onBottom = false
  private page = 1
  private eventTotal = 0
  private pageSize = PAGE_SIZE
  /* ############## */

  private tagId = DEFAULT_TAG_ID

  onLoad() {
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
    const { data, count, size } = await eventsModel.getList(tagId, page)
    if (page === 1) {
      this.eventList = data
    } else {
      this.eventList = this.eventList.concat(data)
    }

    // 数据总和小于查询的size
    if (count <= size) {
      this.onBottom = true
    }

    this.eventTotal = count
    this.pageSize = size
    this.page = page + 1
  }

  onReachBottom() {
    const { page, eventTotal, pageSize: size, tagId, onBottom } = this
    const pageSize = Math.ceil(eventTotal / size)
    if (!onBottom && page <= pageSize) {
      ;(this as any).$loading('getList', this.getList.bind(this), true, '加载中', tagId, page)
    } else {
      this.onBottom = true
    }
  }
}
