<!-- 添加广告 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="70%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="clientRule"
        ref="clientRef"
        label-position="right"
        label-width="140px"
      >
        <el-form-item label="客户名称:" prop="name">
          <jat-input
            v-model="addData.name"
            placeholder="请输入客户名称"
          ></jat-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <jat-input
            v-model="addData.phone"
            placeholder="请输入联系电话"
          ></jat-input>
        </el-form-item>
        <el-form-item label="证件类型:" prop="idCardType">
          <jat-select
            v-model="addData.idCardType"
            placeholder="请选择证件类型"
            @change="handleIdCardTypeChange"
            clearable
            filterable
          >
            <el-option
              v-for="item in idCardTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="证件号码:" prop="idCard">
          <jat-input
            v-model="addData.idCard"
            placeholder="请输入证件号码"
          ></jat-input>
        </el-form-item>
        <el-form-item label="生日:" prop="birthdayParam">
          <jat-input
            v-model="addData.birthdayParam"
            placeholder="请输入生日"
          ></jat-input>
        </el-form-item>
        <el-form-item label="性别:" prop="gender">
          <jat-select
            v-model="addData.gender"
            placeholder="请选择性别"
            clearable
            filterable
          >
            <el-option label="男" :value="1"> </el-option>
            <el-option label="女" :value="2"> </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="所属区域:" prop="region">
          <jat-input
            v-model="addData.region"
            placeholder="请输入所属区域"
          ></jat-input>
        </el-form-item>
        <el-form-item label="家庭住址:" prop="homeAddress">
          <jat-input
            v-model="addData.homeAddress"
            placeholder="请输入家庭住址"
          ></jat-input>
        </el-form-item>
        <el-form-item label="工资水平:" prop="wageLevel">
          <jat-select
            v-model="addData.wageLevel"
            placeholder="请选择工资水平"
            clearable
            filterable
          >
            <el-option
              v-for="item in wageLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="单位:" prop="company">
          <jat-input
            v-model="addData.company"
            placeholder="请输入单位"
          ></jat-input>
        </el-form-item>
        <el-form-item label="客户备注/客户意向:" prop="remark">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.remark"
            placeholder="请输入客户备注/客户意向"
          ></jat-input>
        </el-form-item>

        <el-form-item label="紧急联系人信息:" prop="urgentPerson">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.urgentPerson"
            placeholder="请输入紧急联系人信息"
          ></jat-input>
        </el-form-item>
        <el-form-item label="所有者:" prop="parentAdId">
          <el-select
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.parentAdId"
            filterable
            remote
            placeholder="默认为登录账户，为空的话为公共账户"
            :remote-method="remoteMethod"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in parentAdIdOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件:" prop="attachment">
          <uploadFile :limit="1" v-model="addData.attachment"></uploadFile>
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
import uploadFile from "@/components/uploadFile.vue";
import request from "@/utils/request";
import { getIdCardInfo, validIdCard } from "@/utils/idCardValid";
import { validPhone } from "@/utils/validate";
import { getDate } from "@/utils/tools";

