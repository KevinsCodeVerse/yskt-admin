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
        label-width="150px"
      >
        <el-form-item
          style="width: 100%;"
          label="产品编号/产品名称"
          prop="course"
        >
          <jat-input
            disabled
            v-input.int
            v-model="addData.course"
            placeholder="请输入数量"
          ></jat-input>
        </el-form-item>

        <el-form-item label="开始时间:" prop="time">
          <jat-date-picker
            width="100%"
            clearable
            type="daterange"
            placeholder="请选择时间"
            size="small"
            v-model="addData.time"
          ></jat-date-picker>
        </el-form-item>
        <el-form-item label="数量:" prop="count">
          <jat-input
            disabled
            v-input.int
            v-model="addData.count"
            placeholder="请输入数量"
          ></jat-input>
        </el-form-item>
        <el-form-item label="市场价:" prop="marketPrice">
          <jat-input
            v-input.float="2"
            v-model="addData.marketPrice"
            placeholder="请输入市场价"
          ></jat-input>
        </el-form-item>
        <el-form-item label="成本价:" prop="costPrice">
          <jat-input
            v-input.float="2"
            v-model="addData.costPrice"
            placeholder="请输入成本价"
          ></jat-input>
        </el-form-item>
        <el-form-item label="下单者:" prop="adId">
          <el-select
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.adId"
            filterable
            remote
            placeholder="代客下单选择会员账号，自己下单选择管理员账号"
            :remote-method="(query) => remoteMethod(query, '')"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in userAllOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="利润归属:" prop="profitAdId">
          <el-select
            style="width: 100%;"
            size="small"
            clearable
            v-model="addData.profitAdId"
            filterable
            remote
            placeholder="为空为当前登录账户"
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

        <el-form-item
          style="width: 100%"
          label="优惠信息/订单备注:"
          prop="remark"
        >
          <jat-input
            type="textarea"
            :rows="5"
            v-model="addData.remark"
            placeholder="请输入优惠信息/订单备注"
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
import uploadFile from "@/components/uploadFile.vue";
import request from "@/utils/request";
import { getDate } from "@/utils/tools";
import BasicTable from "@/components/BasicTable/index.vue";
import { tagOptions } from "../../productAssetsManage/courseManage/const";
export default {
  components: { uploadFile, BasicTable },
  data() {
    return {
      addModifyVisible: false,
      remoteLoading: false,
      dialogTitle: "",
      tableData: [],
      userAdminOptions: [],
      userAllOptions: [],
      addData: {
        id: "",
        course: {},
        adId: "",
        costPrice: "",
        count: 1,
        ids: "",
        marketPrice: "",
        profitAdId: "",
        remark: "",
        time: [],
      },

      clientRule: {
        costPrice: [
          { required: true, message: "请输入成本价", trigger: "blur" },
        ],
        marketPrice: [
          { required: true, message: "请输入市场价", trigger: "blur" },
        ],
        adId: [{ required: true, message: "请输入下单者", trigger: "blur" }],
        profitAdId: [
          { required: true, message: "请输入利润归属人", trigger: "blur" },
        ],
        count: [{ required: true, message: "请输入数量", trigger: "blur" }],
        time: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
      },
    };
  },

  mounted() {},

  methods: {
    edit({ id, name, number, tag }) {
      this.dialogTitle = "立即预订";
      this.addModifyVisible = true;
      this.addData = {
        ids: JSON.stringify([id]),
        course: `${number}/${name}`,
        count: 1,
        courseType: tag,
        name: tagOptions.find((item) => item.value == tag).label,
        time: [],
        costPrice: "",
        adId: "",
        marketPrice: "",
        profitAdId: "",
        remark: "",
      };
      this.getCurrentUser();
    },
    close() {
      this.$refs.clientRef && this.$refs.clientRef.clearValidate();
      this.addData = {
        ids: "",
        course: "",
        count: 1,
        courseType: "",
        name: "",
        time: [],
        costPrice: "",
        adId: "",
        marketPrice: "",
        profitAdId: "",
        remark: "",
      };
      this.addModifyVisible = false;
    },
    getCurrentUser() {
      const id = sessionStorage.getItem("id")
        ? parseInt(sessionStorage.getItem("id"))
        : "";
      this.userAdminOptions = [
        {
          id,
          name: sessionStorage.getItem("userName"),
        },
      ];
      this.addData.profitAdId = id;
    },

    handleSubmit() {
      this.$refs.clientRef.validate((valid) => {
        const { ids, time,course, ...rest } = this.addData;

        if (valid) {
          request.post({
            url: "/admin/adCourse/bookingAdd",
            params: {
              ids,
              startTIme: time && time.length > 0 ? time[0] : "",
              endTime: time && time.length > 0 ? time[1] : "",
              ...rest,
            },
            success: (res) => {
              this.$message.success(res);
              this.close();
              this.$emit("success");
            },
          });
        }
      });
    },

    handleSelectionChange(itemList) {
      this.addData.ids = itemList.map((item) => item.id);
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
