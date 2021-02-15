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
        <view class="list-title-container flex">
          <text class="list-title">{{ eventName }}</text>
          <view @click="onSelectAction">
            <img class="title-icon" src="@/static/event-detail-set.png" />
          </view>
        </view>

        <c-title title="基础数据" paddingLR="32"></c-title>

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

        <c-title title="标签" paddingLR="32" />

        <view v-if="tags.length !== 0" class="tags-container flex">
          <view class="tags margin-right text-32" v-for="item in tags" :key="item._id" @click="onTapHome(item)">
            {{ item.name }}
          </view>
        </view>
        <view v-else class="tag-blank margin-top">
          <img class="blank-img margin-bottom-sm" src="@/static/blank2.png" />
          <text class="text-sm text-grey margin-top">未添加标签</text>
        </view>

        <c-title title="时间动态" paddingLR="32" />

        <view class="history-container bg-white">
          <view class="history-item" v-for="(list, year) in historyList" :key="year">
            <view class="year margin-bottom">
              <text class="text-large text-bold margin-right-sm">{{ year.slice(1) }}</text>
              <text class="text-xs">年</text>
            </view>
            <view class="history-list flex" v-for="item in list" :key="item._id">
              <view class="left" @click="goToRecord(item.date)">
                <view>
                  <text class="text-large margin-right-sm">{{ item.date.split('-')[2] }}</text>
                  <text class="text-xs">{{ item.date.split('-')[1] }}月</text>
                </view>
                <view class="text-xs text-grey">{{ item.time }}</view>
                <view class="text-xs text-grey" v-if="item.score">值: {{ item.score }}</view>
              </view>
              <view class="right">
                <view class="content text-sm text-grey margin-bottom-sm">{{ item.describe }}</view>
                <view class="img-container" v-if="item.imageList.length">
                  <img
                    mode="aspectFill"
                    class="history-img"
                    v-for="imgUrl in item.imageList"
                    :key="imgUrl"
                    :src="imgUrl"
                    @click="onPreviewImg(imgUrl, item.imageList)"
                  />
                </view>
                <view
                  class="local-container flex"
                  v-if="item.position"
                  @click="openMap(item.position.point.coordinates, item.position.name)"
                >
                  <img class="local-icon" src="@/static/event-detail-local.png" />
                  <text class="local-name text-xs text-grey text-cut">{{ item.position.name }}</text>
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

<style>
page {
  background-color: #ffffff;
}
</style>
