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
        :rules="channelRules"
        ref="channelRef"
        label-position="left"
        label-width="90px"
      >
        <el-form-item label="渠道名称:" prop="name">
          <jat-input
            v-model="addData.name"
            placeholder="请输入名称"
          ></jat-input>
        </el-form-item>

        <el-form-item label="渠道管理员:" prop="adId" label-width="100px">
          <el-select
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.adId"
            filterable
            remote
            placeholder="渠道管理员可以在渠道统计列表看到该渠道和该渠道的数据,其他人都无法看到"
            :remote-method="(query) => remoteMethod(query, 0)"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in userAdminOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="头像:" prop="image">
          <upload-image v-model="addData.image"></upload-image>
        </el-form-item>
        <el-form-item label="渠道公告:" prop="content">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.content"
            placeholder="请输入渠道公告"
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
      dialogTitle: "",
      userAdminOptions: [],
      remoteLoading: false,
      addData: {
        id: "",
        name: "",
        adId: "",
        content: "",
        image: "",
      },
      categoryOptions: [],
      channelRules: {
        name: [{ required: true, message: "请输入渠道名称", trigger: "blur" }],
        adId: [{ required: true, message: "请选择渠道管理员", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    open() {
      this.dialogTitle = "增加推广渠道";
      this.addModifyVisible = true;
    },
    edit({ id,name, adId,adName, image, content }) {
      this.dialogTitle = "编辑推广渠道";
      this.addModifyVisible = true;
      this.addData = {
        id,
        adId,
        name,
        adName,
        image,
        content,
      };
      this.userAdminOptions = [{
        id: adId,
        name: adName
      }]
    },
    close() {
      this.$refs.channelRef && this.$refs.channelRef.clearValidate();
      this.addData = {
        id: "",
        name: "",
        adId: "",
        content: "",
        image: "",
      };
      this.addModifyVisible = false;
    },

    remoteMethod(search, type) {
      if (!search) {
        return;
      }
      this.remoteLoading = true;
      request.post({
        url: "/admin/adInfo/queryAdminByNameOrPhone",
        params: {
          search,
          type: type,
        },
        success: (res) => {
          this.remoteLoading = false;
          if (type === 0) {
            this.userAdminOptions = res;
          } else {
            this.userAllOptions = res;
          }
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },

    handleSubmit() {
      this.$refs.channelRef.validate((valid) => {
        if (valid) {
          const { id, ...rest } = this.addData;
          if (id) {
            request.post({
              url: "/admin/adPromotionChannel/edit",
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
              url: "/admin/adPromotionChannel/add",
              params: {
                ...rest
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
