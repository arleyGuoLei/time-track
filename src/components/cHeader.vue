<template>
  <view class="header">
    <img :src="imgSrc" class="header-bg" />
    <view class="header-bar" :style="{ top: statusHeight + 'px', height: barHeight - statusHeight + 'px' }">
      <slot name="content">
        <view class="header-bar__content">
          <img v-if="showBack" @click="onBackPage" class="header-content__icon" src="@/static/header-back.png" />
          <text class="heaer-content__title">{{ title }}</text>
        </view>
      </slot>
    </view>
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
.header {
  position: fixed;
  left: 0;
  width: 750rpx;
  height: 500rpx;
  top: 0;
  overflow: hidden;
}
.header-bg {
  width: 100%;
  height: 100%;
}
.header-bar {
  position: absolute;
  left: 0;
  right: 0;
}
.header-bar__content {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}
.header-content__icon {
  width: 36rpx;
  height: 36rpx;
  margin: 0 32rpx;
}
.heaer-content__title {
  font-size: 32rpx;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 12rpx;
}
</style>
