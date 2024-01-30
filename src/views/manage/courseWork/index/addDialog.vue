<!-- 布置作业 -->
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
        :rules="workRule"
        ref="workRef"
        label-position="left"
        label-width="90px"
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
        <el-form-item label="课程章节:" prop="chapterId">
          <jat-select
            v-model="addData.chapterId"
            placeholder="请选择课程章节"
            clearable
          >
            <el-option
              v-for="item in chapterIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>

        <el-form-item label="提交截止时间:" prop="cutOffTime">
          <jat-date-picker
            clearable
            type="date"
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
      chapterIdOptions: [],
      workRule: {
        categoryId: [
          { required: true, message: "请选择广告位置", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入广告名称", trigger: "blur" }],
        sort: [
          { required: true, message: "请输入广告排序", trigger: "blur" },
          {
            type: "number",
            message: "请输入整数",
          },
        ],
      },
    };
  },

  mounted() {
    // this.getCategoryList();
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
      workiseCategoryId: categoryId,
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
      this.$refs.workRef && this.$refs.workRef.clearValidate();
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
        url: "/system/sysworkise/getAllworkisingSpace",
        params: {},
        success: (res) => {
          this.categoryOptions = res;
        },
      });
    },

    handleSubmit() {
      this.$refs.workRef.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysworkise/edit",
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
              url: "/system/sysworkise/add",
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
