<template>
    <div class="order">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @click="getOrderList">
              <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-table
          :data="orderList"
          style="width: 100%" border stripe>
          <el-table-column
            type="index"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格"
            width="180">
          </el-table-column>
          <el-table-column
            prop="pay_status"
            label="是否付款">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_send"
            label="是否发货">
          </el-table-column>
          <el-table-column
            label="下单时间">
            <template slot-scope="scope">
              <span>{{scope.row.create_time | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
              <el-button type="success" icon="el-icon-setting" size="mini" @click="showProgressBox"></el-button>
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
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%">
        <el-form ref="addressForm" :model="addressForm"
                 :rules="addressRule"
                 label-width="150px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              :options="cityData"
              v-model="addressForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2" placeholder="placeholder"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressList"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
export default {
  props: {
  },
  created () {
    this.getOrderList()
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressRule: {
        address1: [
          {
            required: true, message: '请选择省市区', trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true, message: '请输入详细地址', trigger: 'blur'
          }
        ]
      },
      cityData,
      progressVisible: false,
      progressList: []
    }
  },
  computed: {},
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    showBox () {
      this.addressVisible = true
    },
    showProgressBox () {
      // 后台数据请求不成功 这里直接写死
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      // if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      // console.log(res)
      this.progressList = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
      this.progressVisible = true
    }
  }
}
</script>
<style type="scss" scoped>
  @import "../../plugins/timeline/timeline.css";
  @import "../../plugins/timeline-item/timeline-item.css";
  .el-breadcrumb {
    padding-bottom: 15px;
    font-size: 12px;
  }
  .el-table{
    margin: 25px 0;
  }
  .el-cascader{
    width: 100%;
  }
</style>
