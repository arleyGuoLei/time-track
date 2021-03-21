import { playAudio } from './../../utils/utils'
import { DEFAULT_TAG_ID, PAGE_SIZE } from '@/utils/constant'
import { Component, Mixins } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cList from '@/components/cList.vue'
import tag from '@/pages/home/components/tag.vue'
import bannerAd from '@/pages/home/components/banner-ad.vue'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'
import { onShareAppMessageMixin } from '@/plugins/shareAppMessage.mixin'
import { eventsModel, dotsModel } from '@/models'
import { ListItem as eventItem } from '@/models/eventsModel'
import { showTip } from '@/utils/utils'
const SIGN_SUCCESS_AUDIO = 'static/sign_success.mp3'

declare module 'vue/types/vue' {
  interface Vue {
    $report: (action: string, options?: AnyObject) => void
  }
}

interface UpdateItem {
  /** 更新的字段 */
  key: string
  /** 更新的值 */
  value: number | string
  /** 怎么更新 */
  updateType: 'replace' | 'inc'
}

interface ListUpdateItem {
  type: 'updateItem' | 'addItem'
  /**事件id */
  id: string
  data: UpdateItem[] | eventItem
}

@Component({
  components: {
    cHeader,
    tag,
    cList,
    bannerAd,
  },
})
export default class extends Mixins(scrollTopMixin, onShareAppMessageMixin) {
  private imgAnimation = {}
  private eventList: eventItem[] = []
  private sticky = false
  // 为了优化onload生命周期还没执行，页面就渲染了一些元素的问题，因顶部计算导致闪硕
  private load = false
  private isLoading = true

  private title = '时间打点'

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

    this.$nextTick(() => {
      ;(this as any).$loading('getList', this.getList.bind(this))
    })

    const getTagTime = 50
    // 初始化的时候，可能取不到ref
    const tagTimer = setInterval(() => {
      if (this.$refs.tag && (this.$refs.tag as any).initTagData) {
        ;(this.$refs.tag as any).initTagData()
        clearInterval(tagTimer)
      }
    }, getTagTime)

    /**监听list数据被其他页面修改，比如打点、新增事件等 */
    uni.$on('onListUpdate', this.onListUpdate)

    // #ifdef MP-QQ
    this.title = '小日常'
    // #endif

    // #ifdef MP-BAIDU || MP-TOUTIAO
    this.title = '番茄打卡'
    // #endif
  }

  onUnload() {
    uni.$off('onListUpdate', this.onListUpdate)
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
    console.log(tagId)

    this.tagId = tagId
    this.onBottom = false
    this.page = 1
    this.eventTotal = 0
    this.pageSize = PAGE_SIZE
    this.eventList = []
    ;(this as any).$loading('getList', this.getList.bind(this), true, '加载中', tagId, 1)
  }

  async getList(tagId = DEFAULT_TAG_ID, page = 1) {
    this.isLoading = true
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
    this.isLoading = false
  }

  updateDotUI(eventId: string) {
    console.log(eventId)
    for (const [index, event] of Object.entries(this.eventList)) {
      if ((event as any)._id === eventId) {
        this.$set(
          this.eventList,
          +index,
          Object.assign(this.eventList[+index], {
            lastTime: Date.now(),
            signNumber: this.eventList[+index].signNumber! + 1,
          }),
        )
      }
    }
  }

  async addDotQuick(eventId: string) {
    await dotsModel.addDotQuick(eventId)
  }

  async onLongPressSign(eventId: string) {
    try {
      uni.vibrateShort({})
      await (this as any).$loading('addDotQuick', this.addDotQuick.bind(this), true, '打点中', eventId)
      this.$report('add_dot', {
        type: 'quick',
      })
      playAudio(SIGN_SUCCESS_AUDIO)
      showTip('快速打点成功')
      this.updateDotUI(eventId)
    } catch (error) {
      console.log(error)
      showTip('打点失败, 请重试')
    }
  }

  onTapSign(eventId: string, eventName: string, openCalc: boolean) {
    if (!(eventId && eventName)) {
      return showTip('获取事件ID和事件名称失败')
    }
    this.$Router.push({
      path: '/pages/addDot/addDot',
      query: { type: 'add', eventId, eventName, from: 'home', openCalc },
    })
  }

  onTapDetail(eventId: string, eventName: string) {
    if (!(eventId && eventName)) {
      return showTip('获取事件ID和事件名称失败')
    }
    this.$Router.push({ path: '/pages/eventDetail/eventDetail', query: { eventId, eventName } })
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

  async onPullDownRefresh() {
    this.onBottom = false
    this.page = 1
    this.eventTotal = 0
    this.pageSize = PAGE_SIZE
    await Promise.all([
      (this as any).$loading('getList', this.getList.bind(this), true, '加载中', this.tagId, 1),
      (this as any).$loading('getTagList', (this.$refs.tag as any).getTagList),
    ])
    uni.stopPullDownRefresh()
  }

  addItem(item: eventItem) {
    console.log(item)
    if (item.tags.includes(this.tagId) || this.tagId === DEFAULT_TAG_ID) {
      this.eventList = [item].concat(this.eventList)
    }
  }

  updateItem(item: ListUpdateItem) {
    const { id, data } = item
    this.eventList = this.eventList
      .map(event => {
        if (event._id === id) {
          const newItem = {
            ...event,
            ...(data as UpdateItem[]).reduce((prevObj: any, currentItem) => {
              if (currentItem.updateType === 'replace') {
                prevObj[currentItem['key']] = currentItem['value']
              } else if (currentItem.updateType === 'inc') {
                prevObj[currentItem['key']] =
                  (currentItem['value'] as number) + ((event as any)[currentItem['key']] || 0)
                return prevObj
              }
              return prevObj
            }, {}),
          }
          console.log('更新后的对象:', newItem)
          return newItem
        }
        return event
      })
      .filter(item => item.status !== 0)
  }

  onListUpdate(item: ListUpdateItem) {
    const { type } = item
    if (type === 'updateItem') {
      this.updateItem(item) // 更新list中的item字段值
    }
    if (type === 'addItem') {
      this.addItem(item.data as eventItem) // 新增事件
    }
  }
}
