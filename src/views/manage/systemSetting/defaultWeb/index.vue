<!-- 网站设置 -->
<template>
  <div class="webPage">
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
      <!-- <el-form-item label="公司全称" prop="gsqc">
        <jat-input v-model="webData.gsqc"></jat-input>
      </el-form-item>
      <el-form-item label="营业执照" prop="yyzz">
        <jat-input v-model="webData.yyzz"></jat-input>
      </el-form-item>
      <el-form-item label="经营许可证号" prop="jyxkzh">
        <jat-input v-model="webData.jyxkzh"></jat-input>
      </el-form-item>
      <el-form-item label="营业执照照片" prop="yyzzzp">
        <upload-image v-model="webData.yyzzzp"></upload-image>
      </el-form-item>
      <el-form-item label="经营许可证图片" prop="jyxkzhtp">
        <upload-image v-model="webData.jyxkzhtp"></upload-image>
      </el-form-item>

      <el-form-item label="联系人" prop="lxr">
        <jat-input v-model="webData.lxr"></jat-input>
      </el-form-item>

      <el-form-item label="联系人手机号码" prop="lxrsjhm">
        <jat-input v-model="webData.lxrsjhm"></jat-input>
      </el-form-item>

      <el-form-item label="SEO标题" prop="seobt">
        <jat-input v-model="webData.seobt"></jat-input>
      </el-form-item>

      <el-form-item label="SEO关键词" prop="seogjc">
        <jat-input v-model="webData.seogjc"></jat-input>
      </el-form-item>

      <el-form-item label="微信二维码" prop="wxewm">
        <upload-image v-model="webData.wxewm"></upload-image>
      </el-form-item>

      <el-form-item label="SEO描述" prop="seoms">
        <jat-input
          type="textarea"
          :rows="10"
          v-model="webData.seoms"
        ></jat-input>
      </el-form-item>

      <el-form-item label="打印头部：" prop="dytb">
        <tinymceEdit v-model="webData.dytb"></tinymceEdit>
      </el-form-item>

      <el-form-item label="打印尾部：" prop="dywb">
        <tinymceEdit id="dywb" v-model="webData.dywb"></tinymceEdit>
      </el-form-item> -->
    </el-form>
    <div @click="submitForm" class="bottom_submit">
      <jat-button>保存</jat-button>
    </div>
  </div>
</template>

<script>
import tinymceEdit from "@/components/tinymceEdit.vue";
import uploadImage from "@/components/uploadImage.vue";
import { getData, editPlatformParams } from "./api";
export default {
  components: { uploadImage, tinymceEdit },
  data() {
    return {
      webData: {},
      webRules: {},
      formData: [],
    };
  },

  created() {
    this.getInfo();
  },

  methods: {
    async getInfo() {
      const res = await getData();
      this.formData = res.data.result;
    },
    async submitForm() {
      const res = await editPlatformParams(this.formData);
      console.log(res);
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
