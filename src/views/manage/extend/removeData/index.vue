<!-- 推广数据管理 -->
<template>
	<div class="middle-container" v-loading="loading">
		<jat-fillter :option="filterOptions" v-model="filterData" @searchFilter="searchFilter"
			@clearFilter="clearFilter"></jat-fillter>
		<BasicTable :columns="table.columns" :headerOperates="headerOperates" :operates="operates" :data="table.data"
			:pageSize="table.pageSize" :currentPage="table.currentPage" :total="table.total"
			@current-page-change="currentPageChange" @size-page-change="sizePageChange">
			<div slot="image" slot-scope="scope">
				<el-image v-if="scope.row.image" style="width: 50px" :src="scope.row.image"
					:preview-src-list="[scope.row.image]">
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
	import {
		degreeOptions,
		genderOptions,
		getPromotionChannel
	} from "./const";
	export default {
		name: "adverstPage",
		components: {
			BasicTable,
			addDialog
		},
		data() {
			return {
				loading: false,
				categoryOptions: [],

				filterOptions: {
					column: [{
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
					search: "",
					channelId: "",
					promoterId: "",
					createAdId: "",
					time: [],
					rmTime: [],
				},
				table: {
					columns: [{
							id: 2,
							prop: "name",
							label: "姓名",
						},
						{
							id: 3,
							prop: "channelName",
							label: "推广渠道",
						},
						{
							id: 4,
							prop: "promoterName",
							label: "销售员",
						},
						{
							id: 10,
							prop: "createAdName",
							label: "推广员",
						},
						{
							id: 5,
							prop: "qq",
							label: "QQ",
						},
						{
							id: 6,
							prop: "wechat",
							label: "微信",
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
						},
						{
							id: 8,
							prop: "phone",
							label: "电话号码",
						},
						{
							id: 10,
							prop: "degree",
							label: "学历",
							render: (row) => {
								if (!row.degree) {
									return "未填写"
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
						},
						{
							id: 13,
							prop: "deleteTime",
							label: "删除时间",
							type: "date",
						},
						{
							id: 12,
							prop: "createTime",
							label: "添加时间",
							type: "date",
						},
					],
					pageSize: 20,
					currentPage: 1,
					data: [],
					total: 0,
				},
				operates: [{
					key: "restoreData",
					title: "恢复数据",
					permission: "admin/adPromotionData/restoreData",
					btnStyle: "yellow",
					action: (o, row) => {
						this.restoreData(row.id)
					},
				}, ],
				headerOperates: [{
					key: "export",
					permission: "admin/adPromotionData/deleteListExport",
					name: "导出",
					action: () => {
						this.handleExport();
					},
				}, ],
			};
		},
		created() {
			this.getList();
			getPromotionChannel((res) => {
				console.log(res);
				this.filterOptions.column[1].options = res;
			});
		},
		methods: {
			restoreData(e) {
				this.$confirm('确定恢复该数据吗', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log("id:", e);
					request.post({
						url: "/admin/adPromotionData/restoreData",
						params: {
							id: e
						},
						success: (res) => {
							this.$message.success("恢复成功");
							this.getList()
						},
					});
				}).catch(() => {

				});
			},
			handleExport() {
				this.$confirm('确定导出删除的数据列表吗？导出的时候请等待页面下载自动开始，如果数据量大，可能会等待稍长时间，请不要关闭或者刷新页面', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message.warning("请耐心等待，表格正在导出中......");
					const {
						time,
						rmTime,
						...rest
					} = this.filterData;
					request.post({
						url: "/admin/adPromotionData/deleteListExport",
						params: {
							startTime: time && time.length > 1 ? time[0] : "",
							endTime: time && time.length > 1 ? time[1] : "",
							rmStartTime: rmTime && rmTime.length > 1 ? rmTime[0] : "",
							rmEndTime: rmTime && rmTime.length > 1 ? rmTime[1] : "",
							...rest,
						},
						success: (res) => {
							let downloadElement = document.createElement("a");
							downloadElement.href = "http://" + res;
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
				} = this.filterData;
				request.post({
					url: "/admin/adPromotionData/deleteList",
					params: {
						pageNo: this.table.currentPage,
						pageSize: this.table.pageSize,
						startTime: time && time.length > 1 ? time[0] : "",
						endTime: time && time.length > 1 ? time[1] : "",
						rmStartTime: rmTime && rmTime.length > 1 ? rmTime[0] : "",
						rmEndTime: rmTime && rmTime.length > 1 ? rmTime[1] : "",
						...rest,
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
					search: "",
					channelId: "",
					promoterId: "",
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
