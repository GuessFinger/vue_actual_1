<template>
    <div >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card class="box-card">
        <el-row :gutter="10">
         <el-col :span="6">
           <el-button type="primary">添加角色</el-button>
         </el-col>

          <el-table
            :data="rolesList"
            style="width: 100%" border strip>
            <el-table-column type="expand" label="" width="50">
              <template slot-scope="scope">
                <el-row :class="['bdbottom',index === 0 ? 'bdtop': '','vcenter']" v-for="(item,index) in scope.row.children" :key="item.id">
                 <el-col :span="5">
                   <el-tag> {{item.authName}}</el-tag>
                   <i class="el-icon-caret-right"></i>
                 </el-col>
                 <el-col :span="19" >
                   <el-row :class="[index === 0 ? '' : 'bdtop','vcenter']" v-for="(item2,index) in item.children" :key="item2.id">
                     <el-col :span="6">
                       <el-tag type="success"> {{item2.authName}}</el-tag>
                       <i class="el-icon-caret-right"></i>
                     </el-col>
                     <el-col :span="18">
                       <el-tag type="warning" v-for="(item3,index) in item2.children" :key="item3.id" closable @click="removeRightById(scope.row,item3.id)">
                         {{index + item3.authName}}
                       </el-tag>
                     </el-col>
                   </el-row>
                 </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="180"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
            <el-table-column  label="操作" width="300">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分类</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-card>

      <el-dialog @close="closeDialog"
                 title="分配权限"
                 :visible.sync="setDialogVisible"
                 width="50%">
        <el-tree :data="rightsList" :props="treeProps"
        show-checkbox node-key="id" default-expand-all
                 :default-checked-keys="defKeys"
                 ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
         <el-button @click="setDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
      </el-dialog>

    </div>
</template>

<script>
export default {
  props: {
  },
  created () {
    this.getRolesList()
  },
  data () {
    return {
      rolesList: [],
      setDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: []
    }
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    },
    async removeRightById () {
      const conformResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => {
        return error
      })
      // 如果用户确认删除 打印的就是字符串 conform
      if (conformResult !== 'conform') {
        return this.$message.info('已经取消删除')
      }
      // 删除的接口就不进行调用
      const { data: res } = await this.$http.post('delete')
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      // 这里我们不进行权限的替换 只对权限直接进行更新就可以了
    },
    async showSetRightDialog (row) {
      console.log(row)
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.rightsList = res.data
      this.getLeafKeys(row, this.defKeys)
      this.setDialogVisible = true
    },
    editRoles () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 这里请求后台  就不发送请求
      console.log(keys)
    },
    closeDialog () {
      console.log('关闭')
    },
    // 通过递归的方式获取所有勾选的
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
      console.log(this.defKeys)
    }
  }
}
</script>
<style type="scss" scoped>
  .el-breadcrumb {
    padding-bottom: 15px;
    font-size: 12px;
  }
  .el-tag{
    margin: 7px;
  }
  .bdtop{
    border-top: 1px solid #eeeeee;
  }
  .bdbottom{
    border-bottom: 1px solid #eeeeee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
</style>
