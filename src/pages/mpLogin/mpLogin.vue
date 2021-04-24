<template>
  <view class="page">
    <c-header imgSrc="/static/headerImg/20210420001322.png" />

    <c-list>
      <view class="login">
        <img class="login-icon" src="@/static/sun-icon.png" />
        <text class="login-title text text-black">小番茄日常习惯打卡</text>
        <text class="login-desc text-sm text-grey">一个简单的时间打卡小程序，轻松记录小日常</text>

        <button class="login-button" open-type="login" @login="onLogin">一键登录</button>

        <text class="login-tip text-sm text-grey">请登录后使用</text>
      </view>
    </c-list>
  </view>
</template>

<script lang="ts" src="./mpLogin.ts"></script>
<style src="./mpLogin.css" scoped></style>

<style>
page {
  background-color: #ffffff;
}
</style>
