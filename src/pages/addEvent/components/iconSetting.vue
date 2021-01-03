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
        <img v-for="(item, j) in arr" :src="item.src" :key="j" @click="onSelectSrc(item._id, item.src)" />
      </view>
    </scroll-view>

    <scroll-view enable-flex scroll-x="true" class="scroll-view" :style="{ height: colorLine * '100' + 'rpx' }">
      <view v-for="(arr, i) in colorList" :key="i" class="scroll-view__column">
        <view
          v-for="(item, j) in arr"
          :style="{
            backgroundColor: item.color,
          }"
          :key="j"
          @click="onSelectColor(item._id, item.color)"
        ></view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { iconImagesModel, iconColorsModel } from '@/models'

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
  @Prop({ default: 'transparent' }) private iconColor!: string

  /** 图标分成几行显示 */
  @Prop({ default: 3 }) private srcLine!: number
  /** 颜色分为几行 */
  @Prop({ default: 2 }) private colorLine!: number

  private srcList: any[][] = []
  private colorList: any[][] = []

  initIconList() {
    return new Promise((resolve, reject) => {
      Promise.all([iconImagesModel.getList(), iconColorsModel.getList()])
        .then(([srcList, colorList]) => {
          Array.isArray(srcList) && (this.srcList = chunkArr(srcList, this.srcLine))
          Array.isArray(colorList) && (this.colorList = chunkArr(colorList, this.colorLine))
          resolve('')
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  mounted() {
    ;(this as any).$loading('initIconList', this.initIconList.bind(this))
  }

  @Emit('selectIconSrc')
  onSelectSrc(_id: string, src: string) {
    return { _id, src }
  }

  @Emit('selectIconColor')
  onSelectColor(_id: string, color: string) {
    return { _id, color }
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
  float: left;
}

.scroll-view:nth-child(2) {
  margin-top: 24rpx;
}

.scroll-view:nth-child(3) {
  margin-top: 16rpx;
}
</style>
