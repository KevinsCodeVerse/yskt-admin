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
        <div style="margin-left: 20px">总增加:{{calculate.totalDay}}——当天增加：{{calculate.toDay}}</div>
      </div>
      <el-table
          v-loading="loading"
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          :cell-style="cellStyle"
          :header-cell-style="headerCellClassName"
          style="width: 100%; margin-top: 20px;"
          size="mini">


        <el-table-column
            prop="profitName"
            label="销售员"
            width="180">
        </el-table-column>
        <el-table-column
            prop="adName"
            width="150"
            label="推广员">
        </el-table-column>
        <el-table-column
            prop="todayCount"
            label="当天增加">
        </el-table-column>
        <el-table-column
            prop="count"
            label="总数量">
        </el-table-column>

        <el-table-column
            label="操作">
        </el-table-column>
      </el-table>
    </div>
    <!--    <div>-->
    <!--      <el-pagination-->
    <!--          @size-change="handleSizeChange"-->
    <!--          @current-change="handleCurrentChange"-->
    <!--          :current-page="params.pageNo"-->
    <!--          :page-sizes="[20,40, 50,100]"-->
    <!--          :page-size="params.pageSize"-->
    <!--          layout="total, sizes, prev, pager, next, jumper"-->
    <!--          :total="params.totalPage"-->
    <!--          @prev-click="searchFilter(1)"-->
    <!--          @next-click="searchFilter(2)">-->
    <!--      </el-pagination>-->
    <!--    </div>-->
  </div>
</template>
<script>
import request from "../../../../utils/request";


export default {
  name: "eatEua",
  components: {
    // BasicTable,
  },
  data() {
    return {
      params: {

      },
      totalData: "",
      loading: false,
      categoryOptions: [],
      tableData: [],
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
        pageSize: 10,
      },

    };
  },
  created() {
    this.getList()
  },
  methods: {
    changeFilter(){
      console.log("变化:",this.filterData)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    getList() {
      this.loading = true
      console.log(this.filterData)
      request.post({
        url: "/admin/adPromotionData/salesCapacityList",
        params: {
          pageNo: this.filterData.pageNo,
          pageSize: this.filterData.pageSize,
          startTime: this.filterData.time!=null?this.filterData.time[0]:"",
          endTime: this.filterData.time!=null?this.filterData.time[1]:""
        },
        success: (res) => {
          this.tableData = res;
          // this.tableData.sort((a, b) => b.todayCount - a.todayCount)
          this.calculate.totalDay = this.tableData.reduce((total, item) => total + item.count, 0);
          this.calculate.toDay = this.tableData.reduce((total, item) => total + item.todayCount, 0);
          // this.table.total = res.total;
          this.loading = false;
        },
        catch: () => {
          this.loading = false;
        },
      });

      this.tableData.sort((a, b) => {
        if (a.profitName < b.profitName) return -1;
        if (a.profitName > b.profitName) return 1;
        return 0;
      });
    },
    cellStyle() {
      return "border: 1px solid #167CF3;font-size: 15px";
    },
    headerCellClassName({column}) {
      return "color: #fff;border: 1px solid #167CF3";
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}) {

      if (columnIndex === 0) {
        const rowspan = this.getRowspan(row, rowIndex);
        const colspan = column.property === 'profitName' ? 1 : 0;
        return {
          rowspan,
          colspan
        };
      }
    },

    getRowspan(row, index) {
      if (index === 0 || row.profitName !== this.tableData[index - 1].profitName) {
        // 当前行profitName与上一行不同，需要合并
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

      console.log("清楚:",this.filterData)
     this.filterData.time=[]
      this.searchFilter();
    },
    searchFilter(type) {
      this.getList()
      console.log(this.filterData)
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
.white-text {
  font-size: 400px;
  color: red;
}
</style>
