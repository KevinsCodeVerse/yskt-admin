<!-- 创建收款 -->
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
          :rules="collectionRule"
          ref="collectionRef"
          label-position="right"
          label-width="90px"
      >
        <el-form-item v-if="vipName" label="收款单位:">
          {{ vipName }}
        </el-form-item>
        <el-form-item label="收款方式:" prop="categoryId">
          <jat-select
              v-model="addData.categoryId"
              placeholder="请选择收款方式"
              clearable
          >
            <el-option
                v-for="item in categoryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item label="水单:" prop="receiptUrl">
          <upload-image v-model="addData.receiptUrl"></upload-image>
        </el-form-item>
        <el-form-item label="收款金额:" prop="collectionMoney">
          <jat-input
              v-input.float="2"
              v-model="addData.collectionMoney"
              placeholder="请输入收款金额"
          ></jat-input>
        </el-form-item>
        <el-form-item label="收款时间:" prop="collectionTime">
          <jat-date-picker
              width="100%"
              clearable
              type="datetime"
              placeholder="请选择收款时间"
              valueFormat="yyyy-MM-dd HH:mm:ss"
              size="small"
              v-model="addData.collectionTime"
          ></jat-date-picker>
        </el-form-item>
        <el-form-item label="收款备注:" prop="remark">
          <jat-input
              type="textarea"
              :rows="5"
              v-model="addData.remark"
              placeholder="请输入收款备注"
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
      vipName: "",
      addData: {
        categoryId: "",
        collectionMoney: "",
        collectionTime: "",
        orderNum: "",
        receiptUrl: "",
        remark: "",
      },
      categoryOptions: [],
      collectionRule: {
        categoryId: [
          { required: true, message: "请选择收款方式", trigger: "blur" },
        ],
        collectionMoney: [
          { required: true, message: "请输入收款金额", trigger: "blur" },
        ],
        collectionTime: [
          { required: true, message: "请选择收款时间", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getCategoryList();
  },

  methods: {
    open(orderNum, title, collectionName) {
      this.dialogTitle = "创建收款";
      this.addData.orderNum = orderNum;
      if (title) {
        this.dialogTitle = title;
        this.vipName = collectionName;
      }
      this.addModifyVisible = true;
    },
    close() {
      this.$refs.collectionRef && this.$refs.collectionRef.clearValidate();
      this.vipName = "";
      this.addData = {
        categoryId: "",
        collectionMoney: "",
        collectionTime: "",
        orderNum: "",
        receiptUrl: "",
        remark: "",
      };
      this.addModifyVisible = false;
    },

    getCategoryList() {
      request.post({
        url: "/system/sysCategory/listNoPage",
        params: {
          type: 3,
        },
        success: (res) => {
          this.categoryOptions = res;
        },
      });
    },

    handleSubmit() {
      this.$refs.collectionRef.validate((valid) => {
        if (valid) {
          request.post({
            url: "/system/sysCourseOrderBills/claimMoneyAdd",
            params: this.addData,
            success: (res) => {
              this.$message.success(res);
              this.close();
              this.$emit("success");
            },
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
