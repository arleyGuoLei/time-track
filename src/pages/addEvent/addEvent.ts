import { showTip } from '@/utils/utils'
import { eventsModel, tagsModel } from '@/models'
import { ListItem as ImageItem } from '@/models/iconImagesModel'
import { ListItem as ColorItem } from '@/models/iconColorsModel'
import { ListItem as TagItem } from '@/models/tagsModel'
import { ListItem as eventItem } from '@/models/eventsModel'
import { scrollTopMixin } from '@/plugins/onScroll.mixin'
import { Component, Mixins } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cSelect from '@/components/cSelect.vue'
import cList from '@/components/cList.vue'
import iconSetting from './components/iconSetting.vue'
import cSwitch from './components/c-switch.vue'
import bannerAd from '@/pages/addDot/components/banner-ad.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $report: (action: string, options?: AnyObject) => void
  }
}

interface Tag extends TagItem {
  selected: boolean
}

interface IconData {
  src: {
    _id: string
    src: string
  }
  color: {
    _id: string
    color: string
  }
}

function getSelectTagsId(tags: Tag[]) {
  return tags.filter(item => item.selected).map(item => item._id)
}

function validateForm(e: eventItem) {
  const fail = (msg: string) => {
    return {
      status: false,
      msg,
    }
  }
  if (e.eventName.length < 1 || e.eventName.length > 12) {
    return fail('名称长度应为1到12位')
  }
  if (!e.iconColor) {
    return fail('请选择图标颜色')
  }
  if (!e.iconSrc) {
    return fail('请选择图标图片')
  }
  return {
    status: true,
    msg: '',
  }
}

@Component({
  components: {
    cHeader,
    cList,
    cTitle,
    cInput,
    iconSetting,
    cSelect,
    bannerAd,
    cSwitch,
  },
})
export default class extends Mixins(scrollTopMixin) {
  /* 事件 */
  private eventId = ''
  private eventName = ''
  /* 图标 */
  private iconSrc = {
    src: '',
    _id: '',
  }
  /* 图标颜色 */
  private iconColor = {
    color: '',
    _id: '',
  }
  /* tags */
  private tags: Tag[] = []

  private showPositionSwitchStatus = true

  /* 开启量化值 */
  private openCalc = false
  /* 新建 or 更新 */
  private isUpdate = false

  onLoad() {
    if (this.$Route.query.type === 'update') {
      const { eventId, eventName, openCalc, iconColor, iconSrc, isStore } = this.$Route.query
      this.eventId = eventId
      this.eventName = eventName
      this.openCalc = openCalc
      this.iconColor = iconColor
      this.iconSrc = iconSrc
      this.isUpdate = true
      this.showPositionSwitchStatus = !isStore
    }
    this.$nextTick(() => {
      ;(this as any).$loading('getTags', this.getTags.bind(this))
    })
  }

  onEditTag() {
    uni.$once('onTagsChange', data => {
      const { tagList } = data
      this.tags = tagList.map((tag: Tag) => {
        tag.selected = this.tags.some(oldTag => {
          return oldTag._id === tag._id && oldTag.selected
        })
        return tag
      })
    })
  }

  onTagSelectChange(index: number) {
    this.$set(this.tags, index, {
      ...this.tags[index],
      selected: !this.tags[index].selected,
    })
  }

  onCalcSelectChange() {
    this.openCalc = !this.openCalc
  }

  /**
   * 显示位置switch change
   */
  onSwitchChange(status: boolean) {
    this.showPositionSwitchStatus = status
  }

  async getTags() {
    this.tags = (await tagsModel.getList()).map(item => ({ ...item, selected: false }))
    if (this.$Route.query.type === 'update') {
      this.tags = this.tags.map((item: Tag) => {
        const { tags } = this.$Route.query
        if (tags && tags.findIndex((v: TagItem) => v._id === item._id) > -1) {
          return {
            ...item,
            selected: true,
          }
        } else {
          return {
            ...item,
          }
        }
      })
    }
  }

  onInitIcon(data: IconData) {
    const { src, color } = data
    this.iconSrc = src
    this.iconColor = color
  }

  onSelectIconSrc(data: ImageItem) {
    this.iconSrc = data
  }

  onSelectIconColor(data: ColorItem) {
    this.iconColor = data
  }

  async onSave() {
    const { eventName, iconSrc, iconColor, tags, openCalc, isUpdate, eventId, showPositionSwitchStatus } = this
    const item = {
      eventName,
      iconSrc: iconSrc._id,
      iconColor: iconColor._id,
      tags: getSelectTagsId(tags),
      openCalc,
      isStore: showPositionSwitchStatus ? 0 : 1,
    }

    const v = validateForm(item)
    if (v.status) {
      if (isUpdate) {
        await (this as any).$loading('updateEvent', eventsModel.updateEvent.bind(this), false, '修改中', eventId, item)
        uni.$emit('onListUpdate', {
          type: 'updateItem',
          id: eventId,
          data: [
            {
              key: 'eventName',
              value: eventName,
              updateType: 'replace',
            },
            {
              key: 'iconSrc',
              value: [iconSrc],
              updateType: 'replace',
            },
            {
              key: 'iconColor',
              value: [iconColor],
              updateType: 'replace',
            },
            {
              key: 'tags',
              value: getSelectTagsId(tags),
              updateType: 'replace',
            },
            {
              key: 'openCalc',
              value: openCalc,
              updateType: 'replace',
            },
            {
              key: 'isStore',
              value: item.isStore,
              updateType: 'replace',
            },
          ],
        })

        // 更新日志页数据
        uni.$emit('dot', { date: new Date(), backstage: true })

        this.$report('update_event')

        await showTip('修改成功', 800)
        uni.switchTab({
          url: '/pages/home/home',
        })
      } else {
        const {
          result: { id },
        } = await (this as any).$loading('addEvent', eventsModel.addEvent.bind(this), false, '保存中', item)
        uni.$emit('onListUpdate', {
          type: 'addItem',
          id,
          data: {
            ...item,
            _id: id,
            iconSrc: [iconSrc],
            iconColor: [iconColor],
            signNumber: 0,
            lastTime: Date.now(),
          },
        })

        this.$report('add_event')
        await showTip('保存成功', 800)
        this.$Router.back(1)
      }
    } else {
      showTip(v.msg)
    }
  }
}
