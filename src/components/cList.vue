<template>
  <view class="list">
    <!-- 吸顶内容的插槽 -->
    <view class="list-sticky" :style="{ top: barHeight + 'px' }">
      <slot name="fixed" />
    </view>

    <view class="list-content">
      <slot />
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
declare module 'vue/types/vue' {
  interface Vue {
    CustomBar: number
    StatusBar: number
  }
}

@Component
export default class extends Vue {
  private barHeight = 0
  private sticky = false
  @Prop({ default: 0 }) private scrollY!: number

  created() {
    this.barHeight = this.CustomBar
  }

  @Watch('scrollY')
  onScroll(y: number) {
    const paddingTop = uni.upx2px(250)
    if (y >= paddingTop && !this.sticky) {
      this.sticky = true
      this.$emit('sticky', true)
    }
    if (this.sticky && y < paddingTop) {
      this.sticky = false
      this.$emit('sticky', false)
    }
  }
}
</script>
<style scoped>
.list {
  box-sizing: border-box;
  padding-top: 250rpx;
  width: 750rpx;
}
.list-sticky {
  width: 750rpx;
  position: sticky;
}
</style>
