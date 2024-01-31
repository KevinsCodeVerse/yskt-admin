<!-- 我的学员 -->
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
      </BasicTable>
    </div>
  </template>
  
  <script>
  import BasicTable from "@/components/BasicTable/index.vue";
  import request from "../../../../utils/request";
  export default {
    name: "myStudentPage",
    components: { BasicTable },
    data() {
      return {
        loading: false,
        categoryOptions: [],
        filterOptions: {
          column: [
            {
              type: "input",
              label: "名称",
              value: "name",
            },
          ],
        },
  
        filterData: {
          categoryId: "",
          name: "",
        },
        table: {
          columns: [
            {
              id: 1,
              prop: "name",
              label: "姓名",
            },
            {
              id: 2,
              prop: "gender",
              label: "性别",
            },
            {
              id: 3,
              prop: "account",
              label: "账号",
            },
            {
              id: 4,
              prop: "phone",
              label: "手机号",
            }
          ],
          pageSize: 20,
          currentPage: 1,
          data: [],
          total: 0,
        },
        operates: [
          {
            key: "edit",
            title: "编辑",
            permission: "system/sysAdvertise/edit",
            btnStyle: "yellow",
            action: (o, row) => {
              this.$refs.addDialog.edit(row);
            },
          },
          {
            key: "delete",
            title: "删除",
            permission: "system/sysAdvertise/remove",
            btnStyle: "red",
            action: (o, row) => {
              this.handleDelete(row);
            },
          },
        ],
        headerOperates: [
          
        ],
      };
    },
    created() {
    //   this.getList();
    //   this.getCategoryList();
    },
    methods: {
      searchFilter() {
        this.table.currentPage = 1;
        // this.getList();
      },
      getList() {
        this.loading = true,
        request.post({
          url: "/system/sysAdvertise/list",
          params: {
            pageNo: this.table.currentPage,
            pageSize: this.table.pageSize,
            ...this.filterData,
          },
          success: (res) => {
            this.table.data = res.list;
            this.table.total = res.total;
            this.loading = false
          },
          catch: () => {
            this.loading = false
          }
        });
      },
      getCategoryList() {
        request.post({
          url: "/system/sysAdvertise/getAllAdvertisingSpace",
          params: {},
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
  