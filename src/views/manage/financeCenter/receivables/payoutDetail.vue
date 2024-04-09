<!-- 收款明细管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
        :option="filterOptions"
        v-model="filterData"
        @searchFilter="searchFilter"
        @clearFilter="clearFilter"
    ></jat-fillter>
    <BasicTable
        :columns="table.columns"
        :headerOperates="headerOperates"
        :operates="operates"
        operateWidth="280px"
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :total="table.total"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
    >
      <div slot="image" slot-scope="scope">
        <el-image
            v-if="scope.row.image"
            style="width: 50px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
        >
        </el-image>
        <span v-else></span>
      </div>
    </BasicTable>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
    <detail-drawer ref="drawerRef"></detail-drawer>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import {getDate} from "../../../../utils/tools";
import {collectionStatus, orderStatus} from "./const";
import detailDrawer from './detailDrawer.vue';

export default {
  name: "receivablesPage",
  components: {
    BasicTable,
    addDialog,
    detailDrawer
  },
  data() {
    return {
      loading: false,
      categoryOptions: [],
      orderStatus: orderStatus,
      filterOptions: {
        column: [
          {
            type: "select",
            label: "收款方式",
            value: "categoryId",
            labelKey: "name",
            valueKey: "id",
            options: [],
          },
          {
            type: "input",
            label: "订单号/交易号",
            value: "orderNum",
          },
          {
            type: "select",
            label: "收款状态",
            value: "collectionStatus",
            options: collectionStatus,
          },
          {
            type: "user",
            userType: 0,
            label: "收款人",
            value: "profitAdId",
          },

          {
            type: "user",
            userType: 1,
            label: "下单人",
            value: "vipAdId",
          },
          {
            type: "timeAll",
            label: ["开始日期-开始", "开始日期-结束"],
            value: "openTime",
          },
          {
            type: "timeAll",
            label: ["结束日期-开始", "结束日期-结束"],
            value: "endTime",
          },
          {
            type: "timeAll",
            label: ["创建日期-开始", "创建日期-结束"],
            value: "createTime",
          },
        ],
      },
      filterData: {
        categoryId: "",
        orderNum: "",
        collectionStatus: "",
        profitAdId: "",
        openTime: [],
        endTime: [],
        createTime: [],
        vipAdId: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "orderNum",
            label: "订单名称",
            minWidth: "150px",
            width: "190px",
          },
          {
            id: 2,
            prop: "courseName",
            label: "课程名称",
            minWidth: "150px",
          },
          {
            id: 12,
            prop: "collectionTime",
            label: "收款时间",
            width: "170px",
            type: "date",
          },

          {
            id: 4,
            prop: "vipName",
            label: "下单人",
            minWidth: "120px",
          },
          {
            id: 5,
            prop: "collectionMoney",
            label: "金额(正收，负退)",
            minWidth: "150px",
            align: "center",
            render: (row) => {
              if (row.type == -1) {
                return "-" + row.collectionMoney;
              } else {
                return row.collectionMoney;
              }
            },
            colorRener: (row) => {
              return row.type == -1 ? "#C00063" : "";
            },
          },
          {
            id: 22,
            prop: "remark",
            label: "备注",
            width: "120px",
            render: (row) => {
              return row.remark==="" ? "—" : row.remark;
            },
          },
          {
            id: 13,
            prop: "status",
            label: "收款状态",
            render: (row) => {
              const item = collectionStatus.find(
                  (item) => item.value == row.status
              );
              return item ? item.label : "";
            },
            colorRener: (row) => {
              const item = collectionStatus.find(
                  (item) => item.value == row.status
              );
              return item ? item.color : "";
            },
          },
          {
            id: 6,
            prop: "categoryName",
            label: "收款方式",
            minWidth: "120px",
          },

          {
            id: 8,
            prop: "profitAdName",
            label: "销售人",
            minWidth: "100px",
          },
          {
            id: 9,
            prop: "commission",
            label: "佣金",
            minWidth: "100px",
          },
          {
            id: 11,
            prop: "collectionUnit",
            label: "收款单位",
          },
          {
            id: 7,
            prop: "payTime",
            label: "支付时间",
            type: "date",
            minWidth: "100px",
          },
          {
            id: 3,
            width: "220px",
            prop: "time",
            label: "开始/结束日期",
            minWidth: "210px",
            render: (row) => {
              return row.startTime
                  ? `${getDate(row.startTime, "yyyy-MM-dd")} 至 ${getDate(
                      row.endTime,
                      "yyyy-MM-dd"
                  )}`
                  : "";
            },
          },

          {
            id: 14,
            prop: "colectionNumber",
            label: "收款交易号",
            type: "date",
          },
          {
            id: 15,
            prop: "refundNumber",
            label: "退款交易号",
            type: "date",
          },
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        {
          key: "detail",
          title: "详情",
          permission: "",
          btnStyle: "green",
          // 已收、取消、回退
          show: (row) => {
            // return row.status == 0 || row.status == 1;
            return true;
          },
          action: (o, row) => {
            console.log("row",row)
            row.name=row.categoryName
            row.count=1
            row.vipName=row.collectionUnit
            row.receivablePrice=row.receivable
            var imageArr=[]
            imageArr.push(row.receiptUrl)
            row.imageArr=imageArr
            this.$refs.drawerRef.open(row);
            // this.handleDelete(row);
          },
        },
        {
          key: "received",
          title: "已收",
          permission: "system/sysCourseOrderBills/receivedEdit",
          btnStyle: "blue",
          action: (o, row) => {
            this.handleRecived(row);
          },
          // 已收、取消、回退
          show: (row) => {
            return row.status == 0 && row.type !== -1;
          },
        },
        {
          key: "cancel",
          title: "取消",
          permission: "system/sysCourseOrderBills/cancelEdit",
          btnStyle: "yellow",
          action: (o, row) => {
            this.handleCancle(row);
          },
          show: (row) => {
            return row.status == 0;
          },
        },
        {
          key: "recorded",
          title: "入账",
          permission: "system/sysCourseOrderBills/enterBillEdit",
          btnStyle: "yellow",
          action: (o, row) => {
            this.handleRecorded(row);
          },
          show: (row) => {
            return row.status == 2;
          },
        },
        {
          key: "fallback",
          title: "回退",
          permission: "system/sysCourseOrderBills/fallbackEdit",
          btnStyle: "red",
          action: (o, row) => {
            this.handleFallback(row);
          },
          show: (row) => {
            return (
                row.status == 0 ||
                row.status == 1 ||
                row.status == 2 ||
                row.status == 3
            );
          },
        },
        {
          key: "financialAudits",
          title: "财务审核",
          permission: "system/sysCourseOrderBills/financialAuditEdit",
          btnStyle: "blue",
          action: (o, row) => {
            this.handleFinancialAudits(row);
          },
          show: (row) => {
            return row.status == 0 && row.type == -1;
          },
        },
      ],
      headerOperates: [
        {
          key: "export",
          name: "导出",
          permission: "system/sysCourseOrderBills/collectionDetailListExport",
          action: () => {
            this.handleExport();
          },
        },
      ],
    };

  },
  created() {
    if (this.$route.query.orderNum) {
      this.filterData.orderNum = this.$route.query.orderNum;
    }
    this.getList();
    this.getCategoryList();
  },
  methods: {
    handleExport() {
      this.$confirm('确定导出收款明细吗？导出的时候请等待页面下载自动开始，如果数据量大，可能会等待稍长时间，请不要关闭或者刷新页面', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.warning("请耐心等待，表格正在导出中......");
        const {openTime, endTime, createTime, ...rest} = this.filterData;
        request.post({
          url: "/system/sysCourseOrderBills/collectionDetailListExport",
          params: {
            ...rest,
            openStartTime: openTime && openTime.length > 0 ? openTime[0] : "",
            openEndTime: openTime && openTime.length > 0 ? openTime[1] : "",
            createStartTime:
                createTime && createTime.length > 0 ? createTime[0] : "",
            createEndTime:
                createTime && createTime.length > 0 ? createTime[1] : "",
            endStartTime: endTime && endTime.length > 0 ? endTime[0] : "",
            endEndTime: endTime && endTime.length > 0 ? endTime[1] : "",
          },
          success: (res) => {
            let downloadElement = document.createElement("a");
            downloadElement.href = "http://" + res;
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            this.$message.success("导出成功");
            this.searchFilter();
          },
        });
      }).catch(() => {
        this.$message.info("已取消导出");
      });
    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const {openTime, endTime, createTime, ...rest} = this.filterData;
      request.post({
        url: "/system/sysCourseOrderBills/collectionDetailList",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...rest,
          openStartTime: openTime && openTime.length > 0 ? openTime[0] : "",
          openEndTime: openTime && openTime.length > 0 ? openTime[1] : "",
          createStartTime:
              createTime && createTime.length > 0 ? createTime[0] : "",
          createEndTime:
              createTime && createTime.length > 0 ? createTime[1] : "",
          endStartTime: endTime && endTime.length > 0 ? endTime[0] : "",
          endEndTime: endTime && endTime.length > 0 ? endTime[1] : "",
        },
        success: (res) => {
          this.table.data = res.list;
          this.table.total = res.total;
          this.loading = false;
        },
        catch: () => {
          this.loading = false;
        },
      });
    },

    getCategoryList() {
      request.post({
        url: "/system/sysCategory/listNoPage",
        params: {
          type: 3,
        },
        success: (res) => {
          this.filterOptions.column[0].options = res;
        },
      });
    },
    handleSuccess() {
      this.getList();
    },
    //已收
    handleRecived(row) {
      this.$confirm("确定执行已收操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/system/sysCourseOrderBills/receivedEdit",
              params: {
                billsId: row.billsId,
              },
              success: (res) => {
                this.$message.success(res);
                this.getList();
              },
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
    },
    //财务审核
    handleFinancialAudits(row) {
      this.$confirm("确定执行财务审核操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/system/sysCourseOrderBills/financialAuditEdit",
              params: {
                billsId: row.billsId,
              },
              success: (res) => {
                this.$message.success(res);
                this.getList();
              },
            });
          })
          .catch((error) => {
            console.log(error);
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
    },
    //取消
    handleCancle(row) {
      this.$confirm("确定执行取消操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/system/sysCourseOrderBills/cancelEdit",
              params: {
                billsId: row.billsId,
              },
              success: (res) => {
                this.$message.success(res);
                this.getList();
              },
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
    },
    //入账
    handleRecorded(row) {
      this.$confirm("确定执行入账操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/system/sysCourseOrderBills/enterBillEdit",
              params: {
                billsId: row.billsId,
              },
              success: (res) => {
                this.$message.success(res);
                this.getList();
              },
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
    },
    //回退
    handleFallback(row) {
      this.$confirm("确定执行回退操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/system/sysCourseOrderBills/fallbackEdit",
              params: {
                billsId: row.billsId,
              },
              success: (res) => {
                this.$message.success(res);
                this.getList();
              },
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
    },

    clearFilter() {
      this.filterData = {
        categoryId: "",
        orderNum: "",
        courseName: "",
        collectionStatus: "",
        colectionName: "",
        time: [],
        vipName: "",
      };
      this.searchFilter();
    },
    currentPageChange(num) {
      this.table.currentPage = num;
      this.getList();
    },

    sizePageChange(size) {
      this.table.currentPage = 1;
      this.table.pageSize = size;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.zt_colunms_box {
  &.zt1 {
    color: #0fba80;
    display: inline-block;
    padding: 3px;
    background: rgba(15, 186, 128, 0.1);
    // border: 1px solid rgba(108, 255, 40, 0.6);
    border-radius: 2px;
  }

  &.zt0 {
    color: #ff6600;
    display: inline-block;
    padding: 3px;
    background: rgba(255, 102, 0, 0.1);
    // border: 1px solid rgba(108, 255, 40, 0.6);
    border-radius: 2px;
  }
}
</style>
