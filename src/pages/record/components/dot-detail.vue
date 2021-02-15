<template>
  <view class="detail">
    <view class="card" :style="{ maxHeight: cardHeight + 'px' }" @touchmove.stop.prevent="onMoveHandle">
      <scroll-view
        class="card-list"
        scroll-y="true"
        :style="{ maxHeight: listHeight + 'px' }"
        scroll-into-view="current"
      >
        <block v-for="(item, index) in list" :key="item._id">
          <view class="previous flex-column" v-if="index !== list.length - 1">
            <view class="previous-title flex">
              <view class="previous-line mr-24"></view>
              <text class="previous-title__text fw-500 text text-black text-cut">
                {{ item.eventName }}
              </text>
            </view>
            <text class="previous-title__desc text-grey mt-16 margin-bottom">
              {{ item.time }} ~ {{ item.timeDuration }}
            </text>
          </view>
          <!-- 当前点击的打点项 -->
          <view id="current" class="current flex-column pb-28" v-else>
            <view class="current-title flex">
              <view class="current-line mr-24"></view>
              <text class="current-title__text fw-500 text text-blue text-cut">
                {{ item.eventName }}
              </text>
              <text class="current-title__time text-sm text-blue">{{ item.time }}</text>
            </view>
            <text class="current-describe text-sm text-grey mt-16">
              {{ item.describe }}
            </text>
            <view class="img-container mt-16" v-if="item.imageList.length">
              <img
                v-for="imgUrl in item.imageList"
                mode="aspectFill"
                class="history-img"
                :data-img-url="imgUrl"
                :data-img-list="item.imageList"
                :key="imgUrl"
                :src="imgUrl"
                @click="onPreviewImg"
              />
              <text>{{ imgUrl }}</text>
            </view>
            <view
              v-if="item.position"
              :data-position-info="item.position"
              class="local-container flex mt-28"
              @click="onOpenMap"
            >
              <img class="local-icon" src="@/static/event-detail-local.png" />
              <text class="local-name text-xs text-grey text-cut">{{ item.position.name }}</text>
            </view>
          </view>
        </block>
      </scroll-view>
      <view class="footer flex">
        <view class="line"></view>
        <text class="footer-edit text-sm text-blue">编辑</text>
        <text class="footer-close text-sm text-grey" @click="onClose">关闭</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import dayjs from 'dayjs'
import toObject from 'dayjs/plugin/toObject'
import Duration from 'dayjs/plugin/duration'
dayjs.extend(toObject)
dayjs.extend(Duration)

interface EventItem {
  _id: string
  eventName: string
  iconSrc: {
    _id: string
    src: string
  }[]
  iconColor: {
    _id: string
    color: string
  }
}

interface Position {
  point: {
    type: string
    coordinates: number[]
  }
  address: string
  name: string
}

interface DotItem {
  _id: string
  describe: string
  dotTimestamp: number
  time: string
  event_id: EventItem[]
  score?: number
  imageList?: string[]
  position?: Position
}

interface Item {
  eventName: string
  time: string
  dotTimestamp: number
  timeDuration: string
  describe?: string
  imageList?: string[]
  position?: Position
}

@Component
export default class extends Vue {
  @Prop({ default: [] }) private dotList!: DotItem[]
  @Prop({ default: { id: '', index: -1, show: true } }) private detailInfo!: {
    id: string
    index: number
    show: boolean
  }

  private list: Item[] = []
  private cardHeight = 0
  private listHeight = 0

  created() {
    this.initCardUI()
    this.formatList(this.dotList, this.detailInfo.index)
  }

  initCardUI() {
    const { windowHeight } = uni.getSystemInfoSync()
    const cardHeight = windowHeight * 0.8
    const listHeight = cardHeight - uni.upx2px(100 + 48)
    this.cardHeight = cardHeight
    this.listHeight = listHeight
  }

  @Emit('onClose')
  onClose() {
    console.log('close')
  }

  formatList(dotList: DotItem[], index: number) {
    if (!Array.isArray(dotList) || dotList.length < index) {
      return
    }
    const list = []
    // 当前点击的项
    const lastItem: Item = {
      eventName: dotList[index].event_id[0].eventName + (dotList[index].score ? ` (+${dotList[index].score})` : ''),
      time: dotList[index].time,
      timeDuration: '',
      dotTimestamp: dotList[index].dotTimestamp,
      describe: dotList[index].describe,
      imageList: dotList[index].imageList,
      position: dotList[index].position,
    }

    // 点击项的前面的列表
    for (let i = 0; i < index; i++) {
      const startTime = dayjs(+dotList[i].dotTimestamp)
      const endTime = dayjs(+lastItem.dotTimestamp)
      const duration = dayjs.duration(endTime.diff(startTime)).format('距离HH小时mm分')
      list.push({
        eventName: dotList[i].event_id[0].eventName,
        time: dotList[i].time,
        timeDuration: duration,
        dotTimestamp: dotList[i].dotTimestamp,
      })
    }
    list.push(lastItem)
    this.list = list
  }

  onPreviewImg(event: any) {
    uni.previewImage({
      current: event.currentTarget.dataset.imgUrl,
      urls: event.currentTarget.dataset.imgList,
    })
  }

  onOpenMap(event: any) {
    const {
      positionInfo: {
        point: { coordinates },
        name,
      },
    } = event.currentTarget.dataset
    uni.openLocation({
      longitude: coordinates[0],
      latitude: coordinates[1],
      name: name,
    })
  }

  onMoveHandle() {
    return false
  }
}
</script>
<style scoped>
.detail {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
  touch-action: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  width: 686rpx;
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 48rpx;
  padding-left: 48rpx;
  padding-right: 48rpx;
  box-shadow: 0 6rpx 20rpx 0 rgba(0, 0, 0, 0.1);
}
.card-list {
  width: 100%;
  scroll-behavior: smooth;
}
.footer {
  height: 100rpx;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
.line {
  position: absolute;
  top: 0;
  width: 600rpx;
  height: 1rpx;
  background: rgba(0, 0, 0, 0.1);
  transform: scaleY(0.5);
}
.footer-edit,
.footer-close {
  padding: 16rpx 100rpx;
}
.previous {
  width: 100%;
  display: flex;
  position: relative;
}
.previous-title {
  height: 48rpx;
  width: 100%;
}
.previous-line {
  width: 8rpx;
  height: 36rpx;
  background: #a5caf1;
  border-radius: 4rpx;
}
.previous-title__text {
  width: 550rpx;
}
.previous-title__desc {
  width: 100%;
}
.current {
  width: 100%;
  display: flex;
  position: relative;
}
.current-title {
  height: 48rpx;
  width: 100%;
}
.current-line {
  width: 8rpx;
  height: 36rpx;
  background: #4f9bfa;
  border-radius: 4rpx;
}
.current-title__text {
  flex: 1;
}
.current-describe {
  width: 100%;
}

/* 当前选中的点的图片列表和位置信息 */

.img-container {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
}

.history-img {
  width: 170rpx;
  height: 170rpx;
  border-radius: 8rpx;
  margin-right: 13rpx;
  margin-bottom: 13rpx;
  position: relative;
  overflow: hidden;
  display: flex;
}

.history-img::before {
  position: absolute;
  content: '';
  display: block;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.05) 100%);
  pointer-events: none;
}

.history-img:nth-child(3n) {
  margin-right: 0;
}

.local-container {
  width: 100%;
}

.local-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 16rpx;
}

.local-name {
  flex: 1;
}
</style>
