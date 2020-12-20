<template>
  <view>
    <img :src="imgSrc" class="bg" />
    <view class="bar" :style="{ zIndex, height: barHeight + 'px' }">
      <view class="bar-bg" :style="{ backgroundImage: 'url(' + imgSrc + ')' }" />
      <view class="bar-content" :style="{ top: statusHeight + 'px', height: barHeight - statusHeight + 'px' }">
        <slot name="content">
          <view class="bar-content__default">
            <img v-if="showBack" @click="onBackPage" class="default-icon" src="@/static/header-back.png" />
            <text class="default-title">{{ title }}</text>
          </view>
        </slot>
      </view>
    </view>

    <!-- header占位，防止内容塌陷 -->
    <view :style="{ height: barHeight + 'px' }"></view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

declare module 'vue/types/vue' {
  interface Vue {
    CustomBar: number
    StatusBar: number
  }
}

@Component
export default class extends Vue {
  @Prop({ default: '' }) private imgSrc!: string
  @Prop({ default: '' }) private title!: string
  @Prop({ default: false }) private showBack!: boolean
  @Prop({ default: 99 }) private zIndex!: number
  private barHeight = 0
  private statusHeight = 0

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
}
.default-icon {
  width: 36rpx;
  height: 36rpx;
  margin: 0 32rpx;
}
.default-title {
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 12rpx;
}
</style>
