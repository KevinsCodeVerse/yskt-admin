<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>土地详情
			<span slot="after" @click="$router.go(-1)" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回上一页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
		</main-head>

		<div v-if="show">
			<el-card style="margin-top: 20px" shadow="hover">
				<el-empty description="您现在还没有土地呢~"></el-empty>
			</el-card>
		</div>
		<div v-else>
			<el-card style="margin-top: 20px" shadow="hover">
				<el-form :model="plotFrom" :rules="rule" label-width="30" ref="plot" label-position="top">
					<el-row>
						<el-col :span="8">
							<el-form-item label="主图:" prop="avatar">
								<upload ref="avatar" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="背景图:" prop="banner">
								<upload ref="banner" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
							</el-form-item>
						</el-col>
					</el-row>

					<el-row>
						<el-col :span="16">
							<el-form-item label="土地名称" prop="plotName">
								<el-input v-model="plotFrom.plotName" clearable placeholder="请输入土地名称"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="7" style="margin-left: 20px;">
							<el-form-item label="标签：" prop="label">
								<!-- <template slot-scope="scope"> -->
								<el-tag :key="tag" v-for="(tag,index) in plotFrom.label" closable
									:disable-transitions="false" @close="handleClose(tag)"
									style="margin: 0px 5px 0px 5px;" :type="tagCss(index)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
									ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm"
									@blur="handleInputConfirm" style="width: 100px;">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput"
									v-if="plotFrom.label.length<4">+ 新标签
								</el-button>
								<!-- </template> -->
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="5">
							<el-form-item label="所属人名称 :" prop="name">
								<el-input v-model="plotFrom.name" clearable placeholder="请输入所属人名称" style="width: 90%">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="联系方式 :" prop="phone">
								<el-input v-model="plotFrom.phone" clearable placeholder="请输入菜地名称" style="width: 90%">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="总长(m) :" prop="lon">
								<el-input v-model="plotFrom.lon" clearable placeholder="请输入总长" style="width: 90%"
									type="Number">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="总宽(m)  :" prop="wide">
								<el-input v-model="plotFrom.wide" clearable placeholder="请输入总宽" style="width: 90%"
									type="Number">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="占地面积(m²) :" prop="mu">
								<el-input v-model="plotFrom.mu" clearable placeholder="请输入占地面积" type="Number"
									style="width: 90%"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="2">
							<el-form-item label="租赁押金(元) :" prop="deposit">
								<el-input v-model="plotFrom.deposit" clearable placeholder="押金" type="Number"
									style="width: 90%"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3">
							<el-form-item label="土地类型" prop="businessType">
								<el-select v-model="plotFrom.businessType" placeholder="选择分类" clearable
									style="width: 150px;">
									<el-option v-for="item in typeList" :key="item.id" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item label="是否开放？" prop="openType">
								<el-select v-model="plotFrom.openType" placeholder="选择分类" clearable
									style="width: 150px;">
									<el-option v-for="item in openList" :key="item.id" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="4" v-if="plotFrom.businessType==1||plotFrom.businessType==2">
							<el-form-item label="种植开放时间" prop="type">
								<el-time-picker v-model="plotFrom.growOpenTime" placeholder="任意时间点"
									value-format="HH:mm">
								</el-time-picker>
							</el-form-item>
						</el-col>
						<el-col :span="4" v-if="plotFrom.businessType==1||plotFrom.businessType==2">
							<el-form-item label="种植关闭时间" prop="type">
								<el-time-picker v-model="plotFrom.growOverTime" placeholder="任意时间点"
									value-format="HH:mm">
								</el-time-picker>
							</el-form-item>
						</el-col>
						<el-col :span="2" v-if="plotFrom.businessType==1||plotFrom.businessType==2">
							<el-form-item label="最大种植人数" prop="growCount">
								<el-input v-model="plotFrom.growCount" placeholder="-1为不限制" style="width: 100px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4" v-if="plotFrom.businessType==0||plotFrom.businessType==2">
							<el-form-item label="采摘开放时间" prop="type">
								<el-time-picker v-model="plotFrom.pickOpenTime" placeholder="任意时间点"
									value-format="HH:mm">
								</el-time-picker>
							</el-form-item>
						</el-col>
						<el-col :span="4" v-if="plotFrom.businessType==0||plotFrom.businessType==2">
							<el-form-item label="采摘关闭时间" prop="type">
								<el-time-picker v-model="plotFrom.pickOverTime" placeholder="任意时间点"
									value-format="HH:mm">
								</el-time-picker>
							</el-form-item>
						</el-col>
					</el-row>


					<el-form-item label="土地所在位置" prop="address">
						<el-input v-model="plotFrom.address" placeholder="请输入土地地址 如xx市xx镇xx号,用户将在小程序上根据此地址导航到您的土地处"
							style="width: 82.5%"></el-input>
						<el-button type="success" @click="codeAddress()">定位并修改地址</el-button>
					</el-form-item>
					<div id="container" ref="cid"></div>



					<el-form-item label="简介" prop="overview">
						<el-input v-model="plotFrom.overview" placeholder="请输入简介" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="详情" prop="content">
						<editor :isClear="true" :value.sync="plotFrom.content" :uploadImgServer="this.uploadImg.url"
							@uploadSuccess="addFileUrl" @idUrl="setIdUrl"></editor>
					</el-form-item>
					<el-form-item label="">
						<el-button @click="save()" type="primary" icon="iconfont iconbaocun"
							style="margin-left: 43%;margin-right: 20px;">保存并提交信息
						</el-button>
						<span
							style="color: red;font-size: 10px;">种植or采摘的开放关闭时间，如果土地类型不为全部支持，可以不用全部都填，只填对应自己土地类型的就可以了喔~</span>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script>
	import editor from '@/components/utils/CustomWangEditor';
	import Upload from '@/components/utils/Upload';
	import {
		TMap
	} from "@/utils/TMap";
	export default {
		components: {
			editor,
			Upload
		},
		data() {
			return {
				uploadImg: {
					url: "merchant/merchantVegetablePlot/uploadImg",
					//存放返回的图片路径
					array: [],
					//关闭之前判断商品是否添加，未添加时为false，删除服务器图片
					addStatus: false
				},
				plotFrom: {
					label: []
				},
				dialog: false,
				show: false,
				id: "",
				regionFrom: {},
				inputVisible: false,
				inputValue: "",
				rule: {
					avatar: {
						message: "请上传主图",
						required: true
					},
					plotName: {
						message: "请输入土地名称",
						required: true
					},
					name: {
						message: "请输入姓名",
						required: true
					},
					phone: {
						message: "请输入手机号",
						required: true
					},
					businessType: {
						message: "请选择土地类型",
						required: true
					},
					openType: {
						message: "请选择是否公开",
						required: true
					},
					address: {
						message: "请选择定位地址，否则用户无法导航到您的土地处",
						required: true
					},
					content: {
						message: "请填写详细信息",
						required: true
					},
					overview: {
						message: "请填写简介",
						required: true
					},
					banner: {
						message: "请上传背景图",
						required: true
					},
				},
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
				openList: [{
					value: 1,
					label: "公开"
				}, {
					value: 2,
					label: "私有"
				}, ],
			};
		},

		mounted() {
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				this.id = url.substr(url.indexOf("=") + 1);
				this.detail(this.id);
			} else {
				this.show = true
			}
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
			save() {
				console.log("this.plotFrom", this.plotFrom);
				let rawLabel = this.plotFrom.label;
				let _this = this
				this.$nextTick(() => {
					this.plotFrom.avatar = this.$refs.avatar.getPaths();
					this.plotFrom.banner = this.$refs.banner.getPaths();
					this.plotFrom.label = JSON.stringify(this.plotFrom.label)
					this.$refs["plot"].validate((valid) => {
						if (!valid) {
							this.$message.warning("还有一些信息没有填写完全，请仔细核对后再提交喔")
							this.plotFrom.label = JSON.parse(this.plotFrom.label)
							return;
						}
						//提交数据
						this.$request.post({
							url: "merchant/merchantVegetablePlot/savePlot",
							params: this.plotFrom,
							success: (result) => {
								this.$message.success(result)
								this.uploadImg = {
									url: "merchant/merchantVegetablePlot/uploadImg",
									//存放返回的图片路径
									array: [],
									//关闭之前判断商品是否添加，未添加时为false，删除服务器图片
									addStatus: false
								}
								setTimeout(function() {
									_this.detail(_this.id)
								}, 500)
								this.$router.push('/plot/region/')
							},
							error: (result) => {
								this.plotFrom.label = JSON.parse(rawLabel)
							}
						});

					})

					//提交
				})
			},
			switchType(type) {
				switch (type) {
					case 0:
						return "采摘"
					case 1:
						return "种植"
					case 2:
						return "采摘和种植"
				}
			},
			detail(id) {
				this.$request.post({
					url: "merchant/merchantVegetablePlot/detail",
					params: {
						id
					},
					success: (result) => {
						if (result == null) {
							this.show = true
						} else {
							this.plotFrom = result
							this.plotFrom.label = JSON.parse(this.plotFrom.label)
							this.uploadImg.url = this.uploadImg.url + "?urlId=" + this.plotFrom.urlId
							//子组件渲染完毕执行
							this.$nextTick(() => {
								this.$refs.avatar.clean();
								this.$refs.banner.clean();
								this.$refs.avatar.addPathList(result.avatar)
								this.$refs.banner.addPathList(result.banner);
							});
							this.TencentMap();
						}

					},
					error: () => {
						this.show = true
					},
				});
			},

			//创建地图
			TencentMap() {
				let _this = this;
				//这里填自己的key
				TMap("BIEBZ-KBNRD-FII4L-PUKSS-I5YZE-AUF3J").then((qq) => {
					//地图经纬赋值
					const myLatlng = new qq.maps.LatLng(
						this.plotFrom.lat,
						this.plotFrom.lng,
					);
					const map = new qq.maps.Map(_this.$refs.cid, {
						center: myLatlng, //位置
						zoom: 16, //放大程度
						mapTypeId: qq.maps.MapTypeId.ROADMAP,
					});

					//创建定位实例
					this.geocoder = new qq.maps.Geocoder();
					//调用地址定位
					this.codeAddress()
					//地址定位回调
					this.geocoder.setComplete(function(result) {
						_this.plotFrom.lng = result.detail.location.lng;
						_this.plotFrom.lat = result.detail.location.lat;
						_this.plotFrom.province = result.detail.addressComponents.province
						_this.plotFrom.city = result.detail.addressComponents.city
						_this.$message.success("定位成功!");
						map.setZoom(16)
						map.setCenter(result.detail.location);
						var marker = new qq.maps.Marker({
							map: map,
							position: result.detail.location,
						});
						//监听回调函数并将返回的经纬度赋值到数据上
						qq.maps.event.addListener(marker, "click", function(event) {
							this.visible = true;
						});
					});
					this.geocoder.setError(function(result) {
						_this.$message.error("地址错误！最低搜索地址为市级");
					});
				});
			},
			//根据城市区级搜索
			codeAddress() {
				let address = this.plotFrom.province + this.plotFrom.city + this.plotFrom
					.area + this.plotFrom.address
				console.log(address)
				this.geocoder.getLocation(address);
			},

			//存储图片url数组
			addFileUrl(data) {
				this.uploadImg.array.push(data);
			},
			//设置路径id
			setIdUrl(data) {
				this.uploadImg.url = "admin/adGoods/uploadImg?urlId=" + data;
				this.plotFrom.urlId = data
			},



			//标签输入框
			handleClose(tag) {
				console.log(tag)
				this.plotFrom.label.splice(this.plotFrom.label.indexOf(tag), 1);
				console.log(this.plotFrom)
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.plotFrom.label.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			tagCss(tag) {
				switch (tag) {
					case 0:
						return "success"
					case 1:
						return ""
					case 2:
						return "warning"
					case 3:
						return "danger"
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

	el-card {}
</style>
