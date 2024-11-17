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
      width="50%"
      @close="handleClose"
    >
      <div class="tipInfo">
        您已开播成功了。请保存好推流地址和推流码！请注意：不同的订单会产生不同的推流地址，请开播的时候仔细分辨
      </div>
      <div class="account-box">
        <span>推流地址：{{ openLiveData.rtmpPublishUrl }}</span>
        <span>推流码：{{ openLiveData.code }}</span>
        <span>pc端观看地址：{{ openLiveData.pcLive }}</span>
        <span>移动端观看地址：{{ openLiveData.maLive }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
<!--        <jat-button-->
<!--          v-clipboard:copy="-->
<!--            '推流地址：' +-->
<!--              openLiveData.rtmpPublishUrl +-->
<!--              '\n推流码：' +-->
<!--              openLiveData.code-->
<!--          "-->
<!--          v-clipboard:success="onCopy"-->
<!--          >一键复制</jat-button-->
<!--        >-->
      </span>
    </el-dialog>
    <el-dialog
      title="直播审查"
      :close-on-click-modal="false"
      :visible.sync="openCheckLiveVisible"
      width="80%"
      class="checkLive-dialog"
      @close="handleCheckLiveClose"
    >

        <div class="tipInfo" >
          <!-- 生成多个“观看直播”按钮，横向排列 -->
          <div class="button-row">
            <el-button
              v-for="teacher in currentTeachers"
              :key="teacher.id"
              @click="watchLive(teacher)"
              type="primary"
              class="live-button"
              size="mini"
            >
              观看{{ teacher.name }}的直播
            </el-button>
          </div>
        </div>

        <!-- 视频播放区域 -->
        <div class="video-container" >
          <div id="videoPlayer" class="video-player"></div>
        </div>

        <span slot="footer" class="dialog-footer">
      </span>

    </el-dialog>
    <chapters :isWrite="false" ref="chapters"></chapters>
    <workChapters ref="workChaptersRef"></workChapters>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import rsa from "@/utils/rsa";
import { hasFreeOptions, positionptions, tagOptions } from "./const";
import uploadVideo from "./uploadVideo.vue";
import chapters from './chapters.vue';
import workChapters from './workChapters.vue';
import "mui-player/dist/mui-player.min.css";
import MuiPlayer from "mui-player";
import Hls from "hls.js";
import MuiPlayerDesktopPlugin from "mui-player-desktop-plugin";
export default {
  name: "myCoursePage",
  components: { BasicTable, addDialog, uploadVideo, chapters, workChapters },
  data() {
    return {
      loading: false,
      remoteLoading: false,
      openLiveVisible: false,
      openCheckLiveVisible:false,
      currentTeachers: [],
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
          // {
          //   type: "input",
          //   label: "订单编号",
          //   value: "orderNum",
          // },
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
          // {
          //   id:99,
          //   prop: "orderNum",
          //   label: "订单编号",
          // },
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
          // {
          //   id: 9,
          //   prop: "teacherName",
          //   label: "讲师",
          // },
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
          key: "checkLive",
          title: "直播巡查",
          btnStyle: "red",
          permission: "",
          action: (o, row) => {
            console.log('row',row);
            this.handleCheckLive(row);
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
            // return row.hasLive === 1;
            return false;
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
            // return row.hasLive === 0;
            return false;
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
    // initVideo 和 hanleVideoError 是示例用法
    initVideo(url, live = true, image, name) {
      if (image){
        this.chapterImage=image
      }
      this.player = new MuiPlayer({
        container: "#videoPlayer",
        title: name || "",
        src: url,
        live: live,
        autoplay: live,
        lang: "zh-cn",
        volume: 0.6,
        poster: this.chapterImage,
        muted: false,
        height:'100%',
        preload: "auto",
        parse: {
          type: live ? "hls" : "mp4",
          loader: live ? Hls : "",
        },
        plugins: [
          new MuiPlayerDesktopPlugin({
            contextmenu: [],
            customSetting: [],
          }),
        ],
      });
      this.player.on("error", (e) => {
        this.hanleVideoError(e);
      });
    },
    hanleVideoError() {
      this.emptyVisible = true;
      if (this.info.adCourse.hasLive === 1) {
        this.emptyMessage = "视频出错啦~，请重新加载！";
      } else {
        this.emptyMessage = "当前暂无直播";
      }
    },



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
    handleCheckLiveClose(){
      this.openCheckLiveVisible=false
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
              orderNum:row.orderNum,
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
    //直播巡查
    handleCheckLive(row) {
      // 设置当前讲师数组
      this.currentTeachers = row.liveTeracher;
      this.openCheckLiveVisible = true;
    },
    // 观看讲师的直播
    watchLive(teacher) {
      const url = rsa.decryptByPublicKey(teacher.tLive);  // 解密直播地址
      this.initVideo(url);  // 播放视频
    },
    handleCloseLive(row){
      console.log('关播row',row);
      this.$confirm("确定要关闭该场直播, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          request.post({
            url: "/admin/adCourse/closeLiveEdit",
            params: {
              // courseId: row.id,
              orderNum: row.orderNum,
            },
            success: () => {
              this.getList();
            },
          });
        })
        .catch(() => {
          // this.$message
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
<style>
.checkLive-dialog .el-dialog{
  height: 90%;overflow: auto;
}
.checkLive-dialog .el-dialog__body{
  height: 100% !important;
  max-height: 850px;
  overflow: auto;
}
</style>
<style lang="scss" scoped>
.button-row {
  display: flex;
  justify-content: center;  /* 按钮居中对齐 */
  flex-wrap: wrap;  /* 如果按钮太多，自动换行 */
  gap: 10px;  /* 按钮之间的间距 */
}

.live-button {
  min-width: 120px;  /* 统一按钮最小宽度 */
  text-align: center;  /* 按钮文字居中 */
}
.custom-dialog {
  height: 80% !important;  /* 强制设置弹窗的高度为80% */
  max-height: 80% !important;
  display: flex;
  flex-direction: column;
}

.video-container {
  margin-top: 20px;
  height: 100%;  /* 播放器高度充满可用空间 */
}

.video-player {
  width: 100%;
  height: 100%;  /* 播放器高度为剩余的部分 */
  background-color: #000;
}
.tipInfo {
  font-size: 16px;
  font-weight: bold;
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
