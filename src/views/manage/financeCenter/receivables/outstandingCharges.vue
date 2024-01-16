<!-- 未结清管理 -->
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
    <create-collection-dialog ref="collectionRef" @success="handleSuccess">
    </create-collection-dialog>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
    <detail-drawer ref="drawerRef"></detail-drawer>
    <refund ref="refundRef" @success="handleSuccess" ></refund>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import { getDate } from "../../../../utils/tools";
import { collectionStatus, orderStatus } from "./const";
import DetailDrawer from "./detailDrawer.vue";
import refund from "./refund.vue";
import createCollectionDialog from "../../orderManage/index/createCollectionDialog.vue";

export default {
  name: "outstandingChargesPage",
  components: {
    BasicTable,
    addDialog,
    DetailDrawer,
    refund,
    createCollectionDialog,
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
            label: "订单号",
            minWidth: "200px",
          },
          {
            id: 2,
            prop: "status",
            label: "订单状态",
            render: (row) => {
              const item = this.orderStatus.find(
                (item) => item.value == row.status
              );
              return item ? item.label : "";
            },
          },
          {
            id: 3,
            prop: "courseName",
            label: "课程名称",
            minWidth: "150px",
          },
          {
            id: 4,
            prop: "time",
            label: "开始/结束日期",
            minWidth: "200px",
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
            id: 5,
            prop: "collectionUnit",
            label: "收款单位",
          },
          {
            id: 6,
            prop: "count",
            label: "数量",
          },
          {
            id: 7,
            prop: "receivablePrice",
            label: "应收金额",
            minWidth: "100px",
          },
          {
            id: 8,
            prop: "receivedPrice",
            label: "已收金额",
            minWidth: "100px",
          },
          {
            id: 9,
            prop: "unReceivedPrice",
            label: "未收金额",
            minWidth: "100px",
          },
          {
            id: 10,
            prop: "pendingTrialPrice",
            label: "待审金额",
            minWidth: "100px",
          },
          {
            id: 11,
            prop: "invoicedPrice",
            label: "已开票金额",
            minWidth: "100px",
          },
          {
            id: 12,
            prop: "vipName",
            label: "下单人",
            minWidth: "120px",
          },
          {
            id: 13,
            prop: "collectionName",
            label: "收款人",
            minWidth: "100px",
          },
          {
            id: 14,
            prop: "profitAdName",
            label: "销售人",
            minWidth: "100px",
          },
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        {
          key: "deatil",
          title: "详情",
          permission: "system/sysAdvertise/remove",
          btnStyle: "green",
          action: (o, row) => {
            console.log(row);
            this.$refs.drawerRef.open(row);
            // this.handleDelete(row);
          },
        },
        {
          key: "payoutDetail",
          title: "收款明细",
          // permission: "system/sysAdvertise/edit",
          btnStyle: "yellow",
          action: (o, row) => {
            this.$router.push({
              path: this.$router.path,
              query: {
                type: 2,
                orderNum: row.orderNum,
              },
            });
          },
        },
        {
          key: "payment",
          title: "领款",
          permission: "system/sysAdvertise/remove",
          btnStyle: "green",
          action: (o, row) => {
            this.$refs.collectionRef.open(
              row.orderNum,
              "领款",
              row.collectionName
            );
          },
        },
        {
          key: "refund",
          title: "退款",
          permission: "system/sysCourseOrderBills/refundAdd",
          btnStyle: "red",
          action: (o, row) => {
            this.$refs.refundRef.open(row);
            // this.handleDelete(row);
          },
        },
        // {
        //   key: "billing",
        //   title: "开票",
        //   permission: "system/sysAdvertise/remove",
        //   btnStyle: "blue",
        //   action: (o, row) => {
        //     // this.handleDelete(row);
        //   },
        // },
      ],
      headerOperates: [],
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
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const { openTime, endTime, createTime, ...rest } = this.filterData;
      request.post({
        url: "/system/sysCourseOrderBills/outstandingAccountsList",
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

    handleDelete(row) {
      this.$confirm("此操作将会删除该广告, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/system/sysAdvertise/remove",
            params: {
              id: row.id,
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
            message: "已取消删除",
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
<style lang="scss" scoped></style>
