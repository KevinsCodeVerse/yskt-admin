<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      ref="filter"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    ></jat-fillter>
    <div>
      <div style="background-color: #ffffff;height: 40px;color: red;display: flex;align-items: center">
        <div style="margin-left: 20px">总增加: {{calculate.totalDay}} —— 当天增加：{{calculate.toDay}}</div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        :span-method="objectSpanMethod"
        border
        :cell-style="cellStyle"
        :header-cell-style="headerCellClassName"
        style="width: 100%; margin-top: 20px;"
        size="mini"
      >
        <el-table-column prop="profitName" label="销售员" width="180"></el-table-column>
        <el-table-column prop="adName" width="150" label="推广员"></el-table-column>
        <el-table-column prop="todayCount" label="当天增加"></el-table-column>
        <el-table-column prop="todayTotalCount" label="当天增加总和"></el-table-column>
        <el-table-column prop="count" label="总数量"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
      <jat-pagination
        style="margin:20px 0;padding: 0"
        :layout="getWidth <= 479
    ? 'total, prev, next, jumper'
    : 'total, sizes, ->, prev, pager, next, jumper'"
        :total="totalRecords"
        @current-change="handlePageChange"
        :page-size="filterData.pageSize"
        v-bind="$attrs"
        v-on="$listeners"
      />
<!--      <el-pagination-->
<!--        layout="prev, pager, next"-->
<!--        :page-size="filterData.pageSize"-->
<!--        :current-page.sync="filterData.pageNo"-->
<!--        :total="totalRecords"-->
<!--        @current-change="handlePageChange"-->
<!--      ></el-pagination>-->
    </div>
  </div>
</template>

<script>
import request from "../../../../utils/request";

export default {
  name: "eatEua",
  data() {
    return {
      params: {},
      totalData: "",
      loading: false,
      tableData: [], // 原始数据
      pagedData: [], // 分页显示的数据
      totalRecords: 100, // 假设总记录数
      filterOptions: {
        column: [
          {
            type: "timeAll",
            label: ["开始时间", "结束时间"],
            value: "time",
          },
        ],
      },
      calculate: {
        totalDay: "",
        toDay: ""
      },
      filterData: {
        time: [],
        totalPage: 10,
        pageNo: 1,
        pageSize: 10, // 每页显示10条
      },
    };
  },
  computed: {
    getWidth() {
      return window.innerWidth;
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      request.post({
        url: "/admin/adPromotionData/salesCapacityList",
        params: {
          pageNo: this.filterData.pageNo,
          pageSize: this.filterData.pageSize,
          startTime: this.filterData.time != null ? this.filterData.time[0] : "",
          endTime: this.filterData.time != null ? this.filterData.time[1] : ""
        },
        success: (res) => {
          this.tableData = [];
          let totalPromotion = 0; // 推广总数
          let totalToday = 0; // 当天增加的总和

          // 处理新的数据结构并展开 dataList
          res.list.forEach((sales) => {
            sales.dataList.forEach((promotion) => {
              this.tableData.push({
                profitName: sales.profitName,
                adName: promotion.dataName,
                todayCount: promotion.todayCount,
                todayTotalCount: sales.todaySum,
                count: promotion.totalCount
              });
              // 累加总推广数
              totalPromotion += promotion.totalCount;
              // 累加当天增加数
              totalToday += parseInt(promotion.todayCount);
            });
          });

          // 计算总数
          this.calculate.totalDay = totalPromotion;
          this.calculate.toDay = totalToday;

          // 设置总记录数，供分页器使用
          this.totalRecords = res.total;

          this.loading = false;
        },
        catch: () => {
          this.loading = false;
        },
      });
    },






    handlePageChange(newPage) {
      this.filterData.pageNo = newPage;
      this.getList(); // 调用 API 获取对应页的数据
    },

    cellStyle() {
      return "border: 1px solid #167CF3; font-size: 15px";
    },

    headerCellClassName({ column }) {
      return "color: #fff; border: 1px solid #167CF3";
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || column.property === 'todayTotalCount') {
        const rowspan = this.getRowspan(row, rowIndex);
        return {
          rowspan,
          colspan: rowspan > 0 ? 1 : 0
        };
      }
    },

    getRowspan(row, index) {
      if (index === 0 || row.profitName !== this.tableData[index - 1].profitName) {
        let rowspan = 1;
        for (let i = index + 1; i < this.tableData.length; i++) {
          if (row.profitName === this.tableData[i].profitName) {
            rowspan++;
          } else {
            break;
          }
        }
        return rowspan;
      }
      return 0;
    },

    clearFilter() {
      this.filterData.time = [];
      this.searchFilter();
    },

    searchFilter() {
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.white-text {
  font-size: 400px;
  color: red;
}
.pagination{
  margin:20px 0;
}
</style>
