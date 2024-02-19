<!-- 推广数据管理 -->
<template>
	<div class="middle-container" v-loading="loading">
		<jat-fillter :option="filterOptions" v-model="filterData" @searchFilter="searchFilter"
			@clearFilter="clearFilter"></jat-fillter>
		<BasicTable :columns="table.columns" :headerOperates="headerOperates" :data="table.data"
			:pageSize="table.pageSize" :currentPage="table.currentPage" :total="table.total"
			@current-page-change="currentPageChange" @size-page-change="sizePageChange">
		</BasicTable>
	</div>
</template>

<script>
	import BasicTable from "@/components/BasicTable/index.vue";
	import request from "../../../../utils/request";
	import {
		getPromotionChannel
	} from "../data/const";
	export default {
		name: "adverstPage",
		components: {
			BasicTable
		},
		data() {
			return {
				loading: false,
				categoryOptions: [],

				filterOptions: {
					column: [{
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
							label: "推广员",
							value: "createAdId",
						},
						{
							type: "timeAll",
							label: ["添加开始时间", "添加结束时间"],
							value: "time",
						},
						{
							type: "timeAll",
							label: ["删除开始时间", "删除结束时间"],
							value: "rmTime",
						},
					],
				},

				filterData: {
					channelId: "",
					createAdId: "",
					time: [],
					rmTime: [],
				},
				table: {
					columns: [{
							id: 2,
							prop: "name",
							label: "推广员",
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
							id: 6,
							prop: "toDayCount",
							label: "今日增加",
						},
						{
							id: 7,
							prop: "removeCount",
							label: "今日删除",

						}
					],
					pageSize: 20,
					currentPage: 1,
					data: [],
					total: 0,
				},
				operates: [


				],
				headerOperates: [
          {
            key: "export",
            permission: "admin/adPromotionData/promoterStatisticsListExport",
            name: "导出",
            action: () => {
              this.handleExport();
            },
          },
				],
			};
		},
		created() {
			this.getList();
			getPromotionChannel((res) => {
				this.filterOptions.column[1].options = res;
			});
		},
		methods: {
      handleExport(){
        this.$confirm('确定导出推广员统计列表吗？导出的时候请等待页面下载自动开始，如果数据量大，可能会等待稍长时间，请不要关闭或者刷新页面', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.warning("请耐心等待，表格正在导出中......");
          const {
            time,
            rmTime,
            ...rest
          } = this.filterData
          request.post({
            url: "/admin/adPromotionData/promoterStatisticsListExport",
            params: {
              startTime: time && time.length > 1 ? time[0] : "",
              endTime: time && time.length > 1 ? time[1] : "",
              rmStartTime: rmTime && rmTime.length > 1 ? rmTime[0] : "",
              rmEndTime: rmTime && rmTime.length > 1 ? rmTime[1] : "",
              ...rest
            },
            success: (res) => {
              let downloadElement = document.createElement("a");
              downloadElement.href = "https://" + res;
              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              this.$message.success("导出成功");
              this.searchFilter();
            },
          });
        }).catch(() => {
          this.$message.info("已取消导出");
        });
      },
			searchFilter() {
				this.table.currentPage = 1;
				this.getList();
			},
			getList() {
				this.loading = true;
				const {
					time,
					rmTime,
					...rest
				} = this.filterData
				request.post({
					url: "/admin/adPromotionData/promoterStatisticsList",
					params: {
						pageNo: this.table.currentPage,
						pageSize: this.table.pageSize,
						startTime: time && time.length > 1 ? time[0] : "",
						endTime: time && time.length > 1 ? time[1] : "",
						rmStartTime: rmTime && rmTime.length > 1 ? rmTime[0] : "",
						rmEndTime: rmTime && rmTime.length > 1 ? rmTime[1] : "",
						...rest
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
			},
			handleSuccess() {
				this.getList();
			},

			clearFilter() {
				this.filterData = {
					channelId: "",
					createAdId: "",
					time: [],
					rmTime: [],
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
</style>
