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
        :rules="clientRule"
        ref="clientRef"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="新闻分类" prop="categoryId">
          <el-cascader
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.categoryId"
            :options="categoryOptions"
            :props="{ label: 'name', value: 'id', emitPath: false }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="新闻名称:" prop="name">
          <jat-input v-model="addData.name" placeholder="新闻名称"></jat-input>
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
        categoryId: "",
        name: "",
        image: "",
        href: "",
        content: "",
        sort: undefined,
        seoTitle: "",
        seoKey: "",
        seoContent: "",
        remark: "",
        id: "",
      },
      categoryOptions: [],
      clientRule: {
        categoryId: [
          { required: true, message: "请选择新闻分类", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入新闻名称", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入排序", trigger: "blur" },
          {
            type: "number",
            message: "请输入整数",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    open() {
      this.dialogTitle = "添加客户";
      this.addData.name = "";
      this.addModifyVisible = true;
    },
    edit({
      id,
      name,
      categoryId,
      href,
      image,
      sort,
      content,
      seoTitle,
      seoKey,
      seoContent,
      remark,
    }) {
      this.dialogTitle = "编辑客户";
      this.addModifyVisible = true;
      this.addData = {
        id,
        name,
        categoryId,
        href,
        image,
        sort,
        content,
        seoTitle,
        seoKey,
        seoContent,
        remark,
      };
    },
    close() {
      this.$refs.clientRef && this.$refs.clientRef.clearValidate();
      this.addData = {
        categoryId: "",
        name: "",
        image: "",
        href: "",
        content: "",
        sort: undefined,
        seoTitle: "",
        seoKey: "",
        seoContent: "",
        remark: "",
        id: "",
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.clientRef.validate((valid) => {
        const { categoryId, ...rest } = this.addData;
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysclient/edit",
              params: {
                ...rest,
                categoryId,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/system/sysclient/add",
              params: {
                ...rest,
                categoryId,
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
