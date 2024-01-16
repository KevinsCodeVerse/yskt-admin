<!-- 添加广告 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="70%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="courseRule"
        ref="courseRef"
        label-position="right"
        label-width="110px"
      >
        <el-form-item label="课程名称:" prop="name">
          <jat-input
            v-model="addData.name"
            placeholder="请输入课程名称"
          ></jat-input>
        </el-form-item>
        <el-form-item label="课程类别:" prop="categoryId">
          <jat-select
            v-model="addData.categoryId"
            placeholder="请选择课程类别"
            clearable
            filterable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="成本价:" prop="price">
          <jat-input
            v-input.float="2"
            v-model="addData.costPrice"
            placeholder="请输入成本价"
          ></jat-input>
        </el-form-item>
        <el-form-item label="市场价:" prop="underlinedPrice">
          <jat-input
            v-input.float="2"
            v-model="addData.underlinedPrice"
            placeholder="请输入市场价"
          ></jat-input>
        </el-form-item>
        <div style="width: 48%;">
          <el-form-item style="width: 100%;" label="是否收费:" prop="hasFree">
            <jat-select
              v-model="addData.hasFree"
              placeholder="请选择是否收费"
              @change="handleHasFreeChange"
              clearable
            >
              <el-option
                v-for="item in hasFreeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </jat-select>
          </el-form-item>
          <el-form-item
            v-if="addData.hasFree == 1"
            style="width: 100%;"
            label="课程价格:"
            prop="price"
          >
            <jat-input
              v-input.float="2"
              v-model="addData.price"
              placeholder="请输入课程价格"
            ></jat-input>
          </el-form-item>
        </div>

        <el-form-item label="封面:" prop="image">
          <upload-image v-model="addData.image"></upload-image>
        </el-form-item>
        <el-form-item label="课程类型:" prop="hasLive">
          <jat-select
            v-model="addData.hasLive"
            placeholder="请选择课程类型"
            clearable
          >
            <el-option
              v-for="item in hasLiveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="开播时间:" prop="openLiveTime">
          <jat-date-picker
            width="100%"
            clearable
            v-model="addData.openLiveTime"
            valueFormat="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="请选择开播时间"
          ></jat-date-picker>
          <div class="wram-box">
            <i class="el-icon-info"></i
            >如果有直播频道号和直播回放链接，直播时间必填，正在直播会进行直播，没有直播会播放录播链接
          </div>
        </el-form-item>

        <el-form-item label="直播频道号:" prop="channelNumber">
          <jat-input
            v-model="addData.channelNumber"
            placeholder="请输入直播频道号"
            @blur="handleCheck"
          ></jat-input>
        </el-form-item>
        <el-form-item label="课程套餐:" prop="setMealCategoryId">
          <jat-select
            v-model="addData.setMealCategoryId"
            placeholder="请输入课程套餐"
            clearable
            filterable
          >
            <el-option
              v-for="item in MealCategoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="直播回放链接:" prop="livePlaybackUrl">
          <jat-input
            v-model="addData.livePlaybackUrl"
            placeholder="请输入直播回放链接"
          ></jat-input>
          <uploadFile
            :limit="1"
            accept=".mp4"
            valueType="string"
            v-model="addData.livePlaybackUrl"
          ></uploadFile>
          <div class="wram-box">
            <i class="el-icon-info"></i
            >直播有回放链接先放回放链接，没有则播放录播链接
          </div>
        </el-form-item>
        <el-form-item label="录播链接:" prop="recordLiveUrl">
          <jat-input
            v-model="addData.recordLiveUrl"
            placeholder="请输入录播链接"
          ></jat-input>
          <uploadFile
            valueType="string"
            accept=".mp4"
            :limit="1"
            v-model="addData.recordLiveUrl"
          ></uploadFile>
          <div class="wram-box">
            <i class="el-icon-info"></i
            >未设置课程套餐时直播频道号和录播链接必须选择一个，设置课程套餐时直播频道号和录播链接不需要填写
          </div>
        </el-form-item>

        <el-form-item label="课程描述:" prop="overview">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.overview"
            placeholder="请输入课程描述"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO标题:" prop="seoTitle">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.seoTitle"
            placeholder="请输入SEO标题"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO关键字:" prop="seoKey">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.seoKey"
            placeholder="请输入SEO关键字"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO描述:" prop="seoContent">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.seoContent"
            placeholder="请输入SEO关键字"
          ></jat-input>
        </el-form-item>
        <el-form-item label="讲师:" prop="teacherAdId">
          <el-select
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.teacherAdId"
            filterable
            remote
            placeholder="请选择讲师"
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
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <jat-input
            v-input.int
            v-model="addData.sort"
            placeholder="请输入排序"
          ></jat-input>
        </el-form-item>
        <el-form-item label="发布者:" prop="createAdId">
          <el-select
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.createAdId"
            filterable
            remote
            placeholder="默认为登录账户"
            :remote-method="remoteMethod"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in parentAdIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程标签:" prop="tag">
          <jat-select
            v-model="addData.tag"
            placeholder="请选择课程标签"
            clearable
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="推荐位:" prop="position">
          <jat-select
            v-model="addData.position"
            placeholder="请选择推荐位置"
            clearable
          >
            <el-option
              v-for="item in positionptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="查看数:" prop="readCount">
          <jat-input
            v-input.int
            v-model="addData.readCount"
            placeholder="请输入查看数"
          ></jat-input>
        </el-form-item>
        <el-form-item label="是否展示在官网(h5):" prop="showOfficialWebsite">
          <jat-select
            v-model="addData.position"
            placeholder="请选择是否展示在官网(h5)"
            clearable
          >
            <el-option
              v-for="item in showOfficialWebsiteOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item style="width: 100%;" label="课程详情:" prop="content">
          <tinymce-edit v-model="addData.content"></tinymce-edit>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <jat-button plain @click="close">取 消</jat-button>
        <jat-button @click="handleSubmit">确 定</jat-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uploadFile from "@/components/uploadFile.vue";
