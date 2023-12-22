<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>合伙人信息
			<span slot="after" @click="$router.go(-1)" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回上一页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
		</main-head>

		<div v-if="show">
			<el-empty description="已经不见了哦~"></el-empty>
		</div>
		<div v-else>		
			<el-card style="margin-top: 20px;" shadow="hover">
				<span style="font-size: 18px;font-weight: 900;">合伙人信息</span>
				<br />
				<el-row>
					<div v-for="(item,index) in form.son">
						<el-col :span="12">
							<el-descriptions :column="1" title="" border style="margin: 10px;">
								<el-descriptions-item label="微信昵称" content-class-name="my-content"
									label-class-name="my-label">
									{{item.nick}}
								</el-descriptions-item>
								<el-descriptions-item label="微信头像" content-class-name="my-content"
									label-class-name="my-label">
									<el-image style="width: 100px; height: 100px; border-radius: 50%"
										:src="item.avatar">
									</el-image>
								</el-descriptions-item>
								<el-descriptions-item label="真实姓名" content-class-name="my-content"
									label-class-name="my-label">
									{{item.name}}
								</el-descriptions-item>
								<el-descriptions-item label="手机号" content-class-name="my-content"
									label-class-name="my-label">
									{{item.phone}}
								</el-descriptions-item>
								<el-descriptions-item label="收益占比(百分比)" content-class-name="my-content"
									label-class-name="my-label">
									{{item.shares*100}}%
								</el-descriptions-item>
								<el-descriptions-item label="权限操作" content-class-name="my-content"
									label-class-name="my-label">
									<el-button type="danger" size="mini"  @click="getMenuData(item.roleId)">
										<i class="iconfont iconlianxi2hebing-19"></i>分配菜单
									</el-button>
									<el-button type="success" size="mini" @click="setPer(item.id)">
										<i class="iconfont iconlianxi2hebing-19"></i>分配接口权限
									</el-button>
									
								</el-descriptions-item>
							</el-descriptions>

							<br />
							<el-divider></el-divider>
						</el-col>
					</div>
				</el-row>
			</el-card>
		</div>
	
		
		<!-- 菜单弹框 -->
		<el-dialog title="分配菜单" :visible.sync="menuVisible" width="600px" center @close="closeDialog">
			<span slot="footer" class="dialog-footer">
				<el-tree :data="menuData" show-checkbox node-key="id" ref="menu" highlight-current>
				</el-tree>
				<el-button @click="menuVisible = false">取 消</el-button>
				<el-button type="primary" @click="setMenuData">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 接口弹框 -->
		<el-dialog center title="分配接口权限" :visible.sync="checkShow" :close-on-click-modal="false" width="500px">
			<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
			</el-checkbox>
			<el-checkbox-group v-model="checked">
				<el-checkbox v-for="check in checks" :label="check.permissions" :key="check.id">{{check.permissions}}
				</el-checkbox>
			</el-checkbox-group>
			<span slot="footer" class="dialog-footer">
				<el-button @click="checkShow = false">取 消</el-button>
				<el-button type="primary" @click="sumbitPer">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import editor from '@/components/utils/CustomWangEditor';
let checkOptions = [];
	export default {
		components: {
			editor
		},
		data() {
			return {
				isIndeterminate: true,
				checkShow:false,
				checkAll: false,
				//选中的选框,跟label关联
				checked: [],
				checks: checkOptions,
				// 菜单窗口				
				menuVisible: false,
				// 菜单数据
				menuData: [],
				dialog: false,
				show: false,
				id: "",
				form: {},
				auditForm: {
					id: "",
					status: "",
					refuseReason: ""
				},
				rule: {
					refuseReason: {
						message: "请输入拒绝原因",
						required: true
					},
				}
			};
		},

		mounted() {
			this.getInfo()
			this.getTreeData()
		},

		methods: {	
			sumbitPer() {
				let id=this.id
				let rolePerId=JSON.stringify(this.checked)
				this.$request.post({
					url: 'merchant/merchantRolePermissions/setPer',
					params: {
						id,
						rolePerId
					},
					success: result => {
						this.getPer()
						this.checkShow = false
						this.$message.success(result)
					},
				})
			},
			setPer(id) {
				this.getPer(id)
				this.checkShow = true;
			},
			//全选与反全选
			handleCheckAllChange(val) {
				console.log(val)
				if (val) {
					let a = []
					checkOptions.forEach(function(item, index) {
						a.push(item.permissions)
					})
					this.checked = a
				} else {
					this.checked = [];
				}
				this.isIndeterminate = false;
			},
			switchType(type) {
				switch (type) {
					case 0:
						return "采摘"
					case 1:
						return "种植"
					case 2:
						return "采摘和种植"
				}
			},
			//获取权限
			getPer(id) {
				this.id=id
				this.$request.post({
					url: 'merchant/merchantRolePermissions/listNoPage',
					params: {
						id
					},
					success: result => {
						checkOptions = result.list
						this.checks = checkOptions
						console.log(this.checks)
						this.checked = result.listCheck
			
					},
				})
			},
			getInfo(id) {
				this.$request.post({
					url: "merchant/merchantInfo/detail",
					params: {
						id
					},
					success: (result) => {
						console.log(result)
						this.form = result
					},
					error: () => {
						this.show = true
					},
				});
			},
			getAuditStatus() {
				switch (this.form.apply.status) {
					case 0:
						return "<font style='color: #3c86ef'>审核中</font>"
					case 1:
						return "<font style='color: #167cf3'>已通过</font>"
					case -1:
						return "<font style='color: red'>已拒绝</font>"
				}
			},
			// 获取菜单
			getTreeData() {
				this.$request.post({
					url: "merchant/merchantMenu/allList",
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
				console.log(id)
				this.menuVisible = true;
				this.roleId = id;
				this.$request.post({
					url: "merchant/merchantRolePermissions/getRoleMenuId",
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
					url: "merchant/merchantRolePermissions/setRoleMenu",
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
			
		},
	};
</script>

<style>
	#head {
		color: #0949D1;
		font-size: 30px;
	}

	.label {
		margin-top: 10px;
		color: #0482d1;
	}

	.my-content {
		margin-top: 10px;
		border-radius: 10%
	}

	.el-descriptions-item__label.is-bordered-label {
		font-weight: bold;
		color: #61645f;
		background: #fafafa;
	}

	el-card {}
</style>
