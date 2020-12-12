<template>
  <scroll-view
    @scroll="onScroll"
    class="list"
    scroll-y="true"
    :style="{
      top: barHeight + 'px',
      height: listHeight + 'px',
      backgroundColor: fixed ? '#f5f5f5' : 'transparent',
    }"
  >
    <view
      v-if="showFixedSlot"
      class="list-header"
      :style="{
        position: fixed ? 'fixed' : 'static',
        marginTop: fixed ? '0px' : marginTop + 'px',
      }"
    >
      <slot name="fixed" />
    </view>
    <!-- 吸顶占位，防止内容塌陷 -->
    <view
      v-if="fixed && showFixedSlot"
      :style="{
        height: placehandleHeight + 'px',
      }"
      class="placehandle"
    ></view>
    <view
      class="list-content"
      :style="{
        marginTop: showFixedSlot ? '0' : marginTop + 'px',
      }"
    >
      <slot></slot>
    </view>
  </scroll-view>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getClientRect } from '@/utils/utils'
import { VNode } from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    CustomBar: number
    StatusBar: number
  }
}

@Component
export default class extends Vue {
  private barHeight = 0 // 顶部栏高度，包含状态栏 + 胶囊按钮栏(标题栏)
  private statusHeight = 0
  private listHeight = 0
  private fixed = false
  private marginTop = 0
  private placehandleHeight = 0
  private showFixedSlot = false

  /**
   * 判断是否传入吸顶slot，如果没有传入，则不显示
   */
  @Watch('$slots.fixed', { immediate: true })
  watchFixed(node: VNode[] | boolean) {
    if (typeof node === 'boolean') {
      this.showFixedSlot = node
    } else {
      this.showFixedSlot = node && node.length !== 0
    }
    this.updateUI(this.showFixedSlot)
  }

  async updateUI(show: boolean) {
    if (show) {
      this.$nextTick(() => {
        // dom挂载比较慢，延迟获取dom信息
        setTimeout(async () => {
          const res = await getClientRect('.list-header', this)
          if (res) {
            const { height = -1 } = res
            // fixed元素的高度 + fixed的marginTop
            this.placehandleHeight = height + this.marginTop
          }
        }, 0)
      })
    }
  }

  /**
   * 初始化无需依赖页面DOM的数据
   * barHeight
   * statusHeight
   * marginTop
   * listHeight
   */
  created() {
    const { windowHeight } = uni.getSystemInfoSync()

    this.barHeight = this.CustomBar
    this.statusHeight = this.StatusBar

    this.marginTop = uni.upx2px(426) - this.CustomBar
    this.listHeight = windowHeight - this.barHeight
  }

  mounted() {
    this.watchFixed((this.$slots.fixed as any) as boolean)
  }

  onScroll(event: { detail: { scrollTop: number } }) {
    const distance = 10 // 距离多少像素就开启吸顶
    const {
      detail: { scrollTop },
    } = event
    this.fixed = scrollTop >= this.marginTop - distance
  }
}
</script>
<style scoped>
.list {
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
}
.list-header {
  left: 0;
  right: 0;
  overflow: hidden;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
}
.list-content {
  background: #f5f5f5;
}
.placehandle {
  width: 100%;
}
</style>