import uploadImage from "@/components/uploadImage.vue";
import request from "@/utils/request";
import tinymceEdit from "@/components/tinymceEdit.vue";
import { getDate } from "../../../../utils/tools";
import {
  positionptions,
  tagOptions,
  hasLiveOptions,
  hasFreeOptions,
  showOfficialWebsiteOptions,
} from "./const";
export default {
  components: { uploadFile, uploadImage, tinymceEdit },
  data() {
    return {
      addModifyVisible: false,
      remoteLoading: false,
      recordLiveUrlPer: 0,
      teacherOptions: [],
      categoryOptions: [],
      MealCategoryOptions: [],
      positionptions: positionptions,
      tagOptions: tagOptions,
      hasLiveOptions: hasLiveOptions,
      hasFreeOptions: hasFreeOptions,
      showOfficialWebsiteOptions: showOfficialWebsiteOptions,
      dialogTitle: "",
      addData: {
        id: "",
        name: "",
        categoryId: "",
        content: "",
        createAdId: "",
        hasFree: "",
        hasLive: "",
        image: "",
        livePlaybackUrl: "",
        openLiveTime: "",
        showOfficialWebsite: "",
        overview: "",
        position: "",
        price: 0,
        readCount: "",
        recordLiveUrl: "",
        remark: "",
        seoContent: "",
        seoKey: "",
        seoTitle: "",
        setMealCategoryId: "",
        sort: 255,
        tag: "",
        teacherAdId: "",
        underlinedPrice: "",
        costPrice: "",
      },
      parentAdIdOptions: [],
      courseRule: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }],
        hasFree: [
          { required: true, message: "请输入选择是否免费", trigger: "blur" },
        ],
        openLiveTime: [
          {
            validator: (rule, value, callback) => {
              if (
                this.addData.channelNumber &&
                this.addData.livePlaybackUrl &&
                !value
              ) {
                callback(new Error("请输入开播时间"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        hasLive: [
          { required: true, message: "请输入选择是否直播", trigger: "blur" },
        ],
        costPrice: [
          { required: true, message: "请输入成本价", trigger: "blur" },
        ],
        image: [{ required: true, message: "请上传封面", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        tag: [{ required: true, message: "请输入课程标签", trigger: "blur" }],
        teacherAdId: [
          { required: true, message: "请选择讲师", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getCurrentUser();
    this.getCategoryList();
    this.getMealCategoryList();
  },

  methods: {
    open() {
      this.dialogTitle = "添加课程";
      this.addModifyVisible = true;
    },
    edit({
      id,
      name,
      categoryId,
      content,
      createAdId,
      hasFree,
      hasLive,
      image,
      livePlaybackUrl,
      openLive,
      overview,
      showOfficialWebsite,
      position,
      price,
      readCount,
      recordLiveUrl,
      remark,
      seoContent,
      seoKey,
      seoTitle,
      setMealCategoryId,
      sort,
      tag,
      teacherAdId,
      underlinedPrice,
      costPrice,
      teacherName,
    }) {
      this.dialogTitle = "编辑课程";
      this.addModifyVisible = true;
      this.addData = {
        id,
        name,
        categoryId,
        content,
        createAdId,
        hasFree,
        hasLive,
        showOfficialWebsite,
        image,
        livePlaybackUrl,
        openLiveTime: getDate(openLive, "yyyy-MM-dd HH:mm:ss"),
        overview,
        position,
        price,
        readCount,
        recordLiveUrl,
        underlinedPrice,
        costPrice,
        remark,
        seoContent,
        seoKey,
        seoTitle,
        setMealCategoryId,
        sort,
        tag,
        teacherAdId,
      };
      this.teacherOptions = [
        {
          id: teacherAdId,
          name: teacherName,
        },
      ];
    },
    close() {
      this.$refs.courseRef && this.$refs.courseRef.clearValidate();
      this.addData = {
        id: "",
        name: "",
        categoryId: "",
        content: "",
        createAdId: "",
        hasFree: "",
        hasLive: "",
        image: "",
        livePlaybackUrl: "",
        openLiveTime: "",
        overview: "",
        position: "",
        showOfficialWebsite: "",
        price: "",
        readCount: "",
        recordLiveUrl: "",
        remark: "",
        seoContent: "",
        seoKey: "",
        seoTitle: "",
        setMealCategoryId: "",
        underlinedPrice: "",
        costPrice: "",
        sort: 255,
        tag: "",
        teacherAdId: "",
      };
      this.addModifyVisible = false;
    },
    getCurrentUser() {
      this.parentAdIdOptions = [
        {
          id: sessionStorage.getItem("id")
            ? parseInt(sessionStorage.getItem("id"))
            : "",
          name: sessionStorage.getItem("userName"),
        },
      ];
      this.addData.createAdId = parseInt(sessionStorage.getItem("id"));
    },
    handleCheck() {
      if (this.$refs.courseRef) {
        this.$refs.courseRef.validateField("openLiveTime");
      }
    },

    handleSubmit() {
      this.$refs.courseRef.validate((valid) => {
        const { id, ...rest } = this.addData;
        if (valid) {
          if (id) {
            request.post({
              url: "/admin/adCourse/edit",
              params: {
                id,
                ...rest,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/admin/adCourse/add",
              params: {
                ...rest,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          }
        }
      });
    },
    getCategoryList() {
      request.post({
        url: "system/sysCategory/listNoPage",
        params: {
          type: 2,
        },
        success: (res) => {
          this.categoryOptions = res;
        },
      });
    },
    getMealCategoryList() {
      request.post({
        url: "system/sysCategory/listNoPage",
        params: {
          type: 4,
        },
        success: (res) => {
          this.MealCategoryOptions = res;
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
          this.parentAdIdOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },
    handleHasFreeChange(val) {
      if (!val) {
        this.addData.price = 0;
      } else {
        this.addData.price = "";
      }
    },
    teacherRemoteMethod(keyword, list) {
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
  },
  watch: {
    "addData.livePlaybackUrl": {
      handler() {
        this.handleCheck();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 600px;
  overflow: auto;
  .el-form-item {
    width: 48%;
  }
}
.wram-box {
  font-size: 12px;
  color: #e6a23c;
  line-height: 16px;
}
</style>
