<template>
  <view class="page">
    <c-header imgSrc="http://img.i7xy.cn/20201208234148.png" />
    <c-list @sticky="onSticky" :scroll-y="scrollTop">
      <view slot="fixed">
        <tag />
      </view>

      <view v-for="index in 1000" :key="index">
        <text>-------- {{ index }}</text>
      </view>
    </c-list>
  </view>
</template>

<script lang="ts" src="./home.ts"></script>
<style src="./home.css" scoped></style>
