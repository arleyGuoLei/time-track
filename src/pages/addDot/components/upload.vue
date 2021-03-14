<template>
  <view class="upload">
    <view class="img-wrap" v-for="(url, index) in list" :key="index">
      <img mode="aspectFill" class="img" @click="onPreviewImg(index)" :src="url" />
      <view class="img-delete">
        <img class="img-delete__icon" @click="onDelete(index)" src="@/static/delete.png" />
      </view>
    </view>
    <view v-if="!list || list.length < 9" class="upload-btn" @click="onUpload">
      <img class="upload-btn__icon" src="@/static/upload.png" />
    </view>
  </view>
</template>

<script lang="ts">
import { IMAGE_LIST_LENGTH } from '@/utils/constant'
import { showTip } from '@/utils/utils'
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { uploadImageList } from '@/utils/upload.js'

@Component
export default class extends Vue {
  @Prop({ default: [] }) private list!: string[]

  async onUpload() {
    if (this.list.length >= IMAGE_LIST_LENGTH) {
      return showTip(`最多可以上传${IMAGE_LIST_LENGTH}张图片哦`)
    }
    const number = IMAGE_LIST_LENGTH - this.list.length > 9 ? 9 : IMAGE_LIST_LENGTH - this.list.length
    const urls = await uploadImageList(number)

    this.$emit('upload', [...this.list, ...urls])
  }

  @Emit('delete')
  onDelete(index: number) {
    return index
  }

  onPreviewImg(current: string) {
    uni.previewImage({
      current,
      urls: this.list,
    })
  }
}
</script>
<style scoped>
.upload {
  display: flex;
  width: 686rpx;
  flex-flow: row wrap;
}
.upload-btn {
  width: 220rpx;
  height: 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 4rpx;
  border: 2rpx dashed rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  border-radius: 8rpx;
  overflow: hidden;
}
.upload-btn__icon {
  width: 48rpx;
  height: 48rpx;
}
.img-wrap {
  display: flex;
  margin-right: 13rpx;
  margin-bottom: 13rpx;
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
}
.img-delete {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 220rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-delete__icon {
  width: 40rpx;
  height: 40rpx;
}
.img-wrap::before {
  position: absolute;
  content: '';
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.05) 100%);
  pointer-events: none;
}
.img-wrap:nth-child(3n) {
  margin-right: 0;
}
.img {
  display: flex;
  width: 220rpx;
  height: 220rpx;
}
</style>
