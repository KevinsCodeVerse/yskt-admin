<!-- 角色管理 -->
<template>
  <div class="middle-container">
    <jat-fillter
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
import { listToTree } from "../../../../utils/tools";
export default {
  name: "adminManagePage",
  components: { BasicTable, addDialog },
  data() {
    return {
      supervisorAdOptions: [],
      remoteLoading: false,
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
            options: [],
            props: {
              value: "id",
              label: "name",
              emitPath: false,
              checkStrictly: true,
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
                value: 1,
              },
              {
                label: "禁用",
                value: 2,
              },
              {
                label: "未审核",
                value: 3,
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
        departmentId: "",
        parentId: "",
        status: "",
        registerTime: [],
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "username",
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
            prop: "weChat",
            label: "微信",
          },
          {
            id: 6,
            prop: "phone",
            label: "联系电话",
          },
          {
            id: 7,
            prop: "department",
            label: "所属部门",
          },
          {
            id: 8,
            prop: "createTime",
            label: "创建时间",
            type: "date"
          },
        ],
        pageSize: 10,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        // {
        //   key: "edit",
        //   title: "编辑",
        //   btnStyle: "yellow",
        //   action: (o, row) => {
        //     this.$refs.addDialog.edit(row);
        //   },
        // },
        // {
        //   key: "delete",
        //   title: "删除",
        //   btnStyle: "red",
        //   action: (o, row) => {
        //     this.handleDelete(row);
        //   },
        // },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加管理员",
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
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      const { registerTime, ...rest} = this.filterData
      request.post({
        url: "/admin/adInfo/adList",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...rest,
          startTime: registerTime && registerTime.length > 0 && registerTime[0],
          endTime: registerTime && registerTime.length > 0 && registerTime[1]
        },
        success: (res) => {
          this.table.data = res.list;
          this.table.total = res.total;
        },
      });
    },
    getDepartmentList() {
      request.post({
        url: "/admin/adDepartment/listNoPage",
        params: {
          ...this.addData,
        },
        success: (res) => {
          this.filterOptions.column[3].options = listToTree(res);
        },
      });
    },
    handleSuccess() {
      this.getList();
    },
    remoteMethod(search) {
      if(!search) {
        return
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
