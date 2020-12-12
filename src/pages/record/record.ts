import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  onLoad() {
    console.log('record')
  }
}
