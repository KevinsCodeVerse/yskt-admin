<!-- 评论管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    >
      <span slot="adVipld">
        <el-select
          style="width: 90%;"
          v-model="filterData.adVipld"
          filterable
          remote
          size="small"
          clearable
          placeholder="评论人(输入名称或者手机号)"
          :remote-method="remoteMethod"
          :loading="remoteLoading"
        >
          <el-option
            v-for="item in adVipOptions"
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
      :data="table.data"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :total="table.total"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
    >
    </BasicTable>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
export default {
  name: "evalPage",
  components: { BasicTable },
  data() {
    return {
      adVipOptions: [],
      remoteLoading: false,
      loading: false,
      filterOptions: {
        column: [
          {
            type: "slot",
            slotName: "adVipld",
          },
        ],
      },

      filterData: {
        adVipld: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "courseName",
            label: "课程名称",
          },
          {
            id: 2,
            prop: "content",
            label: "评论内容",
          },
          {
            id: 3,
            prop: "vipName",
            label: "评论人",
          },
          {
            id: 4,
            prop: "status",
            label: "状态",
          },
          {
            id: 5,
            prop: "createTime",
            label: "评论时间",
            type: "date",
          },
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
    };
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
        url: "/admin/adCourseComment/list",
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
          this.adVipOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
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
  },
};
</script>
<style lang="scss" scoped></style>
