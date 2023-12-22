<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>摘种订单详情
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
				<span style="font-weight: 900;">用户挑选的果蔬</span>
				<el-form inline>
					<div v-for="(item,index) in form.order.snapshot" :key="index" style=";">
						<el-form-item label="果蔬id:" class="item">{{item.id}}</el-form-item>
						<el-form-item label="主图:" class="item">
							<el-image :src="item.avatar" style="width: 100px"
								:preview-src-list="item.avatar.split(',')">
							</el-image>
						</el-form-item>
						<el-form-item label="果蔬标题:" class="item">{{item.title}}</el-form-item>
						<el-form-item label="简介:" class="item">{{item.overview}}</el-form-item>
						<el-form-item label="标注价格:" class="item">{{item.standardPrice}}元/斤</el-form-item>
						<el-form-item label="重量:" class="item">{{item.amount}}斤</el-form-item>
						<el-form-item label="实际价格:" class="item">{{item.price}}元</el-form-item>
						<el-divider></el-divider>
					</div>
				</el-form>
			</el-card>
			<el-card style="margin-top: 20px;" shadow="hover">
				<el-descriptions :column="5" title="订单信息">
					<el-descriptions-item label="订单编号">
						{{form.order.orderNum}}
					</el-descriptions-item>
					<el-descriptions-item label="菜地id">
						{{form.plotId}}
					</el-descriptions-item>
					<el-descriptions-item label="商家id">
						{{form.merchantId}}
					</el-descriptions-item>
					<el-descriptions-item label="下单时间">
						{{$moment(form.order.createTime).format("Y-MM-DD HH:mm:ss")}}
					</el-descriptions-item>
					<el-descriptions-item label="支付时间">
						{{form.order.payTime==null?"未支付":$moment(form.order.payTime).format("Y-MM-DD HH:mm:ss")}}
					</el-descriptions-item>

					<el-descriptions-item label="总价">
						{{form.order.totalPrice}}元
					</el-descriptions-item>
					<el-descriptions-item label="积分抵扣">
						{{form.order.scope==null?"无抵扣":form.order.scope}}
					</el-descriptions-item>
					<el-descriptions-item label="用户实际支付价格">
						{{form.order.realPrice}}元
					</el-descriptions-item>
					<el-descriptions-item label="用户昵称">
						{{form.nick}}
					</el-descriptions-item>
					<el-descriptions-item label="用户备注">
						{{form.order.remark}}
					</el-descriptions-item>
					<el-descriptions-item label="微信头像">
						<el-image :src="form.avatar" :preview-src-list="form.avatar.split(',')" style="width: 100px">
						</el-image>
					</el-descriptions-item>
					<el-descriptions-item label="用户上传的照片" v-if="form.order.type==1">
						<el-image :src="item" :preview-src-list="form.order.img" style="width: 100px"
							v-for="(item,index) in form.order.img">
						</el-image>
					</el-descriptions-item>
				</el-descriptions>

			</el-card>

			<!-- 售后 -->
			<el-card style="margin: 20px 0;" shadow="hover" v-if="afterSale">
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
				afterSale: {},
				show: false,
				id: "",
				form: {},
				afterSaleDialog: false,
				saleDialog: false,
				saleForm: {}
			};
		},

		mounted() {
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				let id = url.substr(url.indexOf("=") + 1);
				this.getInfo(id);
			} else {
				this.show = true
			}
		},

		methods: {
			saleApply() {
				this.saleForm.id = this.afterSale.id
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
			getStatus(status) {
				switch (status) {
					case 0:
						return "<font style='color: #6b6a70'>待付款</font>"
					case 1:
						return "<font style='color: #167cf3'>已付款</font>"
					case 2:
						return "<font style='color: #e1b919'>商家已核验</font>"
					case 3:
						return "<font style='color: #67c23a'>已评价</font>"
					case -1:
						return "<font style='color: red'>已取消</font>"
				}
			},
			getInfo(id) {
				this.$request.post({
					url: "merchant/merchantVegetable/orderDetail",
					params: {
						id
					},
					success: (result) => {
						this.form = result
						this.form.order.snapshot = JSON.parse(result.order.snapshot.replace("\\", ""))
						console.log("12321", result)
						if (this.form.order.afterSaleStatus != 0) {
							this.afterSale = result.afterSale
						}
						this.form.order.img = result.order.img.split(',')
					},
					error: () => {
						this.show = true
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
			}
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

	#snapshot {
		color: #00A2E9;
	}

	.item .el-form-item__label {
		color: #00A2E9;
		margin-left: 50px;

	}

	el-card {}
</style>
