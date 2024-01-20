<!-- 角色管理 -->
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
  name: "reservePage",
  components: { BasicTable },
  data() {
    return {
      loading: false,
      categoryOptions: [],
      filterOptions: {
        column: [
          {
            type: "input",
            label: "关键字",
            value: "keyword",
          },
          {
            type: "select",
            label: "课程标签",
            value: "tag",
            options: [
              {
                value: 0,
                label: "套餐课程",
              },
              {
                value: 1,
                label: "单品课程",
              },
              {
                value: 2,
                label: "vip课程",
              },
            ],
          },
        ],
      },
      categoryOptions: [],
      filterData: {
        categoryId: "",
        name: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "name",
            label: "课程名称",
          },
          {
            id: 2,
            prop: "categoryId",
            label: "课程类型",
            render: (row) => {
                const item = this.categoryOptions.find(item => item.id == row.categoryId);
                return item ? item.name : ""
            }
            //   renderName: "image",
          },
          {
            id: 4,
            prop: "price",
            label: "价格",
          },
          {
            id: 5,
            prop: "teacherName",
            label: "操作员",
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
          title: "立即预订",
          btnStyle: "yellow",
          permission: "system/sysNews/edit",
          action: (o, row) => {
            this.$refs.addDialog.edit(row);
          },
        },
      ],
      headerOperates: [],
    };
  },
  created() {
    this.getCategoryList();
    this.getList();
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      request.post({
        url: "/admin/adCourse/listReserve",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...this.filterData,
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
        url: "system/sysCategory/listNoPage",
        params: {
          type: 2,
        },
        success: (res) => {
          this.categoryOptions = res;
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
<style lang="scss" scoped></style>
