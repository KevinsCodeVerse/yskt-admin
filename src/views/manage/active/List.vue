<template>
	<div id="sys_params">
		<main-head>
			<i id="head" class="iconfont iconshangpin"></i>活动管理
			<el-button slot="after" @click="$router.push('/active/add')" type="primary" size="medium" icon="el-icon-plus">添加活动
			</el-button>
		</main-head>

		<!-- 列表信息 -->
		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()" clearable>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.name" placeholder="输入活动名称模糊搜索" clearable></el-input>
				</el-form-item>
				
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
			</el-form>
			
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="title" label="团购标题" align="center"></el-table-column>
				
				<el-table-column prop="address" label="活动地址" align="center"></el-table-column>
				
				<el-table-column prop="overview" label="简介" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="registerCount" label="报名人数" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="inventory" label="收费" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-tag v-if="scope.row.hasCost==1">是</el-tag>
						<el-tag v-else>否</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.time}}</span>
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
						<el-button type="primary" size="mini" @click="openUpdateDialog(scope.row)">
							<i class="iconfont iconxiangqing-"></i>详情
						</el-button>
						
						<el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">
							<i class="iconfont iconshanchu"></i>删除
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
	import Upload from '@/components/utils/Upload';

	export default {
		components: {
			editor,
			Upload
		},
		data() {
			return {
				screenWidth: document.body.clientWidth,     // 屏幕宽
				
				dynamicValidateForm: {
					domains: [{
						value: ''
					}],
					email: ''
				},
				priceList:[],
				priceArr:[],

				updateStore: false,
				merchantInfo: {
					storeAvatar: "",
					storeName: ""
				},
				uploadImg: {
					url: "merchant/merchantGoods/uploadImg",
					//存放返回的图片路径
					array: [],
					//关闭之前判断商品是否添加，未添加时为false，删除服务器图片
					addStatus: false
				},
				videoShow: "",
				labelWidth: "300px",
				addDialog: false,
				updateDialog: false,
				typeList: [{
					value: 0,
					label: "可采摘"
				}, {
					value: 1,
					label: "可种植"
				}, {
					value: 2,
					label: "均支持"
				}],
				videoPlay: false,
				categoryList: [],
				//表单Label宽度
				labelWidth: "100px",
				addForm: {
					video: "",
					originalPrice: 0,
					discountPrice: 0,
					peopleCount: 0,
					domains: [{
						discountPrice: 0,
						peopleCount: 0,
					}],
				},
				updateForm: {
					video: ""
				},
				dialog: false,
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
				updateBan: false,
				rule: {
					avatar: {
						message: "请上传主图",
						required: true
					},
					img: {
						message: "请上传轮播图",
						required: true
					},
					categoryId: {
						message: "请选择分类",
						required: true
					},
					title: {
						message: "请输入产品名称",
						required: true
					},
					overview: {
						message: "请输入简介",
						required: true
					},
					originalPrice: {
						message: "请填写单价",
						required: true
					},
					inventory: {
						message: "请填写库存，-1为无限库存",
						required: true
					},
					content: {
						message: "请填写详情",
						required: true
					},
					storeName: {
						message: "请填写店铺名称",
						required: true
					},
					storeAvatar: {
						message: "请上传店铺头像",
						required: true
					},
					peopleCount: {
						message: "请填写拼团人数",
						required: true
					},
					discountPrice: {
						message: "请填写优惠价格",
						required: true
					},
					domains: {
						message: "请填写拼团信息",
						required: true
					},
				}
			};
		},
		watch:{
			screenWidth(){
				console.log(1111);
				return this.screenWidth <= 2010 ? '' : 10
			}
		},
		mounted() {
			console.log('222', this.$route);
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				this.params.id = url.substr(url.indexOf("=") + 1, 1);
			}
			this.search();
		},

		methods: {
			//打开修改弹框
			openUpdateDialog(row) {
				localStorage.setItem('row',JSON.stringify(row))
				this.$router.push({
				  path: '/active/edit'
				  
				})
			},
			
			deleteItem(id) {
				this.$confirm("此操作将永久删除这个活动, 是否删除?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					this.$request.post({
						url: "merchant/merchantActivity/delete",
						params: {
							id
						},
						success: (result) => {
							this.$message.success("删除成功");
							this.getList()
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
				console.log(111);
				this.load = true;
				this.$request.post({
					url: "merchant/merchantActivity/list",
					params: this.params,
					success: (result) => {
						if (this.params.isCount) {
							this.total = result.total;
						}
						this.params.isCount = false;
						this.list = result.list;
						// 处理时间
						this.list.map(item=>{
							let start = item.openTime
							let end = item.overTime
							let now = new Date().getTime()
							console.log(now);
							if(now >= end){
								item.time = "已结束"
								// this.$set(item,"time","已结束")
							}else if(now >= start){
								// this.$set(item,"time","进行中")
								item.time = "进行中"
							}else{
								// this.$set(item,"time","未开始")
								item.time = "未开始"
							}
						})
						console.log(this.list);
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

		},
	};
</script>

<style>
</style>

<style scoped>
	.storeName {
		font-size: 120px;
		color: #55aa00;
	}

	.page {
		text-align: right;
		margin-top: 20px;
	}

	#head {

		font-size: 30px;
	}

	.img {
		width: 20%;
		height: 15%;
		border-radius: 10%;
		margin-left: 10px;
		box-shadow: 3px 3px 3px rgba(0, 0, 0, .5);
		-moz-box-shadow: 3px 3px 3px rgba(0, 0, 0, .5);
		-webkit-box-shadow: 3px 3px 3px rgba(81, 81, 81, 0.5);
	}

	.iconfont {
		font-size: 10px;
		margin-right: 3px;
	}
</style>
