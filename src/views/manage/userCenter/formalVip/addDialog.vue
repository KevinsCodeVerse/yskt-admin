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
          :rules="vipRule"
          ref="vipRef"
          label-position="right"
          label-width="90px"
      >
        <el-form-item label="昵称:" prop="nick">
          <jat-input
              v-model="addData.nick"
              placeholder="请输入昵称"
          ></jat-input>
        </el-form-item>
        <el-form-item label="真实姓名:" prop="name">
          <jat-input
              v-model="addData.name"
              placeholder="请输入真实姓名"
          ></jat-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <jat-input
              v-model="addData.phone"
              placeholder="请输入联系电话"
          ></jat-input>
        </el-form-item>

        <el-form-item label="QQ:" prop="qq">
          <jat-input v-model="addData.qq" placeholder="请输入QQ"></jat-input>
        </el-form-item>
        <el-form-item label="微信:" prop="wechatNum">
          <jat-input
              v-model="addData.wechatNum"
              placeholder="请输入微信"
          ></jat-input>
        </el-form-item>
        <el-form-item label="用户密码:" prop="password">
          <jat-input
              v-model="addData.password"
              placeholder="请输入用户密码，不填系统将会生成随机密码"
          ></jat-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <jat-select v-model="addData.gender" placeholder="请输入性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </jat-select>
        </el-form-item>

        <el-form-item label="用户状态:" prop="status">
          <jat-select v-model="addData.status" placeholder="请选择用户状态，添加新会员请选择正常状态">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="冻结" :value="-1"></el-option>
            <el-option label="禁用" :value="-2"></el-option>
            <el-option label="未审核" :value="-3"></el-option>
          </jat-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <jat-button plain @click="close">取 消</jat-button>
        <jat-button @click="handleSubmit">确 定</jat-button>
      </span>
    </el-dialog>
    <el-dialog
        title="账号信息"
        :close-on-click-modal="false"
        :visible.sync="accountVisible"
        width="30%"
        @close="handleClose"
    >
      <div class="tipInfo">
        同学这个是您的学习账号，你先收藏一下，方便后面听课
      </div>
      <div class="account-box">
        <span id="account">账号：{{ accountInfo.account }}</span>
        <span id="password">密码：{{ accountInfo.password }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
<!--        <jat-button-->
        <!--          v-clipboard:copy="-->
        <!--            '账号：' + accountInfo.account + '\n密码：' + accountInfo.password-->
        <!--          "-->
        <!--          v-clipboard:success="onCopy"-->
        <!--          >一键复制</jat-button-->
        <!--        >-->
<!--        <jat-button @click="copyContent()">一键复制</jat-button-->
<!--        >-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uploadImage from "@/components/uploadImage.vue";
import request from "../../../../utils/request";
import tinymceEdit from "@/components/tinymceEdit.vue";
import {listToTree} from "../../../../utils/tools";
import rsa from "@/utils/rsa";
import {validPhone} from "@/utils/validate";

export default {
  components: {uploadImage, tinymceEdit},
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        name: "",
        nick: "",
        phone: "",
        qq: "",
        wechatNum: "",
        password: "",
        gender: "",
        status: "",
        id: "",
      },
      accountVisible: false,
      accountInfo: {
        account: "",
        password: "",
      },
      defaultProps: {
        label: "name",
        value: "id",
      },
      vipRule: {
        gender: [{required: true, message: "请选择性别", trigger: "blur"}],
        name: [{required: true, message: "请输入真实姓名", trigger: "blur"}],
        phone: [
          {required: true, message: "请输入联系电话", trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              if (validPhone(value)) {
                callback();
              } else {
                callback(new Error("联系电话格式不正确"));
              }
            },
            trigger: "blur",
          },
        ],
        status: [
          {required: true, message: "请选择用户状态", trigger: "blur"},
        ],
      },
    };
  },

  mounted() {
  },

  methods: {

    open() {
      this.dialogTitle = "添加会员";
      this.addModifyVisible = true;
    },
    edit({
           name,
           phone,
           qq,
           wechat: wechatNum,
           gender,
           nick,
           status,
           account,
           id,
         }) {
      this.dialogTitle = "编辑会员";
      this.addData = {
        name,
        phone,
        qq,
        wechatNum,
        password: "",
        gender,
        status,
        nick,
        account,
        id,
      };

      this.addModifyVisible = true;
    },
    close() {
      this.$refs.vipRef && this.$refs.vipRef.clearValidate();
      this.addData = {
        name: "",
        phone: "",
        qq: "",
        wechatNum: "",
        password: "",
        nick: "",
        gender: "",
        status: "",
        id: "",
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.vipRef.validate((valid) => {
        const {password, ...rest} = this.addData;
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/admin/adInfo/editVip",
              params: {
                ...rest,
                password: password ? rsa.encryptByPublicKey(password) : "",
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/admin/adInfo/addVip",
              params: {
                ...rest,
                password: password ? rsa.encryptByPublicKey(password) : "",
              },
              success: (res) => {
                this.accountInfo = res;
                this.accountVisible = true;
                this.$message.success("操作成功");
                this.close();
                this.$emit("success");
              },
            });
          }
        }
      });
    },
    handleClose() {
      this.accountInfo = {
        account: "",
        password: "",
      }
    },
    onCopy() {
      this.$message.success("复制成功");
    },
  },
};
</script>
<style lang="scss" scoped>
.warm_box {
  color: #f39416;
  // color: #f37016;
}

.el-form {
  height: 520px;
  overflow: scroll;
}

.tipInfo {
  font-size: 16px;
  margin: 10px;
  color: #f56c6c;
}

.account-box {
  // text-align: center;
  display: flex;
  flex-direction: column;

  span {
    margin: 10px 20px;
    font-size: 16px;
  }

  margin: auto;
}
</style>
