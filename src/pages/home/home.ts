import { Component, Vue } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cList from '@/components/cList.vue'
import tag from './components/tag.vue'

@Component({
  components: {
    cHeader,
    cList,
    tag,
  },
})
export default class extends Vue {}
