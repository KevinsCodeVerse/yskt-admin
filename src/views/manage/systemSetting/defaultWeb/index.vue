<!-- 网站设置 -->
<template>
  <div class="webPage" v-loading="loading">
    <el-form
      ref="webSet"
      label-position="right"
      :rules="webRules"
      label-width="130px"
      :inline="false"
      size="small"
    >
      <el-form-item
        v-for="(item, index) in formData"
        :key="item.name"
        :label="item.name"
        :prop="item.name"
        :class="{ 'w-full': [13, 14].includes(index) }"
      >
        <tinymceEdit
          v-if="[13, 14].includes(index)"
          v-model="item.value"
        ></tinymceEdit>
        <upload-image
          v-else-if="[3, 5, 11].includes(index)"
          v-model="item.value"
        ></upload-image>
        <jat-input
          v-else-if="index === 10"
          type="textarea"
          :rows="10"
          v-model="item.value"
        ></jat-input>
        <jat-input v-else v-model="item.value"></jat-input>
      </el-form-item>
    </el-form>
    <div @click="submitForm" class="bottom_submit">
      <jat-button>保存</jat-button>
    </div>
  </div>
</template>

<script>
import tinymceEdit from "@/components/tinymceEdit.vue";
import uploadImage from "@/components/uploadImage.vue";
import { getData } from "./api";
import request from "../../../../utils/request";
export default {
  components: { uploadImage, tinymceEdit },
  data() {
    return {
      loading: false,
      webData: {},
      webRules: {},
      formData: [],
    };
  },

  created() {
    this.getInfo();
  },

  methods: {
    getInfo() {
      this.loading = true;
      request.post({
        url: "/system/sysParam/platformParams",
        params: {
        },
        success: (res) => {
          this.formData = res;
          this.loading = false;
        },
        catch: () => {
          this.loading = false;
        },
      });
    },
    submitForm() {
      request.post({
        url: "system/sysParam/editPlatformParams",
        params: {
          paramObjs: JSON.stringify(this.formData),
        },
        success: (res) => {
          this.$message.success(res);
          this.getInfo();
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.webPage {
  height: 100%;
  width: 100%;

  background: #ffffff;
  border: 1px solid rgba(169, 173, 181, 1);
  box-shadow: 0px 5px 8px 0px rgba(116, 136, 161, 0.5);
  border-radius: 4px;
  position: relative;
  box-sizing: border-box;
  padding: 15px;
  display: flex;
  flex-direction: column;
  .el-form {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    overflow: auto;
    justify-content: space-between;
    .el-form-item {
      width: 48%;
    }
    .w-full {
      width: 100%;
    }
  }
  position: relative;
  .bottom_submit {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #ccc;
  }
}
</style>
