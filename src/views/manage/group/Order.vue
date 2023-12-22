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

				<el-table-column prop="totalPrice" label="总价" align="center"></el-table-column>
				<el-table-column prop="realPrice" label="实际价格" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span v-html="getStatus(scope.row.status)"></span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="发货方式" align="center">
					<template slot-scope="scope">
						{{scope.row.type==0?"自提":"快递"}}
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{
              $moment(scope.row.createTime).format("Y-MM-DD HH:mm")
            }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="200">
					<template slot-scope="scope">
						<el-button type="primary" size="mini"
							@click="$router.push('/group/orderDetail?id='+scope.row.id)">
							<i class="iconfont icondaohangdizhi"></i>查看订单详情
						</el-button>

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
						label: "待提货"
					},
					{
						value: 4,
						label: "已提货"
					},
					{
						value: 5,
						label: "待评价"
					},
					{
						value: 6,
						label: "已完成"
					},
					{
						value: -1,
						label: "已取消"
					},
					{
						value: -2,
						label: "已退款"
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
					/* 
					 0：待支付
					 1：待发货
					 2：待收货
					 3：待提货
					 4：已提货，商家已核验
					 5：待评价
					 6：已完成
					 -1：已取消
					 */
					case 0:
						return "<font style='color: #6b6a70'>待支付</font>"
					case 1:
						return "<font style='color: #167cf3'>待发货</font>"
					case 2:
						return "<font style='color: #e1b919'>待收货</font>"
					case 3:
						return "<font style='color: #3daa3d'>待提货</font>"
					case 4:
						return "<font style='color: #67c23a'>已提货，商家已核验</font>"
					case 5:
						return "<font style='color: #5342aa'>待评价</font>"
					case 6:
						return "<font style='color: #67c23a'>已完成</font>"
					case -1:
						return "<font style='color: red'>已取消</font>"
					case -2:
						return "<font style='color: #d59109'>已退款</font>"
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
					url: "merchant/merchantGroupGoods/orderList",
					params: this.params,
					success: (result) => {
						if (this.params.isCount) {
							this.total = result.total;
						}
						this.params.isCount = false;
						this.list = result.list;
						this.list.map(val => {
							val.snapshot = JSON.parse(val.snapshot)
						})
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
