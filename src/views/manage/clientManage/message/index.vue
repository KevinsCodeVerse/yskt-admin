<!-- 广告管理 -->
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
  export default {
    name: "messagePage",
    components: { BasicTable },
    data() {
      return {
        loading: false,
        categoryOptions: [],
        filterOptions: {
          column: [
            {
              type: "input",
              label: "接收人手机号",
              value: "phone"
            }
          ],
        },
  
        filterData: {
            phone: "",
        },
        table: {
          columns: [
            {
              id: 1,
              prop: "phone",
              label: "发送号码"
             
            },
            {
              id: 2,
              prop: "sendName",
              label: "发送人",
            },
            {
              id: 3,
              prop: "createTime",
              label: "发送时间",
              type: "date"
            },
            {
              id: 4,
              prop: "sendContent",
              label: "发送内容",
              width: "400px"
            },
            {
              id: 5,
              prop: "sendBeforeCount",
              label: "发送前条数",
              width: "60px"
            },
            {
              id: 6,
              prop: "sendAfterCount",
              label: "发送后条数",
              width: "60px"
            },
            {
              id: 7,
              prop: "remark",
              label: "发送备注",
              
            },
          ],
          pageSize: 20,
          currentPage: 1,
          data: [],
          total: 0,
        },
        operates: [
         
        ],
        headerOperates: [
          
        ],
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
        this.loading = true,
        request.post({
          url: "/system/sysSmsRecord/list",
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
      handleSuccess() {
        this.getList();
      },
  
  
      clearFilter() {
        this.filterData = {
            phone: "",
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
  </style>
  