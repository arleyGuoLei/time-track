<template>
  <view class="page">
    <c-header imgSrc="http://img.i7xy.cn/20201208234148.png" />

    <c-list>
      <template slot="fixed">
        <view class="tags">
          <scroll-view class="tags-scroll"></scroll-view>
          <view class="tags-icon"></view>
        </view>
      </template>
      <view v-for="index in 1000" :key="index">
        <text>-------- {{ index }}</text>
      </view>
    </c-list>
  </view>
</template>

<script lang="ts" src="./home.ts"></script>
<style src="./home.css" scoped></style>
