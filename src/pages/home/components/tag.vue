<template>
  <view class="tags ani-fadein anic-300ms" :class="sticky ? '' : 'radius'">
    <scroll-view
      :scroll-x="true"
      :scroll-into-view="'item_' + selectIndex"
      :scroll-with-animation="true"
      class="tags-scroll"
    >
      <text class="tag-item" :class="[selectIndex === -1 ? 'tag-item__active' : '']" @click="onSelect(-1)">全部</text>
      <block v-for="(value, index) in list" :key="index">
        <text
          :id="'item_' + index"
          :class="[index === selectIndex ? 'tag-item__active' : '']"
          class="tag-item"
          @click="onSelect(index)"
        >
          {{ value.name }}
        </text>
      </block>
      <text class="tag-item" :class="[selectIndex === -2 ? 'tag-item__active' : '']" @click="onSelect(-2)">归档</text>
    </scroll-view>
    <router-link to="/pages/editTags/editTags">
      <view class="tags-icon">
        <img src="@/static/tag-edit.png" />
      </view>
    </router-link>
  </view>
</template>

<script lang="ts">
import { tagsModel } from '@/models'
import { ListItem } from '@/models/tagsModel'
import { DEFAULT_TAG_ID, STORE_TAG_ID } from '@/utils/constant'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: false }) private sticky!: boolean
  private list: ListItem[] = []
  private selectIndex = -1

  mounted() {
    // 字节跳动小程序BUG：首页还没onload，子组件先mounted了, 所以使用home页面来初始化tag数据
    // this.initTagData()
  }

  initTagData() {
    console.log('initTagData')
    ;(this as any).$loading('getTagList', this.getTagList.bind(this))
    uni.$on('onTagsChange', this.onTagsChange)
    uni.$on('onTagSelect', this.onTagSelect)
  }

  destroyed() {
    uni.$off('onTagsChange', this.onTagsChange)
    uni.$off('onTagSelect', this.onTagSelect)
  }

  async getTagList() {
    this.list = await tagsModel.getList()
  }

  onTagSelect(tag: { _id: string }) {
    let selectIndex = -1
    for (let index = 0; index < this.list.length; index++) {
      if (this.list[index]._id === tag._id) {
        selectIndex = index
        break
      }
    }
    this.onSelect(selectIndex)
  }

  onSelect(index: number) {
    if (this.selectIndex === index) {
      return
    }
    this.selectIndex = index
    this.$emit('changeTag', index === -1 ? DEFAULT_TAG_ID : index === -2 ? STORE_TAG_ID : this.list[index]._id)
  }

  onTagsChange(data: any) {
    const { tagList }: { tagList: ListItem[] } = data
    if (this.selectIndex === -1) {
      this.list = tagList
      return
    }
    const oldTag = this.list[this.selectIndex]
    for (const [index, tag] of Object.entries(tagList)) {
      if (oldTag._id === (tag as ListItem)._id) {
        this.selectIndex = +index
        break
      } else {
        if (+index + 1 === tagList.length) {
          // 已经循环所有列表项，没找到以前的id 说明老的tag被删除了，这个时候切回全部
          this.onSelect(-1)
        }
      }
    }
    this.list = tagList
  }
}
</script>
<style scoped>
.tags {
  height: 100rpx;
  background: #ffffff;
  display: flex;
  border-bottom: 1rpx solid #f5f5f5;
}
.radius {
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
}
.tags-scroll {
  width: 650rpx;
  height: 100rpx;
  /* 不加white-space不能滚动中文 */
  white-space: nowrap;
  position: relative;
}
.tags-scroll::after {
  display: block;
  content: '';
  position: absolute;
  height: 100rpx;
  width: 84rpx;
  right: 0;
  top: 0;
  background-image: linear-gradient(270deg, #fff, hsla(0, 0%, 100%, 0));
}
.tag-item {
  font-size: 34rpx;
  color: #818181;
  line-height: 100rpx;
  padding: 0 24rpx 0 48rpx;
}
.tag-item:last-child {
  margin-right: 64rpx;
}
.tag-item__active {
  color: #333333;
}
.tags-icon {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tags-icon > img {
  width: 32rpx;
  height: 32rpx;
}
</style>
