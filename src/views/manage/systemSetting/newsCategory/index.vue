<!-- 题目管理 -->
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
      selectType="multi"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :total="table.total"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
      @selection-change="handleSelectionChange"
    >
      <template slot="zt" slot-scope="scope">
        <span class="zt_colunms_box" :class="'zt' + scope.row.zt">{{
          scope.row.zt === "1" ? "已发布" : "未发布"
        }}</span>
      </template>
    </BasicTable>
   
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import { fetchFlList, plfbTmxx } from "./api";
export default {
  name: "topicPage",
  components: { BasicTable },
  data() {
    return {
      filterOptions: {
        column: [
          {
            type: "input",
            label: "题目名称",
            value: "tm",
          },
          {
            type: "input",
            label: "所属知识点",
            value: "zsdmc",
          },
          {
            type: "input",
            label: "题库",
            value: "tkmc",
          },
          {
            type: "select",
            label: "题型",
            value: "tmlxdm",
            options: [],
            valueKey: "lxdm",
            labelKey: "lxmc",
          },
          {
            type: "select",
            label: "状态",
            value: "zt",
            options: [
              {
                value: "0",
                label: "未发布",
              },
              {
                label: "已发布",
                value: "1",
              },
            ],
          },
          {
            type: "input",
            label: "创建人",
            value: "cjrxm",
          },
        ],
      },

      filterData: {
        tm: "",
        zsdmc: "",
        tkmc: "",
        tmlxdm: "",
        zt: "",
        cjrxm: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "tm",
            label: "题目名称",
          },
          // {
          //   id: 2,
          //   prop: "zsdmc",
          //   label: "所属知识点"
          // },
          {
            id: 3,
            prop: "tmlxmc",
            label: "题型",
          },
          {
            id: 4,
            prop: "tkmc",
            label: "所属题库",
          },
          {
            id: 5,
            prop: "flmc",
            label: "所属分类",
          },
          {
            id: 6,
            prop: "zt",
            label: "状态",
            renderName: "zt",
          },
          {
            id: 7,
            prop: "cjrxm",
            label: "创建人",
          },
          {
            id: 8,
            prop: "crrq",
            label: "创建时间",
            type: "date",
          },
          {
            id: 9,
            prop: "gxsj",
            label: "更新时间",
            type: "date",
          },
        ],
        pageSize: 10,
        currentPage: 1,
        data: [],
        total: 0,
      },
      addModifyTitle: "",
      addModifyVisible: true,
      selection: [],
      operates: [
        {
          key: "view",
          title: "查看",
          btnStyle: "blue",
          action: (o, row) => {
            this.$refs.addTopic.open("查看", row, true);
          },
        },
        {
          key: "publish",
          title: "发布",
          btnStyle: "green",
          isHidden: (row) => {
            return row.zt === "1";
          },
          action: (o, row) => {
            // this.handlePublish(row);
          },
        },
        {
          key: "edit",
          title: "编辑",
          btnStyle: "yellow",
          action: (o, row) => {
            this.$refs.addTopic.open("编辑", row, true);
          },
          isHidden: (row) => {
            return row.zt === "1";
          },
        },
        {
          key: "delete",
          title: "删除",
          btnStyle: "red",
          action: (o, row) => {
            // this.handleDelete(row);
          },
        },
      ],
      headerOperates: [
        {
          key: "add",
          name: "新增题目",
          action: () => {
            this.$refs.addTopic.open("新增", null, true);
          },
        },
        // {
        //   key: "download",
        //   name: "下载模板",
        //   action: () => {}
        // },
        // {
        //   key: "batch-import",
        //   name: "批量上传",
        //   action: () => {}
        // },
        {
          key: "batch_delete",
          name: "批量删除",
          action: () => {
            // this.handleBatchDelete();
          },
        },
        {
          key: "el-icon-s-promotion",
          bgColor: "#167CF3",
          name: "批量发布",
          action: () => {
            // this.handleBatchPublish();
          },
        },
      ],
    };
  },
  created() {
    this.filterData.tkmc = this.$route.params ? this.$route.params.tkmc : "";
    this.getList();
    // this.getTxList();
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    async getList() {
      const res = await fetchFlList({
        ...this.filterData,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
      });
      this.table.data = res.data.list;
      this.table.total = res.data.total;
    },

    // async getTxList() {
    //   const res = await getTabList();
    //   this.filterOptions.column[3].options = res.data;
    // },

    // async handleBatchDelete() {
    //   if (this.selection.length === 0) {
    //     this.$message.warning("请至少勾选一条数据进行删除");
    //     return;
    //   }

    //   this.$confirm("此操作将会删除所选题目, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       const res = await deleteTmxx(this.selection);
    //       if (res.data.state) {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功",
    //         });
    //         this.getList();
    //       } else {
    //         this.$message.error(res.data.info);
    //       }
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },
    showData(row) {
      console.log(row);
    },

    // handleDelete(row) {
    //   this.$confirm("此操作将会删除该条题目, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       const { tm, tmid, zt, tkid, tmlxdm, tkmc } = row;
    //       const res = await deleteTmxx([
    //         {
    //           tm,
    //           tmid,
    //           tkid,
    //           zt,
    //           tmlxdm,
    //           tkmc,
    //         },
    //       ]);
    //       if (res.data.state) {
    //         this.$message({
    //           type: "success",
    //           message: "删除成功",
    //         });
    //         this.getList();
    //       }
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },
    // handlePublish(row) {
    //   this.$confirm("确定发布该条题目？", "提示", {
    //     confirmButtonText: "发布",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(async () => {
    //       const { tmid, tkid } = row;
    //       const res = await publishTmxx({
    //         tmid,
    //         tkid,
    //       });
    //       if (res.data.state) {
    //         this.$message({
    //           type: "success",
    //           message: "发布成功",
    //         });
    //         this.getList();
    //       }
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "取消发布",
    //       });
    //     });
    // },
    handleSuccess() {
      this.getList();
    },
    handleSelectionChange(e) {
      this.selection = e.map(({ tm, tmid, zt, tkid, tmlxdm }) => {
        return { tm, tmid, zt, tkid: tkid, tmlxdm };
      });
    },

    async handleBatchPublish() {
      if (this.selection.length === 0) {
        this.$message.warning("请至少勾选一条题目进行发布");
        return;
      }

      this.$confirm("确定发布所勾选的题目？", "提示", {
        confirmButtonText: "发布",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let params = this.selection.filter((item) => item.zt != "1");
          if (params.length === 0) {
            this.$message.warning("暂无题目进行发布");
            return;
          }
          params = params.map((item) => {
            return {
              tmlxdm: item.tmlxdm,
              tkid: item.tkid,
              tmid: item.tmid,
            };
          });
          const res = await plfbTmxx(params);
          if (res.data.state) {
            this.$message({
              type: "success",
              message: "发布成功",
            });
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消发布",
          });
        });
    },

    clearFilter() {
      this.filterData = {
        tm: "",
        zsdmc: "",
        tkmc: "",
        tmlxdm: "",
        zt: "",
        cjrxm: "",
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
