<template>
  <view class="title" :style="{ padding: `36rpx ${paddingLR}rpx` }">
    <view class="title-main">
      <view class="line"></view>
      <text class="text">{{ title }}</text>
    </view>
    <slot name="right" />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' }) private title!: string
  @Prop({ default: 48 }) private paddingLR?: number
}
</script>
<style scoped>
.title {
  display: flex;
  align-items: center;
  width: 750rpx;
  box-sizing: border-box;
  justify-content: space-between;
}
.title-main {
  display: flex;
  align-items: center;
}
.line {
  width: 8rpx;
  height: 36rpx;
  background: #4f9bfa;
  border-radius: 4rpx;
  margin-right: 32rpx;
}
.text {
  font-size: 32rpx;
  font-weight: 400;
  color: #818181;
}
</style>
