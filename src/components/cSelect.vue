<template>
  <view class="select" @click="onSelect">
    <text class="select-title">{{ title }}</text>
    <img class="select-icon" v-if="value" src="@/static/selected.png" />
    <img class="select-icon" v-else src="@/static/unselect.png" />
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' }) private title!: string
  @Prop({ default: false }) private value!: boolean

  @Emit('change')
  onSelect() {
    return !this.value
  }
}
</script>
<style scoped>
.select {
  width: 686rpx;
  height: 100rpx;
  background: #f5f6fa;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 48rpx;
  margin: 0 32rpx 36rpx 32rpx;
  justify-content: space-between;
}
.select-title {
  font-size: 34rpx;
  font-weight: 500;
  color: #333333;
}
.select-icon {
  width: 36rpx;
  height: 36rpx;
}
</style>
