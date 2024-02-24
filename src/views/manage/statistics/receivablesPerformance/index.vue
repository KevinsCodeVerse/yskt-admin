<!-- 应用款统计 -->
<template>
  <div class="middle-container" v-loading="loading">
    <div class="header-box">
      <div class="BasicInfo_title" v-if="headerTab.length > 0">
        <div
            v-for="tab in headerTab"
            :key="tab.id"
            v-permission="tab.permission"
            class="item"
            :class="{ is_active: tab.isChecked }"
            @click="handleTabSelect(tab)"
        >
          <span :class="'tab_' + tab.id">{{ tab.name }}</span>
        </div>
      </div>
    </div>
    <jat-fillter
        :option="filterOptions"
        v-model="filterData"
        @searchFilter="searchFilter"
        @clearFilter="clearFilter"
        v-if="tagCheck===1"
    ></jat-fillter>
    <jat-fillter
        :option="filterOptions1"
        v-model="filterData"
        @searchFilter="searchFilter"
        @clearFilter="clearFilter"
        v-if="tagCheck===2"
    ></jat-fillter>
    <jat-fillter
        :option="filterOptions2"
        v-model="filterData"
        @searchFilter="searchFilter"
        @clearFilter="clearFilter"
        v-if="tagCheck===3"
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
        v-if="tagCheck===1"
    >
    </BasicTable>
    <BasicTable
        :columns="table.columns"
        :headerOperates="headerOperates1"
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :total="table.total"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
        v-if="tagCheck===2"
    >
    </BasicTable>
    <BasicTable
        :columns="table.columns"
        :headerOperates="headerOperates2"
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :total="table.total"
        table-remark="注：由于一个订单套餐会包含多个课程，所以该统计只统计包含了该课程的订单数量，不统计相关订单金额"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
        v-if="tagCheck===3"
    >
    </BasicTable>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import {listToTree} from "../../../../utils/tools";

