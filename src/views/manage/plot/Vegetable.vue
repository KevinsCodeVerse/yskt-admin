<template>
	<div id="sys_params">
		<main-head><i id="head" class="iconfont iconshengxian-shucai1"></i>蔬菜/瓜果管理

			<el-button slot="after" @click="openAddDialog()" type="success" size="medium" icon="el-icon-plus">添加果蔬
			</el-button>
		</main-head>

		<main-content>
			<el-form :inline="true" :model="params" class="demo-form-inline">
				<el-form-item label="创建日期">
					<el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期" @change="dateSearch()" clearable>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="">
					<el-input v-model="params.title" placeholder="输入蔬菜/瓜果名称模糊搜索" clearable></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-select v-model="params.categoryId" placeholder="蔬菜/瓜果分类" clearable @change="search()">
						<el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="">
					<el-select v-model="params.type" placeholder="采种类型" clearable @change="search()">
						<el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="search()"><i class="iconfont iconsousuo"></i>搜索</el-button>
			</el-form>
			<el-table :data="list" stripe style="width: 100%" v-loading="load">
				<el-table-column prop="plotId" label="菜地id" align="center"></el-table-column>
				<el-table-column prop="title" label="标题" align="center"></el-table-column>
				<el-table-column prop="categoryName" label="分类名称" align="center"></el-table-column>
				<el-table-column prop="avatar" label="首图" align="center" width="200">
					<template slot-scope="scope">
						<el-image style="width: 100px; height: 100px; border-radius: 50%" :src="scope.row.avatar"
							:preview-src-list="scope.row.avatar.split(',')">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="img" label="轮播图" align="center" width="400">
					<template slot-scope="scope">
						<el-image v-for="(item,index) in JSON.parse(scope.row.img)"
							:preview-src-list="JSON.parse(scope.row.img)" class="img" :src="item">
						</el-image>
					</template>
				</el-table-column>
				<el-table-column prop="overview" label="简介" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="price" label="价格" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						{{scope.row.price}}￥
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
						<el-button type="primary" size="mini" @click="openUpdateDialog(scope.row.id)">
							<i class="iconfont iconxiangqing-"></i>详情
						</el-button>
						<el-button type="success" size="mini" @click="update(scope.row.id)" v-if="scope.row.status==-1">
							<i class="iconfont iconshangjia1"></i>上架
						</el-button>
						<el-button type="info" size="mini" @click="update(scope.row.id)" v-if="scope.row.status==0">
							<i class="iconfont iconxiajia"></i>下架
						</el-button>
						<el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">
							<i class="iconfont iconxiajia"></i>删除
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

			<!-- 修改弹框 -->
			<el-dialog title="详情" :visible.sync="updateDialog" width="55%" :close-on-click-modal="false"
				:close-on-press-escape="false" :show-close="false" center>
				<div v-loading="dialogLoging">
					<el-form :model="updateForm" :rules="rule" :label-width="labelWidth" ref="update">
						<el-row>
							<el-col :span="8">
								<el-form-item label="果蔬id:" prop="id">
									{{updateForm.id}}
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="土地id:" prop="id">
									{{updateForm.plotId}}
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="名称:" prop="title">
									<el-input v-model="updateForm.title" clearable placeholder="请输入果蔬名称"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="果蔬分类:" prop="categoryId">
									<el-select v-model="updateForm.categoryId" placeholder="蔬菜/瓜果分类" clearable>
										<el-option v-for="item in categoryList" :key="item.id" :label="item.name"
											:value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="摘种类型:" prop="type">
									<el-select v-model="updateForm.type" placeholder="采种类型" clearable>
										<el-option v-for="item in typeList" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="10">
								<el-tooltip class="item" effect="dark" placement="bottom-start">
									<div slot="content">
										推广员(任意用户)在小程序内任意页面分享给用户<br />
										该用户点进链接后绑定推广员<br />
										此后该用户每次购买该拼单商品后，推广员都会获得一次佣金<br />
										(设置0则无佣金)
									</div>
									<el-form-item label="推广佣金" prop="commission" class="oneRow" label-width="100">
										<el-input-number style="width: 230px;" v-model="updateForm.commission" :min="0.00"
											clearable placeholder="请设置商品推广佣金" size="mini">
										</el-input-number>
									</el-form-item>
								</el-tooltip>
							</el-col>

							<el-col :span="8" v-if="updateForm.type==0||updateForm.type==2">
								<el-form-item label="所属区域:" prop="regionId">
									<el-select v-model="updateForm.regionId" placeholder="采种类型" clearable>
										<el-option v-for="item in regionList" :key="item.id" :label="item.name"
											:value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="主图:" prop="avatar">
							<upload ref="updateAvatar" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
						</el-form-item>
						<el-form-item label="轮播图" prop="img">
							<upload :isMultiple="true" :bigBox="true" ref="updateImg" :limit_size="3" :ImgSize="5">
							</upload>
						</el-form-item>
						<el-row><span
								style="font-size: 2px; color: red;">种植或者采摘的对应价格或区域，如果土地类型不为全部支持，可以不用全部都填，只填对应自己土地类型的就可以了喔~</span>
						</el-row>
						<el-row>
							<el-col :span="12" v-if="updateForm.type==0||updateForm.type==2">
								<el-form-item label="采摘单价(元/斤)" prop="price" size="medium" label-width="200">
									<el-input-number v-model="updateForm.price" :precision="2" :step="0.1" :min="0"
										placeholder="输入单价">
									</el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="采摘库存" prop="inventory"
									v-if="updateForm.type==0||updateForm.type==2">
									<el-input-number v-model="updateForm.inventory" placeholder="-1为无限库存" :min="-1"
										style="width: 200px;">
									</el-input-number>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" v-if="updateForm.type==1||updateForm.type==2">
								<el-form-item label="种植价格" prop="price" size="medium">
									<el-input-number v-model="updateForm.growPrice" :precision="2" :step="0.1" :min="0"
										placeholder="输入单价">
									</el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="种植库存" prop="growInventory"
									v-if="updateForm.type==1||updateForm.type==2">
									<el-input-number v-model="updateForm.growInventory" placeholder="-1为无限库存" :min="-1"
										style="width: 200px;">
									</el-input-number>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="视频:" prop="video">
							<video class="video" controls v-if="videoShow" :src="videoShow" width="30%" />
							<input ref="videoFile" @change="fileChange($event)" type="file" id="video_file"
								accept="video/*" />
							<el-button type="warning" @click="cleanFile()" size="mini">重置</el-button>
						</el-form-item>
						<el-form-item label="简介:" prop="overview">
							<el-input v-model="updateForm.overview" clearable type="textarea" placeholder="请输入简介">
							</el-input>
						</el-form-item>
						<el-form-item label="图文详情:" prop="content">
							<editor :isClear="true" :value.sync="updateForm.content"
								:uploadImgServer="this.uploadImg.url" @uploadSuccess="addFileUrl" @idUrl="setIdUrl">
							</editor>
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer" style="margin-left: 40%;">
						<el-button @click="updateSave()" type="primary" :disabled="updateBan">提交修改</el-button>
						<el-button @click="closeDialog()" type="info">关闭</el-button>
						<br />
					</span>
				</div>
			</el-dialog>


			<!-- 添加弹框 -->
			<el-dialog title="添加果蔬" :visible.sync="addDialog" width="55%" :close-on-click-modal="false"
				:close-on-press-escape="false" :show-close="false" center>
				<div v-loading="dialogLoging">
					<el-form :model="addForm" :rules="rule" :label-width="labelWidth" ref="add">
						<el-row gutter="20">
							<el-col :span="8">
								<el-form-item label="名称:" prop="title">
									<el-input v-model="addForm.title" clearable placeholder="请输入果蔬名称"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-tooltip class="item" effect="dark" placement="bottom-start">
									<div slot="content">
										推广员(任意用户)在小程序内任意页面分享给用户<br />
										该用户点进链接后绑定推广员<br />
										此后该用户每次购买该拼单商品后，推广员都会获得一次佣金<br />
										(设置0则无佣金)
									</div>
									<el-form-item label="推广佣金" prop="commission" class="oneRow" label-width="100">
										<el-input-number style="width: 230px;" v-model="addForm.commission" :min="0.00"
											clearable placeholder="请设置商品推广佣金" size="mini">
										</el-input-number>
									</el-form-item>
								</el-tooltip>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="8">
								<el-form-item label="果蔬分类:" prop="categoryId">
									<el-select v-model="addForm.categoryId" placeholder="蔬菜/瓜果分类" clearable>
										<el-option v-for="item in categoryList" :key="item.id" :label="item.name"
											:value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="摘种类型:" prop="type">
									<el-select v-model="addForm.type" placeholder="采种类型" clearable>
										<el-option v-for="item in typeList" :key="item.id" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :span="8">
								<el-form-item label="所属区域:" prop="regionId">
									<el-select v-model="addForm.regionId" placeholder="果蔬的区域" clearable>
										<el-option v-for="item in regionList" :key="item.id" :label="item.name"
											:value="item.id">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="主图:" prop="avatar">
							<upload ref="addAvatar" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
						</el-form-item>
						<el-form-item label="轮播图" prop="img">
							<upload :isMultiple="true" :bigBox="true" ref="addImg" :limit_size="3" :ImgSize="5">
							</upload>
						</el-form-item>
						<el-row><span
								style="font-size: 2px; color: red;">种植或者采摘的对应价格或区域，如果土地类型不为全部支持，可以不用全部都填，只填对应自己土地类型的就可以了喔~</span>
						</el-row>
						<el-row>
							<el-col :span="12" v-if="addForm.type==0||addForm.type==2">
								<el-form-item label="采摘单价(元/斤)" prop="price" size="medium" label-width="200">
									<el-input-number v-model="addForm.price" :precision="2" :step="0.1" :min="0"
										placeholder="输入单价">
									</el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="采摘库存" prop="inventory" v-if="addForm.type==0||addForm.type==2">
									<el-input-number v-model="addForm.inventory" placeholder="-1为无限库存" :min="-1"
										style="width: 200px;">
									</el-input-number>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12" v-if="addForm.type==1||addForm.type==2">
								<el-form-item label="种植价格" prop="price" size="medium">
									<el-input-number v-model="addForm.growPrice" :precision="2" :step="0.1" :min="0"
										placeholder="输入单价">
									</el-input-number>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="种植库存" prop="growInventory" v-if="addForm.type==1||addForm.type==2">
									<el-input-number v-model="addForm.growInventory" placeholder="-1为无限库存" :min="-1"
										style="width: 200px;">
									</el-input-number>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="视频:" prop="video">
							<video class="video" controls v-if="videoShow" :src="videoShow" width="30%" />
							<input ref="videoFile" @change="fileChange($event)" type="file" id="video_file"
								accept="video/*" />
							<el-button type="warning" @click="cleanFile()" size="mini">重置</el-button>
						</el-form-item>
						<el-form-item label="简介:" prop="overview">
							<el-input v-model="addForm.overview" clearable type="textarea" placeholder="请输入简介">
							</el-input>
						</el-form-item>
						<el-form-item label="图文详情:" prop="content">
							<editor :isClear="true" :value.sync="addForm.content" :uploadImgServer="this.uploadImg.url"
								@uploadSuccess="addFileUrl" @idUrl="setIdUrl">
							</editor>
						</el-form-item>
					</el-form>
					<span slot="footer" class="dialog-footer" style="margin-left: 40%;">
						<el-button @click="addSave()" type="primary" :disabled="updateBan">添加果蔬</el-button>
						<el-button @click="closeDialog()" type="info">关闭</el-button>
						<br />
					</span>
				</div>
			</el-dialog>
		</main-content>
	</div>
