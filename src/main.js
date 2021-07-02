import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'

import axios from 'axios'

Vue.prototype.$http = axios
// 配置请求的根路径
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// 给axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须进行return
  return config
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
