<template>
	<div>
		<main-head>
			<el-button slot="after" @click="openAddDialog()" type="primary" size="medium" icon="el-icon-plus">添加银行卡
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
				<el-form-item label="">
					<span style="color: #3c86ef;margin: 0px 20px 0px 20px;;">我的收益占比(股份):{{detail.shares*100}}%</span>
					<span style="color: red;margin: 0px 20px 0px 20px;">总余额:{{detail.totalBalance}}元</span>
					<span style="color: green;margin: 0px 20px 0px 20px;">提现中:{{detail.applyIng}}元</span>
					<span style="color: #3c86ef;margin: 0px 20px 0px 20px;;">共提现:{{detail.successApply}}元</span>
				</el-form-item>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="银行卡id" align="center"></el-table-column>
				<el-table-column prop="cardName" label="持有人" align="center">
				</el-table-column>
				<el-table-column prop="cardNum" label="银行卡号" align="center">
				</el-table-column>
				<el-table-column prop="bankName" label="开户行" align="center">
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
				<el-table-column label="操作" align="center" width="450">
					<template slot-scope="scope">
						<el-button type="info" size="mini" @click="openApplyDialog(scope.row)">发起提现申请</el-button>
						<el-button type="success" size="mini"
							@click="$router.push('/finance/withdrawal?id='+scope.row.id)">查看该卡的提现明细</el-button>
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
			<el-dialog title="添加银行卡" :visible.sync="addDialog" width="30%" :close-on-click-modal="false">
				<el-form :model="addForm" :label-width="labelWidth" :rules="rule" ref="addForm">
					<el-form-item label="银行卡号：" prop="cardNum">
						<el-input placeholder="请输入银行卡号" v-model="addForm.cardNum" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="开户行：" prop="bankName">
						<el-input placeholder="请输入开户行(可包含所在地)" v-model="addForm.bankName" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="持有人：" prop="cardName">
						<el-input placeholder="请填写该卡持有人" v-model="addForm.cardName" clearable>
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
			<el-dialog title="修改银行卡" :visible.sync="updateDialog" width="30%" :close-on-click-modal="false">
				<el-form :model="updateForm" :label-width="labelWidth" :rules="rule" ref="updateForm">
					<el-form-item label="银行卡号：" prop="cardNum">
						<el-input placeholder="请输入银行卡号" v-model="updateForm.cardNum" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="开户行：" prop="bankName">
						<el-input placeholder="请输入开户行(可包含所在地)" v-model="updateForm.bankName" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="持有人：" prop="cardName">
						<el-input placeholder="请填写该卡持有人" v-model="updateForm.cardName" clearable>
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

			<!-- 申请dialog -->
			<el-dialog title="提交申请" :visible.sync="applyDialog" width="30%" :close-on-click-modal="false" center>
				<el-form :model="applyForm" :label-width="labelWidth" :rules="rule" ref="form">
					<el-form-item label="银行卡号：" prop="cardNum">
						<el-input v-model="applyForm.cardNum" disabled>
						</el-input>
					</el-form-item>
					<el-form-item label="开户行：" prop="bankName">
						<el-input v-model="applyForm.bankName" disabled>
						</el-input>
					</el-form-item>
					<el-form-item label="持有人：" prop="cardName">
						<el-input v-model="applyForm.cardName" disabled>
						</el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input placeholder="备注" v-model="applyForm.remark">
						</el-input>
					</el-form-item>
					<el-form-item label="提现金额：" prop="money">
						<el-input-number placeholder="输入金额" v-model="applyForm.money" :min="0.00"
							:max="detail.totalBalance" :precision="2">
						</el-input-number>
					</el-form-item>
					<span style="font-size: 5px;color: red;margin-left: 20%;">请仔细核对银行卡信息和提现金额，如提交错误，请联系管理员</span>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="apply()">提交</el-button>
					<el-button type="warning" @click="applyDialog=false">关闭</el-button>
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
				labelWidth: "100px",
				detail: {},
				addForm: {},
				updateForm: {},
				applyForm: {},
				applyDialog: false,
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
					cardNum: [{
						pattern: /^([1-9]{1})(\d{14}|\d{18})$/,
						message: "请输入正确的银行卡号",
						trigger: 'blur'
					}, {
						message: "请输入银行卡号",
						required: true,
					}],
					cardName: [{
						message: "请输入持卡人名称",
						required: true,
					}],
					bankName: [{
						message: "请输入持卡人名称",
						required: true,
					}],
					money: [{
						message: "请填写提现金额",
						required: true,
					}],
				}
			};
		},

		mounted() {
			this.search();
			this.withdrawalDetail();
		},

		methods: {
			apply() {
				this.$refs["form"].validate((valid) => {
					if (!valid) {
						return
					}
					this.$request.post({
						url: "merchant/merchantApply/apply",
						params: this.applyForm,
						success: (result) => {
							this.$message.success("提交成功!请等待管理员审核");
							this.applyDialog = false;							
							this.search();
							this.withdrawalDetail();
						},
					});
				})
			},
			openApplyDialog(row) {
				this.applyForm = {};
				this.applyForm = JSON.parse(JSON.stringify(row));
				this.applyForm.cardId = row.id;
				this.applyDialog = true;
			},
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
						url: "merchant/merchantBankCard/addOrUpdate",
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

			withdrawalDetail() {
				this.$request.post({
					url: "merchant/merchantBankCard/withdrawalDetail",
					success: (result) => {
						this.detail = result
					},
				});
			},

			getList() {
				this.load = true;
				this.$request.post({
					url: "merchant/merchantBankCard/list",
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
				this.$confirm('此操作将永久删除该银行卡, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
					center: true
				}).then(() => {
					this.$request.post({
						url: "merchant/merchantBankCard/delete",
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
