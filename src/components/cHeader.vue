<template>
  <view>
    <img :src="imgSrc" class="bg" />
    <view class="bar" :style="{ zIndex, height: barHeight + 'px' }">
      <view v-if="'backgroundImg' === headerType" class="bar-bg" :style="{ backgroundImage: 'url(' + imgSrc + ')' }" />
      <view v-else class="bar-bg" :style="{ backgroundColor: bgColor, opacity: bgOpacity }"></view>
      <view class="bar-content" :style="{ top: statusHeight + 'px', height: barHeight - statusHeight + 'px' }">
        <slot name="content">
          <view class="bar-content__default">
            <img v-if="showBack" @click="onBackPage" class="default-icon" src="@/static/header-back.png" />
            <text v-if="'backgroundImg' === headerType" class="default-title">{{ title }}</text>
            <text
              v-else
              class="default-title center-title"
              :style="{ opacity: bgOpacity, transform: 'translateY(' + (1 - bgOpacity) * 20 + 'px)' }"
              >{{ title }}</text
            >
          </view>
        </slot>
      </view>
    </view>

    <!-- header占位，防止内容塌陷 -->
    <view :style="{ height: barHeight + 'px' }"></view>
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

type HeaderType = 'backgroundImg' | 'backgroundColor'

@Component
export default class extends Vue {
  @Prop({ default: '' }) private imgSrc!: string
  @Prop({ default: '' }) private title!: string
  @Prop({ default: false }) private showBack!: boolean
  @Prop({ default: 99 }) private zIndex!: number
  @Prop({ default: 0 }) private scrollY!: number

  /** HeaderType为backgroundColor时候的背景色 */
  @Prop({ default: '#93C0F2' }) private bgColor!: string
  @Prop({ default: 'backgroundImg' }) private headerType!: HeaderType
  private barHeight = 0
  private statusHeight = 0
  private bgOpacity = 0

  @Watch('scrollY')
  onScroll(y: number) {
    const distanceY = 0 // 距离distanceY像素变为全不透明
    const paddingTop = uni.upx2px(250) - distanceY
    if (this.headerType === 'backgroundColor') {
      const div = y / paddingTop
      this.bgOpacity = div >= 1 ? 1 : div
    }
  }

  created() {
    this.barHeight = this.CustomBar
    this.statusHeight = this.StatusBar
  }

  private onBackPage() {
    uni.navigateBack({
      delta: 1,
    })
  }
}
</script>
<style scoped>
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 750rpx;
  height: 500rpx;
  z-index: -1;
}
.bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 750rpx;
}
.bar-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  overflow: hidden;
}
.bar-content {
  position: absolute;
  left: 0;
  width: 750rpx;
}
.bar-content__default {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  /* 百度小程序样式BUG */
  transform: translateZ(0);
}
.default-icon {
  width: 36rpx;
  height: 36rpx;
  margin: 0 32rpx;
  z-index: 1;
}
.default-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 12rpx;
}
.center-title {
  font-size: 34rpx;
  font-weight: 800;
  display: block;
  text-align: center;
  width: 750rpx;
  position: absolute;
  z-index: 0;
}
</style>
