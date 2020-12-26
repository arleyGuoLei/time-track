import Vue from 'vue'
import App from './App.vue'
import uniClientdb from '@/components/uni-clientdb.vue'

Vue.config.productionTip = false
Vue.component('unicloud-db', uniClientdb)
new App().$mount()
