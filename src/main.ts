import Vue from 'vue'
import App from './App.vue'
import uniClientdb from '@/components/uni-clientdb.vue'
import link from '@/components/link.vue'
import { router, RouterMount } from '@/utils/router'
import loading from '@/plugins/loading'
import timeFilter from '@/plugins/timeFilter'
import report from '@/plugins/report'
import cLoading from '@/components/cLoading.vue'

Vue.use(router)
Vue.use(loading)
Vue.use(timeFilter)
Vue.use(report)

Vue.config.productionTip = false
Vue.component('client-db', uniClientdb)
Vue.component('router-link', link)
Vue.component('c-loading', cLoading)

const app = new Vue({
  ...App,
})

// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount() //为了兼容小程序及app端必须这样写才有效果
// #endif
