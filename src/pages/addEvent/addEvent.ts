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

  private iconSrcList = new Array(97).fill('http://img.i7xy.cn/20201226154230.png')
  private iconColorList = new Array(95).fill('#EDF7F2')
}
