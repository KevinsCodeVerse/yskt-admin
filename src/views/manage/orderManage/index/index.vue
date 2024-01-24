<!-- 订单管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    >
    </jat-fillter>
    <BasicTable
      ref="orderTable"
      :columns="table.columns"
      :headerOperates="headerOperates"
      selectType="multi"
      :operates="operates"
      :data="table.data"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :row-key="getRowKeys"
      operateWidth="250px"
      :total="table.total"
      :reserveSelection="true"
      @selection-change="handleSelectionChange"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
    >
      <div slot="marketPrice" slot-scope="scope">
        <div>{{ scope.row.marketPrice }}</div>
        <div class="detail-price">
          <div>已收：{{ scope.row.receivedPrice }}</div>
          <div>未收：{{ scope.row.marketPrice - scope.row.receivedPrice }}</div>
        </div>
      </div>
    </BasicTable>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
    <create-collection-dialog
      @success="handleSuccess"
      ref="collectionDialog"
    ></create-collection-dialog>
    <order-detail ref="detailRef"></order-detail>
    <openCourse ref="openCourse"></openCourse>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import { getDate } from "../../../../utils/tools";
import CreateCollectionDialog from "./createCollectionDialog.vue";
import orderDetail from "./orderDetail.vue";
import { orderStatus } from "../../financeCenter/receivables/const";
import openCourse from "./openCourse.vue";
const openStatusOptions = [
  {
    value: 0,
    label: "未开通",
  },
  {
    value: 1,
    label: "已开通",
  },
];
export default {
  name: "orderPage",
  components: {
    BasicTable,
    addDialog,
    CreateCollectionDialog,
    orderDetail,
    openCourse,
  },

  data() {
    return {
      loading: false,
      filterOptions: {
        column: [
          {
            type: "input",
            label: "订单号",
            value: "orderNum",
          },
          {
            type: "user",
            userType: 0,
            label: "利润归属",
            value: "profitAdId",
          },
          {
            type: "user",
            userType: 1,
            label: "下单人",
            value: "vipAdId",
          },
          {
            type: "user",
            userType: 0,
            label: "操作人",
            value: "createAdId",
          },
          {
            type: "select",
            label: "订单状态",
            value: "status",
            options: orderStatus,
          },
          {
            type: "select",
            label: "开通状态",
            value: "openStatus",
            options: openStatusOptions,
          },
          {
            type: "timeAll",
            label: ["下单开始时间", "下单开始时间"],
            value: "placeOrderTime",
          },
          {
            type: "timeAll",
            label: ["核销开始时间", "核销开始时间"],
            value: "writeOffTime",
          },
        ],
      },
      selectList: [],

      filterData: {
        orderNum: "",
        profitAdId: "",
        vipAdId: "",
        createAdId: "",
        status: "",
        openStatus: "",
        placeOrderTime: [],
        writeOffTime: [],
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "orderNum",
            minWidth: "160px",
            label: "订单号",
          },
          {
            id: 2,
            prop: "courseName",
            label: "课程名称",
            minWidth: "180px",
          },
          {
            id: 3,
            prop: "vipName",
            label: "客户名称",
            minWidth: "100px",
          },
          {
            id: 4,
            prop: "count",
            label: "数量",
            minWidth: "100px",
          },
          {
            id: 6,
            prop: "marketPrice",
            label: "总销售价",
            renderName: "marketPrice",
            minWidth: "100px",
          },
          {
            id: 7,
            prop: "marketPrice",
            label: "总结算价",
            minWidth: "100px",
          },
          {
            id: 8,
            prop: "vipName",
            label: "下单人",
            minWidth: "100px",
          },
          {
            id: 9,
            prop: "profitAdName",
            label: "销售人员",
            minWidth: "100px",
          },
          {
            id: 10,
            prop: "createAdName",
            label: "操作人员",
            minWidth: "100px",
          },
          {
            id: 11,
            prop: "status",
            label: "订单状态",
            render: (row) => {
              const item = orderStatus.find((item) => item.value == row.status);
              return item ? item.label : "";
            },
          },
          {
            id: 12,
            prop: "openStatus",
            label: "开通状态",
            render: (row) => {
              return row.openStatus == 1 ? "已开通" : "未开通";
            },
          },
          {
            id: 13,
            prop: "createTime",
            label: "下单时间",
            sortable: true,
            minWidth: "180px",
            type: "date",
          },
          {
            id: 15,
            prop: "time", //startTime-endTime
            label: "开始/结束时间",
            minWidth: "200px",
            render: (row) => {
              return row.startTime
                ? `${getDate(row.startTime, "yyyy-MM-dd")}至${getDate(
                    row.endTime,
                    "yyyy-MM-dd"
                  )}`
                : "";
            },
          },
          {
            id: 14,
            prop: "profitAdName",
            label: "利润归属",
          },
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        {
          key: "create",
          title: "创建收款",
          btnStyle: "blue",
          permission: "system/sysCourseOrderBills/add",
          action: (o, row) => {
            this.$refs.collectionDialog.open(row.orderNum);
          },
          show: (row) => {
            return row.openStatus === 1;
          },
        },
        {
          key: "openCourse",
          title: "开通课程",
          btnStyle: "yellow",
          permission: "system/sysCourseOrder/openCourseEdit",
          action: (o, row) => {
            this.$refs.openCourse.edit(row);
          },
          show: (row) => {
            return row.openStatus === 0;
          },
        },
        {
          key: "detail",
          title: "详情",
          btnStyle: "green",
          // permission: "system/sysCourseOrder/detail",
          action: (o, row) => {
            this.$refs.detailRef.open(row.orderNum);
          },
          show: (row) => {
            return row.openStatus === 0;
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "快捷下单",
          permission: "system/sysCourseOrder/quicklyPlaceOrderAdd",
          action: () => {
            this.$refs.addDialog.open();
          },
        },
        {
          key: "export",
          name: "导出",
          permission: "system/sysCourseOrder/quicklyPlaceOrderAdd",
          action: () => {
            this.handleExport();
          },
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    searchFilter() {
      this.$nextTick(() => {
        this.$refs.orderTable.$refs.basicTable.$refs.multipleTable.clearSelection();
      });
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const { placeOrderTime, writeOffTime, ...rest } = this.filterData;
      request.post({
        url: "/system/sysCourseOrder/salesOrderList",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          placeOrderStartTime:
            placeOrderTime && placeOrderTime.length > 1
              ? placeOrderTime[0]
              : undefined,
          placeOrderEndTime:
            placeOrderTime && placeOrderTime.length > 1
              ? placeOrderTime[1]
              : undefined,
          writeOffStartTime:
            writeOffTime && writeOffTime.length > 1
              ? writeOffTime[0]
              : undefined,
          writeOffEndTime:
            writeOffTime && writeOffTime.length > 1
              ? writeOffTime[1]
              : undefined,
          ...rest,
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

    handleExport() {
      if (this.selectList.length < 1) {
        this.$message.warning("请至少勾选一条数据进行导出");
      }
      request.post({
        url: "/system/sysCourseOrder/exportSalesData",
        params: {
          objArray: JSON.stringify(this.selectList),
        },
        success: (res) => {
          let downloadElement = document.createElement("a");
          downloadElement.href = "https://" + res;
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          this.$message.success("导出成功");
          this.searchFilter();
        },
      });
    },
    handleSuccess() {
      this.getList();
    },

    clearFilter() {
      this.filterData = {
        orderNum: "",
        profitAdId: "",
        vipAdId: "",
        createAdId: "",
        status: "",
        openStatus: "",
        placeOrderTime: [],
        writeOffTime: [],
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

    handleSelectionChange(val) {
      this.selectList = val;
    },
    getRowKeys(row) {
      return row.id;
    },
  },
};
</script>
<style lang="scss" scoped>
.detail-price {
  color: #e6a23c;
}
</style>
