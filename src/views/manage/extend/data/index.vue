<!-- 推广数据管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
        :option="filterOptions"
        v-model="filterData"
        ref="filter"
        @searchFilter="searchFilter"
        @clearFilter="clearFilter"
    ></jat-fillter>
    <BasicTable
        :columns="table.columns"
        :headerOperates="headerOperates"
        :operates="operates"
        :data="table.data"
        :pageSize="table.pageSize"
        :currentPage="table.currentPage"
        :total="table.total"
        @current-page-change="currentPageChange"
        @size-page-change="sizePageChange"
    >
      <div slot="image" slot-scope="scope">
        <el-image
            v-if="scope.row.image"
            style="width: 50px"
            :src="scope.row.image"
            :preview-src-list="[scope.row.image]"
        >
        </el-image>
        <span v-else></span>
      </div>
    </BasicTable>
    <add-dialog @success="handleSuccess" ref="addDialog"></add-dialog>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
import addDialog from "./addDialog.vue";
import {degreeOptions, genderOptions, getPromotionChannel} from "./const";
import {listToTree} from '../../../../utils/tools';

export default {
  name: "dataPage",
  components: {BasicTable, addDialog},
  data() {
    return {
      loading: false,
      categoryOptions: [],

      filterOptions: {
        column: [
          {
            type: "input",
            label: "姓名/QQ/微信/电话号码",
            value: "search",
          },
          {
            type: "select",
            label: "推广渠道",
            value: "channelId",
            valueKey: "id",
            labelKey: "name",
            options: [],
          },

          {
            type: "user",
            userType: 0,
            label: "销售员",
            value: "promoterId",
          },
          {
            type: "user",
            userType: 0,
            label: "推广员",
            value: "createAdId",
          },
          {
            type: "cascader",
            label: "部门",
            value: "departmentId",
            ref: "departmentRef",
            options: [],
            props: {
              value: "id",
              label: "name",
              multiple: true,
            },
          },
          {
            type: "timeAll",
            label: ["添加开始时间", "添加结束时间"],
            value: "time",
          },
          {
            type: "timeAll",
            label: ["创建开始时间", "创建结束时间"],
            value: "createTime",
          },
        ],
      },

      filterData: {
        search: "",
        channelId: "",
        promoterId: "",
        createAdId: "",
        time: [],
        createTime: [],
        departmentId: []
      },
      table: {
        columns: [
          {
            id: 2,
            prop: "name",
            label: "姓名",
            width: "80px"
          },
          {
            id: 3,
            prop: "channelName",
            label: "推广渠道",
            width: "100px"
          },
          {
            id: 4,
            prop: "promoterName",
            label: "销售员",
            width: "80px"
          },
          {
            id: 13,
            prop: "createAdName",
            label: "推广员",
            width: "80px"
          },
          {
            id: 5,
            prop: "qq",
            label: "QQ",
            width: "100px"
          },
          {
            id: 22,
            prop: "ding",
            label: "钉钉",
            width: "100px"
          },
          {
            id: 6,
            prop: "wechat",
            label: "微信",
            width: "100px"
          },
          {
            id: 7,
            prop: "gender",
            label: "性别",
            render: (row) => {
              return genderOptions.find((item) => item.value === row.gender)[
                  "label"
                  ];
            },
            width: "80px"
          },
          {
            id: 8,
            prop: "remark",
            label: "备注",
            width: "100px"
          },
          {
            id: 10,
            prop: "degree",
            label: "学历",
            width: "80px",
            render: (row) => {
              if (!row.degree) {
                return "未填写";
              }
              return degreeOptions.find((item) => item.value === row.degree)[
                  "label"
                  ];
            },
          },
          {
            id: 11,
            prop: "age",
            label: "年龄",
            width: "50px"
          },
          {
            id: 16,
            prop: "addTime",
            label: "添加时间",
            type: "dateRed",
          },
          {
            id: 12,
            prop: "createTime",
            label: "创建时间",
            type: "date",
          },
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [
        {
          key: "edit",
          title: "编辑",
          permission: "admin/adPromotionData/edit",
          btnStyle: "yellow",
          action: (o, row) => {
            this.$refs.addDialog.edit(row);
          },
        },
        // {
        //   key: "delete",
        //   title: "删除",
        //   permission: "admin/adPromotionData/deleteList",
        //   btnStyle: "red",
        //   action: (o, row) => {
        //     this.handleDelete(row);
        //   },
        // },
        {
          key: "logicDelete",
          title: "删除",
          permission: "admin/adPromotionData/logicRemove",
          btnStyle: "red",
          action: (o, row) => {
            this.handleLogicDelete(row);
          },
        },
      ],
      headerOperates: [
        {
          key: "export",
          permission: "admin/adPromotionData/listExport",
          name: "导出",
          action: () => {
            this.handleExport();
          },
        },
        {
          key: "el-icon-plus",
          permission: "admin/adPromotionData/add",
          name: "添加推广数据",
          action: () => {
            this.$refs.addDialog.open();
          },
        },
      ],
    };
  },
  created() {
    this.getList();
    this.getDepartmentList();
    getPromotionChannel((res) => {
      console.log(res);
      this.filterOptions.column[1].options = res;
    });
  },
  methods: {
    handleExport() {
      this.$confirm(
          "确定导出推广数据吗？导出的时候请等待页面下载自动开始，如果数据量大，可能会等待稍长时间，请不要关闭或者刷新页面",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
      )
          .then(() => {
            this.$message.warning("请耐心等待，表格正在导出1中......");
            var that = this
            const {time, createTime, ...rest} = this.filterData;
            request.post({
              url: "/admin/adPromotionData/listExport",
              params: {
                startTime: time && time.length > 1 ? time[0] : "",
                endTime: time && time.length > 1 ? time[1] : "",
                cSTime: createTime && createTime.length > 1 ? createTime[0] : "",
                cETime: createTime && createTime.length > 1 ? createTime[1] : "",
                ...rest,
              },
              success: (res) => {
                let downloadElement = document.createElement("a");
                downloadElement.href = "https://" + res;
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement); //下载完成移除元素
                that.$message.success("导出成功");
                that.searchFilter();
              },
            });
          })
          .catch((err) => {
            console.log(err)
            // this.$message.info("已取消导出");
          });
    },
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const {time, createTime, ...rest} = this.filterData;
      this.$nextTick(() => {
        const department = this.$refs.filter.$refs.departmentRef[0]
            .getCheckedNodes()
            .map((item) => item.data.id);
        request.post({
          url: "/admin/adPromotionData/list",
          params: {
            pageNo: this.table.currentPage,
            pageSize: this.table.pageSize,
            startTime: time && time.length > 1 ? time[0] : "",
            endTime: time && time.length > 1 ? time[1] : "",
            cSTime: createTime && createTime.length > 1 ? createTime[0] : "",
            cETime: createTime && createTime.length > 1 ? createTime[1] : "",
            ...rest,
            departmentId:
                department && department.length > 0
                    ? JSON.stringify(department)
                    : "",
          },
          success: (res) => {
            this.table.data = res.list;
            this.table.total = res.total;
            this.loading = false;
          },
          catch: () => {
            this.loading = false;
          },
          finally: () => {
            this.loading = false;
          },
        });
      });
    },
    getDepartmentList() {
      request.post({
        url: "/admin/adInfo/canChooseCanSeeDepartmentList",
        params: {
          ...this.addData,
          id: sessionStorage.getItem("id"),
        },
        success: (res) => {
          this.departmentList = res;
          this.filterOptions.column[4].options = listToTree(res);
        },
      });
    },
    handleSuccess() {
      this.getList();
    },
    handleLogicDelete(row) {
      this.$confirm("此操作将会删除该推广数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/admin/adPromotionData/logicRemove",
              params: {
                id: row.id,
              },
              success: (res) => {
                this.$message.success(res);
                this.getList();
              },
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
    },

    handleDelete(row) {
      this.$confirm("此操作将会删除该推广数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            request.post({
              url: "/admin/adPromotionData/deleteList",
              params: {
                id: row.id,
              },
              success: (res) => {
                this.$message.success(res);
                this.getList();
              },
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
    },

    clearFilter() {
      this.filterData = {
        search: "",
        channelId: "",
        promoterId: "",
        createAdId: "",
        time: [],
        createTime: [],
        departmentId: []
      };
      this.searchFilter();
    },
    currentPageChange(num) {
      this.table.currentPage = num;
      this.getList();
    },

    sizePageChange(size) {
      this.table.currentPage = 1;
      this.table.pageSize = size;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.zt_colunms_box {
  &.zt1 {
    color: #0fba80;
    display: inline-block;
    padding: 3px;
    background: rgba(15, 186, 128, 0.1);
    // border: 1px solid rgba(108, 255, 40, 0.6);
    border-radius: 2px;
  }

  &.zt0 {
    color: #ff6600;
    display: inline-block;
    padding: 3px;
    background: rgba(255, 102, 0, 0.1);
    // border: 1px solid rgba(108, 255, 40, 0.6);
    border-radius: 2px;
  }
}
</style>
