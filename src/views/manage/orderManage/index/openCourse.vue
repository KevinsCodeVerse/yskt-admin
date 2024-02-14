<!-- 开通课程 -->
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
        <el-form-item style="width: 100%;" label="产品名称" prop="courseName">
          {{ addData.courseName }}
        </el-form-item>
        <el-form-item style="width: 100%; height: 330px; overflow: hidden;" label="课程套餐:" prop="ids">
          <BasicTable
            v-model="addData.ids"
            height="300px"
            ref="courseTableRef"
            selectType="multi"
            @selection-change="handleSelectionChange"
            :hasCard="false"
            :hasPage="false"
            :hasSort="false"
            :columns="columns"
            :isShowTableHead="false"
            :data="tableData"
          ></BasicTable>
        </el-form-item>
        <el-form-item label="开始时间:" prop="time">
          <jat-date-picker
            width="100%"
            clearable
            type="daterange"
            placeholder="请选择订单时间"
            size="small"
            v-model="addData.time"
          ></jat-date-picker>
        </el-form-item>

        <el-form-item label="市场价:" prop="marketPrice">
          <jat-input
            v-input.float="2"
            v-model="addData.marketPrice"
            placeholder="请输入市场价"
          ></jat-input>
        </el-form-item>

        <el-form-item label="下单者:" prop="vipAdId">
          <el-select
            style="width: 100%;"
            size="small"
            ref="selectOpenCourse"
            @hook:mounted="cancalReadOnly"
            @visible-change="cancalReadOnly"
            clearable
            v-model="addData.vipAdId"
            filterable
            remote
            placeholder="代客下单选择会员账号，自己下单选择管理员账号"
            :remote-method="(query) => remoteMethod(query, '')"
            :loading="remoteLoading"
          >
            <el-option
              v-for="item in userAllOptions"
              :key="item.id"
              :label="item.name ? item.name : item.account + '(学籍未注册)'"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
      categoryOptions: [],
      columns: [
        {
          id: 1,
          prop: "name",
          label: "课程名称",
        },
        {
          id: 2,
          prop: "marketPrice",
          label: "市场价",
        },
        {
          id: 3,
          prop: "costPrice",
          label: "成本价",
        },
      ],
      addData: {
        id: "",
        vipAdId: "",
        ids: "",
        orderNum: "",
        marketPrice: "",
        time: [],
      },

      clientRule: {
        vipAdId: [{ required: true, message: "请输入下单者", trigger: "blur" }],
        time: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
        marketPrice: [
          { required: true, message: "请输入市场价", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    // this.getCurrentUser();
    this.getCategoryList();
    
  },

  methods: {
    edit(row) {
      const { orderNum, courseName, courseIds, vipAdId, vipName, marketPrice, startTime, endTime }  = row
      this.dialogTitle = "开通课程";
      this.addModifyVisible = true;
      this.userAllOptions = [
        {
          id: vipAdId,
          name: vipName,
        },
      ];
      this.addData = {
        orderNum,
        courseName,
        courseIds,
        marketPrice,
        time: [getDate(startTime, "yyyy-MM-dd"), getDate(endTime, "yyyy-MM-dd")],
        vipAdId,
      };

      this.getCourseList(courseIds);
      this.cancalReadOnly()
    },
    close() {
      this.$refs.clientRef && this.$refs.clientRef.clearValidate();
      this.addData = {
        id: "",
        vipAdId: "",
        ids: "",
        orderNum: "",
        marketPrice: "",
        time: [],
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
    getCourseList(courseIds) {
      request.post({
        url: "/system/sysCourseOrder/queryCourseById",
        params: {
          ids: courseIds,
        },
        success: (res) => {
          this.tableData = res;
          this.$nextTick(() => {
            this.tableData.forEach((row) => {
              this.$refs.courseTableRef.$refs.basicTable.$refs.multipleTable.toggleRowSelection(
                row
              );
            });
          });
        },
      });
    },

    getCategoryList() {
      request.post({
        url: "system/sysCategory/listNoPage",
        params: {
          type: 4,
        },
        success: (res) => {
          this.categoryOptions = res;
        },
      });
    },

    cancalReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const { selectOpenCourse } = this.$refs;
          const input = selectOpenCourse.$el.querySelector(".el-input__inner");
          input.removeAttribute("readonly");
        }
      });
    },

    handleSubmit() {
      this.$refs.clientRef.validate((valid) => {
        const { ids, time, courseName, ...rest } = this.addData;
        if(ids.length < 1) {
          this.$message.error("请选择要开通的课程套餐")
          return
        }
        if (valid) {
          request.post({
            url: "/system/sysCourseOrder/openCourseEdit",
            params: {
              ...rest,
              courseIds: JSON.stringify(ids),
              startTime: time && time.length > 0 ? time[0] : "",
              endTime: time && time.length > 0 ? time[1] : "",
             
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
@media only screen and (max-width: 479px) {
    .el-form-item {
      width: 100% !important;
    }
  
}
</style>
