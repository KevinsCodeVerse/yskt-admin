<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>团购添加
			<span slot="after" @click="$router.go(-1)" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回上一页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
		</main-head>

		<el-card style="margin-top: 20px;margin-bottom: 100px;" shadow="hover">
			<el-form :model="updateForm" :rules="rule" :label-width="labelWidth" size="mini" ref="update">
				<el-form-item label="分类类型:" prop="categoryId">
					<el-select v-model="updateForm.categoryId" placeholder="选择分类" clearable @change="search()">
						<el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="产品名称" prop="title">
					<el-input v-model="updateForm.title" clearable placeholder="请输入产品名称"></el-input>
				</el-form-item>
				<el-form-item label="主图:" prop="avatar">
					<upload ref="updateAvatar" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
				</el-form-item>
				<el-form-item label="轮播图">
					<upload :isMultiple="true" :bigBox="true" ref="updateImg" :limit_size="5" :ImgSize="10">
					</upload>
				</el-form-item>
				<el-form-item label="视频:" prop="video">
					<video class="video" controls v-if="videoShow" :src="videoShow" width="30%" />
					<input ref="videoFile" @change="fileChange($event)" type="file" id="video_file"
						accept="video/*" />
					<el-button type="warning" @click="cleanFile()" size="mini">重置</el-button>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="单价(元)" prop="price" size="medium">
							<el-input-number v-model="updateForm.price" :precision="2" :step="0.1" :min="0">
							</el-input-number>￥
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="库存" prop="inventory" size="medium">
							<el-input-number v-model="updateForm.inventory" placeholder="-1为无限库存" :min="-1">
							</el-input-number>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="简介" prop="overview">
					<el-input v-model="updateForm.overview" clearable type="textarea" placeholder="请输入简介">
					</el-input>
				</el-form-item>
				<el-form-item label="详情" prop="content">
					<editor :isClear="true" :value.sync="updateForm.content" :uploadImgServer="this.uploadImg.url"
						@uploadSuccess="addFileUrl" @idUrl="setIdUrl"></editor>
				</el-form-item>
			



				<!-- -------规格-------- -->
				<el-descriptions title="规格设置"></el-descriptions>
				<el-switch style="margin: 30px 0;" v-model="updateForm.hasSpec" @change="specChange" active-text="有规格"
					inactive-text="无规格" :inactive-value="false" :active-value="true">
				</el-switch>

				<!-- 规格设置 -->
				<el-row class="row-bg" type="flex" justify='space-around' v-show="updateForm.hasSpec" style="">
					<el-col>
						<!-- 规格分类 -->
						<div class="grid-content bg-purple-light">
							<span class="priceTit">商品规格:</span>
						</div>
						<!-- 规格标签 -->
						<div class="grid-cont">
							<el-tag :key="tag" v-for="tag in bulkPrice" closable :disable-transitions="false"
								@close="handleClose(tag,'bulkPrice')">
								{{tag}}
							</el-tag>
							<el-input class="input-new-tag" v-if="inputVisible1" v-model="inputValue1"
								ref="saveTagInput1" size="small" @keyup.enter.native="handleInputConfirm('bulkPrice')"
								@blur="handleInputConfirm('bulkPrice')">
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput(1)"
								style="border: none;color: #167cf3;">+ 添加</el-button>
						</div>
					</el-col>

					<!-- 添加规格 -->
					<el-col>
						<div class="grid-content bg-purple-light">
							<el-button class="button-new-tag" size="small" @click="addInput" style="color: #167cf3;">
								添加规格</el-button>
						</div>
					</el-col>
				</el-row>


				<!-- 规格参数信息 -->
				<el-row class="row-bg" type="flex" justify='space-around' style="" v-if="updateForm.hasSpec">
					<span style="margin-bottom: 10px;">规格参数信息:</span>
					<!-- 规格信息  -->
					<el-table :data="tableDataAlone" style="width: 100%" border>
						<el-table-column prop="describe" label="规格描述" min-width="230" v-if="updateForm.hasSpec">
						</el-table-column>

						<el-table-column prop="originPrice" label="原价" min-width="230" v-if="updateForm.hasSpec">
							<template slot-scope="scope">
								<el-input-number v-model="scope.row.originPrice" :min="0">
								</el-input-number>￥
							</template>
						</el-table-column>

						<el-table-column prop="price" label="优惠价" min-width="230">
							<template slot-scope="scope">
								<el-input-number v-model="scope.row.price" :min="0">
								</el-input-number>￥
							</template>
						</el-table-column>

						<el-table-column prop="score" label="库存" min-width="230" v-if="updateForm.hasSpec">

							<template slot-scope="scope">
								<el-input-number v-model="scope.row.score" placeholder="-1为无限库存" :min="-1"
									controls-position="right">
								</el-input-number>
							</template>
						</el-table-column>

						<el-table-column prop="discountPrice" label="操作" fixed="right" width="120">
							<template slot-scope="scope">
								<el-button type="primary" @click="deleteRow(scope.row.describe,2)">删 除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-row>

			</el-form>
			<el-button type="success" @click="updateGoods()" :disabled="updateBan">修 改</el-button>
			<el-button type="primary" @click="closeDialog()">关 闭</el-button>



		</el-card>
	</div>
