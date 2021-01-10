<template>
  <view class="page">
    <c-loading ref="loading" />

    <c-header v-show="load" imgSrc="http://img.i7xy.cn/20201208234148.png" />

    <c-list v-show="load" @sticky="onSticky" :scroll-y="scrollTop">
      <view slot="fixed">
        <tag :sticky="sticky" @changeTag="onTagChange" />
      </view>

      <view class="event-container bg-grey">
        <view class="event-item bg-white flex" v-for="(item, index) in eventList" :key="index">
          <view class="icon-container" :style="{ background: item.iconColor[0].color }">
            <img class="icon-img" :src="item.iconSrc[0].src" />
          </view>
          <view class="content-container">
            <p class="text event-name">{{ item.eventName }}</p>
            <view class="text-grey text-sm flex time-container">
              <text class="times">打点999次</text>
              <view class="clock flex">
                <img class="icon-time" src="@/static/home-time.png" />
                <text>100天</text>
              </view>
            </view>
          </view>
          <view class="finger-container">
            <img class="finger-img" src="@/static/home-finger.png" />
          </view>
        </view>
      </view>
    </c-list>

    <!-- TODO: 空白页 -->
    <text v-if="onBottom" class="on-bottom text-grey text-sm">- 到底了 -</text>

    <router-link to="/pages/addEvent/addEvent">
      <img :animation="imgAnimation" class="add-event" src="@/static/home-add-event.png" />
    </router-link>
  </view>
</template>

<script lang="ts" src="./home.ts"></script>
<style src="./home.css" scoped></style>
