<!-- 课程管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    >
      <span slot="teacherAdId">
        <el-select
          style="width: 85%;"
          size="small"
          clearable
          v-model="filterData.teacherAdId"
          filterable
          remote
          placeholder="讲师"
          :remote-method="teacherRemoteMethod"
          :loading="remoteLoading"
        >
          <el-option
            v-for="item in teacherOptions"
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
      operateWidth="110px"
      :data="table.data"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :total="table.total"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
    >
    </BasicTable>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import {
  hasFreeOptions,
  hasLiveOptions,
  positionptions,
  tagOptions
} from "./const";
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
            label: "课程编号",
            value: "number",
          },
          {
            type: "input",
            label: "课程名称",
            value: "name",
          },
          {
            type: "select",
            label: "课程类别",
            value: "categoryId",
            labelKey: "name",
            valueKey: "id",
            options: [],
          },
          {
            type: "select",
            label: "课程套餐",
            value: "setMealCategoryId",
            labelKey: "name",
            valueKey: "id",
            options: []
          },
          {
            type: "select",
            label: "课程标签",
            value: "tag",
            options: tagOptions
          },
          {
            type: "select",
            label: "是否免费",
            value: "hasFree",
            options: hasFreeOptions,
          },
          {
            type: "slot",
            slotName: "teacherAdId",
          },
        ],
      },
      remoteLoading: false,
      teacherOptions: [],
      filterData: {
        name: "",
        number: "",
        hasLive: "",
        teacherAdId: "",
        categoryId: "",
        hasFree: "",
        setMealCategoryId: ""
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "number",
            label: "课程编号",
          },
		  {
		    id: 13,
		    prop: "name",
		    label: "课程名称",
		  },
          {
            id: 2,
            prop: "name",
            label: "课程名称",
            width: "160px"
          },
          {
            id: 3,
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
            id: 4,
            prop: "tag",
            label: "课程标签",
            render: (row) => {
              const item = tagOptions.find(
                (item) => item.value == row.hasLive
              );
              return item ? item.label : "";
            },
          },
          {
            id: 5,
            prop: "setMealCategoryId",
            label: "课程套餐",
            render: (row) => {
              const item = this.$refs.addDialog.MealCategoryOptions.find(
                (item) => item.id == row.setMealCategoryId
              );
              return item ? item.name : "无";
            },
          },
          {
            id: 6,
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
            id: 7,
            prop: "tag",
            label: "课程标签",
            render: (row) => {
              const item = tagOptions.find((item) => item.value == row.tag);
              return item ? item.label : "";
            },
          },
          {
            id: 8,
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
            id: 9,
            prop: "teacherName",
            label: "讲师",
          },
          {
            id: 10,
            prop: "price",
            label: "价格",
          },
          {
            id: 11,
            prop: "createAdName",
            label: "增加人",
          },
          {
            id: 12,
            prop: "createTime",
            label: "增加时间",
            type: "date",
			width: 180
          },
          {
            id: 13,
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
          btnStyle: "yellow",
          permission: "admin/adCourse/edit",
          action: (o, row) => {
            this.$refs.addDialog.edit(row);
          },
        },
        {
          key: "delete",
          title: "删除",
          permission: "admin/adCourse/remove",
          btnStyle: "red",
          action: (o, row) => {
            this.handleDelete(row);
          },
        },
      ],
      headerOperates: [
        {
          key: "el-icon-plus",
          name: "添加课程",
          permission: "admin/adCourse/add",
          action: () => {
            this.$refs.addDialog.open();
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
  mounted() {
    this.$watch(
      () => {
        return this.$refs.addDialog.categoryOptions;
      },
      (val) => {
        this.filterOptions.column[2].options = val;
      }
    );
    this.$watch(
      () => {
        return this.$refs.addDialog.MealCategoryOptions;
      },
      (val) => {
        this.filterOptions.column[3].options = val;
      }
    );
  },

  created() {
    this.getList();
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      request.post({
        url: "/admin/adCourse/list",
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
    teacherRemoteMethod(keyword) {
      if (!keyword) {
        return;
      }
      this.remoteLoading = true;
      request.post({
        url: "/admin/adCourse/queryTeacherByNameOrTeacher",
        params: {
          keyword,
        },
        success: (res) => {
          this.remoteLoading = false;
          this.teacherOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },
    handleSuccess() {
      this.getList();
    },

    handleDelete(row) {
      this.$confirm("此操作将会删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adCourse/remove",
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
        number: "",
        hasLive: "",
        teacherAdId: "",
        categoryId: "",
        hasFree: "",
        setMealCategoryId: ""
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
  }
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
