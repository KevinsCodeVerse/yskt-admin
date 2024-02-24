<!-- 添加广告 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="70%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="articleRule"
        ref="articleRef"
        label-position="right"
        label-width="140px"
      >
        <el-form-item label="文章标题:" prop="title">
          <jat-input
            v-model="addData.title"
            placeholder="请输入文章标题"
          ></jat-input>
        </el-form-item>
        <el-form-item label="文章分类:" prop="categoryId">
          <jat-select
            v-model="addData.categoryId"
            placeholder="请选择文章分类"
            clearable
            filterable
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

        <el-form-item label="封面:" prop="imgUrl">
          <upload-image v-model="addData.imgUrl"></upload-image>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <jat-input
            v-input.int
            v-model="addData.sort"
            placeholder="请输入排序"
          ></jat-input>
        </el-form-item>

        <el-form-item label="文章外链:" prop="href">
          <jat-input
            v-model="addData.href"
            placeholder="请输入文章外链"
          ></jat-input>
          <div class="wram-box">
            <i class="el-icon-info"></i>文章外部链接;设置后优先使用外部链接。
          </div>
        </el-form-item>
        <el-form-item v-if="addData.id" label="文章状态:" prop="status">
          <jat-select
            v-model="addData.status"
            placeholder="请选择文章状态"
            clearable
          >
            <el-option label="正常" :value="0"> </el-option>
            <el-option label="下架" :value="1"> </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="SEO标题:" prop="seoTitle">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.seoTitle"
            placeholder="请输入SEO标题"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO关键字:" prop="seoKey">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.seoKey"
            placeholder="请输入SEO关键字"
          ></jat-input>
        </el-form-item>
        <el-form-item label="SEO描述:" prop="seoContent">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.seoContent"
            placeholder="请输入SEO关键字"
          ></jat-input>
        </el-form-item>
        <el-form-item label="文章简短描述:" prop="overview">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.overview"
            placeholder="请输入课文章简短描述"
          ></jat-input>
        </el-form-item>

        <el-form-item label="发布者:" prop="createAdId">
          <el-select
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.createAdId"
            filterable
            remote
            placeholder="默认为登录账户"
            :remote-method="remoteMethod"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in parentAdIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="width: 100%;" label="文章详细描述:" prop="content">
          <tinymce-edit v-model="addData.content"></tinymce-edit>
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
import uploadFile from "@/components/uploadFile.vue";
import uploadImage from "@/components/uploadImage.vue";
import request from "@/utils/request";
import tinymceEdit from "@/components/tinymceEdit.vue";

export default {
  components: { uploadFile, uploadImage, tinymceEdit },
  data() {
    return {
      addModifyVisible: false,
      remoteLoading: false,
      categoryOptions: [],
      dialogTitle: "",
      addData: {
        id: "",
        title: "",
        categoryId: "",
        content: "",
        href: "",
        createAdId: "",
        imgUrl: "",
        overview: "",
        seoContent: "",
        seoKey: "",
        seoTitle: "",
        status: 0,
        sort: 255,
      },
      parentAdIdOptions: [],
      articleRule: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        categoryId: [
          { required: true, message: "请选择文章分类", trigger: "blur" },
        ],
        // imgUrl: [
        //   { required: true, message: "请上传文章封面", trigger: "blur" },
        // ],
        // href: [{ required: true, message: "请输入文章外链", trigger: "blur" }],
        content: [
          { required: true, message: "请输入文章详细描述", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getCurrentUser();
    this.getCategoryList();
  },

  methods: {
    open() {
      this.dialogTitle = "添加文章";
      this.addModifyVisible = true;
    },
    edit({
      id,
      title,
      categoryId,
      content,
      status,
      href,
      createAdId,
      createAdName,
      imgUrl,
      overview,
      seoContent,
      seoKey,
      seoTitle,
      sort,
    }) {
      this.dialogTitle = "编辑文章";
      this.addModifyVisible = true;
      this.addData = {
        id,
        title,
        categoryId,
        content,
        href,
        createAdId,
        createAdName,
        imgUrl,
        overview,
        seoContent,
        seoKey,
        status,
        seoTitle,
        sort,
      };
      this.teacherOptions = [
        {
          id: createAdId,
          name: createAdName,
        },
      ];
    },
    close() {
      this.$refs.articleRef && this.$refs.articleRef.clearValidate();
      this.addData = {
        id: "",
        title: "",
        categoryId: "",
        content: "",
        href: "",
        createAdId: "",
        imgUrl: "",
        overview: "",
        status: 0,
        seoContent: "",
        seoKey: "",
        seoTitle: "",
        sort: 255,
      };
      this.addModifyVisible = false;
    },
    getCurrentUser() {
      this.parentAdIdOptions = [
        {
          id: sessionStorage.getItem("id")
            ? parseInt(sessionStorage.getItem("id"))
            : "",
          name: sessionStorage.getItem("userName"),
        },
      ];
      this.addData.createAdId = parseInt(sessionStorage.getItem("id"));
    },
    handleSubmit() {
      this.$refs.articleRef.validate((valid) => {
        const { id, ...rest } = this.addData;
        if (valid) {
          if (id) {
            request.post({
              url: "/system/sysArticle/edit",
              params: {
                id,
                ...rest,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/system/sysArticle/add",
              params: {
                ...rest,
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
    getCategoryList() {
      request.post({
        url: "system/sysCategory/listNoPage",
        params: {
          type: 1,
        },
        success: (res) => {
          this.categoryOptions = res;
        },
      });
    },

    remoteMethod(search) {
      if (!search) {
        return;
      }
      this.remoteLoading = true;
      request.post({
        url: "/admin/adInfo/queryAdminByNameOrPhone",
        params: {
          search,
        },
        success: (res) => {
          this.remoteLoading = false;
          this.parentAdIdOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 600px;
  overflow: auto;
  .el-form-item {
    width: 48%;
  }
}
.wram-box {
  font-size: 12px;
  color: #e6a23c;
  line-height: 16px;
}
</style>
