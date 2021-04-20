<template>
  <view class="page">
    <c-loading ref="loading" />

    <view class="user-container">
      <view class="avator">
        <!-- #ifdef MP-WEIXIN	|| MP-BAIDU	|| MP-QQ -->
        <open-data type="userAvatarUrl"></open-data>
        <!-- #endif -->

        <!-- #ifdef MP-TOUTIAO -->
        <img class="avator" :src="avatarUrl" />
        <!-- #endif -->
      </view>
      <view class="name mt-28 text-white">
        <!-- #ifdef MP-WEIXIN	|| MP-BAIDU	|| MP-QQ -->
        <open-data type="userNickName"></open-data>
        <!-- #endif -->

        <!-- #ifdef MP-TOUTIAO -->
        <text class="name mt-28 text-white">{{ nickName }}</text>
        <!-- #endif -->
      </view>
      <view class="info-container text-white">
        <view class="dot-num">
          <view class="num text-large text-bold">{{ signTimes }}</view>
          <view class="desc text-xs">打点次数</view>
        </view>
        <view class="line bg-white"></view>
        <view class="day-num">
          <view class="num text-large text-bold">{{ signDays }}</view>
          <view class="desc text-xs">打点天数</view>
        </view>
      </view>
    </view>
    <view class="list-container bg-white">
      <block v-for="(item, index) in list" :key="index">
        <button
          v-if="item.openType === 'openGroupProfile'"
          class="list flex"
          :open-type="item.openType"
          :group-id="item.groupId"
          @click="methods(item.method)"
        >
          <view class="left flex">
            <img class="list-icon mr-24" :src="`../../static/mine-${item.iconName}.png`" />
            <span>{{ item.title }}</span>
          </view>
        </button>

        <button v-else class="list flex" :open-type="item.openType" @click="methods(item.method)">
          <view class="left flex">
            <img class="list-icon mr-24" :src="`../../static/mine-${item.iconName}.png`" />
            <span>{{ item.title }}</span>
          </view>
        </button>
      </block>

      <text class="on-bottom text-grey-light text-sm">version: 1.0.10</text>
    </view>
  </view>
</template>

<script lang="ts" src="./mine.ts"></script>
<style src="./mine.css" scoped></style>

<style>
page {
  background-color: #ffffff;
}
</style>
