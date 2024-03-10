<!--  -->
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
        label-position="top"
        class="course-form-box"
        label-width="150px"
      >
        <el-form-item style="width: 100%;" label="套餐分类" prop="course">
          <jat-select
            v-model="addData.courseName"
            placeholder="请选择产品编号/产品名称"
            @change="handleCategoryChange"
            value-key="id"
            clearable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </jat-select>
        </el-form-item>
        <el-form-item
          style="width: 100%; height: 330px; overflow: hidden;"
          label="课程套餐:"
          class="filter-form-item"
          prop="ids"
        >
          <div class="filter-table">
            <jat-select
              class="filterBox"
              style="width: 80%;"
              v-model="filterSelectData"
              value-key="id"
              multiple
              placeholder="根据课程名称进行搜索"
              @change="handleFilterChange"
              clearable
              filterable
            >
              <el-option
                v-for="item in selectDataList"
                :key="item.id"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </jat-select>
          </div>
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
            :reserveSelection="true"
            row-key="id"
            :data="tableData"
          ></BasicTable>
        </el-form-item>
        <el-form-item label="订单时间:" prop="time">
          <jat-date-picker
            width="100%"
            clearable
            type="daterange"
            placeholder="请选择订单时间"
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
            ref="select1"
            @hook:mounted="cancalReadOnly"
            @visible-change="cancalReadOnly"
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
              :label="item.name ? item.name : item.account + '(学籍未注册)'"
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
            ref="select2"
            @hook:mounted="cancalReadOnly"
            @visible-change="cancalReadOnly"
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
export default {
  components: { uploadFile, BasicTable },
  data() {
    return {
      addModifyVisible: false,
      remoteLoading: false,
      dialogTitle: "",
      tableData: [],
      userAdminOptions: [],
      filterSelectData: [],
      selectDataList: [],
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
          prop: "price",
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
        courseName: "",
        adId: "",
        costPrice: "",
        count: 1,
        ids: "",
        marketPrice: "",
        profitAdId: "",
        remark: "",
        time: [
          this.$moment().format("YYYY-MM-DD"),
          this.$moment()
            .add(1, "y")
            .format("YYYY-MM-DD"),
        ],
      },

      clientRule: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        costPrice: [
          { required: true, message: "请输入成本价", trigger: "blur" },
        ],
        adId: [{ required: true, message: "请输入下单者", trigger: "blur" }],
        count: [{ required: true, message: "请输入数量", trigger: "blur" }],
        time: [{ required: true, message: "请选择订单时间", trigger: "blur" }],
        ids: [
          { required: true, message: "请输入选择套餐课程", trigger: "blur" },
        ],
        marketPrice: [
          { required: true, message: "请输入市场价", trigger: "blur" },
        ],
        profitAdId: [
          { required: true, message: "请选择利润归属", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getCurrentUser();
    this.getCategoryList();
  },

  methods: {
    open() {
      this.dialogTitle = "增加订单";
      this.addModifyVisible = true;
      this.cancalReadOnly();
    },
    edit({
      orderNum,
      vipName,
      vipAdId,
      profitAdName,
      profitAdId,
      courseIds,
      courseName,
      costPrice,
      count,
      marketPrice,
      remark,
      startTime,
      endTime,
    }) {
      this.dialogTitle = "修改订单";
      this.addModifyVisible = true;
      this.addData = {
        orderNum,
        courseName,
        adId: vipAdId,
        costPrice,
        count: count ? count : 1,
        ids: courseIds ? JSON.parse(courseIds) : [],
        marketPrice,
        profitAdId,
        remark,
        time:
          startTime && endTime
            ? [getDate(startTime, "yyyy-MM-dd"), getDate(endTime, "yyyy-MM-dd")]
            : [],
      };
      this.userAllOptions = [
        {
          id: vipAdId,
          name: vipName,
        },
      ];

      this.userAdminOptions = [
        {
          id: profitAdId,
          name: profitAdName,
        },
      ];

      this.$nextTick(() => {
        this.getCourseList(
          this.categoryOptions.find((item) => item.name === courseName).id,
          this.addData.ids
        );
      });

      this.cancalReadOnly();
    },
    close() {
      this.$refs.clientRef && this.$refs.clientRef.clearValidate();
      this.addData = {
        id: "",
        course: {},
        adId: "",
        costPrice: "",
        count: 1,
        ids: "",
        marketPrice: "",
        profitAdId: "",
        remark: "",
        // time: [],
        time: [
          this.$moment().format("YYYY-MM-DD"),
          this.$moment()
            .add(1, "y")
            .format("YYYY-MM-DD"),
        ],
      };
      this.addModifyVisible = false;
    },
    cancalReadOnly(onOff) {
      this.$nextTick(() => {
        if (!onOff) {
          const { select1, select2 } = this.$refs;
          const input1 = select1.$el.querySelector(".el-input__inner");
          const input2 = select2.$el.querySelector(".el-input__inner");
          input1.removeAttribute("readonly");
          input2.removeAttribute("readonly");
        }
      });
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
    getCourseList(id, ids) {
      request.post({
        url: "/admin/adCourse/queryCourseListByCategoryId",
        params: {
          categoryId: id,
        },
        success: (res) => {
          this.tableData = res;
          this.selectDataList = res;
          this.$nextTick(() => {
            this.$refs.courseTableRef.$refs.basicTable.$refs.multipleTable.clearSelection();
            if (ids) {
              ids.forEach((id) => {
                this.tableData.forEach((row) => {
                  if (row.id === id) {
                    this.$refs.courseTableRef.$refs.basicTable.$refs.multipleTable.toggleRowSelection(
                      row
                    );
                  }
                });
              });
            } else {
              this.tableData.forEach((row) => {
                this.$refs.courseTableRef.$refs.basicTable.$refs.multipleTable.toggleRowSelection(
                  row
                );
              });
            }
          });
        },
      });
    },

    handleCategoryChange(val) {
      if (val) {
        this.getCourseList(val.id);
      }
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
    handleFilterChange(list) {
      if (list && list.length > 0) {
        this.tableData = list;
      } else {
        this.tableData = this.selectDataList;
      }
    },

    handleSubmit() {
      this.$refs.clientRef.validate((valid) => {
        const { ids, time, id, courseName,orderNum, ...rest } = this.addData;

        if (valid) {
          if (orderNum) {
            request.post({
              url: "/system/sysCourseOrder/orderEdit",
              params: {
                orderNum,
                ids: JSON.stringify(ids),
                name: courseName,
                startTime: time && time.length > 0 ? time[0] : "",
                endTime: time && time.length > 0 ? time[1] : "",
                ...rest,
              },
              success: (res) => {
                this.$message.success(res);
                this.close();
                this.$emit("success");
              },
            });
          } else {
            request.post({
              url: "system/sysCourseOrder/quicklyPlaceOrderAdd",
              params: {
                ids: JSON.stringify(ids),
                name: courseName,
                startTime: time && time.length > 0 ? time[0] : "",
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
        }
      });
    },

    handleSelectionChange(itemList) {
      this.addData.ids = itemList.map((item) => item.id);
      this.addData.costPrice = this.addData.costPrice
        ? this.addData.costPrice
        : itemList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.costPrice,
            0
          );
      this.addData.marketPrice = this.addData.marketPrice
        ? this.addData.marketPrice
        : itemList.reduce(
            (accumulator, currentValue) => accumulator + currentValue.price,
            0
          );
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
  .filter-form-item {
    position: relative;
    /deep/.el-form-item__content {
      position: unset;
    }

    .filterBox {
      top: -5px;
      left: 90px;
      position: absolute;
    }
  }
  .el-form-item {
    width: 48%;
  }
}

@media only screen and (max-width: 479px) {
  .course-form-box {
    .el-form-item {
      width: 100% !important;
    }
  }
}
</style>
