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
        :rules="adminRule"
        ref="adminRef"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="用户账号:" prop="account">
          <span v-if="!addData.id" class="warm_box"
            ><i class="el-icon-info"></i>系统将自动生成用户名</span
          >
          <jat-input
            v-else
            disabled
            v-model="addData.account"
            placeholder="请输入用户账号"
          ></jat-input>
        </el-form-item>
        <el-form-item label="角色权限:" prop="roleIds">
          <el-checkbox-group v-model="addData.roleIds">
            <el-checkbox
              v-for="item in rolesOptions"
              :key="item.id"
              :label="item.id"
              >{{ item.roleName }}</el-checkbox
            >
          </el-checkbox-group>
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
            <el-option label="男" :value="1"> </el-option>
            <el-option label="女" :value="2"> </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-cascader
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.departmentId"
            :options="departmentOptions"
            :props="{ label: 'name', value: 'id', emitPath: false }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="用户状态:" prop="status">
          <jat-select v-model="addData.status" placeholder="请选择用户状态">
            <el-option label="正常" :value="0"> </el-option>
            <el-option label="冻结" :value="-1"> </el-option>
            <el-option label="禁用" :value="-2"> </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="可查看部门:" prop="canSeeDepartment">
          <el-tree
            :data="canSeeDepartmentList"
            node-key="id"
            show-checkbox
            default-expand-all
            ref="departmentRef"
            highlight-current
            :props="defaultProps"
          ></el-tree>
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
        您的账号创建成功了。请保存好，方便后面登录后台系统
      </div>
      <div class="account-box">
        <span>账号：{{ accountInfo.account }}</span>
        <span>密码：{{ accountInfo.password }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <jat-button
          v-clipboard:copy="
            '账号：' + accountInfo.account + '\n密码：' + accountInfo.password
          "
          v-clipboard:success="onCopy"
          >一键复制</jat-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import uploadImage from "@/components/uploadImage.vue";
import request from "../../../../utils/request";
import tinymceEdit from "@/components/tinymceEdit.vue";
import { listToTree } from "../../../../utils/tools";
import rsa from "@/utils/rsa";
import { validPhone } from "@/utils/validate";
export default {
  components: { uploadImage, tinymceEdit },
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        roleIds: [],
        name: "",
        phone: "",
        qq: "",
        wechatNum: "",
        password: "",
        gender: "",
        departmentId: "",
        status: "",
        canSeeDepartment: [],
        id: "",
      },
      accountVisible: false,
      accountInfo: {
        account: "",
        password: "",
      },
      departmentOptions: [],
      rolesOptions: [],
      canSeeDepartmentList: [],
      defaultProps: {
        label: "name",
        value: "id",
      },
      adminRule: {
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        name: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
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
        departmentId: [
          { required: true, message: "请选择部门", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择用户状态", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    open() {
      this.dialogTitle = "添加管理员";
      this.addData.name = "";
      this.getcanSeeDepartmentList();
      this.getRolesOptions();
      this.addModifyVisible = true;
    },
    edit({
      roleIds,
      name,
      phone,
      qq,
      wechat: wechatNum,
      gender,
      departmentId,
      status,
      account,
      canSeeDepartment,
      id,
    }) {
      this.dialogTitle = "编辑管理员";
      this.addData = {
        roleIds: roleIds ? JSON.parse(roleIds) : [],
        name,
        phone,
        qq,
        wechatNum,
        password: "",
        gender,
        departmentId,
        status,
        account,
        canSeeDepartment: canSeeDepartment ? JSON.parse(canSeeDepartment) : [],
        id,
      };
      this.getcanSeeDepartmentList();
      this.getRolesOptions();
      this.addModifyVisible = true;
      setTimeout(() => {
        this.$refs.departmentRef.setCheckedKeys(this.addData.canSeeDepartment);
      }, 100);
    },
    handleClose() {
      this.accountInfo = {
        account: "",
        password: "",
      };
    },
    close() {
      this.$refs.adminRef && this.$refs.adminRef.clearValidate();
      this.$refs.departmentRef.setCheckedKeys([]);
      this.addData = {
        roleIds: [],
        name: "",
        phone: "",
        qq: "",
        wechatNum: "",
        password: "",
        gender: "",
        departmentId: "",
        status: "",
        canSeeDepartment: [],
        id: "",
      };
      this.addModifyVisible = false;
    },

    getcanSeeDepartmentList() {
      request.post({
        // url: "/admin/adDepartment/listNoPage",
        url: "admin/adInfo/canChooseCanSeeDepartmentList",
        params: {
          id: sessionStorage.getItem("id")
        },
        success: (res) => {
          this.canSeeDepartmentList = listToTree(res);
          this.departmentOptions = this.canSeeDepartmentList;
        },
      });
    },
    getRolesOptions() {
      request.post({
        url: "/admin/adInfo/canChooseRoleList",
        params: {
          id: sessionStorage.getItem("id")
        },
        success: (res) => {
          this.rolesOptions = res;
        },
      });
    },

    handleSubmit() {
      this.$refs.adminRef.validate((valid) => {
        const { roleIds, password, ...rest } = this.addData;
        const canSeeDepartment = this.$refs.departmentRef.getCheckedKeys();
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/admin/adInfo/editAdmin",
              params: {
                ...rest,
                password: password ? rsa.encryptByPublicKey(password) : "",
                canSeeDepartment: canSeeDepartment
                  ? JSON.stringify(canSeeDepartment)
                  : undefined,
                roleIds: JSON.stringify(roleIds),
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            
            request.post({
              url: "/admin/adInfo/addAdmin",
              params: {
                ...rest,
                canSeeDepartment: canSeeDepartment
                  ? JSON.stringify(canSeeDepartment)
                  : undefined,
                password: password ? rsa.encryptByPublicKey(password) : "",
                roleIds: JSON.stringify(roleIds),
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
