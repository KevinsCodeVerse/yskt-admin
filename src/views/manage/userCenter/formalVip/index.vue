<!-- 会员管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
        :option="filterOptions"
        v-model="filterData"
        @searchFilter="searchFilter"
        @clearFilter="clearFilter"
    >
      <span slot="parentId">
        <el-select
            style="width: 100%;"
            v-model="filterData.parentId"
            filterable
            remote
            size="small"
            clearable
            placeholder="添加人(可根据名称或手机号进行搜索)"
            :remote-method="remoteMethod"
            :loading="remoteLoading"
        >
          <el-option
              v-for="item in supervisorAdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </span>
    </jat-fillter>
    <BasicTable
        :columns="table.columns"
        :headerOperates="headerOperates"
        :operates="operates"
        operateWidth="120px"
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

    <!--编辑销售员弹框-->
    <el-dialog
        title="修改会员所属销售员"
        :visible.sync="JJDialogFlag"
        width="30%"
        @close="closeJJ">
      <div style="margin-top: 10px">
        <span>新销售账号：</span>
        <el-select
            v-model="JJFrom.newId"
            filterable
            remote
            size="small"
            clearable
            placeholder="新销售账号"
            :remote-method="remoteMethodV2"
            :loading="remoteLoading"
        >
          <el-option
              v-for="item in supervisorAdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div style="display: flex;justify-content: center;align-items: center;margin-top: 20px">
        <el-button @click="JJDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="handover">确 定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import {listToTree} from "../../../../utils/tools";

export default {
  name: "formalVipPage",
  components: {BasicTable, addDialog},
  data() {
    return {
      JJFrom: {
        id: "",
        newId: ""
      },
      JJDialogFlag: false,
      supervisorAdOptions: [],
      departmentList: [],
      remoteLoading: false,
      loading: false,
      filterOptions: {
        column: [
          {
            type: "input",
            label: "用户名/真实姓名/电话号码",
            value: "username",
          },
          {
            type: "input",
            label: "QQ/微信",
            value: "qq",
          },
          {
            type: "select",
            label: "性别",
            value: "gender",
            options: [
              {
                label: "男",
                value: "1",
              },
              {
                label: "女",
                value: "2",
              },
            ],
          },
          // {
          //   type: "cascader",
          //   label: "部门",
          //   value: "departmentId",
          //   options: [],
          //   props: {
          //     value: "id",
          //     label: "name",
          //     emitPath: false,
          //     checkStrictly: true,
          //   },
          // },
          {
            type: "slot",
            slotName: "parentId",
          },
          {
            type: "select",
            label: "状态",
            value: "status",
            options: [
              {
                label: "正常",
                value: 0,
              },
              {
                label: "冻结",
                value: -1,
              },
              {
                label: "禁用",
                value: -2,
              },
              {
                label: "未审核",
                value: -3,
              },
            ],
          },
          {
            type: "timeAll",
            label: ["注册开始日期", "注册结束日期"],
            value: "registerTime",
          },
        ],
      },
      statusDic: {
        "0": {label: "正常", type: "success"},
        "-1": {label: "冻结", type: "warning"},
        "-2": {label: "禁用", type: "danger"},
        "-3": {label: "未审核", type: "info"},
      },

      filterData: {
        username: "",
        qq: "",
        gender: "",
        departmentId: "",
        parentId: "",
        status: "",
        registerTime: [],
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "account",
            label: "用户名",
          },
          {
            id: 2,
            prop: "studentNumber",
            label: "学籍号",
            render: (row) => {
              console.log("学籍:", row)

              return !row.studentNumber ? "未注册学籍" : row.studentNumber
            },
          },
          {
            id: 3,
            prop: "name",
            label: "真实姓名",
          },
          {
            id: 10,
            prop: "profitName",
            label: "所属销售员",
          },
          {
            id: 4,
            prop: "qq",
            label: "QQ",
          },
          {
            id: 5,
            prop: "wechat",
            label: "微信",
          },
          {
            id: 6,
            prop: "phone",
            label: "联系电话",
          },
          {
            id: 7,
            prop: "status",
            label: "状态",
            render: (row) => {
              return this.statusDic[row.status].label;
            },
            statusType: (row) => {
              return this.statusDic[row.status].type;
            },
          },
          {
            id: 8,
            prop: "createTime",
            label: "注册时间",
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
          permission: "admin/adInfo/editVip",
          btnStyle: "yellow",
          action: (o, row) => {
            console.log("row:",row)
            this.$refs.addDialog.edit(row);
          }
        },
        {
          key: "edit",
          title: "修改所属销售",
          permission: "admin/adInfo/editProfitAd",
          btnStyle: "red",
          action: (o, row) => {
            console.log("row:",row)
            this.JJDialogFlag=true
            this.JJFrom.id=row.id
            // this.$refs.addDialog.edit(row);
          }
        },
        {
          key: "edit",
          title: "生成学籍",
          permission: "admin/adInfo/gtStNumber",
          btnStyle: "green",
          action: (o, row) => {
            this.gtStNumber(row.id)
          },
          show: (row) => {
            if (!row.studentNumber) {
              return true;
            }
          }
        },
        // {
        //   key: "detail",
        //   title: "详情",
        //   btnStyle: "green",
        //   action: (o, row) => {
        //     this.$refs.drawer.open(row, this.departmentList);
        //   },
        // },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          permission: "admin/adInfo/addVip",
          name: "添加会员",
          action: () => {
            this.$refs.addDialog.open();
          },
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getDepartmentList();
  },
  methods: {
    handover() {
      console.log("JJFROM:", this.JJFrom)
      if (!this.JJFrom.newId) {
        this.$message.warning("请选择新销售账号")
        return;
      }
      if (!this.JJFrom.id) {
        this.$message.warning("旧销售不能为空")
        return;
      }
      this.$confirm('确定编辑该会员的所属销售吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post({
          url: "/admin/adInfo/editProfitAd",
          params: {
            id: this.JJFrom.id,
            newId: this.JJFrom.newId
          },
          success: (res) => {
            this.$message.success("编辑成功！")
            this.JJDialogFlag=false
            this.searchFilter()
          },
        });
      }).catch(() => {

      });
    },
    remoteMethodV2(search) {
      if (!search) {
        return;
      }
      var type = 0
      this.remoteLoading = true;
      request.post({
        url: "/admin/adInfo/queryAdminByNameOrPhone",
        params: {
          search,
          type
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
    closeJJ() {
      this.JJFrom = {
        id: "",
        newId: ""
      }
      this.supervisorAdOptions = []
    },
    gtStNumber(id) {
      this.$confirm('确定生成学籍号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post({
          url: "/admin/adInfo/gtStNumber",
          params: {
            id: id
          },
          success: (res) => {
            this.$message.success("操作成功");
            this.searchFilter();
          },
        });
      }).catch(() => {
      });

    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      const {registerTime, ...rest} = this.filterData;
      this.loading = true;
      request.post({
        url: "/admin/adInfo/vipList",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...rest,
          startTime:
              registerTime && registerTime.length > 0 ? registerTime[0] : "",
          endTime:
              registerTime && registerTime.length > 0
                  ? this.$moment(registerTime[1])
                      .add(1, "days")
                      .format("YYYY-MM-DD")
                  : "",
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
    getDepartmentList() {
      request.post({
        url: "/admin/adInfo/canChooseCanSeeDepartmentList",
        params: {
          ...this.addData,
          id: sessionStorage.getItem("id")
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
        status: "",
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
