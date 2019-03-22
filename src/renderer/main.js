/** 库引入 */
import Vue from 'vue'
import axios from 'axios'
import db from './dataStore'
// import Element from 'element-ui'

/** 项目工具引入 */
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'
import request from '@/utils/request'
import './errorLog'
import './pageLoadInjector'

/** 样式引入 */
import './css/normalize.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// mockjs : simulation data for development
if (process.env.NODE_ENV === 'development') {
  require('./mock')
}

// 注册过滤器
Object.keys(filters).forEach(key => {
  // // console.log(key)
  Vue.filter(key, filters[key])
})

// requests 封装
Vue.prototype.$request = request

// NeDB 数据库
Vue.prototype.$db = db

// Element UI
// Vue.use(Element)

// eslint-disable no-new
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
