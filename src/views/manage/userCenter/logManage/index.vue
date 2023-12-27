<!-- 日志管理 -->
<template>
  <div class="middle-container">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    ></jat-fillter>
    <BasicTable
      :columns="table.columns"
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
export default {
  name: "logPage",
  components: { BasicTable },
  data() {
    return {
      categoryOptions: [],
      filterOptions: {
        column: [
          {
            type: "input",
            label: "日志内容",
            value: "interfaceName",
          },
        ],
      },

      filterData: {
        interfaceName: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "interfaceName",
            label: "日志内容",
          },
          {
            id: 2,
            prop: "adName",
            label: "操作人",
          },
          {
            id: 3,
            prop: "createTime",
            label: "操作时间",
            type: "date",
          },
        ],
        pageSize: 10,
        currentPage: 1,
        data: [],
        total: 0,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      request.post({
        url: "/system/sysLog/list",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...this.filterData
        },
        success: (res) => {
          this.table.data = res.list;
          this.table.total = res.total;
        },
      });
    },

    clearFilter() {
      this.filterData = {
        name: "",
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
