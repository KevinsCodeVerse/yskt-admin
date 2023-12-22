<template>
	<div>
		<main-head>
			<el-button slot="after" @click="openAddDialog()" type="primary" size="medium" icon="el-icon-plus">添加运费设置
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
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="merchantId" label="商家id" align="center">
				</el-table-column>
				
				<el-table-column prop="areaPrice" label="指定区域运费" align="center">
					<template slot-scope="scope">
						{{scope.row.areaPrice}}
					</template>
				</el-table-column>
				<el-table-column prop="defaultPrice" label="其他区域默认运费" align="center">
					<template slot-scope="scope">
						{{scope.row.defaultPrice}}元
					</template>
				</el-table-column>
				<el-table-column prop="locationIds" label="区域" align="center">
					
					<template slot-scope="scope">
						<el-tag v-for="(item,i) in scope.row.locationList" :key="i">{{item}}</el-tag>
					</template>
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
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
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
			<el-dialog title="添加运费模板" :visible.sync="addDialog" width="40%" :close-on-click-modal="false">
				<el-form :model="addForm" label-width="125px" :rules="rule" ref="addForm">
					<el-form-item label="区域选择：" prop="locationIds">
						<el-cascader :options="locationList" :props="props" v-model="addForm.locationIds"
							collapse-tags clearable></el-cascader>
					</el-form-item>
					<el-form-item label="选中区域的运费" prop="areaPrice">
						<el-input-number  placeholder="价格" v-model="addForm.areaPrice" :min="0" :precision="2" clearable>
						</el-input-number>￥
					</el-form-item>
					<el-form-item label="其他区域默认运费" prop="defaultPrice">
						<el-input-number placeholder="价格" v-model="addForm.defaultPrice" :min="0" :precision="2" clearable>
						</el-input-number>￥
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input placeholder="可添加套餐描述" v-model="addForm.remark" clearable>
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="addOrUpdate(1)">添加</el-button>
					<el-button type="warning" @click="addDialog=false">关闭</el-button>
				</div>
			</el-dialog>

			<!-- 修改dialog -->
			<el-dialog title="修改套餐" :visible.sync="updateDialog" width="40%" :close-on-click-modal="false">
				<el-form :model="updateForm" label-width="125px" :rules="rule" ref="updateForm">
					<el-form-item label="限购区域：" prop="locationIds">
						<el-cascader :options="locationList" :props="props" v-model="updateForm.locationIds"
							collapse-tags clearable></el-cascader>
					</el-form-item>
					<el-form-item label="指定区域运费" prop="areaPrice">
						<el-input-number  placeholder="价格" v-model="updateForm.areaPrice" :min="0" :precision="2" clearable>
						</el-input-number>￥
					</el-form-item>
					<el-form-item label="其他区域默认运费" prop="defaultPrice">
						<el-input-number placeholder="价格" v-model="updateForm.defaultPrice" :min="0" :precision="2" clearable>
						</el-input-number>￥
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input placeholder="可添加套餐描述" v-model="addForm.remark" clearable>
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="addOrUpdate(2)">保存</el-button>
					<el-button type="warning" @click="updateDialog=false">关闭</el-button>
				</div>
			</el-dialog>

		</main-content>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 区域选择
				totalLocation:[],//未处理过的区域
				locationList: [],//处理过的区域
				props: { //选择器设置
					multiple: true,
					value: 'id',
					label: 'name',
				},
				
				//表单Label宽度
				labelWidth: "100px",
				addForm: {
					areaPrice:0,
					defaultPrice: 0,
					locationIds:[]
				},
				
				updateForm: {},
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
					locationIds: [{
						message: "请选择限购区域",
						required: true,
					}],
					areaPrice: [{
						message: "请输入指定区域运费",
						required: true,
					}],
					defaultPrice: [{
						message: "请输入其他区域默认运费",
						required: true,
					},],
					remark: [{
						message: "请输入备注用于模板选择",
						required: true,
					},]
				}
			};
		},

		mounted() {
			this.getLocationList()
		},

		methods: {
			
			// 区域回显数组拼接
			 reLocationList(str){
					let list = str.split(",")
					let arr =[]
					list.forEach((val,index)=>{
						// 新建存放数组
						let arr1 = [Number(val)]
						// 查找id对应的一项 (区级)
						let quObj = this.totalLocation.find(item=>item.id == val)
						//通过区级查到对应的市级
						let shiObj = this.totalLocation.find(item1=>item1.val == quObj.parentVal)
						arr1.unshift(shiObj.id)
						
						// 通过市级查到对应的省级
						let shenObj = this.totalLocation.find(item=>item.val == shiObj.parentVal)
						arr1.unshift(shenObj.id)
						arr.push(arr1)
					})
					return arr
			 },
			
			addOrUpdate(type) {
				if (type == 2) {
					delete(this.updateForm.createTime)
					delete(this.updateForm.updateTime)
				}
				// 处理数据
				let obj = this[type==1?"addForm":"updateForm"].locationIds.map(val => {
					return val[2]
				})
				this[type==1?"addForm":"updateForm"].locationIds = obj.join(",")

				this.$refs[type == 1 ? "addForm" : "updateForm"].validate((valid) => {
					if (!valid) {
						return
					}
					console.log(this.updateForm);
					this.$request.post({
						url: "merchant/merchantFreightTemplate/add",
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
			// 获取区域列表
			getLocationList() {
				this.$request.post({
					url: "merchant/merchantGroupGoods/locationList",
					params: {},
					success: (res) => {
						this.totalLocation = JSON.parse(JSON.stringify(res))
						this.search();
						
						let arr = res
						let list = []
						arr.map((val1, i) => {
							// val.parentVal 不存在即为省  或直辖市
							if (!val1.parentVal) {
								let obj = arr.splice(i, 1)[0]
								// 排除直辖市  北京市、天津市、上海市、重庆市
								obj.children = []
								list.push(obj)
							}
						})
						arr.map((val1, i) => {
							list.forEach((item, key) => {
								// 省的val 对应市的parentVal
								if (item.val == val1.parentVal) {
									// console.log(item,val1);
									let obj2 = arr.splice(i, 1)[0]
									obj2.children = []
									item.children.push(obj2)
								} else {
									item.children.some(pro => {
										if (pro.val == val1.parentVal) {
											pro.children.push(val1)
										}
									})
								}
							})
						})

						this.locationList = list
					},
				});
			},
			// 数组去重
			unique(arr){
				return Array.from(new Set(arr));
			},
			// 处理地域名
			dealArea(str){
				let arr = this.reLocationList(str)
				let arr1 = this.unique(arr.map(item=>item[0]))
				let arr2 =[]
				this.totalLocation.map(val=>{
					arr1.forEach(item=>{
						if(item == val.id){
							arr2.push(val.name)
						}
					})
				})
				return arr2
				console.log(arr2);
			},
			
			getList() {
				this.load = true;
				this.$request.post({
					url: "merchant/merchantFreightTemplate/list",
					params: this.params,
					success: (result) => {
						if (this.params.isCount) {
							this.total = result.total;
						}
						this.params.isCount = false;
						this.list = result.list;
						this.list.forEach(val=>{
							val.locationList = this.dealArea(val.locationIds)
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
			deleteItem(id) {
				this.$confirm('此操作将永久删除该区域设置, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
					center: true
				}).then(() => {
					this.$request.post({
						url: "merchant/merchantFreightTemplate/remove",
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
				
				// 处理修改限购区域
				let str = this.updateForm.locationIds
				console.log(str);
				this.updateForm.locationIds = this.reLocationList(str)
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
