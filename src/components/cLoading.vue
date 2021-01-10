<template>
  <view>
    <view class="page" v-if="status !== 'none'">
      <view class="loading" v-if="status === 'loading'">
        <img class="loading-img" src="@/static/loading.png" />
        <text class="loading-text">{{ loadingText }}</text>
      </view>

      <view class="fail" v-else-if="status === 'fail'">
        <img class="fail-img" src="@/static/loading-fail.png" />
        <text class="fail-text">加载异常</text>
        <button class="reload" @click="onReload">重新加载</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

type STATUS = 'none' | 'loading' | 'fail'

interface Stash {
  key: string
  fn: () => any
  status: STATUS
  openReload: boolean // 是否加入能重试的队列、是否打开加载失败页面
}

@Component
export default class extends Vue {
  private loadingText = '加载中'
  private status: STATUS = 'none'
  private stash: Stash[] = []

  @Watch('stash')
  stashChange(stash: Stash[]) {
    if (stash.length === 0) {
      this.status = 'none'
      return
    }
    for (const s of ['fail', 'loading']) {
      const has = stash.some(item => item.status === s)
      if (has) {
        this.status = s as STATUS
        break
      }
    }
  }

  public add(key: string, fn: any, openReload = true, loadingText?: string) {
    this.stash.push({ key, fn, status: 'loading', openReload })
    loadingText && (this.loadingText = loadingText)
  }

  public remove(key: string) {
    this.stash = this.stash.filter(item => item.key !== key)
  }

  public fail(key: string) {
    this.stash = this.stash.map(item => ({
      ...item,
      status: key === item.key && item.openReload ? 'fail' : item.status,
    }))
  }

  public clear() {
    this.stash = []
  }

  private onReload() {
    this.stash
      .filter(item => item.status === 'fail')
      .forEach(item => {
        this.remove(item.key)
        ;(this as any).$loading(item.key, item.fn)
      })
  }
}
</script>
<style scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page::after {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  z-index: -1;
  content: ' ';
  background: rgba(255, 255, 255, 0.95);
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.loading-img {
  width: 84rpx;
  height: 84rpx;
  animation: rotate 2s linear infinite;
}
.loading-text {
  margin-top: 24rpx;
  font-size: 32rpx;
}
.fail {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fail-img {
  width: 328rpx;
  height: 172rpx;
}
.fail-text {
  font-size: 32rpx;
  color: #bacefd;
  margin-top: 36rpx;
}
.reload {
  width: 328rpx;
  height: 84rpx;
  background: #bacefd;
  border-radius: 50rpx;
  margin-top: 72rpx;
  color: #ffffff;
  font-size: 32rpx;
}
</style>