</template>

<script>
	import editor from '@/components/utils/CustomWangEditor';
	import upload from '@/components/utils/Upload';

	export default {
		components: {
			editor,
			upload
		},
		data() {
			return {
				uploadImg: {
					url: "merchant/merchantVegetable/uploadImg",
					//存放返回的图片路径
					array: [],
					//关闭之前判断商品是否添加，未添加时为false，删除服务器图片
					addStatus: false
				},
				videoShow: "",
				dialogLoging: false,
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
				regionList: [],
				//表单Label宽度
				labelWidth: "100px",
				form: {
					avatar: ""
				},
				updateBan: false,
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
				updateForm: {},
				addForm: {
					type: 0
				},
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
					content: {
						message: "请填写详情",
						required: true
					},
					type: {
						message: "请选择摘种类型",
						required: true
					},
					img: {
						message: "请上传轮播图",
						required: true
					},

				}
			};
		},

		mounted() {
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				this.params.id = url.substr(url.indexOf("=") + 1, 1);
			}
			this.getCategoryList();
			this.getRegionList()
			this.search();
			this.updateHtml()
		},

		methods: {
			updateHtml() {
				let a = document.querySelector('div[data-title^=图片]')
				let img = document.querySelector("i[class=w-e-icon-image]")
				img.remove()
				var t = document.createTextNode("插入图片");
				a.appendChild(t)
			},
			deleteItem(id) {
				this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'error',
					center: true
				}).then(() => {
					this.$request.post({
						url: "merchant/merchantVegetable/delete",
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
			addSave() {
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
							this.dialogLoging = true;
							const formData = new FormData();
							// formData.append("id", this.addForm.id);
							formData.append("categoryId", this.addForm.categoryId);


							if (this.addForm.video instanceof File) {
								console.log("有视频")
								formData.append("video", this.addForm.video);
							}

							if (this.addForm.price != undefined) {
								formData.append("price", this.addForm.price);
							}
							if (this.addForm.growPrice != undefined) {
								formData.append("growPrice", this.addForm.growPrice);
							}
							if (this.addForm.inventory != undefined) {
								formData.append("inventory", this.addForm.inventory);
							}
							if (this.addForm.growInventory != undefined) {
								formData.append("growInventory", this.addForm.growInventory);
							}
							formData.append("content", this.addForm.content);
							formData.append("avatar", this.addForm.avatar);
							formData.append("overview", this.addForm.overview);
							formData.append("img", this.addForm.img);
							formData.append("title", this.addForm.title);
							formData.append("type", this.addForm.type);
							formData.append("regionId", this.addForm.regionId);
							formData.append("commission", this.addForm.commission);
							if (this.addForm.urlId != undefined) {
								formData.append("urlId", this.addForm.urlId);
							}
							this.$request.post({
								url: "merchant/merchantVegetable/addVegetable",
								params: formData,
								success: (result) => {
									this.$message.success("添加成功");
									this.addDialog = false;
									this.addForm = {};
									this.uploadImg.addStatus = true
									this.videoShow = ""
									this.dialogLoging = false
									this.getList()
								},
							});
						}
					})
				})
			},
			updateSave() {
				this.$nextTick(() => {
					this.updateForm.avatar = this.$refs.updateAvatar.getPaths();
					this.updateForm.img = this.$refs.updateImg.getPaths();
					this.$refs["update"].validate((valid) => {
						if (!valid) {
							return
						}
						this.updateForm.img = JSON.stringify(this.updateForm.img);
						if (
							this.updateForm.img.indexOf("[") == -1 &&
							this.updateForm.img.indexOf("]") == -1
						) {
							this.updateForm.img = "[" + this.updateForm.img + "]";
						}
						this.dialogLoging = true;
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
						if (this.updateForm.price != undefined) {
							formData.append("price", this.updateForm.price);
						}
						if (this.updateForm.growPrice != undefined) {
							formData.append("growPrice", this.updateForm.growPrice);
						}
						if (this.updateForm.inventory != undefined) {
							formData.append("inventory", this.updateForm.inventory);
						}
						if (this.updateForm.growInventory != undefined) {
							formData.append("growInventory", this.updateForm.growInventory);
						}
						formData.append("content", this.updateForm.content);
						formData.append("avatar", this.updateForm.avatar);
						formData.append("overview", this.updateForm.overview);
						formData.append("img", this.updateForm.img);
						formData.append("title", this.updateForm.title);
						formData.append("inventory", this.updateForm.inventory);
						formData.append("type", this.updateForm.type);
						formData.append("regionId", this.updateForm.regionId);
						formData.append("commission", this.updateForm.commission);
						if (this.updateForm.urlId != undefined) {
							formData.append("urlId", this.updateForm.urlId);
						}
						this.$request.post({
							url: "merchant/merchantVegetable/updateVegetable",
							params: formData,
							success: (result) => {
								this.$message.success("修改成功");
								this.updateDialog = false;
								this.updateForm = {};
								this.uploadImg.addStatus = true
								this.videoShow = ""
								this.getList()
							},
							finally: () => {
								this.dialogLoging = false;
							}
						});

					})
				})
			},
			//存储图片url数组
			addFileUrl(data) {
				this.uploadImg.array.push(data);
			},
			//设置路径id
			setIdUrl(data) {
				this.uploadImg.url = "admin/adGoods/uploadImg?urlId=" + data;
				this.addForm.urlId = data
				this.updateForm.urlId = data
			},
			getCategoryList() {
				let type = 2;
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
			getRegionList() {
				this.$request.post({
					url: "merchant/merchantVegetable/regionList",
					success: (result) => {
						this.regionList = result
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
					url: "merchant/merchantVegetable/vegetableList",
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
			//修改状态
			update(id) {
				this.$request.post({
					url: "merchant/merchantVegetable/upOrDown",
					params: {
						id
					},
					success: (result) => {
						this.$message.success(result);
						this.search();
					},
				});
			},
			cleanDialog() {
				this.videoShow = ""
				this.form = {};
				this.addForm = {};
				this.updateForm = {};
				this.$nextTick(() => {
					this.$refs.addAvatar.clean()
					this.$refs.addImg.clean()
					this.$refs.updateAvatar.clean()
					this.$refs.updateImg.clean()
				})
			},
			openAddDialog(row) {
				this.videoShow = "";
				this.addDialog = true;
				this.uploadImg = {
					url: "merchant/merchantVegetable/uploadImg",
					addStatus: false,
					array: []
				}
				this.updateHtml()
			},
			openUpdateDialog(id) {
				this.cleanDialog();
				this.updateDialog = true;
				//获得详情
				this.dialogLoging = true

				this.$request.post({
					url: "merchant/merchantVegetable/detail",
					params: {
						id
					},
					success: (result) => {
						this.updateForm = result
						this.uploadImg = {
							url: "merchant/merchantVegetable/uploadImg?urlId=" + result.urlId,
							addStatus: false,
							array: []
						}
						this.videoShow = this.updateForm.video;
						let avatar = this.updateForm.avatar.replace("[", "").replace("]", "");
						let img = this.updateForm.img.replace("[", "").replace("]", "");
						this.$nextTick(() => {
							this.$refs.updateAvatar.addPathList(avatar)
							this.$refs.updateImg.addPathList(img)
						})
						this.dialogLoging = false;
					},
				});
				this.updateHtml()
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

			//关闭弹框
			closeDialog() {
				if (!this.uploadImg.addStatus && this.uploadImg.array.length != 0) {
					let array = JSON.stringify(this.uploadImg.array)
					//未添加商品，删除图片
					this.$request.post({
						url: "merchant/merchantVegetable/deleteImg",
						params: {
							array
						}
					});
				}
				this.addDialog = false
				this.updateDialog = false
				console.log("guanbi")
			}
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
