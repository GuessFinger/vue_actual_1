<template>
  <div class="cate">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10" style="padding-bottom: 15px">
        <el-col :span="6">
          <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--   表格     -->
      <tree-table :data="categoriesList" :columns="categoriesColumns"
                  :selection-type="false" :expand-type="false" show-index index-text="序号" border
                  :show-row-hover="false">
        <!--  是否有效       -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted"></i>
          <i v-else class="el-icon-error" style="color:red"></i>
        </template>
        <!--  排序      -->
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!--  操作 -->
        <template slot="operate" slot-scope="">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">刪除</el-button>
        </template>
      </tree-table>
      <!--    分页    -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <el-dialog @close="closeRoleDialog"
               title="添加分类"
               :visible.sync="categoryDialogVisible"
               width="50%">
      <div>
        <el-form :model="addCategoryForm" :rules="categoryRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="addCategoryForm.cate_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader clearable change-on-select
              v-model="selectedCascaserId"
              :options="parentCategoryList"
              :props="cascaderProps"
              @change="parentCascaderChange"></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="categoryDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="saveCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    return {
      categoriesList: [],
      categoriesColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
          prop: 'cat_deleted'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate'
        }
      ],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      categoryDialogVisible: false,
      addCategoryForm: {
        cate_name: '',
        cate_pid: 0,
        cate_level: 0
      },
      categoryRules: {
        cate_name: [
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
      parentCategoryList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCascaserId: []
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      console.log(res)
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoriesList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategoriesList()
    },
    closeRoleDialog () {
      this.categoryDialogVisible = false
      this.selectedCascaserId = []
      this.$refs.ruleForm.resetFields()
      this.addCategoryForm.cate_pid = 0
      this.addCategoryForm.cate_level = 0
    },
    showAddCategoryDialog () {
      this.getParentCategoryList()
      this.categoryDialogVisible = true
    },
    saveCategory () {
      this.$refs.ruleForm.validate(async value => {
        if (!value) return
        const { data: res } = await this.$http.post('categories', this.addCategoryForm)
        if (res.meta.status !== 200) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getCategoriesList()
      })

      this.categoryDialogVisible = false
    },
    async getParentCategoryList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取二级分类列表失败')
      this.parentCategoryList = res.data
    },
    parentCascaderChange () {
      if (this.selectedCascaserId.length > 0) {
        this.addCategoryForm.cate_pid = this.selectedCascaserId[this.selectedCascaserId.length - 1]
        this.addCategoryForm.cate_level = this.selectedCascaserId.length
      } else {
        this.addCategoryForm.cate_pid = 0
        this.addCategoryForm.cate_level = 0
      }
    }
  }
}
</script>
<style type="scss" scoped>
  .el-breadcrumb {
    padding-bottom: 15px;
    font-size: 12px;
  }
  .el-cascader{
    width: 100%;
  }
</style>