export default {
  components: { uploadFile },
  data() {
    return {
      addModifyVisible: false,
      remoteLoading: false,
      dialogTitle: "",
      addData: {
        id: "",
        name: "",
        phone: "",
        idCardType: "",
        idCard: "",
        birthdayParam: "",
        gender: "",
        region: "",
        homeAddress: "",
        wageLevel: "",
        company: "",
        remark: "",
        parentAdId: "",
        urgentPerson: "",
        attachment: [],
      },
      parentAdIdOptions: [],
      // 1身份证 2军人证 3护照 4学生证 5港澳通行证 6其他
      idCardTypeOptions: [
        {
          label: "身份证",
          value: 1,
        },
        {
          label: "军人证",
          value: 2,
        },
        {
          label: "护照",
          value: 3,
        },
        {
          label: "学生证",
          value: 4,
        },
        {
          label: "港澳通行证",
          value: 5,
        },
        {
          label: "其他",
          value: 6,
        },
      ],
      // 工资水平1：三千以下 2：三千到五千 3：五千到一万 4：一万到三万 5：三万以上
      wageLevelOptions: [
        {
          label: "三千以下",
          value: 1,
        },
        {
          label: "三千到五千",
          value: 2,
        },
        {
          label: "五千到一万",
          value: 3,
        },
        {
          label: "一万到三万",
          value: 4,
        },
        {
          label: "三万以上",
          value: 5,
        },
      ],
      clientRule: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        idCard: [
          {
            validator: (rule, value, callback) => {
              if (this.addData.idCardType == 1 && value) {
                if (validIdCard(value)) {
                  this.addData.birthdayParam = getIdCardInfo(
                    value,
                    "birthDate"
                  );
                  this.addData.gender = getIdCardInfo(value, "sex");
                  callback();
                } else {
                  callback(new Error("身份证号格式不正确"));
                }
              }
            },
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              return validPhone(value)
                ? callback()
                : callback(new Error("联系电话格式不正确"));
            },
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.getCurrentUser();
  },

  methods: {
    open() {
      this.dialogTitle = "添加客户";
      this.addData.name = "";
      this.addModifyVisible = true;
    },
    edit({
      id,
      name,
      phone,
      idCardType,
      idCard,
      birthday,
      gender,
      region,
      homeAddress,
      wageLevel,
      company,
      remark,
      parentAdId,
      urgentPerson,
      attachment,
    }) {
      this.dialogTitle = "编辑客户";
      this.addModifyVisible = true;
      let fileName = "";
      if (attachment) {
        const arrName = attachment.split("/");
        fileName = arrName[arrName.length - 1];
      }

      this.addData = {
        id,
        name,
        phone,
        idCardType,
        idCard,
        birthdayParam: getDate(birthday, "yyyy-MM-dd"),
        gender,
        region,
        homeAddress,
        wageLevel,
        company,
        remark,
        parentAdId,
        urgentPerson,
        attachment: [{ id: 1, name: fileName, url: attachment }],
      };
    },
    close() {
      this.$refs.clientRef && this.$refs.clientRef.clearValidate();
      this.addData = {
        name: "",
        phone: "",
        idCardType: "",
        idCard: "",
        birthdayParam: "",
        gender: "",
        region: "",
        homeAddress: "",
        wageLevel: "",
        company: "",
        remark: "",
        parentAdId: "",
        urgentPerson: "",
        attachment: [],
      };
      this.addModifyVisible = false;
    },
    getCurrentUser() {
      this.parentAdIdOptions = [
        {
          id: sessionStorage.getItem("id")
            ? parseInt(sessionStorage.getItem("id"))
            : "",
          name: sessionStorage.getItem("userName"),
        },
      ];
      this.addData.parentAdId = sessionStorage.getItem("id")
        ? parseInt(sessionStorage.getItem("id"))
        : "";
    },

    handleSubmit() {
      this.$refs.clientRef.validate((valid) => {
        const { attachment, ...rest } = this.addData;

        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/admin/adCustomer/edit",
              params: {
                ...rest,
                categoryId: 1,
                attachment:
                  attachment && attachment.length > 0 ? attachment[0].url : "",
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/admin/adCustomer/add",
              params: {
                ...rest,
                categoryId: 1,
                attachment:
                  attachment && attachment.length > 0 ? attachment[0].url : "",
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

    remoteMethod(search) {
      if (!search) {
        return;
      }
      this.remoteLoading = true;
      request.post({
        url: "/admin/adInfo/queryAdminByNameOrPhone",
        params: {
          search,
        },
        success: (res) => {
          this.remoteLoading = false;
          this.parentAdIdOptions = res;
        },
        catch: () => {
          this.remoteLoading = false;
        },
      });
    },
    handleIdCardTypeChange(val) {
      if (val && this.addData.idCard) {
        this.$refs.clientRef.validateField("idCard");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form-item {
    width: 48%;
  }
}
</style>
