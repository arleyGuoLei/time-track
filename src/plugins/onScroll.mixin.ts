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
}

export default {
  install(vue: VueConstructor) {
    vue.mixin(scrollTopMixin)
  },
}
