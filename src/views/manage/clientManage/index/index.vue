<!-- 角色管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    >
    <span slot="parentAdId">
        <el-select
          style="width: 100%;"
          v-model="filterData.parentAdId"
          filterable
          remote
          size="small"
          clearable
          placeholder="所属人(输入名称或者手机号)"
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
  name: "adverstPage",
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
            label: "客户名称",
            value: "name",
          },
          {
            type: "input",
            label: "客户区域",
            value: "region",
          },
          {
            type: "slot",
            slotName: "parentAdId",
          }
        ],
      },

      filterData: {
        name: "",
        region: "",
        parentAdId: ""
      },
       // 工资水平1：三千以下 2：三千到五千 3：五千到一万 4：一万到三万 5：三万以上
       wageLevelOptions: [
        {
          label: "三千以下",
          value: 1,
        },
        {
          label: "三千到五千",
          value: 2,
        },
        {
          label: "五千到一万",
          value: 3,
        },
        {
          label: "一万到三万",
          value: 4,
        },
        {
          label: "三万以上",
          value: 5,
        },
      ],
      table: {
        columns: [
          {
            id: 1,
            prop: "name",
            label: "客户名称",
          },
          {
            id: 2,
            prop: "parentName",
            label: "所属人"
          },
          {
            id: 3,
            prop: "phone",
            label: "联系电话"
          },
          {
            id: 4,
            prop: "idCard",
            label: "证件号码"
          },
          {
            id: 5,
            prop: "birthday",
            label: "生日",
            type: "date",
            formate: "yyyy-MM-dd"
          },
          {
            id: 6,
            prop: "region",
            label: "所属区域",
          },
          {
            id: 7,
            prop: "homeAddress",
            label: "家庭住址",
          },
          {
            id: 8,
            prop: "wageLevel",
            label: "工资水平",
            render: (row) => {
             const item =  this.wageLevelOptions.find(item => item .value == row.wageLevel)
             return item ? item.label : ""
            }
          },
          {
            id: 9,
            prop: "company",
            label: "单位",
          },
          {
            id: 10,
            prop: "createTime",
            label: "创建时间",
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
          permission: "admin/adCustomer/edit",
          action: (o, row) => {
            console.log(row);
            this.$refs.addDialog.edit(row);
          },
        },
        {
          key: "delete",
          title: "删除",
          permission: "admin/adCustomer/remove",
          btnStyle: "red",
          action: (o, row) => {
            this.handleDelete(row);
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加客户",
          permission: "admin/adCustomer/add",
          action: () => {
            this.$refs.addDialog.open();
          },
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getCategoryList();
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true
      request.post({
        url: "/admin/adCustomer/list",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          ...this.filterData,
        },
        success: (res) => {
          this.table.data = res.list;
          this.table.total = res.total;
          this.loading = false
        },
        catch: () => {
          this.loading = false
        }
      });
    },
    getCategoryList() {
      request.post({
        url: "/system/sysNewsCategory/listNoPage",
        params: {
          ...this.addData,
        },
        success: (res) => {
          this.categoryOptions = res;
          this.filterOptions.column[1].options = listToTree(res);
        },
      });
    },
    handleSuccess() {
      this.getList();
    },

    handleDelete(row) {
      this.$confirm("此操作将会删除该客户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adCustomer/remove",
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
