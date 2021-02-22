<template>
  <view class="page">
    <view class="user-container">
      <view class="avator">
        <!-- #ifdef MP-WEIXIN	|| MP-BAIDU	|| MP-QQ -->
        <open-data type="userAvatarUrl"></open-data>
        <!-- #endif -->
      </view>
      <view class="name mt-28 text-white">
        <!-- #ifdef MP-WEIXIN	|| MP-BAIDU	|| MP-QQ -->
        <open-data type="userNickName"></open-data>
        <!-- #endif -->
      </view>
      <view class="info-container text-white">
        <view class="dot-num">
          <view class="num text-large text-bold">321</view>
          <view class="desc text-xs">打点次数</view>
        </view>
        <view class="line bg-white"></view>
        <view class="day-num">
          <view class="num text-large text-bold">123</view>
          <view class="desc text-xs">打点天数</view>
        </view>
      </view>
    </view>
    <view class="list-container bg-white">
      <button class="list flex" v-for="(item, index) in list" :key="index" :open-type="item.openType">
        <view class="left flex">
          <img class="list-icon mr-24" :src="`../../static/mine-${item.iconName}.png`" />
          <span>{{ item.title }}</span>
        </view>
      </button>
    </view>
  </view>
</template>

<script lang="ts" src="./mine.ts"></script>
<style src="./mine.css" scoped></style>
