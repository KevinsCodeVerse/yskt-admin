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
        <el-form-item label="附件:" prop="material">
          <uploadFile :limit="1" v-model="addData.material"></uploadFile>
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
import { getDate } from "../../../../utils/tools";
import uploadFile from "../../../../components/uploadFile.vue";
export default {
  name: "addCourseWork",
  components: { uploadImage, tinymceEdit, uploadFile },
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        id: "",
        cutOffTime: "",
        workName: "",
        caseUrl: "",
        material: "",
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
    edit(row) {
      this.dialogTitle = "编辑作业";
      const { id, workName, material, caseUrl, cutOffTime } = row;
      this.addData = {
        id,
        workName,
        caseUrl,
        material,
        cutOffTime: getDate(cutOffTime, "yyyy-MM-dd"),
      };
      this.addData.id = row.workId;
      this.addModifyVisible = true;
    },

    close() {
      this.$refs.workRef && this.$refs.workRef.clearValidate();
      this.addData = {
        id: "",
        cutOffTime: "",
        workName: "",
        caseUrl: "",
        material: "",
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.workRef.validate((valid) => {
        const { material, ...rest } = this.addData;
        console.log(material);
        if (valid) {
          request.post({
            url: "/admin/adCourseWork/edit",
            params: {
              ...rest,
              material:
                Array.isArray(material) && material.length > 0
                  ? material[0].url
                  : material,
            },
            success: (res) => {
              this.$message.success(res);
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
