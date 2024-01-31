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
      categoryOptions: [],

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
      headerOperates: [],
      currentTab: 2,
      headerTab: [
        {
          id: 1,
          name: "下单客户统计",
          isChecked: false,
          permission: "system/sysCourseOrderBills/pressSinglePersonStatistics",
        },
        {
          id: 2,
          name: "销售员统计",
          isChecked: true,
          permission: "/system/sysCourseOrderBills/statisticsCourse",
        },
        {
          id: 3,
          name: "按课程统计",
          isChecked: false,
          permission: "system/sysCourseOrderBills/statisticsCourse",
        },
      ],
    };
  },
  created() {
    this.getDepartmentList();
    this.getList();
  },
  mounted() {
    this.init();
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const { time, ...rest } = this.filterData;
      request.post({
        url: this.headerTab.find(item => item.isChecked).permission,
        params: {
          startTime: time && time.length > 1 ? time[0] : "",
          endTime: time && time.length > 1 ? time[1] : "",
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
        url: "/admin/adDepartment/listNoPage",
        params: {},
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

    handleTabSelect(tab, flag) {
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
          query: { type: tab.id },
        });
      }
      this.currentTab = tab.id;
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
            query: { type: currentTab.id },
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
          query: { type: 1 },
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
/deep/.FilterContent {
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