</template>
<script>
	import editor from '@/components/utils/CustomWangEditor';
	import Upload from '@/components/utils/Upload';
	import msg from '@/utils/message'
	import {
		getRowspanMethod
	} from '@/utils/span-method'
	import {
		TMap
	} from "@/utils/TMap";
	export default {
		components: {
			editor,
			Upload
		},
		watch: {
			screenWidth() {
				console.log(1111);
				return this.screenWidth <= 2010 ? '' : 10
			},

		},
		data() {
			return {
				spanMethod: () => {},
				existSpec: false,
				existCount: true,
				// 规格表格
				/* {
					discountPrice: 0,
					peopleCount: 0,
					orignPrice: 0,//原价
					inventory: 0,//库存
				} */
				arr: [],
				count: -1,
				tableData: [],
				tableDataAlone: [],

				// 添加规格标签
				bulkPerson: [],
				bulkPrice: [],
				inputVisible1: false,
				inputVisible2: false,
				inputValue1: '',
				inputValue2: '',
				cateId: 0,

				screenWidth: document.body.clientWidth, // 屏幕宽

				dynamicValidateForm: {
					domains: [{
						value: ''
					}],
					email: ''
				},
				priceList: [],
				priceArr: [],

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
				updateForm: {
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
					timeList: {
						message: "请设置拼团时间",
						required: true
					}
				}
			};
		},
		computed: {

		},
		mounted() {
			
			this.$nextTick(() => {
				this.openUpdateDialog(JSON.parse(localStorage.getItem('row')))
				// this.spanMethod = getRowspanMethod(this.tableData, ['specName', 'peopleCount'])
			});
		},

		methods: {
			specChange() {
				this.tableData = []
				this.bulkPrice = []
				this.bulkPerson = []
				this.tableDataAlone = []
			},
			deleteRow(peopleCount, type) {
				this.$confirm("是否删除?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					if (type == 1) {
						let index = this.tableData.findIndex(val => val.peopleCount == peopleCount)
						this.tableData.splice(index, 1)
						this.spanMethod = getRowspanMethod(this.tableData, ['describe', 'peopleCount'])
					} else {
						let index = this.tableDataAlone.findIndex(val => val.describe == peopleCount)
						this.tableDataAlone.splice(index, 1)
					}
					this.$message.success("删除成功");

				})
			},

			// -----------规格标签-------------
			handleClose(tag, str) {
				this[str].splice(this[str].indexOf(tag), 1);
			},

			showInput(type) {
				if (type == 1) {
					this.inputVisible1 = true;

					this.$nextTick(_ => {
						this.$refs.saveTagInput1.$refs.input.focus();
					});
				} else {
					this.inputVisible2 = true;

					this.$nextTick(_ => {
						this.$refs.saveTagInput2.$refs.input.focus();
					});
				}
			},

			handleInputConfirm(str) {

				if (!this.inputValue1) {
					msg.defaultMsg("规格不能为空")
					return
				}
				console.log(this.bulkPerson);
				let inputValue = this.inputValue1
				if (!this[str].includes(inputValue)) {
					if (inputValue) {
						this[str].push(inputValue);
					}
				} else {
					msg.defaultMsg("不可重复")
				}

				this.inputVisible1 = false
				this.inputValue1 = ''

			},
			// -----------规格标签-------------
			// 规格添加到信息
			addInput() {
				let arr = {};
				// this.updateForm.hasSpec

				if (this.updateForm.hasSpec) {
					if (this.bulkPrice.length == 0) {
						msg.defaultMsg('规格设置不能为空')
						return
					}

					this.bulkPrice.forEach(item => {
						// 单独购买参数信息
						let obj = this.tableDataAlone.find(val => val.describe == item)
						if (!obj) {
							this.tableDataAlone.push({
								describe: item
							})
						}
						// 团购参数信息
						arr = JSON.parse(JSON.stringify(this.tableData));
						arr = arr.map(x => {
							return x.describe
						})
						console.log('arr', arr);
						// debugger
						if (arr.indexOf(item) != -1) {
							// msg.defaultMsg('当前规格已存在')
							let tableItem;
							for (let i = 0; i < this.tableData.length; i++) {
								tableItem = this.tableData[i]

								for (let j = 0; j < this.bulkPerson.length; j++) {
									this.tableData.push({
										describe: tableItem.describe,
										peopleCount: this.bulkPerson[j],
										originalPrice: 0,
										inventory: 0,
									})
									console.log("去重前", this.tableData)
									this.tableData = this.deWeight(this.tableData, "describe", "peopleCount")
									console.log("去重后", this.tableData)
								}
							}
						} else {
							//不存在，直接添加
							this.bulkPerson.forEach(val => {
								this.tableData.push({
									describe: item,
									peopleCount: val,
									originalPrice: 0,
									inventory: 0,
								})
							})
						}

					})
					//排序
					this.tableData = this.tableData.sort((a, b) => {
						undefined
						if (a['describe'] != b['describe']) {
							undefined
							return a['describe'].localeCompare(b['describe']);
						}
					})
					//合并单元格
					this.spanMethod = getRowspanMethod(this.tableData, ['peopleCount', 'describe'])
					this.bulkPerson = []
					this.bulkPrice = []
				}

			},
			deWeight(arr, ...arguements) {
				console.log('arguements', ...arguements);
				let result = []; //新数组
				//总数组与新数组比较，遍历总数组时用新数组的some方法进行判断
				arr.map(o => !result.some(m => this.getBoolean(o, m, ...arguements)) ? result.push(o) : '');
				return result;
			},
			getBoolean(o, m, ...arguements) {
				let list = arguements.map(x => o[x] == m[x]); //值均为布尔
				return list.every(i => i); //要使这些布尔值都真才能满足条件，因为要求的条件是 并且
			},
			removeDomain(item, form) {
				var index = this[form].domains.indexOf(item)
				if (index !== -1) {
					this[form].domains.splice(index, 1)
				}
			},
			addDomain(form) {
				this[form].domains.push({
					value: '',
					key: Date.now()
				});
			},

			//修改商品
			updateGoods() {
				if(this.addForm.hasSpec){
					console.log(this.tableDataAlone);
					if(this.tableDataAlone.length == 0){
						msg.defaultMsg("规格信息不能为空")
						return
					}
				}
				
				this.$nextTick(() => {
					this.updateForm.avatar = this.$refs.updateAvatar.getPaths();
					this.updateForm.img = this.$refs.updateImg.getPaths();
					this.$refs["update"].validate((valid) => {
						if (valid) {
							this.updateForm.img = JSON.stringify(this.updateForm.img);
							if (
								this.updateForm.img.indexOf("[") == -1 &&
								this.updateForm.img.indexOf("]") == -1
							) {
								this.updateForm.img = "[" + this.updateForm.img + "]";
							}
							this.updateForm.hasSpec = this.updateForm.hasSpec ? 1 : -1
							
							const formData = new FormData();
							// formData.append("id", this.updateForm.id);
							if (this.updateForm.video instanceof File) {
								console.log("有视频")
							} else {
								if (this.updateForm.video != undefined && this.updateForm.video
									.indexOf(
										"file") != -1) {
									formData.append("hasVideo", true);
								}
							}
							
							formData.append("id", this.updateForm.id);
							formData.append("categoryId", this.updateForm.categoryId);
							formData.append("price", this.updateForm.price);
							formData.append("video", this.updateForm.video);
							formData.append("hasSpec", this.updateForm.hasSpec);
							formData.append("content", this.updateForm.content);
							formData.append("avatar", this.updateForm.avatar);
							formData.append("overview", this.updateForm.overview);
							formData.append("img", this.updateForm.img);
							formData.append("title", this.updateForm.title);
							formData.append("inventory", this.updateForm.inventory);
							formData.append("specList", JSON.stringify(this.tableDataAlone));
							if (this.updateForm.urlId != undefined) {
								formData.append("urlId", this.updateForm.urlId);
							}
							this.$request.post({
								url: "merchant/merchantGoods/updateGoods",
								params: formData,
								success: (result) => {
									this.$message.success("修改成功");
									this.updateDialog = false;
									this.updateForm = {};
									this.uploadImg.addStatus = true
									this.videoShow = ""
									localStorage.removeItem('row')
									this.$router.go(-1)
								},
							});
						}
					})
				})
			},

			updateStatus(id) {
				this.$request.post({
					url: "merchant/merchantGoods/upOrDown",
					params: {
						id
					},
					success: (result) => {
						this.$message.success("操作成功");
					},
				});
			},

			deleteItem(id) {
				this.$confirm("此操作将永久删除这个商品, 是否删除?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					this.$request.post({
						url: "merchant/merchantGoods/delete",
						params: {
							id
						},
						success: (result) => {
							this.$message.success("删除成功");
						},
					});
				})
			},
			//关闭添加弹框
			closeDialog() {
				if (!this.uploadImg.addStatus && this.uploadImg.array.length != 0) {
					let array = JSON.stringify(this.uploadImg.array)
					//未添加商品，删除图片
					this.$request.post({
						url: "merchant/merchantGoods/deleteImg",
						params: {
							array
						}
					});
				}
				this.addDialog = false
				this.updateDialog = false
				localStorage.removeItem('row')
				this.$router.go(-1)
				
				console.log("关闭回调")
			},

			//存储图片url数组
			addFileUrl(data) {
				this.uploadImg.array.push(data);
			},
			//设置路径id
			setIdUrl(data) {
				this.uploadImg.url = "merchant/merchantGroupGoods/uploadImg?urlId=" + data;
				this.updateForm.urlId = data
				this.updateForm.urlId = data
			},
			getCategoryList() {
				let type = 3;
				this.$request.post({
					url: "system/sysCategory/listNoPage",
					params: {
						type
					},
					success: (result) => {
						this.categoryList = result
						this.categoryList.forEach(val => {
							val.dynamicTags = []
						})
					},
				});
			},
			search() {
				this.params.pageNo = 1;
				this.params.isCount = true;
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


			openAddDialog(row) {
				this.videoShow = ""
				this.addDialog = true;
				//上传图片携带id，给后端区分图片文件夹，方便删除
				this.uploadImg = {
					url: "merchant/merchantGoods/uploadImg",
					addStatus: false,
					array: []
				}
			},

			//打开修改弹框
			openUpdateDialog(row) {
				console.log('row',row);
				this.videoShow = ""
				this.updateForm = JSON.parse(JSON.stringify(row));
				console.log(this.updateForm)
				this.updateDialog = true
				this.videoShow = this.updateForm.video;
				let avatar = this.updateForm.avatar.replace("[", "").replace("]", "");
				let img = this.updateForm.img.replace("[", "").replace("]", "");
				//子组件渲染完毕执行
				this.$nextTick(() => { 
					this.$refs.updateAvatar.clean();
					this.$refs.updateImg.clean();
					this.$refs.updateAvatar.addPathList(avatar);
					this.$refs.updateImg.addPathList(img);
				});
				this.uploadImg = {
					url: "merchant/merchantGoods/uploadImg?urlId=" + row.urlId,
					addStatus: false,
					array: []
				}
				let _this = this
				this.$request.post({
					url: "merchant/merchantGoods/goodsDetail",
					params: {
						id: _this.updateForm.id
					},
					success: (res) => {
						if (this.updateForm.hasSpec == 1) {
							this.updateForm.hasSpec = true
						} else {
							this.updateForm.hasSpec = false
						}
						console.log('1111111111', res);
						this.$nextTick(() => {
							this.tableDataAlone = res.specList
						});
					},
				
				});
				
			},
			//视频上传
			fileChange(e) {
				var files = e.target.files || e.dataTransfer.files;
				if (!files.length) return;
				let name = files[0].name.toLowerCase();
				if (
					!/\.(avi|wmv|mpeg|mp4|mov|mkv|flv|f4v|m4v|rmvb|rm|3gp|dat|ts|mts|vob)$/.test(
						name
					)
				) {
					this.$message.warning("请上传视频");
					return;
				}
				if (files[0].size > 1024 * 1024 * 20) {
					this.$message.warning("视频大小不能大于20M");
					return;
				}
				this.updateBan = true;
				this.updateForm.video = files[0];
				this.updateForm.video = files[0];
				var reader = new FileReader();
				reader.readAsDataURL(files[0]);
				reader.onload = () => {
					//视频回显用
					this.videoShow = reader.result;
					this.updateBan = false;
				};
			},
			cleanFile() {
				this.updateForm.video = "",
					this.updateForm.video = "",
					this.videoShow = ""
			},
		},
	};
</script>

<style>
	.priceTit {
		margin-left: 10px;
		color: #909399;
		font-size: 14px;
		font-weight: bold;

	}

	.grid-cont {
		margin: 20px 0;
		margin-left: 10px;
	}

	.el-tag+.el-tag {
		margin-left: 10px;
	}

	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}

	.el-row {
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.el-col {
		border-radius: 4px;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
		height: 50px;
		line-height: 50px;
		box-sizing: border-box;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.row-bg {
		padding: 10px 0;
		border: 2px solid #eee;
		flex-direction: column;
		padding: 10px;
		background-color: #fff;
	}

	.el-descriptions__header {
		margin-bottom: 0;
	}

	.oneRow {
		display: inline-block;
	}

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

	#container {
		height: 400px;
		width: 70%;
	}

	.w-e-text-container {
		overflow: scroll !important;
		height: 600px;
	}
</style>
