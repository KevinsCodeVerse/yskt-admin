<!-- 文件上传组件 -->
<template>
  <div>
    <el-upload
      class="upload-file"
      action="customUrl"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      multiple
      :accept="accept"
      :limit="limit"
      :file-list="fileList"
    >
      <el-button
        :disabled="fileList.length == limit"
        size="small"
        type="primary"
        >点击上传</el-button
      >

      <div v-if="tip" slot="tip" class="el-upload__tip">
        {{ tip }}
      </div>
    </el-upload>
    <el-progress
      style="width: 100%"
      v-if="percentage !== 0 && percentage !== 100"
      :percentage="percentage"
    ></el-progress>
  </div>
</template>

<script>
import * as qiniu from "qiniu-js";
import request from "../utils/request";
export default {
  name: "uploadFile",
  model: {
    prop: "fileValue",
    event: "update:fileValue",
  },
 
  props: {
    fileValue: [Array, String, File],
    limit: {
      type: Number,
      default: 1,
    },
    tip: String,
    accept: String,
    valueType: String,
  },
  mounted() {
    this.initFileValue();
  },
  data() {
    return {
      percentage: 0,
      fileList: [],
    };
  },

  methods: {
    beforeRemove(file, fileList) {
      this.fileList = fileList;
      if (this.valueType === "string" && this.limit === 1) {
        this.$emit("update:fileValue", "");
      } else {
        this.$emit("update:fileValue", this.fileList);
      }
    },

    beforeUpload(file) {
      this.handleUpload(file);
      return false;
    },
    handleUpload(file) {
      try {
        request.post({
          url: "/comm/getUpToken",
          params: {},
          success: (res) => {
            const observable = qiniu.upload(file, null, res);
            observable.subscribe({
              error: () => {
                this.$message.error("上传出错，请重新上传！");
              },
              next: ({ total }) => {
                this.percentage = parseInt(total.percent);
              },
              complete: ({ key }) => {
                this.$message.success("上传成功！");
                this.fileList.push({
                  name: key,
                  url: this.$envConfig.qiniuDomain + key,
                });
                if (this.valueType === "string" && this.limit === 1) {
                  this.$emit("update:fileValue", this.fileList[0].url);
                } else {
                  this.$emit("update:fileValue", this.fileList);
                }
              },
            });
          },
        });
      } catch (error) {
        console.log(error);
        this.$message.error("上传出错，请重新上传！");
      }
    },
    initFileValue() {
      if (Array.isArray(this.fileValue)) {
        this.fileList = this.fileValue;
      } else {
        if (this.fileValue && typeof this.fileValue === "string") {
          const arr = this.fileValue.split("/");
          this.fileList = [
            {
              url: this.fileValue,
              name: arr[arr.length - 1],
            },
          ];
        } else {
          this.fileList = [];
        }
      }
    },
  },
  watch: {
    fileValue() {
      this.initFileValue();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-upload__tip {
  color: #E6A23C;
}
</style>
