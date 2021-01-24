<template>
  <view class="page">
    <c-loading ref="loading" />

    <c-header
      showBack
      header-type="backgroundColor"
      :title="eventName"
      imgSrc="http://img.i7xy.cn/20210113232214.png"
      :scroll-y="scrollTop"
    />

    <c-list class="bg-white">
      <view class="list-content">
        <text class="list-title">{{ eventName }}</text>

        <c-title title="基础数据">
          <view slot="right">
            <img class="title-icon" src="@/static/event-detail-set.png" />
          </view>
        </c-title>

        <view class="base-container bg-white">
          <view class="time flex margin-bottom">
            <view class="title flex">
              <img class="base-icon" src="@/static/event-detail-time.png" />
              <text class="text-black text-32">打点次数</text>
            </view>
            <view class="base-input">{{ signNumber }}</view>
          </view>
          <view class="sum flex" v-if="openCalc">
            <view class="title flex">
              <img class="base-icon" src="@/static/event-detail-sum.png" />
              <text class="text-black text-32">量化总和</text>
            </view>
            <view class="base-input">{{ score }}</view>
          </view>
        </view>

        <c-title title="折线数据" />

        <view class="chart-container">
          <canvas canvas-id="charts" id="charts" class="charts"></canvas>
        </view>

        <c-title title="标签" />

        <c-title title="时间动态" />

        <view class="history-container bg-white">
          <view class="history-item" v-for="(list, year, index) in historyList" :key="index">
            <view class="year margin-bottom">
              <text class="text-large text-bold margin-right-sm">{{ year }}</text>
              <text class="text-xs">年</text>
            </view>
            <view class="history-list flex" v-for="(item, key) in list" :key="key">
              <view class="left">
                <view>
                  <text class="text-large margin-right-sm">{{ item.date.split('-')[2] }}</text>
                  <text class="text-xs">{{ item.date.split('-')[1] }}月</text>
                </view>
                <view class="text-xs text-grey">{{ item.time }}</view>
                <view class="text-xs text-grey" v-if="item.score">值: {{ item.score }}</view>
              </view>
              <view class="right">
                <view class="content text-sm text-grey margin-bottom">{{ item.describe }}</view>
                <view class="img-container">
                  <img
                    mode="aspectFill"
                    class="history-img"
                    v-for="(img, index) in item.imageList"
                    :key="index"
                    :src="img"
                  />
                </view>
                <view class="local-container flex" v-if="item.position">
                  <img class="local-icon" src="@/static/event-detail-local.png" />
                  <text class="local-name text-sm text-grey text-cut">{{ item.position.name }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </c-list>
  </view>
</template>

<script lang="ts" src="./eventDetail.ts"></script>
<style src="./eventDetail.css" scoped></style>
