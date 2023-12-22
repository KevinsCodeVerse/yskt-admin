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

			<el-card style="margin-top: 20px" shadow="hover" >
				<div slot="header" class="clearfix">
				    <span>用户购买的商品</span>				
				  </div>
				<div v-for="(item,i) in snapshot"  :key="item.id">
				<el-descriptions :column="2" >
					<el-descriptions-item label="商品id">
						{{item.id}}
					</el-descriptions-item>
					<el-descriptions-item label="商家id" v-if="goodsOrder.type==2">
						{{item.merchantId}}
					</el-descriptions-item>
					<el-descriptions-item label="商品名称">
						{{item.title}}
					</el-descriptions-item>
					<el-descriptions-item label="商品简介">
						{{item.overview}}
					</el-descriptions-item>
					<el-descriptions-item label="商品单价">
						{{item.price}}
					</el-descriptions-item>
					
					<el-descriptions-item label="商品主图">
						<el-image :src="item.avatar" style="width: 20%"
							:preview-src-list="[item.avatar]">
						</el-image>
					</el-descriptions-item>
				</el-descriptions>
				<el-divider v-if="snapshot.length-1!=i"></el-divider>
				</div>
			</el-card>
			<el-card style="margin-top: 20px;" shadow="hover">
				<div slot="header" class="clearfix">				
				  <span>用户信息</span>
					<el-button type="success"  v-if="goodsOrder.status==1" @click="applyDialog=true" style="float: right; padding: 6px 20px;">
						<i class="iconfont iconfahuo"></i>发货
					</el-button>		
					
				  </div>
				<el-descriptions :column="2" style="margin-top: 10px;">
					<el-descriptions-item label="微信头像" content-class-name="my-content" label-class-name="label">
						<el-image :src="form.avatar" style="width: 80%;border-radius: 50%;"
							:preview-src-list="[form.avatar]">
						</el-image>
					</el-descriptions-item>
					<el-descriptions-item label="微信昵称" content-class-name="my-content" label-class-name="label">
						{{form.nick}}
					</el-descriptions-item>
				</el-descriptions>
				<el-divider></el-divider>
				<el-descriptions :column="3" title="订单信息">
					<el-descriptions-item label="订单编号" content-class-name="my-content" label-class-name="label">
						{{goodsOrder.orderNum}}
					</el-descriptions-item>
					<el-descriptions-item label="商品类型" content-class-name="my-content" label-class-name="label">
						{{goodsOrder.type==1?"平台商品":"商家商品 "}}
					</el-descriptions-item>
					<el-descriptions-item label="订单状态" content-class-name="my-content" label-class-name="label">
						<span v-html="getStatus(goodsOrder.status)"></span>
					</el-descriptions-item>
					<el-descriptions-item label="数量" content-class-name="my-content" label-class-name="label" >
						<!-- {{goodsOrder.count}} -->
						x{{goodsOrder.count}}
					</el-descriptions-item>
					<el-descriptions-item label="总价" content-class-name="my-content" label-class-name="label">
						{{goodsOrder.totalPrice}}
					</el-descriptions-item>
					<el-descriptions-item label="应付价格" content-class-name="my-content" label-class-name="label">
						{{goodsOrder.realPrice}}
					</el-descriptions-item>
					<el-descriptions-item label="收货人名称" content-class-name="my-content" label-class-name="label">
						{{address.name}}
					</el-descriptions-item>
					<el-descriptions-item label="收货人电话" content-class-name="my-content" label-class-name="label">
						{{address.phone}}
					</el-descriptions-item>
					<el-descriptions-item label="收货地址" content-class-name="my-content" label-class-name="label">
						{{address.province+" "+address.city+" "+address.area+" "+address.address}}
					</el-descriptions-item>
					<el-descriptions-item label="备注" content-class-name="my-content" label-class-name="label">
						{{address.remark!=null?address.remark:"无"}}
					</el-descriptions-item>
				</el-descriptions>
			</el-card>
			
			<!-- 售后 -->
			<el-card style="margin: 20px 0;" shadow="hover" v-if="afterSale">
				<div slot="header" class="clearfix">
				  <span>售后审核</span>
				</div>
				<el-descriptions :column="2" >
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
					<el-descriptions-item label="详细描述" content-class-name="my-content" label-class-name="label" v-if="afterSale.content">
						{{afterSale.content}}
					</el-descriptions-item>
					<el-descriptions-item label="图像凭证" content-class-name="my-content" label-class-name="label" v-if="afterSale.img">
						<el-image :src="afterSale.img" style="width: 80%;"
							:preview-src-list="[afterSale.img]">
						</el-image>
					</el-descriptions-item>
				</el-descriptions>
				
				
				<el-button type="success"  v-if="afterSale.status==0" @click="saleDialog=true" style="padding: 6px 20px;">
					<i class="iconfont iconfahuo"></i>审核
				</el-button>
				<div v-else>
					<el-tag v-if="afterSale.status==2">同意</el-tag>
					<el-tag v-else type="danger" >拒绝</el-tag>
				</div>
				
			</el-card>
			
			<el-dialog title="售后申请" :visible.sync="saleDialog" width="30%" :close-on-click-modal="false" center>
				<el-form :model="saleForm" :label-width="labelWidth" ref="saleForm">
			
					<el-radio v-model="saleForm.status" :label="1">同意</el-radio>
					<el-radio v-model="saleForm.status" :label="2">拒绝</el-radio>
					<!-- </el-form-item>	 -->
			
					<el-form-item label="收件地址: " prop="address" v-if="saleForm.status==1 && afterSale.refundType == 2">
						<el-input v-model="saleForm.address">
						</el-input>
					</el-form-item>
					<el-form-item label="拒绝原因: " prop="refusedReason" v-if="saleForm.status==2">
						<el-input v-model="saleForm.refusedReason">
						</el-input>
					</el-form-item>
					
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="saleApply()">提交</el-button>
					<el-button type="warning" @click="saleDialog=false">关闭</el-button>
					
				</div>
			</el-dialog>
				
				
			<!-- 发货dialog -->
			<el-dialog title="提交申请" :visible.sync="applyDialog" width="30%" :close-on-click-modal="false" center>
				<el-form :model="sendForm" :label-width="labelWidth" ref="form">

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
				sendForm: {},
				saleForm:{
					status:null
				},
				applyDialog: false,
				saleDialog: false,
				labelWidth:'',
				snapshot:[],
				afterSale:{},
				goodsOrder:{},
				loading:null,
				address:{},
			};
		},

		mounted() {
			this.loading = this.$loading({
			          lock: true,
			          text: 'Loading',
			          spinner: 'el-icon-loading',
			          background: 'rgba(0, 0, 0, 0.7)'
			        });
			       
			        
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
						return "<font style='color: #167cf3'>待发货</font>"
					case 2:
						return "<font style='color: #e1b919'>待收货</font>"
					case 3:
						return "<font style='color: #3daa3d'>待评价</font>"
					case 4:
						return "<font style='color: #67c23a'>已完成</font>"
					case -1:
						return "<font style='color: red'>已取消</font>"
				}
			},
			getInfo(id) {
				this.$request.post({
					url: "merchant/merchantGoods/detail",
					params: {
						id
					},
					success: (result) => {
						this.loading.close();
						this.form = result
						this.address = this.form.address
						this.goodsOrder = result.goodsOrder
						this.snapshot = JSON.parse(result.goodsOrder.snapshot)
						this.goodsOrder.count = this.snapshot[0].count
						this.afterSale = result.afterSale
						this.saleForm.id = this.afterSale.id
						console.log(11,this.afterSale);
					},
					error: () => {
						this.show = true
						this.loading.close();
					},
				});
			},
			apply() {
				this.$request.post({
					url: "merchant/merchantGoods/delivery",
					params: this.sendForm,
					success: (result) => {
						this.$message.success("发货成功！");
						this.applyDialog = false;
						this.getInfo(this.sendForm.id)
					},
				});
			},
			saleApply(){
				if(!this.saleForm.status){
					this.$message.error("请选择同意或拒绝");
					return
				}
				if(this.saleForm.status == 2 && !this.saleForm.refusedReason){
					this.$message.error("拒绝原因不能为空");
					return
				}
				
				if(this.afterSale.refundType == 2 && !this.saleForm.address){
					this.$message.error("寄件地址不能为空");
					return
				}
				
				
				console.log("审核信息",this.saleForm);
				if(this.saleForm.status == 1){
					this.$set(this.saleForm,"refusedReason",'')
				}else{
					this.$set(this.saleForm,"address",'')
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
			}
		},
	};
</script>

<style scoped>
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

</style>
