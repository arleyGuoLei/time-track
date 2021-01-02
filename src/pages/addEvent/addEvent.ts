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
    return fail('事件名称长度应为1到12位')
  }
  if (!e.iconColor) {
    return fail('请选择图标颜色')
  }
  if (!e.iconSrc) {
    return fail('请选择图标图片')
  }
  return {
    status: true,
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
    src: 'http://img.i7xy.cn/20201226154230.png',
    _id: '',
  }
  /* 图标颜色 */
  private iconColor = {
    color: '#EDF7F2',
    _id: '',
  }
  /* tags */
  private tags: Tag[] = []
  /* 开启量化值 */
  private openCalc = false

  onLoad() {
    this.getTags()
  }

  async getTags() {
    this.tags = (await tagsModel.getList()).map(item => ({ ...item, selected: false }))
  }

  onSelectIconSrc(data: ImageItem) {
    this.iconSrc = data
  }

  onSelectIconColor(data: ColorItem) {
    this.iconColor = data
  }

  async onSave() {
    const { eventName, iconSrc, iconColor, tags, openCalc } = this
    const e = {
      eventName,
      iconSrc: iconSrc._id,
      iconColor: iconColor._id,
      tags: getSelectTagsId(tags),
      openCalc,
    }
    const v = validateForm(e)
    if (v.status) {
      await eventsModel.addEvent(e)
    } else {
      // TODO:提示
    }
  }
}
