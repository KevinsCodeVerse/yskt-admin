<!-- 文件上传组件 -->
<template>
  <div>
    <el-upload
      class="upload-file"
      action="customUrl"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      multiple
      :limit="3"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <!-- <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div> -->
    </el-upload>
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
  },
  mounted() {
    this.initFileValue();
  },
  data() {
    return {
      fileList: [],
    };
  },

  methods: {
    beforeRemove(file, fileList) {
      this.fileList  = fileList
      this.$emit("update:fileValue", this.fileList);
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
            const observable = qiniu.upload(file, file.name, res);
            observable.subscribe({
              next: undefined,
              error: () => {
                this.$message.error("上传出错，请重新上传！");
              },
              complete: ({ key }) => {
                this.$message.success("上传成功！");
                this.fileList.push({
                  name: key,
                  url: "http://s624om21h.hb-bkt.clouddn.com/" + key,
                });
                this.$emit(
                  "update:fileValue",
                 this.fileList
                );
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
<style lang="scss" scoped></style>
