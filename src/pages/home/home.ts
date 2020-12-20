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
  private isSticky = false

  /**
   * 吸顶状态改变时触发
   * @param state 吸顶状态
   */
  onSticky(state: boolean) {
    this.isSticky = state
  }
}
