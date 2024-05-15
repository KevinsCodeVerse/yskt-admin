<!-- 角色管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
        ref="filter"
        :option="filterOptions"
        v-model="filterData"
        @searchFilter="searchFilter"
        @clearFilter="clearFilter"
    >
      <span slot="parentId">
        <el-select
            v-model="filterData.parentId"
            filterable
            remote
            size="small"
            clearable
            placeholder="添加人"
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
        :data="table.data"
        operateWidth="120px"
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
    <!--订单交接弹框-->
    <el-dialog
        title="会员交接（订单交接）"
        :visible.sync="JJDialogFlag"
        width="30%"
        @close="closeJJ">
      <div style="margin-bottom: 10px;color: red;font-weight: bold">
        交接后会将原销售账号的所有订单利益归属都转移给新销售账号，不影响原销售账号开单和新销售账号开单
      </div>
      <div>
        <span>原销售账号（交接前）:</span>
        <el-input v-model="JJFrom.rawName" placeholder="" style="width: 30%;margin-left: 10px" size="small" disabled></el-input>
      </div>
      <div style="margin-top: 10px">
        <span>新销售账号（交接后）：</span>
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

    <detailDrawer ref="drawer"></detailDrawer>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import {listToTree} from "../../../../utils/tools";
import detailDrawer from "./detailDrawer.vue";

export default {
  name: "adminManagePage",
  components: {
    BasicTable,
    addDialog,
    detailDrawer,
  },
  data() {
    return {
      JJFrom: {
        rawName: "",
        rawId: "",
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
          {
            type: "cascader",
            label: "部门",
            value: "departmentId",
            ref: "departmentRef",
            options: [],
            props: {
              value: "id",
              label: "name",
              multiple: true,
            },
          },
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
            ],
          },
          {
            type: "timeAll",
            label: ["注册开始日期", "注册结束日期"],
            value: "registerTime",
          },
        ],
      },

      filterData: {
        username: "",
        qq: "",
        gender: "",
        departmentId: [],
        parentId: "",
        status: "",
        registerTime: [],
      },
      statusDic: {
        "0": {
          label: "正常",
          type: "success",
        },
        "-1": {
          label: "冻结",
          type: "warning",
        },
        "-2": {
          label: "禁用",
          type: "danger",
        },
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "account",
            label: "用户名",
          },
          {
            id: 3,
            prop: "name",
            label: "真实姓名",
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
            prop: "departments",
            label: "所属部门",
            showOverflowTooltip: false,
          },
          {
            id: 8,
            prop: "roles",
            label: "所属角色",
            showOverflowTooltip: false,
          },
          {
            id: 9,
            prop: "canSeeDepartmentName",
            label: "可查看部门",
            showOverflowTooltip: false,
          },
          {
            id: 11,
            prop: "status",
            label: "状态",
            render: (row) => {
              return this.statusDic[row.status].label;
            },
            statusType: (row) => {
              return this.statusDic[row.status].type;
            },
            width: "70px",
          },
          {
            id: 10,
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
          btnStyle: "yellow",
          permission: "admin/adInfo/editAdmin",
          action: (o, row) => {
            this.$refs.addDialog.edit(row);
          },
        },
        {
          key: "edit",
          title: "订单交接",
          permission: "admin/adInfo/handover",
          btnStyle: "red",
          action: (o, row) => {
            // this.gtStNumber(row.id)

            this.openJJ(row)
          },
        },
        {
          key: "detail",
          title: "详情",
          btnStyle: "green",
          action: (o, row) => {
            this.$refs.drawer.open(row, this.departmentList);
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加管理员",
          permission: "admin/adInfo/addAdmin",
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
        this.$message.warning("请选择新销售账号（交接后的）")
        return;
      }
      if (!this.JJFrom.rawId) {
        this.$message.warning("旧销售不能为空")
        return;
      }
      this.$confirm('确定将' + this.JJFrom.rawName + '目前为止的所有订单转移给新销售吗？?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        request.post({
          url: "/admin/adInfo/handover",
          params: {
            rawId: this.JJFrom.rawId,
            newId: this.JJFrom.newId
          },
          success: (res) => {
            this.$message.success("交接成功！")
            this.JJDialogFlag=false
          },
        });
      }).catch(() => {

      });
    },
    closeJJ() {
      this.JJFrom = {
        rawName: "",
        rawId: "",
        newId: ""
      }
      this.supervisorAdOptions = []
    },
    openJJ(row) {
      console.log("row:", row)
      this.JJFrom.rawId = row.id
      this.JJFrom.rawName = row.name
      this.JJDialogFlag = true
    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      const {registerTime, ...rest} = this.filterData;
      this.loading = true;
      this.$nextTick(() => {
        const department = this.$refs.filter.$refs.departmentRef[0]
            .getCheckedNodes()
            .map((item) => item.data.id);
        request.post({
          url: "/admin/adInfo/adList",
          params: {
            pageNo: this.table.currentPage,
            pageSize: this.table.pageSize,
            ...rest,
            departmentId:
                department && department.length > 0
                    ? JSON.stringify(department)
                    : "",
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
            this.loading = false;
            this.table.data = res.list;
            this.table.total = res.total;
            console.log("da:", this.table.data);
            this.table.data.forEach((item) => {
              if (!this.$common.checkNull(item.qq)) {
                item.qq = "暂未填写qq";
              }
              if (!this.$common.checkNull(item.wechat)) {
                item.wechat = "暂未填写微信号";
              }
              if (!this.$common.checkNull(item.canSeeDepartmentName)) {
                item.canSeeDepartmentName = "无";
              }
            });
          },
          catch: () => {
            this.loading = false;
          },
        });
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

    clearFilter() {
      this.filterData = {
        username: "",
        qq: "",
        gender: "",
        departmentId: [],
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
