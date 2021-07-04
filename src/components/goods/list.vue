<template>
    <div class="list">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
         <el-col :span="6">
           <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @click="getGoodsList">
             <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
           </el-input>
         </el-col>
         <el-col :span="4">
            <el-button type="primary" @click="goAddGoodsPage">新增</el-button>
         </el-col>
        </el-row>
        <el-table
          :data="goodsList" border stripe style="width: 100%">
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
          <el-table-column prop="goods_price" label="商品价格" width="95"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="95"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.add_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column  label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-edit" size="mini" @click="deleteGoodsById(scope.row.goods_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        background>
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
export default {
  props: {
  },
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  computed: {},

  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取商品列表失败')
      console.log(res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 处理分页
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
    },
    async deleteGoodsById (id) {
      const conformResult = await this.$confirm('是否删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => {
        return error
      })
      if (conformResult !== 'conform') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除成功失败')
      }
      this.$message.success('删除属性成功')
      this.getGoodsList()
    },
    goAddGoodsPage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style type="scss" scoped>
  .el-breadcrumb {
    padding-bottom: 15px;
    font-size: 12px;
  }
  .el-table{
    margin-top: 30px;
  }
</style>
