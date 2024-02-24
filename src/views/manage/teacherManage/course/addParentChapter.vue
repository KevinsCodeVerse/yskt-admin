<!-- 添加章节 -->
<template>
  <el-dialog
    :title="dialogTitle"
    :close-on-click-modal="false"
    :visible.sync="addChaptersVisible"
    :append-to-body="true"
    width="50%"
    @close="close"
  >
    <el-form
      :model="addData"
      :rules="addChapterRule"
      ref="addChapterRef"
      label-position="left"
      label-width="90px"
    >
      <el-form-item label="章节名称:" prop="name">
        <jat-input v-model="addData.name" placeholder="请输入名称"></jat-input>
      </el-form-item>
      <el-form-item label="排序:" prop="sort">
          <jat-input
            v-input.int
            v-model="addData.sort"
            placeholder="请输入排序"
          ></jat-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <jat-button plain @click="close">取 消</jat-button>
      <jat-button @click="handleSubmit">确 定</jat-button>
    </span>
  </el-dialog>
</template>

<script>
import uploadImage from "@/components/uploadImage.vue";
import request from "../../../../utils/request";
import uploadFile from "../../../../components/uploadFile.vue";
export default {
  components: { uploadImage, uploadFile },
  data() {
    return {
      addChaptersVisible: false,
      dialogTitle: "",
      addData: {
        name: "",
        courseId: "",
        sort: 255,
        id: "",
      },
      categoryOptions: [],
      addChapterRule: {
        name: [{ required: true, message: "请输入章节名称", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    open(id) {
      this.dialogTitle = "添加父章节";
      this.addData.courseId = id;
      this.addChaptersVisible = true;
    },
    edit({ name, id, sort }, courseId) {
      this.dialogTitle = "编辑父章节";
      this.addChaptersVisible = true;
      this.addData = {
        name,
        id,
        sort,
        courseId,
      };
    },
    close() {
      this.$refs.addChapterRef && this.$refs.addChapterRef.clearValidate();
      this.addData = {
        courseId: "",
        name: "",
        sort: 255,
        id: "",
      };
      this.addChaptersVisible = false;
    },
    handleSubmit() {
      this.$refs.addChapterRef.validate((valid) => {
        if (valid) {
          const { id, ...rest } = this.addData;
          if (id) {
            request.post({
              url: "/admin/adCourseChapters/uploadCourseEdit",
              params: {
                id,
                parentId: -1,
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
              url: "/admin/adCourseChapters/uploadCourseAdd",
              params: {
                parentId: -1,
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
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
