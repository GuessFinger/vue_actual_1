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
   

