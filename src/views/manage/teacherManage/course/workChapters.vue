<!-- 章节列表 -->
<template>
  <el-dialog title="布置作业" width="60%" :visible.sync="courseWorkVisible">
    <div style="max-height: 500px;" v-loading="loading">
      <BasicTable
        :columns="table.columns"
        height="400px"
        :operates="operates"
        operateWidth="130px"
        row-key="id"
        :hasCard="false"
        :isShowTableHead="false"
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :total="table.total"
        :hasPage="false"
        :hasSort="false"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
      >
      </BasicTable>
      <addCourseWork @success="handleSuccess" ref="addWordDia"></addCourseWork>
    </div>
  </el-dialog>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addCourseWork from "./addCourseWork.vue";
export default {
  name: "workChapters",
  components: { BasicTable, addCourseWork },
  data() {
    return {
      loading: false,
      courseWorkVisible: false,
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
            align: "left",
            width: "180px",
          },
          {
            id: 2,
            type: "image",
            prop: "image",
            label: "封面",
            width: "100px",
          },
          {
            id: 3,
            prop: "url",
            type: "video",
            width: "230px",
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
          permission: "admin/adCourseWork/add",
          btnStyle: "yellow",
          action: (o, row) => {

            this.$refs.addWordDia.open(row);
          },
          show: (row) => {
            return row.parentId !== -1
          }
        },
      ],
    };
  },
  computed: {},
  mounted() {},

  created() {},
  methods: {
    open(row) {
      this.courseWorkVisible = true;
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
        url: "/admin/adCourseChapters/list",
        params: {
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
