<template>
  <view class="tags">
    <scroll-view
      :scroll-x="true"
      :scroll-into-view="'item_' + selectIndex"
      :scroll-with-animation="true"
      class="tags-scroll"
    >
      <block v-for="(value, index) in list" :key="index">
        <text
          :id="'item_' + index"
          :class="[index === selectIndex ? 'tag-item__active' : '']"
          class="tag-item"
          @click="onSelect(index)"
        >
          {{ value }}
        </text>
      </block>
    </scroll-view>
    <view class="tags-icon">
      <img src="@/static/tag-edit.png" />
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  private list = [
    '全部',
    '日常',
    '周卡',
    '月卡',
    '年卡',
    '不定时',
    '全部',
    '日常',
    '周卡',
    '月卡',
    '年卡',
    '不定时',
    '全部',
    '日常',
    '周卡',
    '月卡',
    '年卡',
    '不定时',
  ]
  private selectIndex = 0

  onSelect(index: number) {
    this.selectIndex = index
    console.log('log =>  ~ file: tag.vue ~ line 43 ~ extends ~ onSelect ~ index', index)
  }
}
</script>
<style scoped>
.tags {
  height: 100rpx;
  background: #ffffff;
  display: flex;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
}
.tags-scroll {
  width: 650rpx;
  height: 100rpx;
  /* 不加white-space不能滚动中文 */
  white-space: nowrap;
}
.tag-item {
  font-size: 34rpx;
  color: #818181;
  line-height: 100rpx;
  padding: 0 24rpx 0 48rpx;
}
.tag-item__active {
  color: #333333;
}
.tags-icon {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tags-icon > img {
  width: 32rpx;
  height: 32rpx;
}
</style>
