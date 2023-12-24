<!-- 角色管理 -->
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
      :headerOperates="headerOperates"
      :operates="operates"
      :data="table.data"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :total="table.total"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
    >
      <div slot="image" slot-scope="scope">
        <el-image
          v-if="scope.row.image"
          style="width: 50px"
          :src="scope.row.image"
          :preview-src-list="[scope.row.image]"
        >
        </el-image>
        <span v-else></span>
      </div>
    </BasicTable>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
export default {
  name: "adverstPage",
  components: { BasicTable, addDialog },
  data() {
    return {
      categoryOptions: [],
      filterOptions: {
        column: [
          {
            type: "select",
            label: "广告位置",
            value: "categoryId",
            options: [],
            labelKey: "name",
            valueKey: "id",
          },
          {
            type: "input",
            label: "广告名称",
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
            prop: "advertiseCategoryId",
            label: "广告位置",
            render: (row) => {
              return (
                this.filterOptions.column[0].options.find(
                  (item) => item.id == row.advertiseCategoryId
                ) &&
                this.filterOptions.column[0].options.find(
                  (item) => item.id == row.advertiseCategoryId
                )["name"]
              );
            },
          },
          {
            id: 2,
            prop: "name",
            label: "广告名称",
          },
          {
            id: 3,
            prop: "image",
            label: "广告图片",
            renderName: "image",
          },
          {
            id: 4,
            prop: "sort",
            label: "排序",
          },
          {
            id: 5,
            prop: "adName",
            label: "创建人",
          },
          {
            id: 6,
            prop: "createTime",
            label: "创建时间",
            type: "date",
          },
        ],
        pageSize: 10,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        {
          key: "edit",
          title: "编辑",
          btnStyle: "yellow",
          action: (o, row) => {
            console.log(row);
            this.$refs.addDialog.edit(row);
          },
        },
        {
          key: "delete",
          title: "删除",
          btnStyle: "red",
          action: (o, row) => {
            this.handleDelete(row);
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加广告",
          action: () => {
            this.$refs.addDialog.open();
          },
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getCategoryList();
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
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
        },
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
