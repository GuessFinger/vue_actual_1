<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-title">
        <img class="image_class" src="../assets/images/t.jpg" alt="头像">
        <span>电商管理系统</span>
      </div>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="toggleCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse = !toggleCollapse">|||</div>
        <el-menu
          router
          :collapse="toggleCollapse"
          :collapse-transition="false"
          :unique-opened="true"
          background-color="black"
          text-color="#fff"
          active-text-color="#9f9ff0"
          :default-active="$route.path">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path " v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  props: {},
  data () {
    return {
      menuList: [],
      toggleCollapse: false
    }
  },
  mounted () {
    this.getMenuList()
  },
  methods: {
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style type="scss" scoped>
  .el-header {
    background-color: gray;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .header-title {
    display: flex;
    align-items: center;
  }

  .image_class {
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin-left: 10px;
  }

  .header-title span {
    margin-left: 15px;
  }

  .el-aside {
    background-color: black;
  }

  .el-aside .el-menu {
    border-right: none;
  }

  .el-main {
    background-color: #e6ffe0;
  }

  .home-container {
    height: 100%;
  }

  .toggle-button {
    background-color: red;
    font-size: 10px;
    color: #ffffff;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
