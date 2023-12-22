<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>活动修改
			<span slot="after" @click="closeDialog" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回上一页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
		</main-head>

		<el-card style="margin-top: 20px" shadow="hover">

			<el-form :model="updateForm" :rules="rule" :label-width="labelWidth" size="mini" ref="update">
				<el-form-item label="活动标题" prop="title">
					<el-input v-model="updateForm.title" :maxlength="30" clearable placeholder="请输入活动名称,限字数30">
					</el-input>
				</el-form-item>

				<el-form-item label="活动时间" prop="timeList">
					<el-date-picker v-model="updateForm.timeList" type="datetimerange"
						value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="活动背景图:" prop="banner">
					<upload ref="updateAvatar" :limit_size="1" :isCompress="true" :bigBox="true"></upload>
				</el-form-item>

				<el-form-item label="最多报名人数" prop="registerCount" size="medium">
					<el-input-number v-model="updateForm.registerCount" placeholder="-1为无限人数" :min="-1">
					</el-input-number>
				</el-form-item>

				<el-row>
					<el-col :span="12">
						<el-form-item label="活动收费" prop="hasCost" size="medium">
							<el-switch v-model="updateForm.hasCost" active-text="活动付费" inactive-text="活动免费"
								:active-value="1" :inactive-value="0">
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-show="updateForm.hasCost">
						<el-form-item label="活动费用" prop="cost" size="medium">
							<el-input-number v-model="updateForm.cost" :precision="2" :step="0.1" :min="0">
							</el-input-number>￥
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="活动详细地址" prop="address">
					<el-input v-model="updateForm.address" placeholder="请输入活动地址 如xx市xx镇xx号,用户将在小程序上根据此地址导航到您的活动处"
						style="width: 82.5%" @keyup.enter.native="codeAddress"></el-input>
					<el-button type="success" @click="codeAddress">定位并修改地址</el-button>
				</el-form-item>
				<div id="container" ref="cid"></div>

				<el-form-item label="简介" prop="overview" style="margin-top: 20px;">
					<el-input v-model="updateForm.overview" clearable :maxlength="100" type="textarea"
						placeholder="请输入简介,限字数100">
					</el-input>
				</el-form-item>
				<el-form-item label="商品详情" prop="content">
					<editor :isClear="true" :value.sync="updateForm.content" :uploadImgServer="this.uploadImg.url"
						@uploadSuccess="addFileUrl" @idUrl="setIdUrl"></editor>
				</el-form-item>

			</el-form>
			<el-button type="success" @click="updateGoods" :disabled="updateBan">修 改</el-button>
			<el-button type="primary" @click="closeDialog">关 闭</el-button>

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

				arr: [],


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

				videoPlay: false,
				categoryList: [],
				//表单Label宽度
				labelWidth: "100px",

				updateForm: {
					startTime: "",
					endTime: "",
					timeList: [],
					// timeList: [this.updateForm.startTime,this.updateForm.endTime],
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
					address: {
						message: "请填写活动地址",
						required: true
					},
					lat: {
						message: "请填写经度",
						required: true
					},
					lng: {
						message: "请填写纬度",
						required: true
					},
					title: {
						message: "请输入活动标题",
						required: true
					},
					overview: {
						message: "请输入简介",
						required: true
					},
					registerCount: {
						message: "请填写报名人数",
						required: true
					},
					content: {
						message: "请填写详情",
						required: true
					},
					hasCost: {
						message: "请选择是否收费",
						required: true
					},
					timeList: {
						message: "请设置活动时间",
						required: true
					}
				},

			};
		},

		mounted() {
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				this.params.id = url.substr(url.indexOf("=") + 1, 1);
			}
			this.$nextTick(() => {
				this.openUpdateDialog(JSON.parse(localStorage.getItem('row')))
			});
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
			//根据城市区级搜索
			codeAddress() {
				this.showMap = true
				this.geocoder.getLocation(this.updateForm.address);
			},
			//创建地图
			TencentMap() {
				let _this = this;
				//这里填自己的key
				TMap("BIEBZ-KBNRD-FII4L-PUKSS-I5YZE-AUF3J").then((qq) => {

					//地图经纬赋值
					const myLatlng = new qq.maps.LatLng(
						this.updateForm.lat,
						this.updateForm.lng,
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
						_this.updateForm.lng = result.detail.location.lng;
						_this.updateForm.lat = result.detail.location.lat;
						_this.updateForm.province = result.detail.addressComponents.province
						_this.updateForm.city = result.detail.addressComponents.city
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

			countDown(time) {
				undefined
				var s = 0;
				var hour = time.split(':')[0];
				var min = time.split(':')[1];
				var sec = time.split(':')[2];
				s = Number(hour * 3600) + Number(min * 60) + Number(sec);
				return s;
			},


			deleteRow(id, type) {
				this.$confirm("是否删除?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					if (type == 1) {
						let index = this.tableData.findIndex(val => val.id == id)
						this.tableData.splice(index, 1)
						this.spanMethod = getRowspanMethod(this.tableData, ['specName', 'peopleCount'])
					} else {
						let index = this.tableDataAlone.findIndex(val => val.id == id)
						this.tableDataAlone.splice(index, 1)
					}
					this.$message.success("删除成功");

				})
			},


			//修改商品
			updateGoods() {

				this.$nextTick(() => {
					this.updateForm.banner = this.$refs.updateAvatar.getPaths();
					this.$refs["update"].validate((valid) => {
						if (valid) {

							this.updateForm.cost = this.updateForm.hasCost == 1 ? this.updateForm.cost : ""

							const formData = new FormData();
							formData.append("title", this.updateForm.title);
							formData.append("overview", this.updateForm.overview);
							formData.append("lat", this.updateForm.lat);
							formData.append("lng", this.updateForm.lng);
							formData.append("content", this.updateForm.content);
							formData.append("registerCount", this.updateForm.registerCount);
							formData.append("address", this.updateForm.address);
							formData.append("hasCost", this.updateForm.hasCost);
							formData.append("cost", this.updateForm.cost);
							formData.append("startTime", this.updateForm.timeList[0]);
							formData.append("endTime", this.updateForm.timeList[1]);
							formData.append("banner", this.updateForm.banner);
							formData.append("id", this.updateForm.id);

							this.$request.post({
								url: "merchant/merchantActivity/add",
								params: formData,
								success: (result) => {
									this.$message.success("修改成功");
									this.updateForm = {};
									this.uploadImg.addStatus = true
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


			//关闭添加弹框
			closeDialog() {
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
				let _this = this
				this.videoShow = ""
				this.updateForm = JSON.parse(JSON.stringify(row));
				console.log('row', this.updateForm);
				this.TencentMap();
				this.$set(this.updateForm, "timeList", [this.getDate(this.updateForm.openTime), this.getDate(this
					.updateForm.overTime)])


				if (this.updateForm.banner) {
					let banner = this.updateForm.banner.replace("[", "").replace("]", "");
					//子组件渲染完毕执行
					this.$nextTick(() => {
						this.$refs.updateAvatar.clean();
						this.$refs.updateAvatar.addPathList(banner);
					});
				}

				this.uploadImg = {
					url: "merchant/merchantGoods/uploadImg?urlId=" + row.urlId,
					addStatus: false,
					array: []
				}
			},
			getDate(str) {
				if (str == "" || str == null) {
					return "";
				}
				if (typeof(str) == 'string') {
					str = str.replace(/-/g, '/');
				}
				var oDate = new Date(str),
					oYear = oDate.getFullYear(),
					oMonth = oDate.getMonth() + 1,
					oDay = oDate.getDate(),
					oHour = oDate.getHours(),
					oMin = oDate.getMinutes(),
					oSen = oDate.getSeconds(),
					oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' +
					this.getzf(oMin) +
					':' + this.getzf(oSen); //最后拼接时间
				return oTime;
			},
			//补0操作
			getzf(num) {
				if (parseInt(num) < 10) {
					num = '0' + num;
				}
				return num;
			},

		},
	};
</script>

<style>
	#container {
		height: 400px;
		width: 70%;
	}

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
