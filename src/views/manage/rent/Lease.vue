<template>
	<div>
		<main-head>
		
		</main-head>

		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()">
					</el-date-picker>
				</el-form-item>
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="regionId" label="区域id" align="center">
				</el-table-column>
				<el-table-column prop="rentMenuId" label="租赁套餐id" align="center">
				</el-table-column>
				<el-table-column prop="rentUsId" label="租借用户id" align="center">
				</el-table-column>
				<el-table-column prop="nick" label="微信昵称" align="center">
				</el-table-column>
				<el-table-column prop="avatar" label="头像" align="center">
					<template slot-scope="scope">
						<el-image style="width: 100px; height: 100px; border-radius: 50%" :src="scope.row.avatar"
							:preview-src-list="scope.row.avatar.split(',')">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="rentMerchantId" label="租借后的商家id" align="center">
					<template slot-scope="scope">
						{{scope.row.rentMerchantId==undefined?"未签约":scope.row.rentMerchantId}}
					</template>
				</el-table-column>
				<el-table-column prop="day" label="剩余天数" align="center">
					<template slot-scope="scope">
						{{scope.row.day}}
					</template>
				</el-table-column>
				<el-table-column prop="payAmount" label="租金" align="center">
					<template slot-scope="scope">
						{{scope.row.payAmount}}元
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center">
					<template slot-scope="scope">
						{{scope.row.remark==null?"暂无":scope.row.remark}}
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span v-html="getStatus(scope.row.status)"></span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{
              $moment(scope.row.createTime).format("Y-MM-DD HH:mm")
            }}</span>
					</template>
				</el-table-column>				
			</el-table>
			<el-pagination class="page" background :layout="
          $store.state.isPhone
            ? 'total, prev, pager, next'
            : 'total, sizes, prev, pager, next, jumper'
        " :current-page.sync="params.pageNo" :page-size.sync="params.pageSize" :total="total" @size-change="search"
				@current-change="getList">
			</el-pagination>		

		</main-content>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//表单Label宽度
				regionList: [],
				labelWidth: "100px",
				addForm: {},
				updateForm: {},
				addDialog: false,
				updateDialog: false,
				date: "",
				list: [],
				load: false,
				params: {
					name: "",
					pageSize: 10,
					pageNo: 1,
					isCount: true,
					startTime: "",
					endTime: "",
					id: "",
				},
				total: 0,			
			};
		},

		mounted() {
			this.search();
			this.getRegionList()
		},

		methods: {
			addOrUpdate(type) {
				if (type == 2) {
					delete(this.updateForm.createTime)
					delete(this.updateForm.updateTime)
				}

				this.$refs[type == 1 ? "addForm" : "updateForm"].validate((valid) => {
					if (!valid) {
						return
					}
					this.$request.post({
						url: "merchant/merchantPlotRentalMenu/addOrUpdate",
						params: type == 1 ? this.addForm : this.updateForm,
						success: (result) => {
							this.$message.success(result);
							this.addDialog = false;
							this.updateDialog = false;
							this.search();
						},
					});
				})
			},
			search() {
				this.params.pageNo = 1;
				this.params.isCount = true;
				this.getList();
			},

			getRegionList() {
				this.$request.post({
					url: "merchant/merchantPlotRegion/regionListNoPage",
					success: (result) => {
						this.regionList = result
					},
				});
			},
			getList() {
				this.load = true;
				this.$request.post({
					url: "merchant/merchantPlotRent/leaseList",
					params: this.params,
					success: (result) => {
						if (this.params.isCount) {
							this.total = result.total;
						}
						this.params.isCount = false;
						this.list = result.list;
					},
					finally: () => {
						this.load = false;
					},
				});
			},

			//时间改变
			dateSearch() {
				if (this.date != null) {
					this.params.startTime = this.$moment(this.date[0]).format(
						"Y-MM-DD " + "23:59:59"
					);
					this.params.endTime = this.$moment(this.date[1]).format(
						"Y-MM-DD " + "23:59:59"
					);
				} else {
					this.params.startTime = ""
					this.params.endTime = ""
				}
				this.search();
			},
			deleteItem(id) {
				this.$confirm('此操作将永久删除该套餐, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
					center: true
				}).then(() => {
					this.$request.post({
						url: "merchant/merchantPlotRentalMenu/delete",
						params: {
							id
						},
						success: (result) => {
							this.$message.success(result);
							this.search();
						},
					});
				}).catch(() => {

				});
			},
			cleanDialog() {
				this.addForm = {};
				this.updateForm = {};
			},
			openAddDialog(row) {
				this.cleanDialog();
				this.addDialog = true;
			},
			openUpdateDialog(row) {
				this.cleanDialog();
				this.updateDialog = true;
				//浅拷贝				
				this.updateForm = JSON.parse(JSON.stringify(row));
			},
			getStatus(status) {
				switch (status) {
					case 0:
						return "<span style='color: #7a7a7a'>未生效</span>";
					case 1:
						return "<span style='color: #76c379'>已生效</span>";
					case -1:
						return "<span style='color: red'>已过期退回</span>";
				}
			}
		},
	};
</script>

<style>
</style>

<style scoped>
	.page {
		text-align: right;
		margin-top: 20px;
	}

	.iconfont {
		font-size: 10px;
		margin-right: 3px;
	}
</style>
