<!-- 章节列表 -->
<template>
  <el-dialog title="章节列表" width="60%" :visible.sync="chaptersVisible">
    <div style="max-height: 500px;" v-loading="loading">
      <BasicTable
        :columns="table.columns"
        :operates="operates"
        operateWidth="130px"
        :hasCard="false"
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :headerOperates="headerOperates"
        :total="table.total"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
      >
      </BasicTable>
      <addChapters @success="handleSuccess" ref="addChatptersDialog"></addChapters>
    </div>
  </el-dialog>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";

import { hasFreeOptions, positionptions, tagOptions } from "./const";
import uploadVideo from "./uploadVideo.vue";
import addChapters from './addChapters.vue';
export default {
  name: "chaptersPage",
  components: { BasicTable, addChapters, uploadVideo },
  data() {
    return {
      loading: false,
      chaptersVisible: false,
      remoteLoading: false,
      openLiveVisible: false,
      openLiveData: {},
      supervisorAdOptions: [],
      categoryOptions: [],
      filterOptions: {
        column: [
         
        ],
      },
      remoteLoading: false,
      teacherOptions: [],
      filterData: {
       id: ""
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "number",
            label: "课程编号",
          },
          {
            id: 2,
            prop: "hasLive",
            label: "课程类型",
            render: (row) => {
              const item = this.hasLiveOptions.find(
                (item) => item.value == row.hasLive
              );
              return item ? item.label : "";
            },
          },
          {
            id: 3,
            prop: "setMealCategoryId",
            label: "课程套餐",
            render: (row) => {
              const item = this.$refs.addDialog.MealCategoryOptions.find(
                (item) => item.id == row.setMealCategoryId
              );
              return item ? item.name : "";
            },
          },
          {
            id: 4,
            prop: "categoryId",
            label: "课程类别",
            render: (row) => {
              const item = this.$refs.addDialog.categoryOptions.find(
                (item) => item.id == row.categoryId
              );
              return item ? item.name : "";
            },
          },
          {
            id: 5,
            prop: "tag",
            label: "课程标签",
            render: (row) => {
              const item = tagOptions.find((item) => item.value == row.tag);
              return item ? item.label : "";
            },
          },
          {
            id: 6,
            prop: "position",
            label: "推荐位",
            render: (row) => {
              const item = positionptions.find(
                (item) => item.value == row.position
              );
              return item ? item.label : "";
            },
          },
          {
            id: 7,
            prop: "teacherName",
            label: "讲师",
          },
          {
            id: 8,
            prop: "price",
            label: "价格",
          },
          {
            id: 9,
            prop: "createAdName",
            label: "增加人",
          },
          {
            id: 10,
            prop: "createTime",
            label: "增加时间",
            type: "date",
          },
          {
            id: 12,
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
          permission: "admin/adCourseChapters/uploadCourseEdit",
          btnStyle: "yellow",
          action: (o, row) => {
            this.$refs.addDialog.edit(row);
          },
        },
        {
          key: "delete",
          title: "删除",
          permission: "/admin/adCourseChapters/remove",
          btnStyle: "red",
          action: (o, row) => {
            this.handleDelete(row);
          },
        },
      ],
      headerOperates: [
      {
          key: "el-icon-plus",
          name: "添加章节",
          permission: "admin/adCourseChapters/uploadCourseAdd",
          action: () => {
            this.$refs.addChatptersDialog.open(this.filterData.id)
          },
        },
      ]
    };
  },
  computed: {
    hasLiveOptions() {
      return this.$refs.addDialog ? this.$refs.addDialog.hasLiveOptions : [];
    },
  },
  mounted() {
  },

  created() {
  },
  methods: {
    open(row) {
        this.chaptersVisible = true;
        this.filterData.id = row.id
        this.getList();
    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      request.post({
        url: "/admin/adCourseChapters/list",
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
    handleSuccess() {
      this.getList();
    },
    onCopy() {
      this.$message.success("复制成功");
    },

    handleClose() {
      this.openLiveData = {};
    },
    clearFilter() {
      this.filterData = {
        id: ""
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
    handleDelete(row) {
      this.$confirm("此操作将会删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adCourseChapters/remove",
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
  },
};
</script>
<style lang="scss" scoped>
.tipInfo {
  font-size: 16px;
  margin: 10px;
  color: #f56c6c;
}
.account-box {
  // text-align: center;
  display: flex;
  flex-direction: column;
  span {
    margin: 10px 20px;
    font-size: 16px;
  }
  margin: auto;
}
</style>
