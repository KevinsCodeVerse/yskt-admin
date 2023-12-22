<template>
	<div id="sys_params">
		<main-head>
			<el-button slot="after" @click="openAddDialog()" type="primary" size="medium" icon="el-icon-plus">添加区域
			</el-button>
		</main-head>

		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.plotId" placeholder="请输入土地id" clearable></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.plotName" placeholder="输入土地名称模糊搜索" clearable></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.name" placeholder="输入区域名称模糊搜索" clearable></el-input>
				</el-form-item>
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="区域id" align="center"></el-table-column>
				<el-table-column prop="plotId" label="土地id" align="center">
				</el-table-column>
				<el-table-column prop="plotName" label="土地名称" align="center">
				</el-table-column>
				<el-table-column prop="name" label="区域名称" align="center">
				</el-table-column>
				<el-table-column prop="lon" label="总长" align="center">
					<template slot-scope="scope">
						{{scope.row.lon}}米
					</template>
				</el-table-column>
				<el-table-column prop="wide" label="总宽" align="center">
					<template slot-scope="scope">
						{{scope.row.wide}}米
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.status == 0 ? "正常" : "出租中" }}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{
              $moment(scope.row.createTime).format("Y-MM-DD HH:mm")
            }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="500">
					<template slot-scope="scope">
						<el-button type="danger" size="small"
							@click="update(scope.row.id)" v-if="scope.row.status==0">出租该区域</el-button>
							<el-button type="infor" size="small"
								@click="update(scope.row.id)" v-if="scope.row.status==1">取消出租</el-button>
						<el-button type="success" size="small"
							@click="$router.push('/plot/detail?id='+scope.row.plotId)">查看所属的土地</el-button>
						<el-button type="warning" size="small"
							@click="openUpdateDialog(scope.row)">修改区域信息</el-button>
						<el-button type="info" size="small"
							@click="deleteItem(scope.row.id)">删除</el-button>
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
			<el-dialog title="添加区域" :visible.sync="addDialog" width="30%" :close-on-click-modal="false">
				<el-form :model="addForm" :label-width="labelWidth" :rules="rule" ref="form">
					<el-form-item label="长：单位/m" prop="lon">
						<el-input-number placeholder="区域长度" v-model="addForm.lon" clearable :min="0.00" :precision="2">
						</el-input-number>
					</el-form-item>
					<el-form-item label="宽：单位/m" prop="wide">
						<el-input-number placeholder="区域宽度" v-model="addForm.wide" clearable :min="0.00" :precision="2">
						</el-input-number>
					</el-form-item>
					<el-form-item label="区域名称：" prop="name">
						<el-input placeholder="请输入区域名称" v-model="addForm.name" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input placeholder="备注" v-model="addForm.remark" clearable>
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="addOrUpdate(1)">添加</el-button>
					<el-button type="warning" @click="addDialog=false">关闭</el-button>
				</div>
			</el-dialog>

			<!-- 修改dialog -->
			<el-dialog title="添加区域" :visible.sync="updateDialog" width="30%" :close-on-click-modal="false">
				<el-form :model="updateForm" :label-width="labelWidth" :rules="rule" ref="form">
					<el-form-item label="长：单位/m" prop="lon">
						<el-input-number placeholder="请输入区域长度" v-model="updateForm.lon" clearable :min="0.00"
							:precision="2">
						</el-input-number>
					</el-form-item>
					<el-form-item label="宽：单位/m" prop="wide">
						<el-input-number placeholder="请输入区域宽度" v-model="updateForm.wide" clearable :min="0.00" :precision="2">
						</el-input-number>
					</el-form-item>
					<el-form-item label="区域名称：" prop="name">
						<el-input placeholder="请输入区域名称" v-model="updateForm.name" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input placeholder="备注" v-model="updateForm.remark" clearable>
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
	let checkOptions = [];
	export default {
		data() {
			return {
				//表单Label宽度
				labelWidth: "100px",
				form: {},
				dialog: false,
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
				addDialog: false,
				updateDialog: false,
				addForm: {},
				updateForm: {},
				rule: {
					lon: [{
						message: "请输入区域长度",
						required: true,
					}],
					wide: [{
						message: "请输入区域宽度",
						required: true,
					}],
					name: [{
						message: "请输入区域名称",
						required: true,
					}],
				}
			};
		},

		mounted() {
			this.search();
		},

		methods: {
			deleteItem(id) {
				this.$confirm('此操作将删除该区域，如果有出租或该区域有产品则会删除失败, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
					center: true
				}).then(() => {
					this.$request.post({
						url: "merchant/merchantPlotRegion/delete",
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
			addOrUpdate(type) {
				if (type == 2) {
					delete(this.updateForm.createTime)
					delete(this.updateForm.updateTime)
				}
				this.$refs["form"].validate((valid) => {
					if (!valid) {
						return
					}
					this.$request.post({
						url: "merchant/merchantPlotRegion/addOrUpdate",
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

			getList() {
				this.load = true;
				this.$request.post({
					url: "merchant/merchantPlotRegion/regionList",
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
			//修改状态
			update(id) {
				this.$request.post({
					url: "merchant/merchantPlotRegion/updateStatus",
					params: {
						id
					},
					success: (result) => {
						this.$message.success(result);
						this.search();
					},
				});
			},
			cleanDialog() {
				this.addForm = {};
				this.updateForm = {};
			},
			openAddDialog() {
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
