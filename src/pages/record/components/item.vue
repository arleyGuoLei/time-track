<template>
  <view class="item">
    <view class="icon-container" :style="{ background: iconColor }">
      <img class="icon-img" :src="iconSrc" />
    </view>
    <view class="content-container" @tap="onTapDetail(itemId)">
      <p class="text text-black">{{ eventName }}</p>
      <view class="text-grey text-sm event-time">
        <img class="icon-time mr-16" src="@/static/home-time.png" />
        <text class="text-cut">打点时间 {{ signTime }}</text>
      </view>
    </view>
    <view class="delete-container flex-column justify-content__center" @tap="onTapDelete(itemId)">
      <img class="delete-icon" src="@/static/delete2.png" />
      <text class="text-red text-xs">删除</text>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' }) private itemId!: string
  @Prop({ default: '' }) private iconSrc!: string
  @Prop({ default: '' }) private iconColor!: string
  @Prop({ default: '' }) private eventName!: string
  @Prop({ default: '' }) private signTime!: string

  onTapDelete(id: string) {
    console.log(id)
  }

  onTapDetail(id: string) {
    console.log(id)
  }
}
</script>
<style scoped>
.item {
  width: 718rpx;
  height: 150rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  padding-left: 48rpx;
  margin-top: 16rpx;

  justify-content: space-between;
  align-items: center;
}

.icon-container {
  width: 100rpx;
  height: 100rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 100%;
  height: 100%;
}

.content-container {
  width: 320rpx;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 25rpx 0;
  box-sizing: border-box;
}

.event-name {
}

.event-time {
  display: flex;
  align-items: center;
}

.icon-time {
  width: 28rpx;
  height: 28rpx;
}

.delete-container {
  width: 150rpx;
  height: 150rpx;
  background: rgba(236, 115, 93, 0.4);
}

.delete-icon {
  width: 46rpx;
  height: 48rpx;
}
</style>
