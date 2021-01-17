import { VueConstructor } from 'vue/types/vue'
import SOtime from '@/utils/SOtime.js'

export default {
  install(vue: VueConstructor) {
    vue.filter('timeago', function(time: number) {
      return SOtime.time1(time)
    })
  },
}
