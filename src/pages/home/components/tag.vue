<template>
  <view class="tags">
    <scroll-view :scroll-x="true" class="tags-scroll">
      <block v-for="(value, index) in list" :key="index">
        <text class="tag-item">
          {{ value }}
        </text>
      </block>
    </scroll-view>
    <view class="tags-icon">
      <img src="@/static/home-tag-edit.png" />
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
}
</script>
<style scoped>
.tags {
  height: 100rpx;
  background: #ffffff;
  display: flex;
}
.tags-scroll {
  width: 650rpx;
  height: 100rpx;
  /* 不加white-space不能滚动中文 */
  white-space: nowrap;
}
.tag-item {
  font-size: 34rpx;
  color: #333333;
  line-height: 100rpx;
  margin-left: 64rpx;
}
.tag-item:first-child {
  margin-left: 48rpx !important;
}
.tag-item:last-child {
  margin-right: 48rpx;
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
