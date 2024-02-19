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
            type: "input",
            label: "课程编号",
            value: "number",
          },
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
            clearable: false,
          },
        ],
      },

      filterData: {
        profitAdId: "",
        departmentId: "",
        time: [],
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "courseName",
            label: "课程名称",
          },
          {
            id: 2,
            prop: "courseNum",
            label: "课程编号",
          },
          {
            id: 4,
            prop: "totalCount",
            label: "总数量",
          },
          {
            id: 5,
            prop: "totalProfit",
            label: "总收入",
          }
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
          permission: "system/sysCourseOrderBills/coursePerformanceStatisticsExport",
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
  },
  methods: {
    handleExport(){
      this.$confirm('确定导出课程业绩统计列表吗？导出的时候请等待页面下载自动开始，如果数据量大，可能会等待稍长时间，请不要关闭或者刷新页面', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.warning("请耐心等待，表格正在导出中......");
        const { time, ...rest } = this.filterData;
        request.post({
          url: "/system/sysCourseOrderBills/coursePerformanceStatisticsExport",
          params: {
            startTime: time && time.length > 1 ? time[0] : "",
            endTime: time && time.length > 1 ? time[1] : "",
            ...rest,
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
      const { time, ...rest } = this.filterData;
      request.post({
        url: "/system/sysCourseOrderBills/coursePerformanceStatistics",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          startTime: time && time.length > 1 ? time[0] : "",
          endTime: time && time.length > 1 ? time[1] : "",
          ...rest,
        },
        success: (res) => {
          this.table.data = res;
          this.table.total = res.length;
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
        },
        success: (res) => {
          this.filterOptions.column[2].options = listToTree(res);
        },
      });
    },

    clearFilter() {
      this.filterData = {
        profitAdId: "",
        departmentId: "",
        number: "",
        time: [],
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
