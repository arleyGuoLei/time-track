<template>
  <view class="page">
    <c-loading ref="loading" />

    <textarea class="desc" v-model="describe" maxlength="1000" placeholder="这一刻的想法…" />

    <c-upload @upload="onUploaded" @delete="onDeleteImage" :list="imageList" />

    <view class="line">
      <img class="line-icon" src="@/static/time.png" />
      <view class="line-text line-date">
        <picker mode="date" :end="endDate" :value="date" @change="onDateChange">
          <text class="line-text">{{ date }}</text>
        </picker>
        <view class="separator">|</view>
        <picker mode="time" :value="time" @change="onTimeChange">
          <text class="line-text">{{ time }}:00</text>
        </picker>
      </view>
    </view>

    <view class="line">
      <img class="line-icon" src="@/static/position.png" />
      <text class="line-text text-cut" @click="onChooseLocation">{{ position.name + ' ' + position.address }}</text>
    </view>

    <view class="line" v-if="openCalc">
      <img class="line-icon" src="@/static/calc.png" />
      <input class="line-text" placeholder="输入量化值 (可用于事件自动求和)" type="text" v-model="score" />
    </view>

    <button class="save" @click="onSave">{{ pageType === 'add' ? '打 点' : '更 新' }}</button>

    <text class="text-grey text-sm margin-bottom">提示: “首页”长按打卡可快速打点</text>

    <banner-ad />
  </view>
</template>

<style>
page {
  background-color: #ffffff;
}
</style>
<style src="./addDot.css" scoped></style>
<script lang="ts" src="./addDot.ts"></script>
