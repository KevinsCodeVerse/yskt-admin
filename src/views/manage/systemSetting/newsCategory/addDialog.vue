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
        <el-form-item label="父级名称:" prop="parentId">
          <jat-select
            v-model="addData.parentId"
            placeholder="请选择父级名称"
            clearable
          >
            <el-option label="顶级" :value="-1"> </el-option>
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="封面:" prop="image">
          <uploadImage v-model="addData.image"></uploadImage>
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
export default {
  components: { uploadImage },
  data() {
    return {
      addModifyVisible: false,
      addInterfaceVisible: false,
      dialogTitle: "",
      categoryOptions: [],
      addData: {
        name: "",
        parentId: "",
        image: "",
        sort: undefined,
        seoTitle: "",
        seoKey: "",
        seoContent: "",
        id: "",
      },
      categoryRule: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
        parentId: [
          { required: true, message: "请选择父级名称", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    open(data) {
      this.dialogTitle = "添加分类";
      this.addData.name = "";
      this.addModifyVisible = true;
      if (data) {
        this.addData.parentId = data.id;
      }
      this.getNewCategoryList();
    },
    edit({ id, name, parentId, sort, image, seoContent, seoKey, seoTitle }) {
      this.dialogTitle = "编辑分类";
      this.addModifyVisible = true;
      this.addData = {
        id,
        name,
        parentId,
        sort,
        image,
        seoContent,
        seoKey,
        seoTitle,
      };
      this.getNewCategoryList();
    },
    close() {
      this.$refs.categoryRef && this.$refs.categoryRef.clearValidate();
      this.addModifyVisible = false;
      this.addData = {
        name: "",
        parentId: "",
        image: "",
        sort: undefined,
        seoTitle: "",
        seoKey: "",
        seoContent: "",
        id: "",
      };
    },

    handleSubmit() {
      this.$refs.categoryRef.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysNewsCategory/edit",
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
              url: "/system/sysNewsCategory/add",
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
    getNewCategoryList() {
      request.post({
        url: "/system/sysNewsCategory/listNoPage",
        params: {
          ...this.addData,
        },
        success: (res) => {
          this.categoryOptions = res.filter((item) => item.parentId == -1);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
