<template>
  <view class="switch">
    <text class="switch-title">{{ title }}</text>
    <switch class="switch-bar" :color="color" :checked="value" @change="onSwitchChange" />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' }) private title!: string
  @Prop({ default: '#4f9bfa' }) private color!: string
  @Prop({ default: false }) private value!: boolean

  @Emit('change')
  onSwitchChange() {
    return !this.value
  }
}
</script>
<style scoped>
.switch {
  width: 686rpx;
  height: 100rpx;
  background: #f5f6fa;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 32rpx 0 48rpx;
  margin: 0 32rpx 36rpx 32rpx;
  justify-content: space-between;
}

.switch-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}

.switch-bar {
  transform: scale(0.9);
}
</style>
