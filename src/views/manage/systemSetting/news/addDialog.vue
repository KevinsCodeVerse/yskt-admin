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
        :rules="newsRule"
        ref="newsRef"
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
            :props="{ label: 'name', value: 'id',emitPath: false }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="新闻名称:" prop="name">
          <jat-input v-model="addData.name" placeholder="新闻名称"></jat-input>
        </el-form-item>
        <el-form-item label="新闻图片:" prop="image">
          <upload-image v-model="addData.image"></upload-image>
        </el-form-item>
        <el-form-item label="链接:" prop="href">
          <jat-input
            v-model="addData.href"
            placeholder="请输入链接"
          ></jat-input>
        </el-form-item>
        <el-form-item label="新闻内容:" prop="content">
          <tinymce-edit v-model="addData.content"></tinymce-edit>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <jat-input
            v-model.number="addData.sort"
            placeholder="请输入排序"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO标题:" prop="seoTitle">
          <jat-input
            v-model="addData.seoTitle"
            type="textarea"
            :row="4"
            placeholder="请输入SEO标题"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO关键字:" prop="seoKey">
          <jat-input
            v-model="addData.seoKey"
            type="textarea"
            :row="4"
            placeholder="请输入SEO关键字"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO描述:" prop="seoContent">
          <jat-input
            v-model="addData.seoContent"
            type="textarea"
            :row="4"
            placeholder="请输入SEO描述"
          ></jat-input>
        </el-form-item>
        <el-form-item label="S描述:" prop="remark">
          <jat-input
            v-model="addData.remark"
            type="textarea"
            :row="6"
            placeholder="描述"
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
      newsRule: {
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

  mounted() {
    this.getCategoryList();
  },

  methods: {
    open() {
      this.dialogTitle = "添加新闻";
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
      this.dialogTitle = "编辑新闻";
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
      this.$refs.newsRef && this.$refs.newsRef.clearValidate();
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

    getCategoryList() {
      request.post({
        url: "/system/sysNewsCategory/listNoPage",
        params: {
          ...this.addData,
        },
        success: (res) => {
          this.categoryOptions = listToTree(res);
        },
      });
    },

    handleSubmit() {
      this.$refs.newsRef.validate((valid) => {
        const {categoryId, ...rest} = this.addData
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysNews/edit",
              params: {
                ...rest,
                categoryId
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/system/sysNews/add",
              params: {
                ...rest,
                categoryId
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
