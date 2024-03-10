<!-- 审核作业 -->
<template>
  <div>
    <el-dialog
        title="审核作业"
        :close-on-click-modal="false"
        :visible.sync="addModifyVisible"
        :append-to-body="true"
        width="50%"
        @close="close"
    >
      <el-form
          :model="addData"
          :rules="workRule"
          ref="auditRef"
          label-position="left"
          label-width="120px"
      >
        <el-form-item label="作业图片:" prop="comment" >
          <div  style="display:flex;gap: 20px">
            <el-image
                style="width: 100px; height: 100px"
                :src="item"
                v-for="(item, index) in addData.url" :key="index"
                :preview-src-list="addData.url"
            ></el-image>
          </div>
        </el-form-item>
        <el-form-item label="点评内容:" prop="comment">
          <jat-input
              v-model="addData.comment"
              type="textarea"
              :rows="5"
              placeholder="请输入点评内容"
          ></jat-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <jat-select
              v-model="addData.status"
              placeholder="请选择状态"
              clearable
          >
            <el-option label="正常显示" :value="0"></el-option>
            <el-option label="隐藏" :value="1"></el-option>
          </jat-select>
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
import request from "../../../../utils/request";

export default {
  name: "auditWork",
  components: {},
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        comment: "",
        status: "",
        sWorkId: "",
        url: []
      },
      workRule: {
        status: [
          {required: true, message: "请选择状态", trigger: "blur"},
        ]
      },
    };
  },

  mounted() {
  },

  methods: {
    open(row) {
      this.addData.sWorkId = row.sWorkId;
      this.addData.url = row.workUrl;
      this.addModifyVisible = true;
      console.log("addData", this.addData)
    },

    close() {
      this.$refs.auditRef && this.$refs.auditRef.clearValidate();
      this.addData = {
        comment: "",
        status: "",
        sWorkId: ""
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.auditRef.validate((valid) => {
        if (valid) {
          request.post({
            url: "/admin/adCourseWorkSubmit/auditWorkEdit",
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
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
