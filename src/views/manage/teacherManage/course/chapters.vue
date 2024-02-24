<!-- 章节列表 -->
<template>
  <el-dialog title="章节列表" width="80%" :visible.sync="chaptersVisible">
    <div style="max-height: 500px;" v-loading="loading">
      <BasicTable
        :columns="table.columns"
        height="400px"
        :operates="isWrite ? operates : undefined"
        operateWidth="180px"
        :hasCard="false"
        :data="table.data"
        :hasPage="false"
        :hasSort="false"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :headerOperates="isWrite ? headerOperates : undefined"
      >
      </BasicTable>
      <addChapters
        @success="handleSuccess"
        ref="addChatptersDialog"
      ></addChapters>
      <addParentChapter
        @success="handleSuccess"
        ref="addParentChatpterDialog"
      ></addParentChapter>
    </div>
  </el-dialog>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";

import { hasFreeOptions, positionptions, tagOptions } from "./const";
import uploadVideo from "./uploadVideo.vue";
import addChapters from "./addChapters.vue";
import addParentChapter from "./addParentChapter.vue";
export default {
  props: {
    isWrite: {
      type: Boolean,
      default: true,
    },
  },
  name: "chaptersPage",
  components: { BasicTable, addChapters, uploadVideo, addParentChapter },
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
        column: [],
      },
      remoteLoading: false,
      teacherOptions: [],
      filterData: {
        id: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "name",
            label: "章节名称",
            align: "left"
          },
          {
            id: 2,
            type: "image",
            prop: "image",
            label: "封面",
          },
          {
            id: 3,
            prop: "url",
            type: "video",
            label: "视频",
          },
          {
            id: 4,
            prop: "lengthTime",
            label: "视频时长",
          },
          {
            id: 5,
            prop: "sort",
            label: "排序",
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
          permission: "admin/adCourseChapters/uploadCourseEdit",
          btnStyle: "yellow",
          action: (o, row) => {
            if (row.parentId === -1) {
              this.$refs.addParentChatpterDialog.edit(row, this.filterData.id);
            } else {
              this.$refs.addChatptersDialog.edit(row, this.filterData.id);
            }
          },
        },
        {
          key: "el-icon-plus",
          title: "添加章节",
          btnStyle: "blue",
          permission: "admin/adCourseChapters/uploadCourseAdd",
          action: (o, row) => {
            this.$refs.addChatptersDialog.open(row, this.filterData.id);
          },
          show: (row) => {
            return row.parentId == -1;
          },
        },
        {
          key: "delete",
          title: "删除",
          permission: "admin/adCourseChapters/remove",
          btnStyle: "red",
          action: (o, row) => {
            this.handleDelete(row);
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加父章节",
          permission: "admin/adCourseChapters/uploadCourseAdd",
          action: () => {
            this.$refs.addParentChatpterDialog.open(this.filterData.id);
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
  mounted() {},

  created() {},
  methods: {
    open(row) {
      this.chaptersVisible = true;
      this.filterData.id = row.id;
      this.getList();
    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      request.post({
        url: this.isWrite ? "/admin/adCourseChapters/list" : "/admin/adCourseChapters/courseList",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...this.filterData,
        },
        success: (res) => {
          this.table.data = res.map((item) => {
            return {
              ...item.parent,

              children: item.sonList.map((son) => {
                return {
                  ...son,
                  parentInfo: item.parent,
                };
              }),
            };
          });
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
        id: "",
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
      let msg = "";
      if (row.parentId === -1) {
        msg = "此操作将会删除该父章节和父章节下的所有子章节, 是否继续?";
      } else {
        msg = "此操作将会删除该章节, 是否继续?";
      }
      this.$confirm(msg, "提示", {
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
          this.$message.info("已取消删除")
        });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-table__row:not([class*='el-table__row--level-']) {
  td:first-child {
    padding-left: 24px;
  }
}

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
