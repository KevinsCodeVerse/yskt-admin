<!-- 章节列表 -->
<template>
  <el-dialog title="布置作11业" width="60%" :visible.sync="chaptersVisible">
    <div style="max-height: 500px;" v-loading="loading">
      <BasicTable
        :columns="table.columns"
        height="400px"
        :operates="operates"
        operateWidth="130px"
        :hasCard="false"
        :isShowTableHead="false"
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :total="table.total"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
      >
      </BasicTable>
      <addDialog @success="handleSuccess" ref="addWordDia"></addDialog>
    </div>
  </el-dialog>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
export default {
  name: "chaptersPage",
  components: { BasicTable, addDialog },
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
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        {
          key: "edit",
          title: "布置作业",
          permission: "admin/adCourseChapters/uploadCourseEdit",
          btnStyle: "yellow",
          action: (o, row) => {
            this.$refs.addChatptersDialog.edit(row);
          },
        },
      ],
    };
  },
  computed: {},
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
        url: "/admin/adCourseChapters/courseList",
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
