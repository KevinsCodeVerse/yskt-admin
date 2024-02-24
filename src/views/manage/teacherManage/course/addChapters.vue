<!-- 添加章节 -->
<template>
  <el-dialog
    :title="dialogTitle"
    :close-on-click-modal="false"
    :visible.sync="addChaptersVisible"
    :append-to-body="true"
    width="50%"
    @close="close"
  >
    <el-form
      :model="addData"
      :rules="addChapterRule"
      ref="addChapterRef"
      label-position="left"
      label-width="100px"
    >
      <el-form-item label="父章节名称:" prop="name">
        {{ parentInfo.name }}
      </el-form-item>
      <el-form-item label="章节名称:" prop="name">
        <jat-input v-model="addData.name" placeholder="请输入名称"></jat-input>
      </el-form-item>
      <el-form-item label="视频封面:" prop="image">
        <upload-image v-model="addData.image"></upload-image>
      </el-form-item>
      <el-form-item label="视频链接:" prop="url">
        <jat-input
          v-model="addData.url"
          placeholder="请输入视频链接或者点击上传"
        ></jat-input>

        <upload-file
          accept=".mp4"
          valueType="string"
          tip="上传期间请不要关闭或者刷新浏览器"
          v-model="addData.url"
        ></upload-file>
      </el-form-item>

      <el-form-item label="视频时长:" prop="lengthTime">
        <jat-input
          disabled
          v-model="addData.lengthTime"
          placeholder="请输入视频时长"
        ></jat-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
        <jat-input
          v-input.int
          v-model="addData.sort"
          placeholder="请输入排序"
        ></jat-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <jat-button plain @click="close">取 消</jat-button>
      <jat-button @click="handleSubmit">确 定</jat-button>
    </span>
  </el-dialog>
</template>

<script>
import uploadImage from "@/components/uploadImage.vue";
import request from "../../../../utils/request";
import uploadFile from "../../../../components/uploadFile.vue";
export default {
  components: { uploadImage, uploadFile },
  data() {
    return {
      addChaptersVisible: false,
      dialogTitle: "",
      parentInfo: {},
      addData: {
        courseId: "",
        name: "",
        image: "",
        url: "",
        lengthTime: undefined,
        sort: 255,
        id: "",
      },
      categoryOptions: [],
      addChapterRule: {
        name: [{ required: true, message: "请输入章节名称", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    open(row, id) {
      this.dialogTitle = "添加章节";
      this.parentInfo = row;
      this.addData.courseId = id;
      this.addChaptersVisible = true;
    },
    edit({ name, image, url, lengthTime, id, parentInfo, sort }, courseId) {
      this.dialogTitle = "编辑章节";
      this.addChaptersVisible = true;
      this.parentInfo = parentInfo;
      this.addData = {
        name,
        image,
        url,
        sort,
        lengthTime,
        id,
        courseId,
      };
    },
    geVideoTime(videoUrl) {
      const audio = new Audio(videoUrl);
      let duration = 0;
      let that = this;
      audio.addEventListener("loadedmetadata", function(e) {
        duration = audio.duration; // 通过添加监听来获取视频总时长字段，即duration
        that.addData.lengthTime = that.formatSeconds(duration);
      });
    },
    close() {
      this.$refs.addChapterRef && this.$refs.addChapterRef.clearValidate();
      this.addData = {
        courseId: "",
        name: "",
        image: "",
        url: "",
        sort: 255,
        lengthTime: undefined,
        id: "",
      };
      this.addChaptersVisible = false;
    },

    handleBlurVideo() {
      if (this.addData.url) {
        this.geVideoTime(this.addData.url);
      }
    },

    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = "" + parseInt(theTime);
      if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + ":" + result;
      }
      if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + ":" + result;
      }
      return result;
    },

    handleSubmit() {
      this.$refs.addChapterRef.validate((valid) => {
        if (valid) {
          const { id, ...rest } = this.addData;
          if (id) {
            request.post({
              url: "/admin/adCourseChapters/uploadCourseEdit",
              params: {
                id,
                parentId: this.parentInfo.id,
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
              url: "/admin/adCourseChapters/uploadCourseAdd",
              params: {
                parentId: this.parentInfo.id,
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
  },
  watch: {
    "addData.url": {
      handler(val) {
        if (val) {
          this.handleBlurVideo();
        }
      },
    },
  },
};
</script>
<style lang="scss" scoped></style>