export default {
  name: "personPerformance",
  components: {BasicTable},
  data() {
    return {
      tagCheck: 1,
      loading: false,
      categoryOptions: [],
      filterOptions: {
        column: [
          {
            type: "user",
            userType: 1,
            label: "下单客户",
            value: "vipId",
          },
          {
            type: "timeAll",
            label: ["开始日期", "结束日期"],
            value: "time",
            clearable: false,
          },
        ],
      },
      filterOptions1: {
        column: [
          {
            type: "user",
            userType: 0,
            label: "销售员",
            value: "profitAdId",
          },
          {
            type: "timeAll",
            label: ["开始日期", "结束日期"],
            value: "time",
            clearable: false,
          },
        ],
      },
      filterOptions2: {
        column: [
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
            prop: "name",
            label: "名称",
          },
          {
            id: 2,
            prop: "count",
            label: "订单数量",
          },
          {
            id: 4,
            prop: "receivable",
            label: "应收金额",
          },
          {
            id: 5,
            prop: "received",
            label: "已收金额",
          },
          {
            id: 6,
            prop: "unReceived",
            label: "未收金额",
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
          permission: "system/sysCourseOrderBills/pressSinglePersonStatisticsExport",
          action: () => {
            this.handleExport(0);
          },
        },
      ],
      headerOperates1: [
        {
          key: "export",
          name: "导出",
          permission: "system/sysCourseOrderBills/statisticsSalespersonExport",
          action: () => {
            this.handleExport(1);
          },
        },
      ],
      headerOperates2: [
        {
          key: "export",
          name: "导出",
          permission: "system/sysCourseOrderBills/statisticsCourseExport",
          action: () => {
            this.handleExport(2);
          },
        },
      ],
      currentTab: 1,
      headerTab: [
        {
          id: 1,
          name: "下单客户统计",
          isChecked: true,
          permission: "",
          api: "system/sysCourseOrderBills/pressSinglePersonStatistics",
        },
        {
          id: 2,
          name: "销售员统计",
          isChecked: false,
          api: "/system/sysCourseOrderBills/statisticsSalesperson",
          permission: "",
        },
        {
          id: 3,
          name: "按课程统计",
          isChecked: false,
          api: "system/sysCourseOrderBills/statisticsCourse",
          permission: "",
        },
      ],
    };
  },
  created() {
    // this.getDepartmentList();
    this.getList();
  },
  mounted() {
    this.init();
  },
  methods: {
    handleExport(e) {
      var exportUrl = "";
      var title = "";
      if (e === 0) {
        exportUrl = "system/sysCourseOrderBills/pressSinglePersonStatisticsExport"
        title="下单客户统计列表"
      }
      if (e === 1) {
        exportUrl = "system/sysCourseOrderBills/statisticsSalespersonExport"
        title="销售员统计列表"
      }
      if (e === 2) {
        exportUrl = "system/sysCourseOrderBills/statisticsCourseExport"
        title="课程统计列表"
      }

      this.$confirm('确定导出' + title + '吗？导出的时候请等待页面下载自动开始，如果数据量大，可能会等待稍长时间，请不要关闭或者刷新页面', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.warning("请耐心等待，表格正在导出中......");
        const {time, ...rest} = this.filterData;
        request.post({
          url: exportUrl,
          params: {
            startTime: time && time.length > 1 ? time[0] : "",
            endTime: time && time.length > 1 ? time[1] : "",
            ...rest
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
      const {time, ...rest} = this.filterData;
      request.post({
        url: this.headerTab.find(item => item.isChecked).api,
        params: {
          startTime: time && time.length > 1 ? time[0] : "",
          endTime: time && time.length > 1 ? time[1] : "",
          ...rest
        },
        success: (res) => {
          this.table.data = res.slice(
            (this.table.currentPage - 1) * this.table.pageSize,
            (this.table.currentPage - 1) * this.table.pageSize +
              this.table.pageSize
          );
          this.table.total = res.length;
          // this.table.data = res;
          // this.table.total = res.length;
          this.loading = false;
          
        },
        catch: () => {
          this.loading = false;
        },
        finally: () => {
          this.loading = false;
        }
      });
    },

    // handleDelete(row) {
    //   this.$confirm("此操作将会删除该新闻, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       request.post({
    //         url: "/system/sysNews/remove",
    //         params: {
    //           id: row.id,
    //         },
    //         success: (res) => {
    //           this.$message.success(res);
    //           this.getList();
    //         },
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },

    getDepartmentList() {
      request.post({
        url: "/admin/adInfo/canChooseCanSeeDepartmentList",
        params: {
          id: sessionStorage.getItem("id")
        },
        params: {},
        success: (res) => {
          this.filterOptions.column[1].options = listToTree(res);
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

    handleTabSelect(tab, flag) {
      this.tagCheck = tab.id
      // if() {}
      if (tab.id == this.$route.query.type && tab.isChecked) {
        return;
      }
      this.headerTab.forEach((item) => {
        item.isChecked = item.id == tab.id;
      });
      if (!flag) {
        this.$router.replace({
          path: this.$router.path,
          query: {type: tab.id},
        });
      }
      this.currentTab = tab.id;
      this.table.data = []
      this.table.total = 0
      this.clearFilter()
    },
    init() {
      const type = this.$route.query.type;
      if (type) {
        const dom = document.querySelector(".tab_" + type);
        if (!dom) {
          const currentTab = this.headerTab.find((item) => item.isChecked);
          this.$router.replace({
            path: this.$router.path,
            query: {type: currentTab.id},
          });
          return;
        }
        const item = this.headerTab.find((item) => item.id == type);
        if (item) {
          this.handleTabSelect(item, true);
        }
      } else {
        this.$router.replace({
          path: this.$router.path,
          query: {type: 1},
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-box {
  background: #fff;
  display: flex;
  align-items: center;
  border: 1px solid #a9adb5;
  border-bottom: 1px solid #cbced2;
  box-shadow: 0px 0px 8px 0px rgba(116, 136, 161, 0.5);
}

/deep/ .FilterContent {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  // box-shadow: none;
  border-top: 1px;
  box-shadow: 0px 5px 8px 0px rgba(116, 136, 161, 0.5);
  padding-top: 15px;
}

.BasicInfo_title {
  // display: inline-block;
  margin: 10px 13px;
  // margin-top: 0px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: hwb(0 40% 60%);
  display: inline-block;
  background: #eceff3;
  border-radius: 4px;

  div {
    display: inline-block;
    margin: 3px 3px;

    padding: 6px 12px;
    cursor: pointer;

    &.is_active {
      background: #167cf3;
      border-radius: 2px;
      font-size: 14px;
      color: #fff;
      border-radius: 2;
    }
  }
}
</style>
