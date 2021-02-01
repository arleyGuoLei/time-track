<template>
  <view class="page">
    <c-loading ref="loading" />

    <calendar-horizontal ref="calendar" @date-change="onDateChange" />

    <block v-for="(item, index) in dotList" :key="index">
      <item
        :item-id="item._id"
        :iconSrc="item.event_id[0].iconSrc[0].src"
        :iconColor="item.event_id[0].iconColor[0].color"
        :eventName="item.event_id[0].eventName"
        :signTime="item.time"
      ></item>
    </block>

    <view class="blank" v-if="dotList.length === 0 && !isLoading">
      <img class="blank-img margin-bottom-sm" src="@/static/blank2.png" />
      <text class="text-sm text-grey">当日未打卡</text>
    </view>
    <text v-else class="on-bottom text-grey text-sm margin-top margin-bottom">- 点击“卡片”可查看详情 -</text>
  </view>
</template>

<script lang="ts" src="./record.ts"></script>
<style src="./record.css" scoped></style>
