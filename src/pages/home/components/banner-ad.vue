<template>
  <view
    class="ad-view"
    :style="{
      marginTop: loadSuccess ? '16rpx' : 0,
    }"
  >
    <!--  #ifdef MP-TOUTIAO -->
    <ad @load="onAdLoad" @error="onAdError" unit-id="23gyarcfikk41tb2bu" ad-intervals="32"></ad>
    <!--  #endif -->
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  private loadSuccess = false
  onAdLoad() {
    this.loadSuccess = true
  }

  onAdError(e: any) {
    console.log(e)
  }
}
</script>
<style scoped>
.ad-view {
  width: 718rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
</style>
