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
        <el-form-item label="用户账号:">
          <span class="warm_box"
            ><i class="el-icon-info"></i>系统将自动生成用户名</span
          >
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
            placeholder="请输入用户密码，不填系统将会生成随机密码（以短信的方式通知密码给后台账号持有人）"
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
            <el-option label="冻结" :value="1"> </el-option>
            <el-option label="禁用" :value="2"> </el-option>
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
  </div>
</template>

<script>
import uploadImage from "@/components/uploadImage.vue";
import request from "../../../../utils/request";
import tinymceEdit from "@/components/tinymceEdit.vue";
import { listToTree } from "../../../../utils/tools";
import rsa from '@/utils/rsa'
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
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
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
    // edit({
    //   id,
    //   name,
    //   categoryId,
    //   href,
    //   image,
    //   sort,
    //   content,
    //   seoTitle,
    //   seoKey,
    //   seoContent,
    //   remark,
    // }) {
    //   this.dialogTitle = "编辑新闻";
    //   this.addModifyVisible = true;
    //   this.addData = {
    //     id,
    //     name,
    //     categoryId,
    //     href,
    //     image,
    //     sort,
    //     content,
    //     seoTitle,
    //     seoKey,
    //     seoContent,
    //     remark,
    //   };
    // },
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
        url: "/admin/adInfo/canChooseCanSeeDepartmentList",
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
        url: "/admin/adRole/list",
        params: {
          pageNo: 1,
          pageSize: 50,
        },
        success: (res) => {
          this.rolesOptions = res.list;
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
                password: rsa.encryptByPublicKey(password),
                roleIds: JSON.stringify(roleIds),
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
<style lang="scss" scoped>
.warm_box {
  color: #f39416;
  // color: #f37016;
}
.el-form {
  height: 520px;
  overflow:scroll;
}
</style>
