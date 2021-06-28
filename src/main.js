import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import { Form, Button, FormItem, Input } from 'element-ui'
Vue.use(Form)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
