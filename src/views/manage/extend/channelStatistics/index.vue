<!-- 推广数据管理 -->
<template>
  <div class="middle-container" v-loading="loading">
    <jat-fillter
      :option="filterOptions"
      v-model="filterData"
      @searchFilter="searchFilter"
      @clearFilter="clearFilter"
    ></jat-fillter>
    <BasicTable
      :columns="table.columns"
      :headerOperates="headerOperates"
      :data="table.data"
      :pageSize="table.pageSize"
      :currentPage="table.currentPage"
      :total="table.total"
      @current-page-change="currentPageChange"
      @size-page-change="sizePageChange"
    >
    </BasicTable>
  </div>
</template>

<script>
import BasicTable from "@/components/BasicTable/index.vue";
import request from "../../../../utils/request";
// import {  getPromotionChannel } from "../data/const";
export default {
  name: "channelStatistics",
  components: { BasicTable },
  data() {
    return {
      loading: false,
      categoryOptions: [],

      filterOptions: {
        column: [
          {
            type: "timeAll",
            label: ["开始时间", "结束时间"],
            value: "time",
          },
        ],
      },

      filterData: {
        time: [],
      },
      table: {
        columns: [
          {
            id: 2,
            prop: "name",
            label: "推广渠道",
          },
          {
            id: 6,
            prop: "toDayCount",
            label: "今日增加",
          },
          {
            id: 3,
            prop: "totalDataCount",
            label: "总数据",
          },
          {
            id: 4,
            prop: "totalAddCount",
            label: "总增加",
          },
          {
            id: 5,
            prop: "totalRemoveCount",
            label: "总删除",
          },

          {
            id: 7,
            prop: "removeCount",
            label: "今日删除",
          },
        ],
        pageSize: 20,
        currentPage: 1,
        data: [],
        total: 0,
      },
      operates: [],
      headerOperates: [],
    };
  },
  created() {
    this.getList();
    // getPromotionChannel((res) => {
    //   this.filterOptions.column[1].options = res;
    // });
  },
  methods: {
    searchFilter() {
      this.table.currentPage = 1;
      this.getList();
    },
    getList() {
      this.loading = true;
      const { time, ...rest } = this.filterData;
      request.post({
        url: "/admin/adPromotionData/promotionChannelStatisticsList",
        params: {
          pageNo: this.table.currentPage,
          pageSize: this.table.pageSize,
          startTime: time && time.length > 1 ? time[0] : "",
          endTime: time && time.length > 1 ? time[1] : "",
          ...rest,
        },
        success: (res) => {
          this.table.data = res.slice(
            (this.table.currentPage - 1) * this.table.pageSize,
            (this.table.currentPage - 1) * this.table.pageSize +
              this.table.pageSize
          );
          this.table.total = res.length;
          this.loading = false;
        },
        catch: () => {
          this.loading = false;
        },
        finally: () => {
          this.loading = false;
        },
      });
    },
    handleSuccess() {
      this.getList();
    },

    clearFilter() {
      this.filterData = {
        time: [],
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
<style lang="scss" scoped></style>
