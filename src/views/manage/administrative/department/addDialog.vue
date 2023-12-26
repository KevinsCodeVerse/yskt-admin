<!-- 添加角色谈款 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="40%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="departmentRule"
        ref="departmentRef"
        label-position="right"
        label-width="90px"
      >
        <el-form-item label="部门名称:" prop="name">
          <jat-input
            v-model="addData.name"
            placeholder="请输入部门名称"
          ></jat-input>
        </el-form-item>
        <el-form-item label="父级名称:" prop="parentId">
          <el-cascader
            style="width: 100%;"
            size="small"
            placeholder="请选择父级名称"
            clearable
            v-model="addData.parentId"
            :options="departmentOptions"
            :props="{
              label: 'name',
              value: 'id',
              emitPath: false,
              checkStrictly: true,
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="主管:" prop="supervisorAdId">
          <jat-select
            v-model="addData.supervisorAdId"
            filterable
            remote
            placeholder="请输入名称或手机号关键词"
            :remote-method="remoteMethod"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in supervisorAdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <jat-input
            v-model.number="addData.sort"
            placeholder="请输入排序"
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
      addInterfaceVisible: false,
      remoteLoading: false,
      dialogTitle: "",
      departmentOptions: [
        {
          name: "顶级",
          id: "-1",
        },
      ],
      supervisorAdOptions: [],
      addData: {
        name: "",
        parentId: "",
        sort: undefined,
        supervisorAdId: "",
        id: "",
      },
      departmentRule: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        parentId: [
          { required: true, message: "请选择父级名称", trigger: "blur" },
        ],
        sort: [
        { required: true, message: "请输入排序", trigger: "blur" },
          {
            type: "number",
            message: "请输入整数",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    open(data, item) {
      this.dialogTitle = "添加部门";
      this.addData.name = "";
      this.addModifyVisible = true;
      this.departmentOptions = [
        {
          name: "顶级",
          id: -1,
        },
        ...data,
      ];
      if (item) {
        this.addData.parentId = item.id;
      }
      // this.remoteMethod()
    },
    edit({ id, name, parentId, sort, supervisorAdId, supervisorAdName }, data) {
      this.departmentOptions = [
        {
          name: "顶级",
          id: -1,
        },
        ...data,
      ];
      this.addData = {
        id,
        name,
        parentId,
        supervisorAdId,
        sort,
      };
      if (supervisorAdId) {
        this.supervisorAdOptions = [
          {
            id: supervisorAdId,
            name: supervisorAdName,
          },
        ];
      }
      this.dialogTitle = "编辑部门";
      this.addModifyVisible = true;
    },
    close() {
      this.$refs.departmentRef && this.$refs.departmentRef.clearValidate();
      this.addModifyVisible = false;
      this.addData = {
        name: "",
        parentId: "",
        sort: undefined,
        supervisorAdId: "",
        id: "",
      };
    },
    remoteMethod(search) {
      this.remoteLoading = true
      request.post({
        url: "/admin/adInfo/queryAdminByNameOrPhone",
        params: {
          search,
        },
        success: (res) => {
          this.remoteLoading = false
          this.supervisorAdOptions = res;
        },
        catch: () => {
          this.remoteLoading = false
        }
      });
    },

    handleSubmit() {
      this.$refs.departmentRef.validate((valid) => {
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/admin/adDepartment/edit",
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
              url: "/admin/adDepartment/add",
              params: this.addData,
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
              catch: () => {
                
              }
            });
          }
        }
      });
    },
    getNewdepartmentList() {
      request.post({
        url: "/system/sysNewsdepartment/listNoPage",
        params: {
          ...this.addData,
        },
        success: (res) => {
          this.departmentOptions = res.filter((item) => item.parentId == -1);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
