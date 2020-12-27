<template>
  <view class="icon-setting">
    <img
      class="icon"
      :style="{
        backgroundColor: iconColor,
      }"
      :src="iconSrc"
    />

    <scroll-view enable-flex scroll-x="true" class="scroll-view" :style="{ height: srcLine * '100' + 'rpx' }">
      <view v-for="(arr, i) in srcList" :key="i" class="scroll-view__column">
        <img v-for="(item, j) in arr" :src="item" :key="j" @click="onSelectSrc" />
      </view>
    </scroll-view>

    <scroll-view enable-flex scroll-x="true" class="scroll-view" :style="{ height: colorLine * '100' + 'rpx' }">
      <view v-for="(arr, i) in colorList" :key="i" class="scroll-view__column">
        <view
          v-for="(item, j) in arr"
          :style="{
            backgroundColor: item,
          }"
          :key="j"
          @click="onSelectColor"
        ></view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { iconImagesModel } from '@/models'

/**
 * 数组切分成多个长度为num的数组
 */
function chunkArr(data: any[], num: number) {
  const arr = []
  const len = data.length
  for (let i = 0; i < len; i += num) {
    arr.push(data.slice(i, i + num))
  }
  return arr
}

@Component
export default class extends Vue {
  @Prop({ default: '' }) private iconSrc!: string
  @Prop({ default: [] }) private iconSrcList!: string[]
  /** 图标分成几行显示 */
  @Prop({ default: 3 }) private srcLine!: number

  @Prop({ default: 'transparent' }) private iconColor!: string
  @Prop({ default: [] }) private iconColorList!: string[]
  /** 颜色分为几行 */
  @Prop({ default: 2 }) private colorLine!: number

  private srcList: any[][] = []
  private colorList: any[][] = []

  initImageList() {
    iconImagesModel.getList()
  }

  created() {
    this.srcList = chunkArr(this.iconSrcList, this.srcLine)
    this.colorList = chunkArr(this.iconColorList, this.colorLine)

    this.initImageList()
  }

  // TODO: id
  onSelectSrc() {
    console.log('onSelectSrc')
  }

  // TODO: id
  onSelectColor() {
    console.log('onSelectColor')
  }
}
</script>
<style scoped>
.icon-setting {
  width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 32rpx;
  box-sizing: border-box;
}
.icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 32rpx;
  overflow: hidden;
}
.scroll-view {
  width: 686rpx;
  display: flex;
  white-space: nowrap;
}
.scroll-view__column {
  width: 100rpx;
  display: inline-block;
  white-space: normal;
}

.scroll-view__column img {
  width: 100rpx;
  height: 100rpx;
}

.scroll-view__column view {
  width: 72rpx;
  height: 72rpx;
  margin: 14rpx;

  border-radius: 50%;
}

.scroll-view:nth-child(2) {
  margin-top: 24rpx;
}

.scroll-view:nth-child(3) {
  margin-top: 16rpx;
}
</style>
