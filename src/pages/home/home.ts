import { Component, Vue } from 'vue-property-decorator'
import cHeader from '@/components/cHeader.vue'
import cList from '@/components/cList.vue'

@Component({
  components: {
    cHeader,
    cList,
  },
})
export default class extends Vue {}
