import { ListItem as ImageItem } from './../../models/iconImagesModel'
import { ListItem as ColorItem } from './../../models/iconColorsModel'
import { Component, Vue } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cTitle from '@/components/cTitle.vue'
import cInput from '@/components/cInput.vue'
import cSelect from '@/components/cSelect.vue'
import cList from '@/components/cList.vue'
import iconSetting from './components/iconSetting.vue'

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
  private eventName = ''
  private iconSrc = 'http://img.i7xy.cn/20201226154230.png'
  private iconColor = '#EDF7F2'
  private selected = false // delete

  onSelectIconSrc(data: ImageItem) {
    const { src, _id } = data
    this.iconSrc = src
  }

  onSelectIconColor(data: ColorItem) {
    const { color, _id } = data
    this.iconColor = color
  }
}
