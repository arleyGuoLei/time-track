import { Vue } from 'vue-property-decorator'
import { VueConstructor } from 'vue/types/vue'

interface Page {
  $vm: Vue
}

export function getLoaingRef() {
  const page = getCurrentPages<Page>()
  if (page.length === 0) {
    return null
  }
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
      openReload = true, // 加载失败是否打开点击重试
      loadingText = '加载中', // 加载中文案
      ...args: any
    ) {
      // 加入获取loading重试机制，抖音小程序上第一次获取经常获取不到
      let loading = getLoaingRef() as any
      const retryNumber = 100 // 重试100次
      for (let i = 0; i < retryNumber; i++) {
        await new Promise(resolve => {
          setTimeout(() => {
            loading = getLoaingRef() as any
            resolve(i)
          }, 0)
        })

        if (loading && loading.add) {
          break
        }
      }

      if (loading && loading.add) {
        try {
          loading.add(key, loadingFn, openReload, loadingText)
          const res = await loadingFn.apply(this, args)
          loading.remove(key)
          return res
        } catch (error) {
          console.log('error::', error)
          console.log('errorKey::', key)

          loading.fail(key)
          throw error
        }
      } else {
        // 重试完还是找不到loading组件
        // loading组件挂载有时候比较慢，不应该阻塞数据加载
        await loadingFn.apply(this, args)
      }
    }
  },
}
