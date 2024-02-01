<!-- 我的课程 -->
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
      :operates="operates"
      operateWidth="130px"
      :data="table.data"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :total="table.total"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
    >
    </BasicTable>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
    <uploadVideo ref="upload"></uploadVideo>
    <el-dialog
      title="开播信息"
      :close-on-click-modal="false"
      :visible.sync="openLiveVisible"
      width="30%"
      @close="handleClose"
    >
      <div class="tipInfo">
        您已开播成功了。请保存好推流地址和推流码！
      </div>
      <div class="account-box">
        <span>推流地址：{{ openLiveData.rtmpPublishUrl }}</span>
        <span>推流码：{{ openLiveData.code }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <jat-button
          v-clipboard:copy="
            '推流地址：' +
              openLiveData.rtmpPublishUrl +
              '\n推流码：' +
              openLiveData.code
          "
          v-clipboard:success="onCopy"
          >一键复制</jat-button
        >
      </span>
    </el-dialog>
    <chapters ref="chapters"></chapters>
    <workChapters ref="workChaptersRef"></workChapters>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";

import { hasFreeOptions, positionptions, tagOptions } from "./const";
import uploadVideo from "./uploadVideo.vue";
import chapters from './chapters.vue';
import workChapters from './workChapters.vue';
export default {
  name: "myCoursePage",
  components: { BasicTable, addDialog, uploadVideo, chapters, workChapters },
  data() {
    return {
      loading: false,
      remoteLoading: false,
      openLiveVisible: false,
      openLiveData: {},
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
            options: [],
          },
          {
            type: "select",
            label: "课程标签",
            value: "tag",
            options: tagOptions,
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
        setMealCategoryId: "",
      },
      table: {
        columns: [
          {
            id: 1,
            prop: "number",
            label: "课程编号",
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
            prop: "setMealCategoryId",
            label: "课程套餐",
            render: (row) => {
              const item = this.$refs.addDialog.MealCategoryOptions.find(
                (item) => item.id == row.setMealCategoryId
              );
              return item ? item.name : "";
            },
          },
          {
            id: 5,
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
            id: 6,
            prop: "tag",
            label: "课程标签",
            render: (row) => {
              const item = tagOptions.find((item) => item.value == row.tag);
              return item ? item.label : "";
            },
          },
          {
            id: 7,
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
            id: 8,
            prop: "teacherName",
            label: "讲师",
          },
          {
            id: 9,
            prop: "price",
            label: "价格",
          },
          {
            id: 10,
            prop: "createAdName",
            label: "增加人",
          },
          {
            id: 11,
            prop: "createTime",
            label: "增加时间",
            type: "date",
          },
          {
            id: 12,
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
          key: "openLive",
          title: "一键开播",
          btnStyle: "green",
          permission: "",
          action: (o, row) => {
            this.handleOpenLive(row);
          },
          show: (row) => {
            return row.hasLive === 0  && row.liveStatus === 0;
          },
        },
        {
          key: "closeLive",
          title: "一键关播",
          btnStyle: "red",
          permission: "",
          action: (o, row) => {
            this.handleCloseLive(row);
          },
          show: (row) => {
            return row.hasLive === 0 && row.liveStatus === 1;
          },
        },
        {
          key: "edit",
          title: "上传回放",
          btnStyle: "yellow",
          permission: "",
          action: (o, row) => {
            this.$refs.upload.open("上传录播", 1, row.id);
          },
          show: (row) => {
            return row.hasLive === 1;
          },
        },
        {
          key: "upload",
          title: "上传直播回放",
          permission: "",
          btnStyle: "blue",
          action: (o, row) => {
            this.$refs.upload.open("上传直播回放", 2, row.id);
          },
          show: (row) => {
            return row.hasLive === 0;
          },
        },
        {
          key: "charpter",
          title: "章节详情",
          permission: "admin/adCourseChapters/list",
          btnStyle: "yellow",
          action: (o, row) => {
            this.$refs.chapters.open(row)
          }
        },
        {
          key: "courseWork",
          title: "布置作业",
          permission: "admin/adCourseWork/add",
          btnStyle: "blue",
          action: (o, row) => {
            this.$refs.workChaptersRef.open(row)
          }
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
        url: "/admin/adCourse/myList",
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
    onCopy() {
      this.$message.success("复制成功");
    },

    handleClose() {
      this.openLiveData = {};
    },

    handleOpenLive(row) {
      this.$confirm("确定要开播此课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adCourse/liveOpenAdd",
            params: {
              id: row.id,
            },
            success: (res) => {
              this.openLiveData = res;
              this.openLiveVisible = true;
              this.getList();
            },
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消开播",
          });
        });
    },
    handleCloseLive(){
      this.$confirm("确定要关闭该场直播, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adCourse/closeLiveEdit",
            params: {
              courseId: row.id,
            },
            success: () => {
              this.getList();
            },
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消关播",
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
        setMealCategoryId: "",
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
