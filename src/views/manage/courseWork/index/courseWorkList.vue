<!-- 课程作业列表 -->
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
      <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
    </div>
  </template>

  <script>
  import BasicTable from "@/components/BasicTable/index.vue";
  import request from "../../../../utils/request";
  import addDialog from "./addDialog.vue";
  export default {
    name: "courseWorkPage",
    components: { BasicTable, addDialog },
    data() {
      return {
        loading: false,
        categoryOptions: [],
        filterOptions: {
          column: [
            {
              type: "input",
              label: "课程名称",
              value: "courseName"
            }
          ],
        },

        filterData: {
          courseName: "",
        },
        table: {
          columns: [
            {
              id: 1,
              prop: "workName",
              label: "作业名称",
              width: "180px"
            },
            {
              id: 2,
              prop: "courseName",
              label: "课程名称",
              width: "180px"
            },
            {
              id: 3,
              prop: "chapterName",
              label: "章节名称",
              width: "180px"
            },
            {
              id: 5,
              type: "image",
              prop: "caseUrl",
              label: "作业案例展示图",
              width: "180px"
            },
            {
              id: 6,
              prop: "count",
              label: "作业提交人数",
            },
            {
              id: 7,
              prop: "teacherName",
              label: "老师名称",
              width: "180px"
            },
            {
              id: 8,
              prop: "createTime",
              label: "创建时间",
              type: "date",
              width: "180px"
            },
            {
              id: 9,
              prop: "cutOffTime",
              label: "提交截止时间",
              type: "date",
              width: "180px"
            },
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
            permission: "admin/adCourseWork/edit",
            btnStyle: "yellow",
            action: (o, row) => {
              this.$refs.addDialog.edit(row);
            },
          },
          {
            key: "delete",
            title: "删除",
            permission: "admin/adCourseWork/remove",
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
          url: "/admin/adCourseWork/list",
          params: {
            pageNo: this.table.currentPage,
            pageSize: this.table.pageSize,
            // ...this.filterData,
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

      handleDelete(row) {
        console.log("row:",row)
        this.$confirm("此操作将会删除该作业, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            request.post({
              url: "/admin/adCourseWork/remove",
              params: {
                id: row.workId,
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
            courseName: "",
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
  