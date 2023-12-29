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
          <jat-input v-model="addData.name" placeholder="客户名称"></jat-input>
        </el-form-item>
        <el-form-item label="联系人:" prop="name">
          <jat-input v-model="addData.name" placeholder="联系人"></jat-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <jat-input v-model="addData.phone" placeholder="联系电话"></jat-input>
        </el-form-item>
        <el-form-item label="证件类型:" prop="idCardType">
          <jat-select
            v-model="addData.idCardType"
            placeholder="请选择证件类型"
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
        <el-form-item label="生日:" prop="birthday">
          <jat-input
            v-model="addData.birthday"
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
        <el-form-item label="所有者:" prop="parentAdId">
          <jat-select
            v-model="addData.wageLevel"
            placeholder="请选择所有者"
            key-id="id"
            clearable
            filterable
          >
            <el-option
              v-for="item in parentAdIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="紧急联系人信息:" prop="urgentPerson">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.urgentPerson"
            placeholder="请输入紧急联系人信息"
          ></jat-input>
        </el-form-item>
        <el-form-item style="width: 100%" label="附件:" prop="attachment"> 
          <uploadFile v-model="addData.attachment"></uploadFile>
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
import uploadFile from "../../../../components/uploadFile.vue";
import request from "../../../../utils/request";

export default {
  components: { uploadFile },
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      addData: {
        name: "",
        phone: "",
        idCardType: "",
        idCard: "",
        birthday: "",
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
        categoryId: [
          { required: true, message: "请选择新闻分类", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入新闻名称", trigger: "blur" }],
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
    open() {
      this.dialogTitle = "添加客户";
      this.addData.name = "";
      this.addModifyVisible = true;
    },
    edit({
      id,
      name,
      categoryId,
      href,
      image,
      sort,
      content,
      seoTitle,
      seoKey,
      seoContent,
      remark,
    }) {
      this.dialogTitle = "编辑客户";
      this.addModifyVisible = true;
      this.addData = {
        id,
        name,
        categoryId,
        href,
        image,
        sort,
        content,
        seoTitle,
        seoKey,
        seoContent,
        remark,
      };
    },
    close() {
      this.$refs.clientRef && this.$refs.clientRef.clearValidate();
      this.addData = {
        categoryId: "",
        name: "",
        image: "",
        href: "",
        content: "",
        sort: undefined,
        seoTitle: "",
        seoKey: "",
        seoContent: "",
        remark: "",
        id: "",
      };
      this.addModifyVisible = false;
    },

    handleSubmit() {
      this.$refs.clientRef.validate((valid) => {
        const { categoryId, ...rest } = this.addData;
        if (valid) {
          if (this.addData.id) {
            request.post({
              url: "/system/sysclient/edit",
              params: {
                ...rest,
                categoryId,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "/system/sysclient/add",
              params: {
                ...rest,
                categoryId,
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
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form-item {
    width: 48%;
  }
}
</style>
