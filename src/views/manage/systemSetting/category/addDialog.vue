<!-- 添加广告 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="50%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="categoryRule"
        ref="categoryRef"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="分类类型" prop="type">
          <jat-select
            v-model="addData.type"
            placeholder="请选择分类类型"
            clearable
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="分类名称:" prop="name">
          <jat-input v-model="addData.name" placeholder="分类名称"></jat-input>
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
import { listToTree } from "../../../../utils/tools";
export default {
  components: { uploadImage, tinymceEdit },
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        type: "",
        name: "",
        id: "",
      },
      typeOptions: [
        {
          label: "文章分类",
          value: 1,
        },
        {
          label: "课程分类",
          value: 2,
        },
        {
          label: "银行账户分类",
          value: 3,
        },
      ],
      categoryRule: {
        type: [{ required: true, message: "请选择分类类型", trigger: "blur" }],
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    open() {
      this.dialogTitle = "添加分了";
      this.addData.name = "";
      this.addModifyVisible = true;
    },
    edit({ id, name, type }) {
      this.dialogTitle = "编辑分类";
      this.addModifyVisible = true;
      this.addData = {
        id,
        name,
        type,
      };
    },
    close() {
      this.$refs.cateRef && this.$refs.categoryRef.clearValidate();
      this.addData = {
        type: "",
        name: "",
        id: "",
      };
      this.addModifyVisible = false;
    },
    handleSubmit() {
      this.$refs.categoryRef.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysCategory/edit",
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
              url: "/system/sysCategory/add",
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
