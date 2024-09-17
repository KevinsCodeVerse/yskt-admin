<!-- 详情 -->
<template>
  <div>
    <el-dialog
      title="订单详情"
      :close-on-click-modal="false"
      :visible.sync="detailVisible"
      width="70%"
      @close="handleClose"
    >
    
   
      <el-descriptions
        class="margin-top"
        title="订单信息"
        :colon="true"
        :labelStyle="{ width: '140px' }"
        :column="2"
        size="medium"
        border
      >
      <template slot="extra">
      <jat-button @click="handleUpdateTime">修改订单时间</jat-button>
        <jat-button @click="stopCourse" type="success">停课</jat-button>
        <jat-button @click="restoreCourse" type="warning">恢复课程</jat-button>
    </template>
        <el-descriptions-item
          v-for="(order, index) in orderList"
          :key="order.id"
          :span="index === 0 ? 2 : 1"
        >
          <template slot="label">
            {{ order.name }}
          </template>
          <div
            v-html="
              order.type === 'date' ? getDate(info[order.id]) : info[order.id]
            "
          ></div>
        </el-descriptions-item>
      </el-descriptions>
      <div class="tilte-box">订单收款</div>
      <BasicTable
        height="300px"
        :hasCard="false"
        :hasPage="false"
        :hasSort="false"
        :columns="columns"
        :isShowTableHead="false"
        :data="tableData"
      ></BasicTable>
    </el-dialog>
    <el-dialog
      title="修改订单时间"
      :close-on-click-modal="false"
      :visible.sync="timelVisible"
      width="40%"
      @close="handleTimeClose"
    >
    <el-form :model="diaData" ref="timeForm" :rules="rules" label-width="100px" :inline="false" size="normal">
        <el-form-item label="订单时间:" prop="time">
          <jat-date-picker
            width="100%"
            clearable
            type="daterange"
            placeholder="请选择订单时间"
            size="small"
            v-model="diaData.time"
          ></jat-date-picker>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <jat-button plain @click="handleTimeClose">取 消</jat-button>
        <jat-button @click="handleSubmit">确 定</jat-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../../../utils/request";
import BasicTable from "@/components/BasicTable/index.vue";
import { getDate } from "../../../../utils/tools";

export default {
  components: {
    BasicTable,
  },
  data() {
    return {
      getDate,
      detailVisible: false,
      timelVisible: false,
      info: {},
      diaData: {
        time: []
      },
      tableData: [],
      orderList: [
        {
          id: "orderNum",
          name: "订单编号",
        },

        {
          id: "courseNameS",
          name: "课程名称",
        },
        {
          id: "courseName",
          name: "套餐名称",
        },
        {
          id: "startTime",
          name: "开始时间",
          type: "date",
        },
        {
          id: "endTime",
          name: "结束时间",
          type: "date",
        },
        {
          id: "vipName",
          name: "客户名称",
        },
        {
          id: "count",
          name: "数量",
        },
        {
          id: "vipName",
          name: "预订人",
        },
        {
          id: "orderTeacherList",
          name: "直播讲师",
        },
        {
          id: "phone",
          name: "客户电话",
        },
        {
          id: "totalMarketPrice",
          name: "订单总销售价",
        },
        {
          id: "statusName",
          name: "订单状态",
        },
        {
          id: "createTime",
          name: "下单时间",
          type: "date",
        },
        {
          id: "profitAdName",
          name: "销售员",
        },
        {
          id: "createAdName",
          name: "操作员",
        },
        {
          id: "remark",
          name: "优惠信息/订单备注",
        },
        {
          id: "",
          name: "",
        },
      ],
      // 应收金额，已收金额，水单，备注，创建人名称
      columns: [
        {
          id: 1,
          prop: "categoryName",
          label: "付款方式",
        },
        {
          id: 2,
          prop: "orderMoney",
          label: "应收金额",
        },
        {
          id: 3,
          prop: "collectionMoney",
          label: "已收金额",
          colorRener: (row) => {
            return row.status == -1 ? "#C00063" : "";
          },
        },
        {
          id: 4,
          type: "image",
          prop: "receiptUrl",
          label: "水单",
        },
        {
          id: 5,
          prop: "collectionMoney",
          label: "备注",
        },
        {
          id: 6,
          prop: "createAdName",
          label: "创建人",
        },
      ],
      rules: {
        time: [{ required: true, message: "请选择订单时间", trigger: "blur" }]
      }
    };
  },

  methods: {
    stopCourse(){
      this.$confirm(
          "确定将订单:"+this.info.orderNum+"停课吗，这会导致该用户无法观看该订单内的所有课程",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      )
          .then(() => {
            request.post({
              url: "/system/sysVipOrderCourse/stopCourse",
              params: {
               orderNum:this.info.orderNum
              },
              success: (res) => {
                this.$message.success("操作成功");
              },
            });
          })
          .catch((err) => {
            console.log(err)
            // this.$message.info("已取消导出");
          });
    },
    restoreCourse(){
      this.$confirm(
          "确定恢复该订单:"+this.info.orderNum+"内的所有课程吗",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      )
          .then(() => {
            request.post({
              url: "/system/sysVipOrderCourse/restoreCourse",
              params: {
                orderNum:this.info.orderNum
              },
              success: (res) => {
                this.$message.success("操作成功");
              },
            });
          })
          .catch((err) => {
            console.log(err)
            // this.$message.info("已取消导出");
          });
    },
    open(orderNum) {
      this.detailVisible = true;
      this.getDetailInfo(orderNum);
    },
    handleClose() {
      this.detailVisible = false;
    },
    handleTimeClose() {
      this.timelVisible = false
      this.diaData.time = []
    }
  ,
    handleUpdateTime() {
      this.timelVisible = true
      this.diaData.time = [this.getDate(this.info.startTime), this.getDate(this.info.endTime)]
    },
    handleSubmit() {
      this.$refs.timeForm.validate((valid) => {
        const { time } = this.diaData;
        if (valid) {
            request.post({
              url: "/system/sysCourseOrder/orderTimeEdit",
              params: {
                orderNum: this.info.orderNum,
                startTime: time && time.length > 0 ? time[0] : "",
                endTime: time && time.length > 0 ? time[1] : "",
              },
              success: (res) => {
                this.$message.success(res);
                this.handleTimeClose()
                this.getDetailInfo(this.info.orderNum)
              },
            });
         
        }
      });
    },
    getDetailInfo(orderNum) {
      request.post({
        url: "/system/sysCourseOrder/detail",
        params: {
          orderNum,
        },
        success: (res) => {
          this.info = res.orderDetail;
          if(res.orderTeacherList&&res.orderTeacherList.length>0){
            this.info.orderTeacherList = res.orderTeacherList.map(teacher => teacher.teacherName).join('，');
          }
          this.tableData = res.billsList;
          if (!this.info.remark) {
            this.info.remark = "暂无备注";
          }
          if (this.info.courseNameS) {
            let str = "";
            this.info.courseNameS.split(",").forEach((item) => {
              str = str + `<div>${item}</div>`;
            });
            this.info.courseNameS = str;
          }
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.label-box {
  width: 100px;
}

.tilte-box {
  font-size: 16px;
  color: #303133;
  font-weight: bold;
  margin-top: 20px;
}

/deep/.el-dialog__body {
  max-height: 500px;
  overflow: auto;
}
</style>
