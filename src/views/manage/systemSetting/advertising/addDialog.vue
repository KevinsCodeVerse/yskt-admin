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
        :rules="advertRule"
        ref="advertRef"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="广告位置:" prop="categoryId">
          <jat-select
            v-model="addData.categoryId"
            placeholder="请选择广告位置"
            clearable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="广告名称:" prop="name">
          <jat-input
            v-model="addData.name"
            placeholder="请输入名称"
          ></jat-input>
        </el-form-item>
        <el-form-item label="广告图片:" prop="image">
          <upload-image v-model="addData.image"></upload-image>
        </el-form-item>
        <el-form-item label="广告链接:" prop="href">
          <jat-input
            v-model="addData.href"
            placeholder="请输入广告链接"
          ></jat-input>
        </el-form-item>
        <el-form-item label="广告内容:" prop="content">
          <tinymce-edit v-model="addData.content"></tinymce-edit>
        </el-form-item>
        <el-form-item label="广告排序:" prop="sort">
          <jat-input
            v-model.number="addData.sort"
            placeholder="请输入广告排序"
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
import uploadImage from "@/components/uploadImage.vue";
import request from "../../../../utils/request";
import tinymceEdit from "@/components/tinymceEdit.vue";
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
        id: "",
      },
      categoryOptions: [],
      advertRule: {
        categoryId: [
          { required: true, message: "请选择广告位置", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入广告名称", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入广告排序", trigger: "blur" },
          {
            type: "number",
            message: "请输入整数"
          },
        ],
      },
    };
  },

  mounted() {
    this.getCategoryList();
  },

  methods: {
    open() {
      this.dialogTitle = "添加广告";
      this.addData.name = "";
      this.addModifyVisible = true;
    },
    edit({
      id,
      name,
      advertiseCategoryId: categoryId,
      herf: href,
      image,
      sort,
      content,
    }) {
      this.dialogTitle = "编辑广告";
      this.addModifyVisible = true;
      this.addData = { id, name, categoryId, href, image, sort, content };
    },
    close() {
      this.$refs.advertRef && this.$refs.advertRef.clearValidate();
      this.addData = {
        categoryId: "",
        name: "",
        image: "",
        href: "",
        content: "",
        sort: "",
        id: "",
      };
      this.addModifyVisible = false;
    },

    getCategoryList() {
      request.post({
        url: "/system/sysAdvertise/getAllAdvertisingSpace",
        params: {},
        success: (res) => {
          this.categoryOptions = res;
        },
      });
    },

    handleSubmit() {
      this.$refs.advertRef.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysAdvertise/edit",
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
              url: "/system/sysAdvertise/add",
              params: this.addData,
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
