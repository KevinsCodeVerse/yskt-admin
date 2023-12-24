<!-- 添加角色谈款 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="40%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="categoryRule"
        ref="categoryRef"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="分类名称:" prop="name">
          <jat-input
            v-model="addData.name"
            placeholder="请输入分类名称"
          ></jat-input>
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
  data() {
    return {
      addModifyVisible: false,
      addInterfaceVisible: false,
      dialogTitle: "",
      addData: {
        name: "",
        id: "",
      },
      categoryRule: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    open() {
      this.dialogTitle = "添加分类";
      this.addData.name = "";
      this.addModifyVisible = true;
    },
    edit({ id, name }) {
      this.dialogTitle = "编辑分类";
      this.addModifyVisible = true;
      this.addData = { id, name };
    },
    close() {
      this.$refs.categoryRef && this.$refs.categoryRef.clearValidate();
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.categoryRef.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysAdvertiseCategory/edit",
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
              url: "/system/sysAdvertiseCategory/add",
              params: {
                name: this.addData.name,
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
