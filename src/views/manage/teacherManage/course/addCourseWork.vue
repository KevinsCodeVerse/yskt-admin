<!-- 布置作业 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      :append-to-body="true"
      width="50%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="workRule"
        ref="workRef"
        label-position="left"
        label-width="120px"
      >
        <el-form-item label="作业标题:" prop="workName">
          <jat-input
            v-model="addData.workName"
            placeholder="请输入作业标题"
          ></jat-input>
        </el-form-item>
        <el-form-item label="案例展示图:" prop="caseUrl">
          <upload-image v-model="addData.caseUrl"></upload-image>
        </el-form-item>
        <el-form-item label="提交截止时间:" prop="cutOffTime">
          <jat-date-picker
            clearable
            type="date"
            width="100%"
            placeholder="请选择提交截止时间"
            v-model="addData.cutOffTime"
          ></jat-date-picker>
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
import uploadImage from "@/components/uploadImage.vue";
import request from "../../../../utils/request";
import tinymceEdit from "@/components/tinymceEdit.vue";
export default {
  name: "addCourseWork",
  components: { uploadImage, tinymceEdit },
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        chapterId: "",
        cutOffTime: "",
        workName: "",
        caseUrl: "",
      },
      workRule: {
        cutOffTime: [
          { required: true, message: "请选择提交截止时间", trigger: "blur" },
        ],
        workName: [
          { required: true, message: "请输入作者名称", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    open(row) {
      this.dialogTitle = `布置作业-${row.name}`;
      this.addData.chapterId = row.id;
      this.addModifyVisible = true;
    },

    close() {
      this.$refs.workRef && this.$refs.workRef.clearValidate();
      this.addData = {
        chapterId: "",
        cutOffTime: "",
        workName: "",
        caseUrl: "",
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.workRef.validate((valid) => {
        if (valid) {
          request.post({
            url: "admin/adCourseWork/add",
            params: {
              ...this.addData,
            },
            success: (res) => {
              this.$message.success("布置成功！可在课程作业中查看");
              this.close();
              this.$emit("success");
            },
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
