<template>
    <div class="params">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-alert :closable="false" title="提示：只允许选择三级分类" type="warning" show-icon></el-alert>
        <el-row class="cat_option">
         <el-col :span="10" style="float: left">
           <span>选择分类: </span>
           <el-cascader clearable
                        v-model="selectedCatId"
                        :options="categoriesList"
                        :props="cascaderProps"
                        @change="parentCascaderChange"></el-cascader>
         </el-col>
        </el-row>
        <el-row :gutter="10">
           <el-col  :span="20">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="addDialogVisible">添加参数</el-button>
                <el-table
                  :data="manyTabData"
                  style="width: 100%">
                  <el-table-column
                    label="#"
                    type="expand"
                    width="180">
                    <template slot-scope="scope">
                      <el-tag type="success" v-for="(item,index) in scope.row.attr_vals" :key="index" closable>{{item}}</el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="#"
                    type="index"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="attr_name"
                    label="参数名称"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                      <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)">刪除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" size="mini" :disabled="isButtonDisabled" @click="addDialogVisible">添加参数</el-button>
                <el-table
                  :data="onlyTabData"
                  style="width: 100%">
                  <el-table-column
                    label="#"
                    type="expand"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    label="#"
                    type="index"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="attr_name"
                    label="属性名称"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                      <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr(scope.row.attr_id)">刪除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-card>

      <el-dialog
        :title="'添加' + dialogTitle"
        :visible.sync="dialogVisible"
        @close="addDialogClose"
        width="30%">
        <el-form :model="addForm" :rules="addAttrRule" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAttrData">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="'修改' + dialogTitle"
        :visible.sync="editDialogVisible"
        @close="editDialogClose"
        width="30%">
        <el-form :model="editForm" :rules="editAttrRule" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="dialogTitle" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAttrData">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
      categoriesList: [],
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectedCatId: [],
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addAttrRule: {
        attr_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        attr_name: ''
      },
      editAttrRule: {
        attr_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    isButtonDisabled () {
      if (this.selectedCatId.length !== 3) {
        return true
      }
      return false
    },
    cateId () {
      if (this.selectedCatId.length === 3) {
        return this.selectedCatId[2]
      }
      return null
    },
    dialogTitle () {
      return this.activeName === 'many' ? '动态参数' : '静态参数'
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取分类列表失败')
      this.categoriesList = res.data
    },
    parentCascaderChange () {
      this.getParamsData()
    },
    handleClick () {
      console.log(this.selectedCatId)
      this.getParamsData()
    },
    async getParamsData () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数列表失败')
      console.log(res)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显式
        item.inputVisible = false
        item.intpuValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTabData = res.data
        console.log(this.manyTabData)
      } else {
        this.onlyTabData = res.data
      }
    },
    addDialogVisible () {
      this.dialogVisible = true
    },
    addDialogClose () {
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
    },
    editDialogClose () {
      this.$refs.editRuleForm.resetFields()
    },
    addAttrData () {
      this.$refs.ruleForm.validate(async value => {
        if (value) {
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attirbutes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 200) return this.$message.error('添加失败')
        }
      })
      this.dialogVisible = false
    },
    editAttrData () {
      this.$refs.editRuleForm.validate(async value => {
        if (value) {
          const { data: res } = await this.$http.post(`categories/${this.cateId}/attirbutes`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 200) return this.$message.error('添加失败')
        }
      })
      this.editDialogVisible = false
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`categories/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.editDialogVisible = true
    },
    async deleteAttr (id) {
      const conformResult = await this.$confirm('是否删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => {
        return error
      })
      if (conformResult !== 'conform') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除属性失败')
      }
      this.$message.success('删除属性成功')
    },
    handleInputConfirm (row) {
      const inputValue = this.inputValue
      if (inputValue) {
        // 这里如果没有渲染出来 一种是 先发送一个请求  另一种就是 Vue.$set这样的方式

        row.attr_vals.push(inputValue)
      }
      row.inputVisible = false
      this.inputValue = ''

      // 这里进行网络请求
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>
<style type="scss" scoped>
  .el-breadcrumb {
    padding-bottom: 15px;
    font-size: 12px;
  }
  .cat_option{
    margin: 15px -50px;
  }
  .el-tag{
    margin: 10px;
  }
  .el-input{
    width:100px
  }

</style>
