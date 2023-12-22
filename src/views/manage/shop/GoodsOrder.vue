<template>
	<div id="sys_params">
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>订单管理</main-head>

		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.orderNum" placeholder="输入订单编号查找" clearable></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.usId" placeholder="输入用户id搜索" clearable></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-select v-model="params.status" placeholder="根据订单状态筛选" clearable @change="search()">
						<el-option v-for="item in stausList" :key="item.id" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center" width="60"></el-table-column>
				<el-table-column prop="orderNum" label="订单编号" align="center" width="150"></el-table-column>
				<el-table-column prop="usId" label="用户id" align="center">
				</el-table-column>
				<el-table-column prop="totalPrice" label="总价" align="center"></el-table-column>
				<el-table-column prop="realPrice" label="实际价格" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span v-html="getStatus(scope.row.status)"></span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="商品类型" align="center">
					<template slot-scope="scope">
						{{scope.row.type==1?"平台商品":"商家商品"}}
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
						<div style="padding: 10px;">
							<el-badge :value="scope.row.afterSaleStatus == 1?'需审核':''" class="item">
							  <el-button type="primary" size="mini"
							  	@click="$router.push('/shop/orderDetail?id='+scope.row.id)">
							  	<i class="iconfont icondaohangdizhi"></i>查看订单详情
							  </el-button>
							</el-badge>
						</div>
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

			<!-- 详情弹框 -->
			<el-dialog title="订单详情" :visible.sync="dialog" width="40%">
				<el-descriptions :column="2" border title="商品信息">
					<el-descriptions-item label="菜地/果园名称:" content-class-name="my-content" label-class-name="my-label">
						{{form.plotName}}
					</el-descriptions-item>
					<el-descriptions-item label="菜地类型:" content-class-name="my-content" label-class-name="my-label">
						<el-tag type="success" v-if="form.businessType==0">可摘菜</el-tag>
						<el-tag v-if="form.businessType==1">可种菜</el-tag>
						<div v-else>
							<el-tag type="success">可摘菜</el-tag>
							<el-tag>可种菜</el-tag>
						</div>

					</el-descriptions-item>
					<el-descriptions-item label="所属人名称:" content-class-name="my-content" label-class-name="my-label">
						{{form.name}}
					</el-descriptions-item>
					<el-descriptions-item label="联系方式:" content-class-name="my-content" label-class-name="my-label">
						{{form.phone}}
					</el-descriptions-item>
				</el-descriptions>
				<br />
				<el-descriptions :column="3" border title="地址和开放时间" direction="vertical">
					<el-descriptions-item label="省:" content-class-name="my-content" label-class-name="my-label">
						{{form.province}}
					</el-descriptions-item>
					<el-descriptions-item label="市:" content-class-name="my-content" label-class-name="my-label">
						{{form.city}}
					</el-descriptions-item>
					<el-descriptions-item label="区/镇:" content-class-name="my-content" label-class-name="my-label">
						{{form.area}}
					</el-descriptions-item>
				</el-descriptions>
				<el-descriptions border direction="vertical">
					<el-descriptions-item label="详细地址:" content-class-name="my-content" label-class-name="my-label">
						{{form.address}}
					</el-descriptions-item>
					<el-descriptions-item label="是否公开菜地:" content-class-name="my-content" label-class-name="my-label">
						<el-switch v-model="form.openType" active-text="公开菜地" inactive-text="私有菜地" :active-value="1"
							:inactive-value="2" disabled>
						</el-switch>
					</el-descriptions-item>
				</el-descriptions>
				<el-descriptions :column="2" border>
					<el-descriptions-item label="摘菜开放时间:" content-class-name="my-content" label-class-name="my-label"
						v-if="form.businessType==0||form.businessType==2">
						<span
							v-if="form.pickOpenTime!=null">{{$moment(form.pickOpenTime).format("HH:mm")}}至{{$moment(form.pickOverTime).format("HH:mm")}}</span>
					</el-descriptions-item>
					<el-descriptions-item label="种菜开放时间:" content-class-name="my-content" label-class-name="my-label"
						v-if="form.businessType==1||form.businessType==2">
						<span
							v-if="form.pickOpenTime!=null">{{$moment(form.pickOpenTime).format("HH:mm")}}至{{$moment(form.pickOverTime).format("HH:mm")}}</span>
					</el-descriptions-item>
				</el-descriptions>
				<br />
				<el-descriptions border title="内容介绍">
					<el-descriptions-item label="简介:" content-class-name="my-content" label-class-name="my-label"
						v-if="form.businessType==0||form.businessType==2">
						{{form.overview}}
					</el-descriptions-item>
				</el-descriptions>
				<editor :isClear="true" :value.sync="form.content"></editor>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialog = false">关 闭</el-button>
				</div>
			</el-dialog>
		</main-content>
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
				//表单Label宽度
				labelWidth: "100px",
				form: {},
				dialog: false,
				date: "",
				list: [],
				load: false,
				params: {
					pageSize: 10,
					pageNo: 1,
					isCount: true,
					startTime: "",
					endTime: "",
					type: 1
				},
				total: 0,
				stausList: [{
						value: 0,
						label: "待付款"
					}, {
						value: 1,
						label: "待发货"
					}, {
						value: 2,
						label: "待收货"
					}, {
						value: 3,
						label: "待评价"
					},
					{
						value: 4,
						label: "已完成"
					},
					{
						value: -1,
						label: "已取消"
					}
				],
			};
		},

		mounted() {
			this.search();
		},

		methods: {
			//列表状态显示
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
			search() {
				this.params.pageNo = 1;
				this.params.isCount = true;
				this.getList();
			},

			getList() {
				this.load = true;
				this.$request.post({
					url: "merchant/merchantGoods/orderList",
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
			openDialog(row) {
				//浅拷贝
				this.form = JSON.parse(JSON.stringify(row));
				this.dialog = true;
			},
		},
	};
</script>



<style scoped>
	.page {
		text-align: right;
		margin-top: 20px;
	}

	#head {

		font-size: 30px;
	}

	.descrContent {
		color: #0949D1;
	}

	/deep/.my-label {
		color: black;
	}

	/deep/.my-content {
		/* font-weight: 9000; */
		/* color: #0949D1;		 */
	}

	.iconfont {
		font-size: 10px;
		margin-right: 3px;
	}
</style>
