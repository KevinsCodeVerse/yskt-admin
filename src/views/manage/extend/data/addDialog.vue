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
          :rules="promotionRule"
          ref="promotionRef"
          label-position="left"
          label-width="90px"
      >
        <el-form-item label="推广渠道:" prop="channelId">
          <jat-select
              v-model="addData.channelId"
              placeholder="请选择推广渠道"
              clearable
          >
            <el-option
                v-for="item in channelIdOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="销售员:" prop="promoterId">
          <select-user-remote
              width="100%"
              v-model="addData.promoterId"
              :type="0"
              ref="selectUser"
              placeholder="销售员"
          ></select-user-remote>
        </el-form-item>
        <el-form-item label="增加时间:" prop="addTime">
          <jat-date-picker
              width="100%"
              clearable
              type="datetime"
              value-format="timestamp"
              placeholder="请选择增加时间"
              size="small"
              v-model="addData.addTime"
              @change="shijian()"
          ></jat-date-picker>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <jat-input
              v-model="addData.name"
              placeholder="请输入姓名"
          ></jat-input>
        </el-form-item>
        <el-form-item label="年龄:" prop="age">
          <jat-input v-model="addData.age" placeholder="请输入年龄"></jat-input>
        </el-form-item>
        <el-form-item label="QQ:" prop="qq">
          <jat-input v-model="addData.qq" placeholder="请输入QQ"></jat-input>
        </el-form-item>
        <el-form-item label="微信:" prop="wechat">
          <jat-input
              v-model="addData.wechat"
              placeholder="请输入微信"
          ></jat-input>
        </el-form-item>

        <el-form-item label="性别:" prop="gender">
          <jat-select
              v-model="addData.gender"
              placeholder="请选择性别"
              clearable
          >
            <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phone">
          <jat-input
              v-model="addData.phone"
              placeholder="请输入电话号码"
          ></jat-input>
        </el-form-item>
        <el-form-item label="学历:" prop="degree">
          <jat-select
              v-model="addData.degree"
              placeholder="请选择学历"
              clearable
          >
            <el-option
                v-for="item in degreeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>


        <el-form-item label="头像:" prop="avatar">
          <upload-image v-model="addData.avatar"></upload-image>
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
import selectUserRemote from "../../../../components/selectUserRemote.vue";
import {degreeOptions, genderOptions, getPromotionChannel} from "./const";
import {validPhone} from "@/utils/validate.js";

export default {
  components: {uploadImage, selectUserRemote},
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      channelIdOptions: [],
      genderOptions,
      degreeOptions,
      addData: {
        age: "",
        avatar: "",
        degree: "",
        gender: "",
        name: "",
        phone: "",
        qq: "",
        wechat: "",
        channelId: "",
        promoterId: "",
        addTime: ""
      },
      categoryOptions: [],
      promotionRule: {
        channelId: [
          {required: true, message: "请选推广渠道", trigger: "blur"},
        ],
        promoterId: [
          {required: true, message: "请选择销售员", trigger: "blur"},
        ],
        addTime: [
          {required: true, message: "请选择增加时间", trigger: "blur"},
        ],
        phone: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (validPhone(value)) {
                  callback();
                } else {
                  callback(new Error("格式不正确"));
                }
              } else {
                callback()
              }
            },
            trigger: "blur",
          },
        ],
        qq: [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.addData.wechat) {
                callback(new Error("QQ和微信二选一,其中一个必填"));
              } else {
                this.$refs.promotionRef.validateField("wechat");
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        wechat: [
          {
            validator: (rule, value, callback) => {
              if (!value && !this.addData.qq) {
                callback(new Error("QQ和微信二选一,其中一个必填"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
  },

  methods: {
    shijian() {


    },
    open() {
      this.dialogTitle = "添加推广数据";
      this.addData.addTime = Date.now()
      this.addModifyVisible = true;
      getPromotionChannel((res) => {
        this.channelIdOptions = res;
      });
    },
    edit({
           id: dataId,
           age,
           avatar,
           degree,
           gender,
           name,
           phone,
           addTime,
           qq,
           wechat,
           channelId,
           promoterId,
           promoterName,
         }) {
      this.dialogTitle = "编辑推广数据";
      this.addModifyVisible = true;
      getPromotionChannel((res) => {
        this.channelIdOptions = res;
      });
      this.addData = {
        dataId,
        avatar,
        degree,
        gender,
        name,
        phone,
        age,
        addTime,
        qq,
        wechat,
        channelId,
        promoterId,
      };
      this.$nextTick(() => {
        this.$refs.selectUser.userOptions = [
          {name: promoterName, id: promoterId},
        ];
      });
    },
    close() {
      this.$refs.promotionRef && this.$refs.promotionRef.clearValidate();
      this.addData = {
        age: "",
        avatar: "",
        degree: "",
        gender: "",
        name: "",
        phone: "",
        qq: "",
        wechat: "",
        channelId: "",
        promoterId: "",
        addTime: ""
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.promotionRef.validate((valid) => {
        console.log(valid, "valid");
        this.addData.qq=this.addData.qq.trim()
        this.addData.wechat=this.addData.wechat.trim()
        this.addData.name=this.addData.name.trim()
        if (valid) {
          if (this.addData.dataId) {
            request.post({
              url: "/admin/adPromotionData/edit",
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
              url: "/admin/adPromotionData/add",
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
