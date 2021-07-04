<template>
  <div class="add">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addRules" ref="addRuleForm" label-width="100px" class="demo-ruleForm" label-position="top">
      <el-tabs :tab-position="'left'"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name" placeholder="placeholder"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" placeholder="placeholder" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" placeholder="placeholder" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="goods_number">
            <el-input v-model="addForm.goods_number" placeholder="placeholder" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
            v-model="addForm.goods_cat"
            :options="categoriesList"
            :props="categoryProp"
            @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="item in manyTabData" :label="item.attr_name" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="item" v-for="(item,index) in item.attr_vals" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item v-for="(item,index) in onlyTabData" :key="index" :label="item.attr_name">
            <el-input v-model="item.attr_vals" placeholder="placeholder"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
<!--     action 图片上传的地址     -->
          <el-upload
            :headers="headerObj"
            :action="uploadURL"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture" :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor
            ref="myQuillEditor"
            v-model="addForm.goods_introduce"
          />
          <el-button class="addButton" type="primary" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="previewDialog"
      width="30%">
      <img :src="previewUrl" alt="预览图片">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: {},
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分裂
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addRules: {
        goods_name: [
          {
            required: true, message: '请输入商品名称', trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true, message: '请输入商品价格', trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true, message: '请输入商品重量', trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true, message: '请输入商品数量', trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true, message: '请选择商品分类', trigger: 'blur'
          }
        ]
      },
      categoriesList: [],
      categoryProp: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数数据列表
      manyTabData: [],
      onlyTabData: [],
      uploadURL: 'http://www.ysqorz.top:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewUrl: '',
      previewDialog: false
    }
  },
  created () {
    this.getCategoriesList()
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('请求分类信息失败')
      this.categoriesList = res.data
    },
    handleChange () {
      console.log(222)
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类信息')
        return false
      }
    },
    async tabClicked () {
      if (this.activeIndex === '1') {
        // 动态参数面板
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        if (res.meta.status !== 200) return this.$message.error('获取商品属性失败')
        this.manyTabData = res.data
      }
      if (this.activeIndex === '2') {
        // 动态参数面板
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        if (res.meta.status !== 200) return this.$message.error('获取商品属性失败')
        this.onlyTabData = res.data
      }
    },
    handlePreview (file) {
      this.previewUrl = file.response.data.url
      this.previewDialog = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(x => {
        return x.pic === filePath
      })
      this.addForm.pics.splice(index, 1)
    },
    uploadSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    add () {
      this.$refs.addRuleForm.validate(async value => {
        if (value) {
          const addForm = _.cloneDeep(this.addForm)
          addForm.goods_cat = addForm.goods_cat.join(',')
          // 处理动态参数
          this.manyTabData.forEach(item => {
            const info = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
            this.addForm.attrs.push(info)
          })
          // 处理静态属性
          this.onlyTabData.forEach(item => {
            const info = { attr_id: item.attr_id, attr_value: item.attr_vals }
            this.addForm.attrs.push(info)
          })
          addForm.attrs = this.addForm.attrs
          // 发送请求
          const { data: res } = await this.$http.post('goods', addForm)
          if (res.meta.status !== 200) return this.$message.error('添加商品失败')
          this.$router.push('/goods')
        }
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
  .el-steps{
    margin: 20px 0;
  }
  .el-checkbox{
    margin: 0 10px 0 0 !important;
  }
  .addButton{
    margin:15px 0;
  }
</style>
