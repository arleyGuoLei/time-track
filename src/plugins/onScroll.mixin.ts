import { VueConstructor } from 'vue/types/vue'

interface ScrollEvent {
  scrollTop: number
}

export const scrollTopMixin: any = {
  data() {
    return {
      scrollTop: 0,
    }
  },
  onPageScroll(event: ScrollEvent) {
    const { scrollTop } = event
    ;((this as any) as ScrollEvent).scrollTop = scrollTop
  },
  onLoad() {
    // noop, 不写该函数app初始化执行顺序不对
  },
}

export default {
  install(vue: VueConstructor) {
    vue.mixin(scrollTopMixin)
  },
}
