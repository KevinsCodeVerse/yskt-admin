<template>
	<div>
		<main-head>
			<el-button slot="after" @click="openAddDialog()" type="primary" size="medium" icon="el-icon-plus">添加租赁套餐
			</el-button>
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
				<el-table-column prop="regionName" label="区域名称" align="center">
				</el-table-column>
				<el-table-column prop="day" label="租赁天数" align="center">
					<template slot-scope="scope">
						{{scope.row.day}}
					</template>
				</el-table-column>
				<el-table-column prop="price" label="租赁金额" align="center">
					<template slot-scope="scope">
						{{scope.row.price}}元
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注描述" align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.status == 0 ? "正常" : "已冻结" }}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{
              $moment(scope.row.createTime).format("Y-MM-DD HH:mm")
            }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" >
					<template slot-scope="scope">					
						<el-button type="warning" size="mini" @click="openUpdateDialog(scope.row)">修改</el-button>
						<el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
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

			<!-- 添加dialog -->
			<el-dialog title="添加租赁套餐" :visible.sync="addDialog" width="30%" :close-on-click-modal="false">
				<el-form :model="addForm" label-width="125px" :rules="rule" ref="addForm">
					<el-form-item label="对应的区域：" prop="regionId">
						<el-select v-model="addForm.regionId" placeholder="当前套餐所对应的区域" clearable>
							<el-option v-for="item in regionList" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="套餐名称：" prop="describe">
						<el-input placeholder="请输入租赁套餐名称,如'月度' '季度'" v-model="addForm.describe" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="套餐有效天数：" prop="day" >
						<el-input-number placeholder="10天起租" v-model="addForm.day" :min="10" clearable>
						</el-input-number>
					</el-form-item>
					<el-form-item label="套餐租金：" prop="price" >
						<el-input-number placeholder="价格" v-model="addForm.price" :min="0.00" :precision="2" clearable>
						</el-input-number>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input placeholder="可添加套餐描述" v-model="addForm.remark" clearable>
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="addOrUpdate(1)">添加</el-button>
					<el-button type="warning" @click="addDialog=false">关闭</el-button>
				</div>
			</el-dialog>

			<!-- 修改dialog -->
			<el-dialog title="修改套餐" :visible.sync="updateDialog" width="30%" :close-on-click-modal="false">
				<el-form :model="updateForm" label-width="125px" :rules="rule" ref="updateForm">
					<el-form-item label="对应的区域：" prop="regionId">
						<el-select v-model="updateForm.regionId" placeholder="当前套餐所对应的区域" clearable>
							<el-option v-for="item in regionList" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="套餐名称：" prop="describe">
						<el-input placeholder="请输入租赁套餐名称,如'月度' '季度'" v-model="updateForm.describe" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="套餐有效天数：" prop="day" >
						<el-input-number placeholder="10天起租" v-model="updateForm.day" :min="10" clearable>
						</el-input-number>
					</el-form-item>
					<el-form-item label="套餐租金：" prop="price" >
						<el-input-number placeholder="价格" v-model="updateForm.price" :min="0.00" :precision="2" clearable>
						</el-input-number>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input placeholder="可添加套餐描述" v-model="updateForm.remark" clearable>
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="addOrUpdate(2)">保存</el-button>
					<el-button type="warning" @click="updateDialog=false">关闭</el-button>
				</div>
			</el-dialog>

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
				rule: {
					price: [{
						message: "请输入租金金额",
						required: true,
					}],
					describe: [{
						message: "请输入套餐描述",
						required: true,
					}],
					day: [{
						message: "请输入可租天数，10天起步",
						required: true,
					}],
				}
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
				
				this.$refs[type==1?"addForm":"updateForm"].validate((valid) => {
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
					url: "merchant/merchantPlotRentalMenu/list",
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
