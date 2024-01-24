<!--  -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="uploadVisible"
      width="50%"
      @close="close"
    >
      <div>
        <el-form
          :model="addData"
          ref="uploadVidoRef"
          :rules="uploadVidoRules"
          label-width="80px"
          :inline="false"
        >
          <el-form-item :label="dialogTitle" prop="url">
            <jat-input
              v-model="addData.url"
              :placeholder="'请输入' + dialogTitle + '链接或者点击上传'"
            ></jat-input>

            <upload-file
              accept=".mp4"
              valueType="string"
              tip="上传期间请不要关闭或者刷新浏览器"
              v-model="addData.url"
            ></upload-file>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <jat-button plain @click="close">取 消</jat-button>
        <jat-button @click="handleSubmit">确 定</jat-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uploadFile from "../../../../components/uploadFile.vue";
import request from "../../../../utils/request";
export default {
  components: { uploadFile },
  data() {
    return {
      uploadVisible: false,
      dialogTitle: "",
      addData: {
        id: "",
        url: "",
      },
      uploadType: "",
      uploadVidoRules: {
        url: {
          required: true,
          message: "请输入视频链接或者点击上传",
          trigger: "blur",
        },
      },
    };
  },

  methods: {
    open(title, type, id) {
      this.dialogTitle = title;
      this.uploadType = type;
      this.addData.id = id;
      this.uploadVisible = true;
    },
    close() {
      this.uploadVisible = false;
      this.addData = {
        id: "",
        url: "",
      };
    },
    handleSubmit() {
      this.$refs.uploadVidoRef.validate((valid) => {
        if (valid) {
          if (this.type === 1) {
            request.post({
              url: "/admin/adCourse/uploadLivePlaybackUrlEdit",
              params: {
                ...this.addData,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/admin/adCourse/uploadRecordLiveUrlEdit",
              params: {
                ...this.addData,
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
};
</script>
<style lang="scss" scoped></style>
