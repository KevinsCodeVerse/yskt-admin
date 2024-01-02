<template>
  <div class="uploadImage">
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="limit"
      :auto-upload="true"
      :before-upload="beforeUpload"
      accept=".jpg,.jpeg,.png"
      :file-list="fileList"
      :class="fileList.length < limit ? '' : 'hiddenImage'"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
      <div
        slot="tip"
        class="el-upload__tip"
        :style="{ left: fileList.length * 148 + 'px' }"
        v-if="fileList.length < limit"
      >
        只能上传jpg/png文件，且不超过1M
      </div>
    </el-upload>
    <el-image-viewer
      v-if="dialogVisible"
      :z-index="5000"
      :on-close="() => (dialogVisible = false)"
      :url-list="[dialogImageUrl]"
    ></el-image-viewer>
  </div>
</template>

<script>
// import { transformBlobToImage } from "@/api/common"
// import { showImageOrPdf } from "@/api/download"
import { getUpToken } from "@/api";
import * as qiniu from "qiniu-js";
export default {
  name: "uploadImage",
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
  },
  data() {
    return {
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      removeList: [],
      prev: "",
    };
  },
  components: {
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer.vue"),
  },
  created() {
    this.initImagePrev()
  },
  mounted() {},
  methods: {
    //上传图片触发
    handleChange(e, list) {
      const valid = this.beforeUpload(list[list.length - 1].raw);
      this.handleUpload(e);
      if (valid) {
        this.fileList = list;
        if (this.limit > 1) {
          const fileData = this.fileList
            .filter((item) => item.raw)
            .map((item) => item.raw);
          this.$emit("update:fileValue", fileData);
        } else {
          this.$emit("update:fileValue", this.fileList[0].raw);
        }
      } else {
        this.fileList = [];
      }
    },
    // 删除图片触发
    onRemove() {
      this.fileList = [];
      this.$emit("update:fileValue", "");
    },
    handleRemove(file) {
      if (file.id) {
        this.removeList.push(file.id);
      }
      const index = this.fileList.findIndex((item) => item.uid === file.uid);
      // this.$emit("removeFile", this.removeList);
      if (index !== -1) {
        this.fileList.splice(index, 1);
      } else {
        this.fileList = [];
      }
      if (this.fileList.length === 0) {
        this.$emit("update:fileValue", "");
        return;
      }

      if (this.limit > 1) {
        this.$emit(
          "update:fileValue",
          this.fileList.map((item) => item.filePath)
        );
      } else {
        this.$emit("update:fileValue", this.fileList[0].raw);
      }
    },
    //查看图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeUpload(file) {
      const isImg = ["image/png", "image/jpg", "image/jpeg"].includes(
        file.type
      );
      const isLtM = file.size / 1024 / 1024 < 5;
      if (!isImg) {
        this.$message.warning("只能上传jpg/png文件");
        return false;
      }
      if (!isLtM) {
        this.$message.warning("大小不能超过5M");
        return false;
      }
      this.handleUpload(file);
      return false;
    },
    async handleUpload(file) {
      try {
        const res = await getUpToken();
        const observable = qiniu.upload(file, null, res.data.result);
        observable.subscribe({
          next: undefined,
          error: () => {
            this.$message.error("上传出错，请重新上传！");
          },
          complete: ({ key }) => {
            this.$message.success("上传成功！");
            this.fileList.push({
              name: this.fileList.length + "",
              url: this.$envConfig.qiniuDomain + key,
            });
            this.$emit(
              "update:fileValue",
              this.$envConfig.qiniuDomain + key
            );
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    initImagePrev() {
      if(Array.isArray(this.fileValue)) {
        this.fileList = this.fileValue
      } else {
        if(this.fileValue && typeof this.fileValue === "string") {
          this.fileList = [
            {
              url: this.fileValue,
              name: "image01"
            }
          ]
        } else {
          this.fileList =  []
        }
      }
    }
  },
  watch: {
    fileValue() {
      this.initImagePrev()
    }
  },
};
</script>

<style lang="less" scoped>
.uploadImage {
  div {
    display: flex;
  }
  /deep/.el-upload-list--picture-card {
    display: flex;
  }
  /deep/.el-upload-list__item {
    display: flex;
    min-width: 148px;
  }
  /deep/ .hiddenImage .el-upload--picture-card {
    display: none;
  }

  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /deep/ .hiddenUpload .el-upload-list--picture-card {
    display: none;
  }

  /deep/.el-upload--picture-card {
    background-color: transparent !important;
  }

  /deep/.el-upload-list--picture-card .el-upload-list__item {
    background-color: transparent !important;
  }
  /deep/.el-upload__tip {
    color: #fff;
    position: absolute;
    bottom: -30px;
    left: 0;
  }
}
</style>
