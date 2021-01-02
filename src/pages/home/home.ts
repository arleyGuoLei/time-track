import { Component, Mixins } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cList from '@/components/cList.vue'
import tag from '@/pages/home/components/tag.vue'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'

@Component({
  components: {
    cHeader,
    tag,
    cList,
  },
})
export default class extends Mixins(scrollTopMixin) {
  private imgAnimation = {}

  onLoad() {
    // noop, 不写该函数app初始化执行顺序不对
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
  }
}
