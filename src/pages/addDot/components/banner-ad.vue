<template>
  <view class="ad-view">
    <!--  #ifdef MP-TOUTIAO -->
    <ad unit-id="1b3echan3jg523j6ng" ad-intervals="32"></ad>
    <!--  #endif -->
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {}
</script>
<style scoped>
.ad-view {
  width: 686rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
}
</style>
