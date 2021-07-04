<template>
    <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-table :data="rightsList" style="width: 100%" border stripe>
           <el-table-column  type="index" width="180" label="#"></el-table-column>
           <el-table-column  prop="authName" label="权限名称" width="180"> </el-table-column>
           <el-table-column  prop="path" label="路径" width="180"> </el-table-column>
           <el-table-column  prop="level" label="登记" width="180">
             <template slot-scope="scope">
               <el-tag v-if="scope.row.level ==='0'">一级</el-tag>
               <el-tag v-if="scope.row.level ==='1'" type="success">二级</el-tag>
               <el-tag v-if="scope.row.level ==='2'" type="warning">三级</el-tag>
             </template>
           </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  props: {
  },
  created () {
    this.getRightsList()
  },
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
    }
  }
}
</script>
<style type="scss" scoped>
  .el-breadcrumb {
    padding-bottom: 15px;
    font-size: 12px;
  }
</style>
