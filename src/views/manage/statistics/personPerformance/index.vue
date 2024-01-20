<!-- 个人业绩分析 -->
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
      :data="table.data"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :total="table.total"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
    >
    </BasicTable>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import { listToTree } from '../../../../utils/tools';
export default {
  name: "personPerformance",
  components: { BasicTable },
  data() {
    return {
      loading: false,
      categoryOptions: [],
      filterOptions: {
        column: [
          {
            type: "user",
            userType: 0,
            label: "销售员",
            value: "profitAdId",
          },
          {
            type: "cascader",
            label: "部门",
            value: "departmentId",
            options: [],
            props: {
              value: "id",
              label: "name",
              emitPath: false,
              checkStrictly: true,
            },
          },
          {
            type: "timeAll",
            label: ["开始日期", "结束日期"],
            value: "time",
            clearable: false
          },
        ],
      },
      categoryOptions: [],
      
      filterData: {
        profitAdId: "",
        departmentId: "",
        time: [this.$moment().startOf("month").format("YYYY-MM-DD"), this.$moment().endOf("month").format("YYYY-MM-DD")]
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "profitAdName",
            label: "销售员",
          },
          {
            id: 2,
            prop: "receivable",
            label: "应收",
          },
          {
            id: 4,
            prop: "received",
            label: "已收",
          },
          {
            id: 5,
            prop: "unReceived",
            label: "未收",
          },
          {
            id: 6,
            prop: "orderCount",
            label: "订单数",
          },
          {
            id: 7,
            prop: "unreportedOrder",
            label: "未入账订单",
          },
          {
            id: 8,
            prop: "orderNum",
            label: "订单编号",
          },
          {
            id: 9,
            prop: "departments",
            label: "部门",
          },
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        
      ],
      headerOperates: [],
    };
  },
  created() {
    this.getDepartmentList()
    this.getList();
    console.log(this.startTime);
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const {time, ...rest} = this.filterData
      request.post({
        url: "/system/sysCourseOrderBills/individualPerformanceStatisticsList",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          createTimeSt: time[0],
          createTimeEt: time[1],
          ...rest
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

   

    handleDelete(row) {
      this.$confirm("此操作将会删除该新闻, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/system/sysNews/remove",
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

    getDepartmentList() {
      request.post({
        url: "/admin/adDepartment/listNoPage",
        params: {
          ...this.addData,
        },
        success: (res) => {
          this.departmentList = res;
          this.filterOptions.column[1].options = listToTree(res);
        },
      });
    },

    clearFilter() {
      this.filterData = {
        profitAdId: "",
        departmentId: "",
        time: [this.$moment().startOf("month").format("YYYY-MM-DD"), this.$moment().endOf("month").format("YYYY-MM-DD")]
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
