import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import user from '../components/user/user'
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
