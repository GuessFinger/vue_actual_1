import Vue from 'vue'
import { Form, Button, FormItem, Input, Message, Container, Header, Aside, Main, Menu, MenuItem, Submenu, MenuItemGroup, Breadcrumb, BreadcrumbItem, Card, Row, Col } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(MenuItemGroup)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

// 这个需要全局挂载
Vue.prototype.$message = Message
