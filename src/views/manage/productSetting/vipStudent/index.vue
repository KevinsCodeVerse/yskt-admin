<!-- 非会员管理 -->
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
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :total="table.total"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
        :operates="operates"
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

  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";


export default {
  name: "vipStudent",
  components: {
    BasicTable,
  },
  data() {
    return {
      supervisorAdOptions: [],
      departmentList: [],
      remoteLoading: false,
      accountVisible: false,
      accountInfo: {
        account: "",
        password: "",
      },
      loading: false,
      filterOptions: {
        column: [
          {
            type: "user",
            userType: 1,
            label: "下单人",
            value: "vipId",
          },
          {
            type: "timeAll",
            label: ["学习开始日期", "学习结束日期"],
            value: "registerTime",
          },
        ],
      },

      filterData: {
        username: "",
        qq: "",
        gender: "",
        departmentId: "",
        parentId: "",
        status: -3,
        registerTime: [],
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "vipName",
            label: "用户名",
          },
          {
            id: 3,
            prop: "account",
            label: "学员账号",
          },
          {
            id: 4,
            prop: "courseName",
            label: "课程名称",
          },
          {
            id: 5,
            prop: "chapterName",
            label: "章节名称",
          },
          {
            id: 6,
            prop: "openTimeName",
            label: "学习时间",
          },
          {
            id: 8,
            prop: "lastTimeName",
            label: "最后一次学习时间"
          },
          {
            id: 9,
            prop: "status",
            label: "学习状态",
            render: () => {
              return "已学习";
            },
          },

        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      // operates: [
      //   {
      //     key: "edit",
      //     title: "审核",
      //     btnStyle: "yellow",
      //     permission: "admin/adInfo/auditVip",
      //     action: (o, row) => {
      //       this.handleAudit(row);
      //     },
      //   },
      // ],
      headerOperates: [],
    };
  },
  created() {
    this.getList();
    this.getDepartmentList();
  },
  methods: {
    handleClose() {
      this.accountInfo = {
        account: "",
        password: "",
      }
    },
    handleAudit(row) {
      this.$confirm("确定审核通过吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/admin/adInfo/auditVip",
              params: {
                id: row.id,
              },
              success: (res) => {
                this.accountInfo = res;
                this.accountVisible = true;
                this.$message.success("审核通过，请将账号和密码发给学员");
                this.getList();
              },
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      const { registerTime, ...rest } = this.filterData;
      this.loading = true;
      request.post({
        url: "/admin/adInfo/vipWatch",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...rest,
          lastTimeStart:
              registerTime && registerTime.length > 0 ? registerTime[0] : "",
          lastTimeEnd:
              registerTime && registerTime.length > 0
                  ? this.$moment(registerTime[1])
                      .add(1, "days")
                      .format("YYYY-MM-DD")
                  : "",
        },
        success: (res) => {
          this.table.data = res.list;
          this.table.total = res.total;
          this.table.data.forEach((item) => {
            if (!this.$common.checkNull(item.name)) {
              item.name = "未填写";
            }
            if (!this.$common.checkNull(item.qq)) {
              item.qq = "未填写";
            }
            if (!this.$common.checkNull(item.wechat)) {
              item.wechat = "未填写";
            }
          });
          this.loading = false;
        },
        catch: () => {
          this.loading = false;
        },
      });
    },
    getDepartmentList() {
      request.post({
        url: "/admin/adInfo/canChooseCanSeeDepartmentList",
        params: {
          ...this.addData,
          id: sessionStorage.getItem("id"),
        },
        success: (res) => {
          this.departmentList = res;
          this.filterOptions.column[3].options = listToTree(res);
        },
      });
    },
    handleSuccess() {
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

    clearFilter() {
      this.filterData = {
        username: "",
        qq: "",
        gender: "",
        departmentId: "",
        parentId: "",
        status: -3,
        registerTime: [],
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
