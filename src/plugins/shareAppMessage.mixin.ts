import { VueConstructor } from 'vue/types/vue'

export const onShareAppMessageMixin: any = {
  onShareAppMessage() {
    return {
      title: '时间打卡，记录生活小日常 ~',
      path: '/pages/home/home',
      imageUrl: './../../static/share-cover.png',
    }
  },
}

export default {
  install(vue: VueConstructor) {
    vue.mixin(onShareAppMessageMixin)
  },
}
