- 怎么配置GitHub
1. git config --global user.name "guessfinger"
   git config --global user.email "373898092@qq.com"
2. git config --list  // 查看已经配置的列表
3. ssh-keygen -t rsa -C "373898092@qq.com"
4. 把其中生成的公钥(也就是有pub后缀的) 添加到GitHub上的token里面
5. ssh -T git@github.com  只要出现类似下面的语句就表示成功了
    'Hi xiangshuo1992! You've successfully authenticated, but GitHub does not provide shell access.'



- 构建vue项目
1. 命令行 vue ui  会打开浏览器，我们在浏览器中创建项目
2. 选择自定义安装 勾选babel router 等等   然后安装 vue-cli-plugin-element  axios
3. 把项目上传到你GitHub上的项目里面 (一般新创建的项目它会有提示你怎么处理的)
   

- 如果存在跨域的问题 可以使用token来解决这个问题



- 安装scss的时候报错了，可以根据错误信息去百度一下 看一看报错的内容是什么  主要就是因为安装的版本太高了 按照网络上的卸载然后从新安装
- 导入element-ui的时候报错 一直引入进来  使用vue-ui安装的时候 没有成功 最直接的表现就是 没有plugin/element.js的文件 
    重新安装以后 在main.js中 按需进行导入  import {Button} from 'element-ui'  Vue.use(Button) 这样的话 就可以使用element
    的组件了
- 在routers中配置的路由信息  当访问根目录的时候 {path:'/',redirect:'/login'}  
    当腰配置一个路由的时候 {path:'/login',component:login(这里的话 可以采用 () => import xxx  这种方式)}
    配置完路由以后 需要使用  router-view 这样路由组件就会在 app.vue中进行显示了
- 针对不同的浏览器 市面上有一套通用的处理css的方式  https://github.com/necolas/normalize.css  就是为了兼容不同的浏览器
- 针对某个特定的组件 给它的css中添加scoped 表示这个样式只针对当前的组件是生效

2021年6月30日22:33:12 lesson30章节
- form表单的验证 
    - 之前用过 在公司的时候用的是xui的组件 死活不生效，很苦恼 不知道因为什么？ 今天在login组件中也出现同样的情况 
    最后发现是你loginForm:{userName:''} 和 formRules:{userName:''}  里面的属性名必须一致 至于名称的大小写是没有关系的
    主要就是里面**属性名称一定要保持一致**
    - 把表单中的内容进行情况  this.$refs.loginForm.resetFields()直接调用这个方法就可以了
    - 提交之前我们需要对表单进行预校验  this.$refs.loginForm.validate(value => {}) 其中可以判断value的值 如果true表示验证通过
- 错误提示框  之前在使用el-button的时候 采用的是 import {Button} from 'element-ui' Vue.use(Button)  
    但是错误提示框不一样 import {Message} from 'element-ui';Vue.prototype.$message = Message 这样的使用方法
- axios  
    - import axios from 'axios' 使用axios的时候  **不需要用Vue.use(axios)** 
    - 把axios绑定在$http上 Vue.prototype.$http = axios
    - 把默认的访问路径可以设置下 axios.defaults.baseURL = "https://www.baidu.com/api/vi/"
    - 老师把异步方法用async  await 这样的方法进行访问  
- router
    - 登录成功后需要进行路由跳转  this.$router.push("/home") 这样的方式 配置路由的方式和之前一致 
        {path:'/home',component:home}  
    - 路由的巡航守卫，从下面的代码可以看出来  next(里面添加路径就是下一个需要访问的路径) 这个是访问之前进行的设置 还有一个是访问
        进行的设置 afterEach()
    ```JavaScript
      router.beforeEach((to,from,next) => {
          // from 从哪里来 to  到哪里去  这个一定要执行next()方法 要不然不知道往哪里访问了
          if (to.path === '/login') {
              return next()
            }
            const tokenStr = window.sessionStorage.getItem('token')
            if (!tokenStr) return next('/login')
            next() 
      })
    ```
- prettierrc 这个文件主要是配置格式化代码用的 已经有了.eslintrc文件 这个感觉也不是很必要   

