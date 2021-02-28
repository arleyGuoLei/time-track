<template>
  <view class="page">
    <c-loading ref="loading" />

    <c-header
      v-show="load"
      header-type="backgroundColor"
      title="时间打点"
      imgSrc="http://img.i7xy.cn/20201208234148.png"
      :scroll-y="scrollTop"
    />

    <c-list v-show="load" @sticky="onSticky" :scroll-y="scrollTop">
      <view slot="fixed">
        <tag ref="tag" :sticky="sticky" @changeTag="onTagChange" />
      </view>

      <view class="event-container bg-grey">
        <block v-for="(item, index) in eventList" :key="index">
          <view class="event-item bg-white flex" v-if="item.status !== 0">
            <view class="icon-container" :style="{ background: item.iconColor[0].color }">
              <img class="icon-img" mode="aspectFit" :src="item.iconSrc[0].src" />
            </view>
            <view class="content-container" @tap="onTapDetail(item._id, item.eventName)">
              <p class="text event-name text-cut">{{ item.eventName }}</p>
              <view class="text-grey text-sm flex time-container">
                <text class="times">打点{{ item.signNumber ? item.signNumber : 0 }}次</text>
                <view class="clock flex" v-if="item.signNumber">
                  <img class="icon-time" src="@/static/home-time.png" />
                  <text class="text-cut">{{ item.lastTime | timeago }}</text>
                </view>
              </view>
            </view>
            <view
              class="finger-container"
              @longpress="onLongPressSign(item._id)"
              @tap="onTapSign(item._id, item.eventName, item.openCalc)"
            >
              <img class="finger-img" src="@/static/home-finger.png" />
            </view>
          </view>
        </block>
      </view>
    </c-list>

    <view class="blank" v-if="eventList.length === 0 && !isLoading">
      <img class="blank-img margin-bottom-sm" src="@/static/blank.png" />
      <text class="text-sm text-grey">无任何事件</text>
    </view>
    <text v-if="onBottom && eventList.length !== 0" class="on-bottom text-grey text-sm">— 到底了 —</text>

    <router-link to="/pages/addEvent/addEvent">
      <img :animation="imgAnimation" class="add-event" src="@/static/home-add-event.png" />
    </router-link>
  </view>
</template>

<script lang="ts" src="./home.ts"></script>
<style src="./home.css" scoped></style>
