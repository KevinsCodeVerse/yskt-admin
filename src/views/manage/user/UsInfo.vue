<template>
	<div id="sys_params">
		<main-head></main-head>

		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.usId" placeholder="请输入用户id" clearable></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.nick" placeholder="输入微信名称模糊搜索" clearable></el-input>
				</el-form-item>
				<el-button type="primary" @click="search()">搜索</el-button>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="avatar" label="头像" align="center">
					<template slot-scope="scope">
						<el-image style="width: 100px; height: 100px; border-radius: 50%" :src="scope.row.avatar" :preview-src-list="scope.row.avatar.split(',')">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="姓名" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.name == null ? "--" : scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="nick" label="微信昵称" align="center">
				</el-table-column>
				<el-table-column prop="nick" label="身份" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.merchantId==null">普通用户</span>
						<span v-else>
							<font style="color: green">加盟商家</font>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="phone" label="手机号" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.phone == null ? "--" : scope.row.phone }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="score" label="积分余额" align="center">
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
				<el-table-column label="操作" align="center" width="300">
					<template slot-scope="scope">
						<el-button type="danger" plain size="mini" @click="update(scope.row.id)"
							v-if="scope.row.status == 0"><i class="iconfont iconlianxi2hebing-19"></i>冻结</el-button>
						<el-button type="success" plain size="mini" @click="update(scope.row.id)" v-else><i
								class="iconfont iconkaisuohuansuo"></i>解冻</el-button>
						<el-button type="warning" plain size="mini" @click="openDialog(scope.row)">
							查看详情</el-button>
						<el-button type="primary" size="mini" @click="openPreDialog(scope.row.id)" v-has="'detail'">
							分配权限</el-button>
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

			<!-- 用户弹框 -->
			<el-dialog title="用户信息" :visible.sync="dialog" width="30%">
				<el-form :model="form" :label-width="labelWidth">
					<el-row>
						<el-col :span="11">
							<el-form-item label="头像:">
								<el-image style="width: 100px; height: 100px; border-radius: 50%" :src="form.avatar">
								</el-image>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="微信昵称：">
								<el-input v-model="form.nick" clearable disabled style="width: 185px;"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="姓名：">
								<el-input v-model="form.name" clearable style="width: 160px;"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="手机号：">
								<el-input v-model="form.phone" clearable style="width: 185px;"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="openId：">
						<el-input v-model="form.openId" clearable disabled></el-input>
					</el-form-item>
					<el-form-item label="个性签名：">
						<span>{{ form.signature==null?"这个人很懒，什么都没有留下":form.signature}}</span>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="warning" @click="upload()">提交修改</el-button>
					<el-button type="success" @click="dialog = false">关 闭</el-button>
				</div>
			</el-dialog>
			<!-- 分配dialog -->
			<el-dialog center title="分配接口权限" :visible.sync="checkShow" :close-on-click-modal="false" width="500px">
				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
				</el-checkbox>
				<el-checkbox-group v-model="checked">
					<el-checkbox v-for="check in checks" :label="check.permissions" :key="check.id">
						{{check.permissions}}
					</el-checkbox>
				</el-checkbox-group>
				<span slot="footer" class="dialog-footer">
					<el-button @click="checkShow = false">取 消</el-button>
					<el-button type="primary" @click="sumbitPer">确 定</el-button>
				</span>
			</el-dialog>
		</main-content>
	</div>
</template>

<script>
	let checkOptions = [];
	export default {
		data() {
			return {
				checkShow: false,
				checkAll: false,
				//选中的选框,跟label关联
				checked: [],
				checks: checkOptions,
				isIndeterminate: true,
				//表单Label宽度
				labelWidth: "100px",
				form: {},
				dialog: false,
				date: "",
				list: [],
				load: false,
				params: {
					nick: "",
					pageSize: 10,
					pageNo: 1,
					isCount: true,
					startTime: "",
					endTime: "",
					usId: "",
				},
				total: 0,
			};
		},

		mounted() {
			this.search();
		},

		methods: {
			sumbitPer() {
				let id = this.id
				let rolePerId = JSON.stringify(this.checked)
				this.$request.post({
					url: 'admin/adUsInfo/setPer',
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

			//获取权限
			getPer(id) {
				this.id = id
				this.$request.post({
					url: 'admin/adUsInfo/listNoPage',
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
			openPreDialog(id) {
				this.getPer(id)
				this.checkShow = true;
			},
			upload() {
				this.form.time = new Date(this.form.birthday).getTime()
				delete(this.form.birthday)
				delete(this.form.createTime)
				delete(this.form.loginTime)
				this.$confirm('确认修改用户信息吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(this.form)
					this.$request.post({
						url: "admin/adUsInfo/updateInfo",
						params: this.form,
						success: (result) => {
							this.$message.success(result);
							this.dialog = false;
							this.getList()
						},
						finally: () => {
							this.load = false;
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
					url: "admin/adUsInfo/list",
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
				let usId = id;
				this.$request.post({
					url: "admin/adUsInfo/updateStatus",
					params: {
						usId
					},
					success: (result) => {
						this.search();
					},
				});
			},
			cleanDialog() {
				this.form = {};
			},
			openDialog(row) {
				this.cleanDialog();
				this.dialog = true;
				//浅拷贝				
				this.form = JSON.parse(JSON.stringify(row));
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
	.iconfont{
		font-size: 10px;
	}
</style>
