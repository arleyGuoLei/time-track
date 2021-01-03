import { Vue } from 'vue-property-decorator'
import { VueConstructor } from 'vue/types/vue'

interface Page {
  $vm: Vue
}

function getLoaingRef() {
  const page = getCurrentPages<Page>()
  const $vm = page[page.length - 1].$vm
  return $vm.$refs['loading'] || null
}

export default {
  install(vue: VueConstructor) {
    this.useLoading(vue)
  },

  useLoading(vue: VueConstructor) {
    vue.prototype.$loading = async function(
      key: string,
      loadingFn: <T>() => Promise<T>,
      openReload = true,
      ...args: any
    ) {
      const loading = getLoaingRef() as any
      if (loading && loading.add) {
        try {
          loading.add(key, loadingFn, openReload)
          await loadingFn.apply(this, args)
          loading.remove(key)
        } catch (error) {
          loading.fail(key)
          throw error
        }
      } else {
        // loading组件挂载有时候比较慢，不应该阻塞数据加载
        await loadingFn.apply(this, args)
      }
    }
  },
}
