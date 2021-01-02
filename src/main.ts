import Vue from 'vue'
import App from './App.vue'
import uniClientdb from '@/components/uni-clientdb.vue'
import { router, RouterMount } from '@/utils/router'

Vue.use(router)

Vue.config.productionTip = false
Vue.component('unicloud-db', uniClientdb)

const app = new Vue({
  ...App,
})

// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount() //为了兼容小程序及app端必须这样写才有效果
// #endif
