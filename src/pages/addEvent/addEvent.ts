import { showTip } from './../../utils/utils'
import { eventsModel } from './../../models/index'
import { tagsModel } from './../../models'
import { ListItem as ImageItem } from './../../models/iconImagesModel'
import { ListItem as ColorItem } from './../../models/iconColorsModel'
import { ListItem as TagItem } from './../../models/tagsModel'
import { ListItem as eventItem } from './../../models/eventsModel'
import { Component, Vue } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cSelect from '@/components/cSelect.vue'
import cList from '@/components/cList.vue'
import iconSetting from './components/iconSetting.vue'

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
  },
})
export default class extends Vue {
  /* 事件名称 */
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
  /* 开启量化值 */
  private openCalc = false

  onLoad() {
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

  async getTags() {
    this.tags = (await tagsModel.getList()).map(item => ({ ...item, selected: false }))
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
    const { eventName, iconSrc, iconColor, tags, openCalc } = this
    const item = {
      eventName,
      iconSrc: iconSrc._id,
      iconColor: iconColor._id,
      tags: getSelectTagsId(tags),
      openCalc,
    }
    const v = validateForm(item)
    if (v.status) {
      const {
        result: { id },
      } = await (this as any).$loading('addEvent', eventsModel.addEvent.bind(this), false, '保存中', item)
      console.log('log =>  ~ file: addEvent.ts ~ line 106 ~ extends ~ onSave ~ id', id)
      showTip('保存成功')
    } else {
      showTip(v.msg)
    }
  }
}
