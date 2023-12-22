<template>
	<div id="authority_role">
		<main-head>
			<el-button slot="after" @click="openAddForm" plain type="primary" size="medium" icon="el-icon-plus">添加角色
			</el-button>
		</main-head>

		<main-content>
			<!-- 筛选 -->
			<el-form :inline="true" class="demo-form-inline" size="medium" :disabled="load">
			</el-form>
			<!-- 表格 -->
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="role" label="角色名称" width="120" align="center"></el-table-column>
				<el-table-column prop="remark" label="角色描述" align="center"></el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{$moment(scope.row.createTime).format('Y-MM-DD HH:mm')}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="310" class-name="operation">
					<template slot-scope="scope">
						<div v-if="scope.row.id != 1">
							<el-button type="success" plain size="small" v-hasPer="'ad/role/setRoleMenu'"
								@click="getMenuData(scope.row.id)">分配菜单</el-button>
							<el-button type="primary" plain size="small" @click="setRoleForm(scope.row)">修改</el-button>
							<el-button type="danger" plain size="small"
								@click="del(scope.row.id, scope.row.accountNum)">删除</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background
				:layout="$store.state.isPhone?'total, prev, pager, next':'total, sizes, prev, pager, next, jumper'"
				:current-page.sync="params.pageNo" :page-size.sync="params.pageSize" :total="total"
				@size-change="search" @current-change="getList" class="page">
			</el-pagination>
		</main-content>

		<!-- 添加角色弹框 -->
		<el-dialog center title="添加角色" :visible.sync="addVisible" :close-on-click-modal="false" width="500px">
			<el-form ref="form" :model="roleForm" label-width="80px" :rules="rules">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="remark">
					<el-input v-model="roleForm.remark" placeholder="可在此处填写备注"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addVisible = false">取 消</el-button>
				<el-button type="primary" @click="add">添 加</el-button>
			</span>
		</el-dialog>

		<!-- 修改角色弹框 -->
		<el-dialog center title="修改角色" :visible.sync="updateVisible" :close-on-click-modal="false" width="500px">
			<el-form ref="form" :model="roleForm" label-width="80px" :rules="rules">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="remark">
					<el-input v-model="roleForm.remark" placeholder="可在此处填写备注"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="updateVisible = false">取 消</el-button>
				<el-button type="primary" @click="update">修 改</el-button>
			</span>
		</el-dialog>

		<el-dialog title="分配菜单" :visible.sync="menuVisible" width="600px" center @close="closeDialog">
			<span slot="footer" class="dialog-footer">
				<el-tree :data="menuData" show-checkbox node-key="id" ref="menu" highlight-current>
				</el-tree>
				<el-button @click="menuVisible = false">取 消</el-button>
				<el-button type="primary" @click="setMenuData">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				total: 0,
				load: false,
				// 请求参数
				params: {
					pageSize: 10,
					pageNo: 1,
					status: '',
					type: 1
				},
				// 添加窗口
				addVisible: false,
				// 修改窗口
				updateVisible: false,
				// 菜单窗口
				menuVisible: false,
				// 角色表单信息
				roleForm: {
					id: '',
					name: '',
					remark: '',
					type: 1
				},
				rules: {
					name: {
						message: '请输入角色名称',
						required: true,
						tagger: 'blur'
					},
					remark: {
						message: '请输入角色描述',
						required: true,
						tagger: 'blur'
					}
				},
				// 菜单数据
				menuData: [],
				// 分配菜单时用到的角色id
				roleId: '',
			};
		},

		mounted() {
			this.search()
			this.getTreeData()
		},

		methods: {
			search() {
				this.params.pageNo = 1
				this.getList()
			},

			// 获取角色列表
			getList() {
				this.load = true
				this.$request.post({
					url: 'admin/adRolePermissions/list',
					params: this.params,
					success: result => {
						this.list = result.list
						this.total = result.total
					},
					finally: () => {
						this.load = false
					}
				})
			},

			// 添加
			add() {
				if (this.load) {
					return;
				}
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.load = true;
						this.addVisible = false
						this.$request.post({
							url: 'admin/adRolePermissions/add',
							params: this.roleForm,
							success: result => {
								this.$message.success('添加成功')
								this.search()
							},
							finally: () => {
								this.load = false
							}
						})
					}
				})
			},

			// 打开添加窗口
			openAddForm() {
				this.reset()
				this.addVisible = true
			},

			// 设置角色表单信息
			setRoleForm(roleInfo) {
				this.roleForm = {
					name: roleInfo.name,
					remark: roleInfo.remark,
					id: roleInfo.id
				}
				this.updateVisible = true
			},

			// 重置角色表单信息
			reset() {
				this.roleForm.id = ''
				this.roleForm.name = ''
				this.roleForm.remark = ''
				this.roleForm.type=1
			},

			beforeClose(done) {
				this.reset()
				// done()
			},

			// 修改
			update() {
				this.roleForm.type=1
				if (this.load) {
					return;
				}
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.updateVisible = false
						this.load = true
						this.$request.post({
							url: 'admin/adRolePermissions/update',
							params: this.roleForm,
							success: result => {
								this.$message.success('修改成功')
								this.getList()
							},
							finally: () => {
								this.load = false
							}
						})
					}
				})
				
			},

			// 删除
			del(id, accountNum) {
				let type =1
				if (this.load) {
					return;
				}
				var message = '';
				this.$confirm(message, '这会删除这个角色下的所有账号和这个角色，确定要这么做吗？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					align: 'center',
					type: 'warning'
				}).then(() => {
					this.load = true
					this.$request.post({
						url: 'admin/adRolePermissions/delete',
						params: {
							id,type
						},
						success: result => {
							this.$message.success('删除成功')
							if (this.params.pageNo > 1 && this.list.length < 2) {
								this.params.pageNo--
							}
							this.getList()
						},
						finally: () => {
							this.load = false
						}
					})
				})
			},

			// 冻结
			freeze(id) {
				if (this.load) {
					return;
				}
				this.$confirm('是否冻结该角色?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.load = true
					this.$request.post({
						url: 'admin/adRole/freezeOrThaw',
						params: {
							id,
							status: -1
						},
						success: result => {
							this.$message.success('冻结成功')
							this.getList()
						},
						finally: () => {
							this.load = false
						}
					})
				})
			},

			// 解冻
			thaw(id) {
				if (this.load) {
					return;
				}
				this.$confirm('是否解冻该角色?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.load = true
					this.$request.post({
						url: 'admin/adRole/freezeOrThaw',
						params: {
							id,
							status: 1
						},
						success: result => {
							this.$message.success('解冻成功')
							this.getList()
						},
						finally: () => {
							this.load = false
						}
					})
				})
			},

			// 获取菜单
			getTreeData() {
				this.$request.post({
					url: "admin/adMenu/allList",
					success: res => {
						this.menuData = res
						var menuMap = {};

						// 获取根节点数据
						let data = res.filter(value => value.parentId == -1)
						let parents = [];
						data.forEach(item => {
							if (item.menuName != '权限管理') {
								parents.push({
									id: item.id,
									label: item.menuName,
									level: item.level,
								})
							}
						})

						// 获取子节点数据
						let childrens = res.filter(value => value.parentId !== -1)

						// 生成树
						this.menuData = this.$common.translator(parents, childrens, current => {
							// 定义树结构
							return {
								id: current.id,
								label: current.menuName + (current.flag == 2 ? '  (接口)' : ''),
								children: current.children,
								disabled: parent.id == 24 || parent.id == 25 || parent.id == 26
							}
						})

					}
				});
			},

			// 获取该角色的菜单数据
			getMenuData(id) {
				this.menuVisible = true;
				this.roleId = id;
				this.$request.post({
					url: "admin/adRolePermissions/getRoleMenuId",
					params: {
						roleId: id
					},
					success: result => {
						this.$refs.menu.setCheckedKeys(result);
					}
				});
			},

			// 分配菜单
			setMenuData() {
				let arr = this.$refs.menu.getCheckedNodes(false, true);
				if (arr.length < 1) {
					this.$message.success("请选择需要分配权限的菜单")
					return
				}
				var menuIds = []
				arr.forEach(item => {
					menuIds.push(item.id)
				})
				this.$request.post({
					url: "admin/adRolePermissions//setRoleMenu",
					type: "array",
					params: {
						roleId: this.roleId,
						menuIds
					},
					success: res => {
						this.$message.success("设置成功");
					}
				});
				this.menuVisible = false;
			},



			// 关闭菜单窗口回调
			closeDialog() {
				this.$refs.menu.setCheckedKeys([]);
			},

		}

	}
</script>

<style>

</style>

<style scoped>
</style>
