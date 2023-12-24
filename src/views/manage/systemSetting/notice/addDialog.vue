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
        :rules="noticeRule"
        ref="noticeRef"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="公告名称:" prop="name">
          <jat-input
            v-model="addData.name"
            placeholder="请输入公告名称"
          ></jat-input>
        </el-form-item>
        <el-form-item label="公告时间:" prop="noticeTime">
          <jat-date-picker
            width="300px"
            clearable
            type="daterange"
            v-model="addData.noticeTime"
          ></jat-date-picker>
        </el-form-item>
        <el-form-item label="封面:" prop="image">
          <upload-image v-model="addData.image"></upload-image>
        </el-form-item>
        <el-form-item label="公告内容:" prop="content">
          <tinymce-edit v-model="addData.content"></tinymce-edit>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <jat-input
            v-model.number="addData.sort"
            placeholder="请输入排序"
          ></jat-input>
        </el-form-item>
        <el-form-item label="描述:" prop="remark">
          <jat-input
            type="textarea"
            :rows="6"
            v-model="addData.remark"
            placeholder="请输入描述"
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
import { getDate } from "../../../../utils/tools";
export default {
  components: { uploadImage, tinymceEdit },
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        name: "",
        image: "",
        noticeTime: [],
        content: "",
        remark: "",
        sort: null,
        id: "",
      },
      categoryOptions: [],
      noticeRule: {
        name: [{ required: true, message: "请输入公告名称", trigger: "blur" }],
        noticeTime: [
          { required: true, message: "请输入公告时间", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入公告内容", trigger: "blur" },
        ],
        sort: [
          {
            type: "number",
            required: false,
            message: "请输入整数",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    open() {
      this.dialogTitle = "添加公告";
      this.addModifyVisible = true;
    },
    edit({ id, name, image, remark, stratTime, endTime, sort, content }) {
      this.dialogTitle = "编辑公告";
      this.addModifyVisible = true;
      this.addData = {
        id,
        name,
        image,
        remark,
        sort,
        content,
        noticeTime: stratTime && endTime && [getDate(stratTime), getDate(endTime)],
      };
    },
    close() {
      this.$refs.noticeRef && this.$refs.noticeRef.clearValidate();
      this.addData = {
        name: "",
        image: "",
        noticeTime: [],
        content: "",
        remark: "",
        sort: null,
        id: "",
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.noticeRef.validate((valid) => {
        const { noticeTime, ...rest } = this.addData;
        const time = {
          startTime: noticeTime && noticeTime.length > 0 && noticeTime[0],
          endTime: noticeTime && noticeTime.length > 0 && noticeTime[1],
        };
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysNotice/edit",
              params: {
                ...rest,
                ...time,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/system/sysNotice/add",
              params: {
                ...rest,
                ...time,
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
