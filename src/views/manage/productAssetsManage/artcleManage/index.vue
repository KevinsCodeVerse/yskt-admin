<!-- 文章管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    >
    </jat-fillter>
    <BasicTable
      :columns="table.columns"
      :headerOperates="headerOperates"
      :operates="operates"
      operateWidth="110px"
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
  name: "articlePage",
  components: { BasicTable, addDialog },
  data() {
    return {
      loading: false,
      remoteLoading: false,
      supervisorAdOptions: [],
      categoryOptions: [],
      filterOptions: {
        column: [
          
          {
            type: "input",
            label: "文章名称",
            value: "title",
          },
          {
            type: "select",
            label: "文章类别",
            value: "categoryId",
            labelKey: "name",
            valueKey: "id",
            options: [],
          },
          {
            type: "select",
            label: "文章状态",
            value: "status",
            options: [
              {
                value: 0,
                label: "正常"
              },
              {
                value: 1,
                label: "下架"
              }
            ],
          }
        ],
      },
      remoteLoading: false,
      teacherOptions: [],
      filterData: {
        title: "",
        categoryId: "",
        status: ""
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "title",
            label: "文章名称",
          },
          {
            id: 2,
            prop: "categoryId",
            label: "文章类别",
            render: (row) => {
              const item = this.$refs.addDialog.categoryOptions.find(
                (item) => item.id == row.categoryId
              );
              return item ? item.name : "";
            },
          },
          {
            id: 3,
            prop: "createAdName",
            label: "增加人",
          },
          {
            id: 4,
            prop: "createTime",
            label: "增加时间",
            type: "date",
          },
          {
            id: 5,
            prop: "status",
            label: "文章状态",
            render: (row) => {
              return row.status == 0 ? '正常' : "下架"
            },
            statusType: (row) => {
              return row.status == 0 ? 'success' : "error"
            }
          },
          {
            id: 6,
            prop: "sort",
            label: "排序",
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
          permission: "admin/adCourse/edit",
          action: (o, row) => {
            this.$refs.addDialog.edit(row);
          },
        },
        {
          key: "delete",
          title: "删除",
          permission: "system/sysArticle/remove",
          btnStyle: "red",
          action: (o, row) => {
            this.handleDelete(row);
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加文章",
          permission: "system/sysArticle/add",
          action: () => {
            this.$refs.addDialog.open();
          },
        },
      ],
    };
  },
  computed: {
    hasLiveOptions() {
      return this.$refs.addDialog ? this.$refs.addDialog.hasLiveOptions : [];
    },
  },
  mounted() {
    this.$watch(
      () => {
        return this.$refs.addDialog.categoryOptions;
      },
      (val) => {
        this.filterOptions.column[1].options = val;
      }
    );
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
      this.loading = true;
      request.post({
        url: "/system/sysArticle/list",
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
    teacherRemoteMethod(keyword) {
      if (!keyword) {
        return;
      }
      this.remoteLoading = true;
      request.post({
        url: "/admin/adCourse/queryTeacherByNameOrTeacher",
        params: {
          keyword,
        },
        success: (res) => {
          this.remoteLoading = false;
          this.teacherOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },
    handleSuccess() {
      this.getList();
    },

    handleDelete(row) {
      this.$confirm("此操作将会删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/system/sysArticle/remove",
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
        number: "",
        hasLive: "",
        teacherAdId: "",
        categoryId: "",
        hasFree: "",
        setMealCategoryId: ""
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
    remoteMethod(search) {
      if (!search) {
        return;
      }
      this.remoteLoading = true;
      request.post({
        url: "/admin/adInfo/queryAdminByNameOrPhone",
        params: {
          search,
        },
        success: (res) => {
          this.remoteLoading = false;
          this.supervisorAdOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },
  }
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
