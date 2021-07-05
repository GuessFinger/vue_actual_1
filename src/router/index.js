import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '../components/login'
const login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// import home from '../components/home'
const home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
// import welcome from '../components/welcome'
const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import user from '../components/user/user'
const user = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/user')
// import rights from '../components/power/rights'
const rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/rights')
// import roles from '../components/power/roles'
const roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/roles')

// import cate from '../components/goods/cate'
const cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/cate.vue')
// import params from '../components/goods/params'
const params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/params.vue')

// import list from '../components/goods/list'
const list = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/list.vue')
// import add from '../components/goods/add'
const add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/add.vue')

// import orders from '../components/order/order'
const orders = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/order.vue')
// import report from '../components/report/report'
const report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/report.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: user
      },
      {
        path: '/rights',
        component: rights
      },
      {
        path: '/roles',
        component: roles
      },
      {
        path: '/categories',
        component: cate
      },
      {
        path: '/params',
        component: params
      },
      {
        path: '/goods',
        component: list
      },
      {
        path: '/goods/add',
        component: add
      },
      {
        path: '/orders',
        component: orders
      },
      {
        path: '/reports',
        component: report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// from 从哪里来  to 到那里去
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
