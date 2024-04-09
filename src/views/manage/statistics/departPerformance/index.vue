<!-- 部门业绩分析 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      ref="filter"
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
import { listToTree } from "../../../../utils/tools";
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
            type: "cascader",
            label: "部门",
            value: "departmentId",
            ref: "departmentRef",
            options: [],
            props: {
              value: "id",
              label: "name",
              multiple: true,
            },
          },
          {
            type: "timeAll",
            label: ["开始日期", "结束日期"],
            value: "time",
            clearable: false,
          },
        ],
      },
      categoryOptions: [],
      filterData: {
        departmentId: "",
        time: [
          this.$moment()
            .startOf("month")
            .format("YYYY-MM-DD"),
          this.$moment()
            .endOf("month")
            .format("YYYY-MM-DD"),
        ],
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "departmentName",
            label: "部门名称",
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
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [],
      headerOperates: [
        {
          key: "export",
          name: "导出",
          permission:
            "system/sysCourseOrderBills/departmentalPerformanceStatisticsListExport",
          action: () => {
            this.handleExport();
          },
        },
      ],
    };
  },
  created() {
    this.getDepartmentList();
    this.getList();
    console.log(this.startTime);
  },
  methods: {
    handleExport() {
      this.$confirm(
        "确定导出部门业绩统计列表吗？导出的时候请等待页面下载自动开始，如果数据量大，可能会等待稍长时间，请不要关闭或者刷新页面",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$message.warning("请耐心等待，表格正在导出中......");
          const { time, ...rest } = this.filterData;
          request.post({
            url:
              "/system/sysCourseOrderBills/departmentalPerformanceStatisticsListExport",
            params: {
              createTimeSt: time[0],
              createTimeEt: time[1],
              ...rest,
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
        })
        .catch(() => {
          this.$message.info("已取消导出");
        });
    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const { time, ...rest } = this.filterData;
      this.$nextTick(() => {
        const department = this.$refs.filter.$refs.departmentRef[0]
          .getCheckedNodes()
          .map((item) => item.data.id);
        request.post({
          url:
            "/system/sysCourseOrderBills/departmentalPerformanceStatisticsList",
          params: {
            pageNo: this.table.currentPage,
            pageSize: this.table.pageSize,
            createTimeSt: time[0],
            createTimeEt: time[1],
            ...rest,
            departmentId:
              department && department.length > 0
                ? JSON.stringify(department)
                : "",
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
        url: "/admin/adInfo/canChooseCanSeeDepartmentList",
        params: {
          id: sessionStorage.getItem("id"),
        },
        success: (res) => {
          this.departmentList = res;
          this.filterOptions.column[0].options = listToTree(res);
        },
      });
    },

    clearFilter() {
      this.filterData = {
        profitAdId: "",
        departmentId: "",
        time: [
          this.$moment()
            .startOf("month")
            .format("YYYY-MM-DD"),
          this.$moment()
            .endOf("month")
            .format("YYYY-MM-DD"),
        ],
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
