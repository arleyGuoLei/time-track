import { Component, Vue } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import tag from './components/tag.vue'

@Component({
  components: {
    cHeader,
    tag,
  },
})
export default class extends Vue {}
