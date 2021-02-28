<template>
  <view class="item">
    <view class="icon-container" :style="{ background: iconColor }">
      <img class="icon-img" mode="aspectFit" :src="iconSrc" />
    </view>
    <view class="content-container" @tap="onTapDetail(itemId, itemIndex)">
      <p class="text text-black text-cut">{{ eventName }}</p>
      <view class="text-grey text-sm event-time">
        <img class="icon-time mr-16" src="@/static/home-time.png" />
        <text class="text-cut">打点时间 {{ signTime }}</text>
      </view>
    </view>
    <view class="delete-container flex-column justify-content__center" @tap="onTapDelete(itemId, date)">
      <img class="delete-icon" src="@/static/delete2.png" />
      <text class="text-red text-xs">删除</text>
    </view>
  </view>
</template>

<script lang="ts">
import { dotsModel } from '@/models'
import { showTip } from '@/utils/utils'
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: '' }) private itemId!: string
  @Prop({ default: '' }) private date!: string
  @Prop({ default: -1 }) private itemIndex!: number
  @Prop({ default: '' }) private iconSrc!: string
  @Prop({ default: '' }) private iconColor!: string
  @Prop({ default: '' }) private eventName!: string
  @Prop({ default: '' }) private eventId!: string
  @Prop({ default: '' }) private signTime!: string

  async onTapDelete(id: string, date: string) {
    uni.showModal({
      title: '提示',
      content: `是否确认删除「${this.eventName}」打点`,
      success: async res => {
        if (res.confirm) {
          try {
            const {
              result: { updated = 0 },
            } = await (this as any).$loading('deleteDot', dotsModel.deleteDot, false, '删除中', id)
            if (updated === 0) {
              throw new Error('no updated')
            }
            this.$emit('onDelete', { id, date })
            uni.$emit('onListUpdate', {
              type: 'updateItem',
              id: this.eventId,
              data: [
                {
                  key: 'signNumber',
                  value: -1,
                  updateType: 'inc',
                },
              ],
            })
          } catch (error) {
            showTip('删除失败，请重试 ~')
          }
        }
      },
    })
  }

  @Emit('onShowDetail')
  onTapDetail(id: string, index: number) {
    return { id, index }
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
