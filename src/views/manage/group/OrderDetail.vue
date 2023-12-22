<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>商品订单详情
			<span slot="after" @click="$router.go(-1)" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回上一页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
		</main-head>

		<div v-if="show">
			<el-empty description="订单可能已经被删除了哦~"></el-empty>
		</div>
		<div v-else>

			<el-card style="margin-top: 20px" shadow="hover">
				<div slot="header" class="clearfix">
					<span>用户购买的商品</span>
				</div>

				<el-descriptions :column="2">

					<el-descriptions-item label="商品名称">
						{{snapshot.title}}
					</el-descriptions-item>

					<!-- <el-descriptions-item label="商品单价" >
						{{order.realPrice / order.count}}
					</el-descriptions-item> -->

					<el-descriptions-item label="数量">
						{{order.count+""+snapshot.unit}}
					</el-descriptions-item>
					<el-descriptions-item label="商品主图">
						<el-image :src="snapshot.avatar" style="width: 20%"
							:preview-src-list="snapshot.avatar.split(',')">
						</el-image>
					</el-descriptions-item>
					<el-divider></el-divider>
				</el-descriptions>
			</el-card>
			<el-card style="margin-top: 20px;" shadow="hover">
				<div slot="header" class="clearfix">
					<span>用户信息</span>
					<el-button type="success" v-if="order.status==1" @click="applyDialog=true"
						style="float: right; padding: 6px 20px">
						<i class="iconfont iconfahuo"></i>发货
					</el-button>
				</div>
				<el-descriptions :column="2" style="margin-top: 10px;">
					<el-descriptions-item label="微信头像" content-class-name="my-content" label-class-name="label">
						<el-image :src="form.avatar" style="width: 80%;border-radius: 50%;">
						</el-image>
					</el-descriptions-item>
					<el-descriptions-item label="微信昵称" content-class-name="my-content" label-class-name="label">
						{{form.nick}}
					</el-descriptions-item>
				</el-descriptions>
				<el-divider></el-divider>
				<el-descriptions :column="3" title="订单信息">
					<el-descriptions-item label="订单编号" content-class-name="my-content" label-class-name="label">
						{{order.orderNum}}
					</el-descriptions-item>
					<el-descriptions-item label="订单状态" content-class-name="my-content" label-class-name="label">
						<span v-html="getStatus(order.status)"></span>
					</el-descriptions-item>
					<el-descriptions-item label="下单时间" content-class-name="my-content" label-class-name="label">
						{{$moment(order.createTime).format(" Y-MM-DD HH:mm")}}
					</el-descriptions-item>
					<el-descriptions-item label="支付时间" content-class-name="my-content" label-class-name="label"
						v-if="order.status!=0&&order.status!=-1">
						{{$moment(order.payTime).format(" Y-MM-DD HH:mm")}}
					</el-descriptions-item>
					<el-descriptions-item label="配送类型" content-class-name="my-content" label-class-name="label">
						{{order.type==0?"自提":order.type==1?"快递":"免费配送"}}
					</el-descriptions-item>
					<el-descriptions-item label="数量" content-class-name="my-content" label-class-name="label">
						{{order.count+snapshot.unit}}
					</el-descriptions-item>
					<el-descriptions-item label="总价" content-class-name="my-content" label-class-name="label">
						{{order.totalPrice}}
					</el-descriptions-item>
					<el-descriptions-item label="实付价格" content-class-name="my-content" label-class-name="label">
						{{order.realPrice}}
					</el-descriptions-item>
					<el-descriptions-item label="收货人名称" content-class-name="my-content" label-class-name="label"
						v-if="order.type==1">
						{{form.address.name}}
					</el-descriptions-item>
					<el-descriptions-item label="收货人电话" content-class-name="my-content" label-class-name="label"
						v-if="order.type==1">
						{{form.address.phone}}
					</el-descriptions-item>
					<el-descriptions-item label="收货地址" content-class-name="my-content" label-class-name="label"
						v-if="order.type==1">
						{{form.address.province+" "+form.address.city+" "+form.address.area+" "+form.address.address}}
					</el-descriptions-item>
					<el-descriptions-item label="备注" content-class-name="my-content" label-class-name="label"
						v-if="order.type==1">
						{{form.address.remark!=null?form.address.remark:"无"}}
					</el-descriptions-item>
				</el-descriptions>
			</el-card>

			<!-- 售后 -->
			<el-card style="margin: 20px 0;" shadow="hover" v-if="order.afterSaleStatus!=0">
				<div slot="header" class="clearfix">
					<span>售后审核</span>
					<el-button type="success" v-if="afterSale.status==1" @click="afterSaleDialog=true"
						style="float: right; padding: 6px 20px">
						<i class="iconfont iconfahuo"></i>确认退款
					</el-button>
				</div>
				<el-descriptions :column="2">
					<el-descriptions-item label="用户退款理由" content-class-name="my-content" label-class-name="label">
						{{afterSale.redundReason}}
					</el-descriptions-item>
					<el-descriptions-item label="退款金额" content-class-name="my-content" label-class-name="label">
						￥{{afterSale.refundAmount}}
					</el-descriptions-item>
					<el-descriptions-item label="退款类型" content-class-name="my-content" label-class-name="label">
						{{afterSale.refundType == 1?"仅退款":"退货退款 "}}
					</el-descriptions-item>
					<el-descriptions-item label="商品类型" content-class-name="my-content" label-class-name="label">
						{{afterSale.type == 1?"普通商品":afterSale.type == 2?'团购商品':'平台商品'}}
					</el-descriptions-item>
					<el-descriptions-item label="详细描述" content-class-name="my-content" label-class-name="label">
						{{afterSale.content}}
					</el-descriptions-item>
					<el-descriptions-item label="退款状态" content-class-name="my-content" label-class-name="label">
						<span v-html="getRefundStatus()"></span>
					</el-descriptions-item>
					<el-descriptions-item label="用户寄回快递单号" content-class-name="my-content" label-class-name="label"
						v-if="afterSale.courierNumber">
						{{afterSale.courierNumber}}
					</el-descriptions-item>
					<el-descriptions-item label="图像凭证" content-class-name="my-content" label-class-name="label"
						v-if="afterSale.img!=undefined&&afterSale.img!=''">
						<el-image :src="afterSale.img" style="width: 30%;" :preview-src-list="afterSale.img.split(',')">
						</el-image>
					</el-descriptions-item>
				</el-descriptions>
				<el-button type="success" v-if="afterSale.status==0" @click="saleDialog=true"
					style="padding: 6px 20px;">
					<i class="iconfont iconfahuo"></i>审核
				</el-button>
			</el-card>

			<el-dialog title="售后申请" :visible.sync="saleDialog" width="30%" :close-on-click-modal="false" center>
				<el-form :model="saleForm" :label-width="labelWidth" ref="saleForm">
					<el-radio v-model="saleForm.status" :label="1">同意</el-radio>
					<el-radio v-model="saleForm.status" :label="2">拒绝</el-radio>
					<!-- </el-form-item>	 -->
					<el-form-item label="收件地址: " prop="address" v-if="saleForm.status==1">
						<el-input v-model="saleForm.address" placeholder="订单如果是仅退款类型,可不填地址">
						</el-input>
					</el-form-item>
					<el-form-item label="拒绝原因: " prop="refusedReason" v-if="saleForm.status==2">
						<el-input v-model="saleForm.refusedReason" placeholder="请输入拒绝原因(可为空)">
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="saleApply()">提交</el-button>
					<el-button type="warning" @click="saleDialog=false">关闭</el-button>
				</div>
			</el-dialog>

			<!-- 发货dialog  :label-width="labelWidth" :rules="rule"-->
			<el-dialog title="提交申请" :visible.sync="applyDialog" width="30%" :close-on-click-modal="false" center>
				<el-form :model="sendForm" ref="form">

					<el-radio v-model="sendForm.type" label="1">快递</el-radio>
					<el-radio v-model="sendForm.type" label="2">自取或其他</el-radio>
					<!-- </el-form-item>	 -->

					<el-form-item label="快递单号：" prop="expressNumber" v-if="sendForm.type==1">
						<el-input v-model="sendForm.expressNumber">
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="apply()">发货</el-button>
					<el-button type="warning" @click="applyDialog=false">关闭</el-button>
				</div>
			</el-dialog>

			<!-- 确认退货退款 -->
			<el-dialog title="确认退款(已收到货物完好)" :visible.sync="afterSaleDialog" width="30%" :close-on-click-modal="false"
				center>
				<el-form :model="afterSaleFrom" ref="form">
					<span style="color: red;">请确认已经收到用户寄回的货物并确认完整后再退款，系统将会直接退款给用户</span>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="refund()">退款</el-button>
					<el-button type="warning" @click="afterSaleDialog=false">关闭</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import editor from '@/components/utils/CustomWangEditor';

	export default {
		components: {
			editor
		},
		data() {
			return {
				show: false,
				id: "",
				form: {},
				afterSaleDialog: false,
				afterSaleFrom: {},
				sendForm: {},
				saleForm: {},
				applyDialog: false,
				saleDialog: false,
				order: {},
				snapshot: {},
				afterSale: {},
				labelWidth: '',
			};
		},

		mounted() {
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				let id = url.substr(url.indexOf("=") + 1);
				this.sendForm.id = id
				this.getInfo(id);
			} else {
				this.show = true
			}
		},

		methods: {
			getStatus(status) {
				switch (status) {
					case 0:
						return "<font style='color: #6b6a70'>待付款</font>"
					case 1:
						return "<font style='color: #167cf3'>已支付(拼团中)</font>"
					case 2:
						return "<font style='color: #e1b919'>待收货</font>"
					case 3:
						return "<font style='color: #3daa3d'>待提货</font>"
					case 4:
						return "<font style='color: #67c23a'>已提货</font>"
					case 5:
						return "<font style='color: #9625c2'>待评价</font>"
					case 6:
						return "<font style='color: #1d6dc2'>已完成</font>"
					case -1:
						return "<font style='color: red'>已取消</font>"
					case -2:
						return "<font style='color: #d59109'>已退款</font>"
				}
			},
			getInfo(id) {
				this.$request.post({
					url: "merchant/merchantGroupGoods/orderDetail",
					params: {
						id
					},
					success: (result) => {
						this.form = result
						this.order = result.order
						if (this.order.afterSaleStatus != 0) {
							this.afterSale = result.afterSale
							this.saleForm.id = this.afterSale.id
						}
						this.snapshot = JSON.parse(this.order.snapshot)
					},
					error: () => {
						this.show = true
					},
				});
			},
			refund() {
				this.$request.post({
					url: "merchant/merchantGoods/confirmedReturn",
					params: {
						id: this.afterSale.id
					},
					success: (result) => {
						this.$message.success("发货成功！");
						this.applyDialog = false;
						this.getInfo(this.sendForm.id)
						this.afterSaleDialog = false
					},
				});
			},
			apply() {
				this.$request.post({
					url: "merchant/merchantGroupGoods/delivery",
					params: this.sendForm,
					success: (result) => {
						this.$message.success("发货成功！");
						this.applyDialog = false;
						this.getInfo(this.sendForm.id)
					},
				});
			},
			saleApply() {
				console.log("审核信息", this.saleForm);
				if (this.saleForm.status == 1) {
					this.$set(this.saleForm, "refusedReason", '')
				} else {
					this.$set(this.saleForm, "address", '')
				}
				this.$request.post({
					url: "merchant/merchantGoods/auditAfterSale",
					params: this.saleForm,
					success: (result) => {
						this.$message.success("提交成功！");
						this.saleDialog = false;
						this.getInfo(this.sendForm.id)
					},
				});
			},
			getRefundStatus() {
				let status = this.afterSale.status
				switch (status) {
					case 0:
						return "<font style='color: #167cf3'>商家审核中</font>"
					case 1:
						return "<font style='color: #3daa3d'>待寄回</font>"
					case 2:
						return "<font style='color: #d59109'>已退款</font>"
					case -1:
						return "<font style='color: red'>已拒绝</font>"
				}
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
		/* background-color: #f4f4f5; */
		border-radius: 10%
			/* color: #0949D1;		 */
	}

	el-card {}
</style>
