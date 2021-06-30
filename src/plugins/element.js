import Vue from 'vue'
import { Form, Button, FormItem, Input, Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)

// 这个需要全局挂载
Vue.prototype.$message = Message
