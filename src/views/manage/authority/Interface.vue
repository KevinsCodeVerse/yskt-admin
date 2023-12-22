<template>
	<div id="finance_profit">
		<main-head>
			<span slot="after">
				<el-button plain size="medium" @click="openAddForm" type="primary" icon="el-icon-plus">添加接口权限
				</el-button>
			</span>
		</main-head>
		<main-content>
			<el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
				<el-form-item>
					<el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="search">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="permissions" label="接口权限名" align="center">
				</el-table-column>
				<el-table-column prop="remark" label="备注" align="center"></el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{ $moment(scope.row.createTime).format('Y-MM-DD HH:mm') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button plain size="mini" @click="openUpdateForm(scope.row)" type=success>修改权限
						</el-button>
						<el-button plain size="mini" @click="deletePre(scope.row.id)" type=danger>删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination class="page" background
				:layout="$store.state.isPhone?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
				:page-size.sync="params.pageSize" :current-page.sync="params.pageNo" :total="total"
				@size-change="search" @current-change="getList">
			</el-pagination>
			<!-- 添加账号弹框 -->
			<el-dialog center title="添加权限" :visible.sync="addVisible" :close-on-click-modal="false" width="420px">
				<el-form ref="form" :model="addForm" label-width="100px" :rules="rules" label-position="left">
					<el-form-item label="接口权限" prop="name">
						<el-input v-model="addForm.name" placeholder="请输入权限全称(全英)" maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="addForm.remark" placeholder="可在此处填写备注"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="add">添 加</el-button>
				</span>
			</el-dialog>
			<!-- 修改账号弹框 -->
			<el-dialog center title="修改权限" :visible.sync="updateVisible" :close-on-click-modal="false" width="420px">
				<el-form ref="form" :model="updateForm" label-width="100px" :rules="rules" label-position="left">
					<el-form-item label="接口权限" prop="name">
						<el-input v-model="updateForm.name" placeholder="请输入权限全称(全英)" maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input v-model="updateForm.remark" placeholder="可在此处填写备注"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="updateVisible = false">取 消</el-button>
					<el-button type="primary" @click="update">修 改</el-button>
				</span>
			</el-dialog>
		</main-content>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				updateForm: {
					name: "",
					remark: ""
				},
				addForm: {},
				updateVisible: false,
				addVisible: false,
				list: [],
				params: {
					startTime: '',
					endTime: '',
					pageSize: 10,
					pageNo: 1,
					type: 2
				},
				total: 0,
				load: false,
				date: [],
				rules: {
					name: {
						message: '请输入权限名称',
						required: true
					},
				}
			};
		},

		created() {
			this.search()
		},

		methods: {
			openAddForm() {
				this.addForm = {
						type: 2
					},
					this.addVisible = true
			},
			update() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.$request.post({
							url: 'admin/adRolePermissions/update',
							params: this.updateForm,
							success: result => {
								this.$message.success(result);
								this.updateVisible = false
								this.updateForm = {
									name: "",
									remark: ""
								}
								this.getList()
							},
						})
					}
				})
			},
			openUpdateForm(row) {
				this.updateVisible = true
				this.updateForm.id = row.id
				this.updateForm.name = row.permissions;
				this.updateForm.remark = row.remark;
				this.updateForm.type = 2
			},
			add() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.$request.post({
							url: 'admin/adRolePermissions/add',
							params: this.addForm,
							success: result => {
								this.$message.success(result);
								this.addVisible = false
								this.getList()
							},
						})
					}
				})
			},
			deletePre(id) {
				this.$confirm('是否删除该接口？这会更新所有拥有该接口用户的权限', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {				
					this.$request.post({
						url: 'admin/adRolePermissions/delete',
						params: {
							id,
							type: 2
						},
						success: result => {
							this.$message.success('删除成功')
							this.getList()
						},					
					})
				})
			},
			// 获取列表
			getList() {
				if (this.load) {
					return;
				}
				if (this.date && this.date.length) {
					this.params.startTime = this.$moment(this.date[0]).format('Y-MM-DD HH:mm:ss')
					this.params.endTime = this.$moment(this.date[1]).format('Y-MM-DD HH:mm:ss')
				} else {
					this.date = [];
					this.params.startTime = ''
					this.params.endTime = ''
				}
				this.load = true
				this.$request.post({
					url: 'admin/adRolePermissions/list',
					params: this.params,
					success: result => {
						this.list = result.list
						if (this.params.isCount) {
							this.total = result.total
						}
					},
					finally: () => {
						this.load = false
					}
				})
			},

			search() {
				this.params.isCount = true
				this.params.pageNo = 1
				this.getList()
			}
		}
	}
</script>

<style>
</style>
