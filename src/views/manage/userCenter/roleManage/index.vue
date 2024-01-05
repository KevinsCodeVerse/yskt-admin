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
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
export default {
  name: "RolePage",
  components: { BasicTable, addDialog },
  data() {
    return {
      loading: false,
      filterOptions: {
        column: [
          {
            type: "input",
            label: "角色名称",
            value: "name",
          },
        ],
      },

      filterData: {
        name: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "roleName",
            label: "角色名称",
          },
          {
            id: 2,
            prop: "createTime",
            label: "创建时间",
            type: "date",
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
          btnStyle: "yellow",
          permission: "admin/adRole/edit",
          action: (o, row) => {
            this.$refs.addDialog.edit(row.id);
          },
        },
        {
          key: "delete",
          title: "删除",
          permission: "admin/adRole/remove",
          btnStyle: "red",
          action: (o, row) => {
            this.handleDelete(row)
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加角色",
          permission: "admin/adRole/add",
          action: () => {
            this.$refs.addDialog.open();
          },
        },
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
      this.loading = true
      request.post({
        url: "/admin/adRole/list",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...this.filterData
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
    showData(row) {
      console.log(row);
    },
    handleSuccess() {
      this.getList();
    },

    handleDelete(row) {
      this.$confirm("此操作将会删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adRole/remove",
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
        name: ""
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
