<template>
	<div id="sys_params">
		<main-head>
			<i id="head" class="iconfont iconshangpin"></i>商品管理
			<el-button slot="after" @click="$router.push('/shop/add')" type="primary" size="medium" icon="el-icon-plus">添加商品
			</el-button>
		</main-head>
		<el-card shadow="never">
			<div slot="header" class="clearfix">
				<span>店铺信息</span>
				<el-button style="float: right; padding: 3px 0" type="text" @click="updateStore=true">修改店铺信息</el-button>
			</div>
			<el-form :inline="true" :model="merchantInfo" class="demo-form-inline">
				<el-form-item>
					<el-image style="width: 150px; height: 150px; border-radius: 50%" :src="merchantInfo.storeAvatar"
						:preview-src-list="merchantInfo.storeAvatar.split(',')">
					</el-image>
				</el-form-item>
				<el-form-item style="margin: 50px 30px 0px 50px">
					<span class="storeName">{{merchantInfo.storeName}}</span>
				</el-form-item>
			</el-form>
		</el-card>
		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()" clearable>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.name" placeholder="输入商品名称模糊搜索" clearable></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-select v-model="params.categoryId" placeholder="选择分类" clearable @change="search()">
						<el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="id" label="id" align="center"></el-table-column>
				<el-table-column prop="title" label="标题" align="center"></el-table-column>
				<el-table-column prop="categoryName" label="分类名称" align="center"></el-table-column>
				<el-table-column prop="avatar" label="主图" align="center" width="200">
					<template slot-scope="scope">
						<el-image style="width: 100px; height: 100px; border-radius: 50%" :src="scope.row.avatar"
							:preview-src-list="scope.row.avatar.split(',')">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="img" label="轮播图" align="center" width="400">
					<template slot-scope="scope">
						<div v-if="scope.row.img!=null">
							<el-image v-for="(item,index) in JSON.parse(scope.row.img)"
								:preview-src-list="JSON.parse(scope.row.img)" class="img" :src="item">
							</el-image>
						</div>
						<span v-else>暂无轮播图</span>
					</template>
				</el-table-column>
				<el-table-column prop="overview" label="简介" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="price" label="单价" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						{{scope.row.price}}￥
					</template>
				</el-table-column>
				<el-table-column prop="inventory" label="库存" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.inventory==-1" style="color: seagreen;">充足</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.status == 0 ? "正常" : "已下架" }}</span>
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
						<el-button type="success" size="mini" @click="updateStatus(scope.row.id)"
							v-if="scope.row.status==-1">
							<i class="iconfont iconshangjia1"></i>上架
						</el-button>
						<el-button type="info" size="mini" @click="updateStatus(scope.row.id)"
							v-if="scope.row.status==0">
							<i class="iconfont iconxiajia"></i>下架
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

			<!-- 添加弹框 -->
			<el-dialog title="添加商品" :visible.sync="addDialog" width="40%" :close-on-click-modal="false"
				:close-on-press-escape="false" :show-close="false">
				<el-form :model="addForm" :rules="rule" :label-width="labelWidth" size="mini" ref="add">
					<el-form-item label="分类类型:" prop="categoryId">
						<el-select v-model="addForm.categoryId" placeholder="选择分类" clearable @change="search()">
							<el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="产品名称" prop="title">
						<el-input v-model="addForm.title" clearable placeholder="请输入产品名称"></el-input>
					</el-form-item>
					<el-form-item label="主图:" prop="avatar">
						<upload ref="addAvatar" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
					</el-form-item>
					<el-form-item label="轮播图">
						<upload :isMultiple="true" :bigBox="true" ref="addImg" :limit_size="5" :ImgSize="10"></upload>
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
								<el-input-number v-model="addForm.price" :precision="2" :step="0.1" :min="0">
								</el-input-number>￥
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="库存" prop="inventory" size="medium">
								<el-input-number v-model="addForm.inventory" placeholder="-1为无限库存" :min="-1">
								</el-input-number>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="简介" prop="overview">
						<el-input v-model="addForm.overview" clearable type="textarea" placeholder="请输入简介"></el-input>
					</el-form-item>
					<el-form-item label="详情" prop="content">
						<editor :isClear="true" :value.sync="addForm.content" :uploadImgServer="this.uploadImg.url"
							@uploadSuccess="addFileUrl" @idUrl="setIdUrl"></editor>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="addGoods()">添 加</el-button>
					<el-button type="primary" @click="closeDialog()">关 闭</el-button>
				</div>
			</el-dialog>

			<!-- 修改弹框 -->
			<el-dialog title="修改商品" :visible.sync="updateDialog" width="45%" :close-on-click-modal="false"
				:close-on-press-escape="false" :show-close="false" :destroy-on-close="false">
				
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
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="updateGoods()" :disabled="updateBan">修 改</el-button>
					<el-button type="primary" @click="closeDialog()">关 闭</el-button>
				</div>
			</el-dialog>

			<!-- 修改店铺信息弹框 -->
			<el-dialog title="修改店铺信息" :visible.sync="updateStore" width="30%" :close-on-click-modal="false"
				:close-on-press-escape="false" :show-close="false">
				<el-form :model="merchantInfo" :rules="rule" :label-width="labelWidth" size="mini" ref="updateStore">
					<el-form-item label="店铺名称" prop="storeName">
						<el-input v-model="merchantInfo.storeName" clearable placeholder="请输入产品名称" maxlength="10"></el-input>
					</el-form-item>
					<el-form-item label="店铺头像:" prop="storeAvatar">
						<upload ref="storeAvatar" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="success" @click="saveInfo()">修 改</el-button>
					<el-button type="primary" @click="updateStore=false">关 闭</el-button>
				</div>
			</el-dialog>
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
					price: 0
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
					price: {
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
					}
				}
			};
		},

		mounted() {
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				this.params.id = url.substr(url.indexOf("=") + 1, 1);
			}
			this.getMerchantInfo();
			this.getCategoryList();
			this.search();
		},

		methods: {
			saveInfo() {
				this.$nextTick(() => {
					this.merchantInfo.storeAvatar = this.$refs.storeAvatar.getPaths();
					this.$refs["updateStore"].validate((valid) => {						
						this.$request.post({
							url: "merchant/merchantGoods/updateStore",
							params: this.merchantInfo,
							success: (result) => {
								this.$message.success("修改成功");
								this.updateStore = false;
								this.getMerchantInfo()
							},
						});
					})
				})
			},
			getMerchantInfo() {
				this.$request.post({
					url: "merchant/merchantGoods/getMerchantInfo",
					success: (result) => {
						this.merchantInfo.storeAvatar = result.storeAvatar
						this.merchantInfo.storeName = result.storeName
					},
				});
			},
			//上传商品
			addGoods() {
				this.$nextTick(() => {
					this.addForm.avatar = this.$refs.addAvatar.getPaths();
					this.addForm.img = this.$refs.addImg.getPaths();
					this.$refs["add"].validate((valid) => {
						if (valid) {
							this.addForm.img = JSON.stringify(this.addForm.img);
							if (
								this.addForm.img.indexOf("[") == -1 &&
								this.addForm.img.indexOf("]") == -1
							) {
								this.addForm.img = "[" + this.addForm.img + "]";
							}
							const formData = new FormData();
							formData.append("categoryId", this.addForm.categoryId);
							formData.append("video", this.addForm.video);
							formData.append("price", this.addForm.price);
							formData.append("content", this.addForm.content);
							formData.append("avatar", this.addForm.avatar);
							formData.append("overview", this.addForm.overview);
							formData.append("img", this.addForm.img);
							formData.append("title", this.addForm.title);
							formData.append("inventory", this.addForm.inventory);
							if (this.addForm.urlId != undefined) {
								formData.append("urlId", this.addForm.urlId);
							}
							this.$request.post({
								url: "merchant/merchantGoods/addGoods",
								params: formData,
								success: (result) => {
									this.$message.success("添加成功");
									this.addDialog = false;
									this.addForm = {};
									this.uploadImg.addStatus = true
									this.videoShow = ""
									this.getList()
								},
							});
						}
					})
				})
			},

			//修改商品
			updateGoods() {
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

							const formData = new FormData();
							formData.append("id", this.updateForm.id);
							formData.append("categoryId", this.updateForm.categoryId);
							if (this.updateForm.video instanceof File) {
								console.log("有视频")
							} else {
								if (this.updateForm.video != undefined && this.updateForm.video.indexOf(
										"file") != -1) {
									formData.append("hasVideo", true);
								}
							}
							formData.append("video", this.updateForm.video);
							formData.append("price", this.updateForm.price);
							formData.append("content", this.updateForm.content);
							formData.append("avatar", this.updateForm.avatar);
							formData.append("overview", this.updateForm.overview);
							formData.append("img", this.updateForm.img);
							formData.append("title", this.updateForm.title);
							formData.append("inventory", this.updateForm.inventory);
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
									this.getList()
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
						this.getList()
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
							this.getList()
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
				console.log("关闭回调")
			},

			//存储图片url数组
			addFileUrl(data) {
				this.uploadImg.array.push(data);
			},
			//设置路径id
			setIdUrl(data) {
				this.uploadImg.url = "merchant/merchantGoods/uploadImg?urlId=" + data;
				this.addForm.urlId = data
				this.updateForm.urlId = data
			},
			getCategoryList() {
				let type = 1;
				this.$request.post({
					url: "system/sysCategory/listNoPage",
					params: {
						type
					},
					success: (result) => {
						this.categoryList = result
					},
				});
			},
			search() {
				this.params.pageNo = 1;
				this.params.isCount = true;
				this.getList();
			},

			getList() {
				this.load = true;
				this.$request.post({
					url: "merchant/merchantGoods/list",
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
				localStorage.setItem('row',JSON.stringify(row))
				this.$router.push({
				  path: '/shop/edit'
				})
				return
				
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
				this.addForm.video = files[0];
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
					this.addForm.video = "",
					this.videoShow = ""
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
