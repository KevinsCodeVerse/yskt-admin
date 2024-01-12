<!-- 创建收款 -->
<template>
  <div>
    <el-dialog
      title="退款"
      :close-on-click-modal="false"
      :visible.sync="addModifyVisible"
      width="40%"
      @close="close"
    >
      <el-form
        :model="addData"
        :rules="refundRule"
        ref="refundRef"
        label-position="right"
        label-width="90px"
      >
     
        <el-form-item label="退款方式:" prop="categoryId">
          <jat-select
            v-model="addData.categoryId"
            placeholder="退款方式"
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

        <el-form-item label="退款金额:" prop="collectionMoney">
          <jat-input
            v-input.float="2"
            v-model="addData.collectionMoney"
            placeholder="请输入收款金额"
          ></jat-input>
        </el-form-item>

        <el-form-item label="收款备注:" prop="remark">
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.remark"
            placeholder="请输入退款备注"
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
import request from "../../../../utils/request";
export default {
  components: {},
  data() {
    return {
      addModifyVisible: false,
      dialogTitle: "",
      vipName: "",
      addData: {
        categoryId: "",
        collectionMoney: "",
        orderNum: "",
        remark: "",
      },
      categoryOptions: [],
      refundRule: {
        categoryId: [
          { required: true, message: "请选择退款方式", trigger: "blur" },
        ],
        collectionMoney: [
          { required: true, message: "请输入退款金额", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getCategoryList();
  },

  methods: {
    open(row) {
      const { orderNum } = row;
      this.addData.orderNum = orderNum
      this.addModifyVisible = true;
    },
    close() {
      this.$refs.refundRef && this.$refs.refundRef.clearValidate();
      this.addData = {
        categoryId: "",
        collectionMoney: "",
        orderNum: "",
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
      this.$refs.refundRef.validate((valid) => {
        if (valid) {
          request.post({
            url: "/system/sysCourseOrderBills/refundAdd",
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
