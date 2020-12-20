<template>
  <view class="page">
    <c-header imgSrc="http://img.i7xy.cn/20201208234148.png" />

    <view v-for="index in 1000" :key="index">
      <text>-------- {{ index }}</text>
    </view>
  </view>
</template>

<script lang="ts" src="./home.ts"></script>
<style src="./home.css" scoped></style>
