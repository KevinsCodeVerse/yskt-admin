<template>
	<div>
		<main-head><i id="head" class="iconfont icondingdandingdanmingxishouzhimingxi"></i>拼团修改
			<span slot="after" @click="closeDialog" type="primary" size="medium" icon="el-icon-plus">
				<span style="font-weight: 700;color: #444444;cursor: pointer;">返回上一页</span>
				<i class="iconfont iconfanhui" style="color: #0482d1;margin-left: 10px;cursor: pointer;"></i>
			</span>
		</main-head>

		<el-card style="margin-top: 20px" shadow="hover">
			<el-form :model="updateForm" :rules="rule" :label-width="labelWidth" size="mini" ref="update">

				<!-- -------拼团-------- -->
				<el-descriptions title="介绍详情">
				</el-descriptions>
				<el-divider></el-divider>

				<el-form-item label="分类类型:" prop="categoryId">
					<el-select v-model="updateForm.categoryId" placeholder="选择分类" clearable @change="search()">
						<el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="拼团标题" prop="title">
					<el-input v-model="updateForm.title" :maxlength="30" clearable placeholder="请输入产品名称,限字数30">
					</el-input>
				</el-form-item>

				<el-row>
					<el-col :span="12">
						<el-form-item label="拼团时间" prop="timeList">
							<el-date-picker v-model="updateForm.timeList" value-format="yyyy-MM-dd HH:mm"
								format="yyyy-MM-dd HH:mm" type="datetimerange" range-separator="至"
								start-placeholder="开始时间" end-placeholder="结束时间" placeholder="请设置拼团时间">
							</el-date-picker>
							<div class="" style="color: #f66c6c;">
								提示: 结束时间后，达到对应档位的用户，统一按照原价和优惠价的差价进行退款
							</div>
						</el-form-item>
					</el-col>

          <el-col :span="12">
            <el-form-item label="是否自动续期:">
              <el-switch
                  style="display: inline-block"
                  v-model="updateForm.isAutoShelving"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value= 1
                  :inactive-value= -1
              >
              </el-switch>

              <div
                  v-show="updateForm.isAutoShelving === 1"
                  style="
                  display: inline-block;
                  margin-left: 20px"
              >
                <span style="
                display: inline-block;
                margin-right: 5px">
                  续期时间 :
                </span>
                <div
                    style="display: inline-block"
                >
                  <el-input
                      v-model="updateForm.autoShelvingTime"
                      placeholder="(单位/分钟)"
                      type="number"
                  >
                  </el-input>
                </div>
              </div>
            </el-form-item>
          </el-col>

				</el-row>

        <el-row style="margin-left: 30px">
          <el-col :span="24">
            <el-tooltip class="item" effect="dark" placement="bottom-start">
              <div slot="content">
                推广员(任意用户)在小程序内任意页面分享给用户<br />
                该用户点进链接后绑定推广员<br />
                此后该用户每次购买该拼单商品后，推广员都会获得一次佣金<br />
                (设置0则无佣金)
              </div>
              <el-form-item label="推广佣金(单笔成交)" prop="commission" class="oneRow" label-width="100">
                <el-input-number style="width: 200px;" v-model="updateForm.commission" :min="0.00"
                                 clearable placeholder="请设置商品推广佣金">
                </el-input-number>
              </el-form-item>
            </el-tooltip>
          </el-col>
        </el-row>

				<el-row style="margin-left: 30px">
					<el-col :span="12">
						<el-form-item label="是否有限购区域" prop="hasLimitArea" class="oneRow">
							<el-tooltip :content="'是否有限购区域: ' + updateForm.hasLimitArea" placement="top">
								<el-switch v-model="updateForm.hasLimitArea" active-value="1" inactive-value="-1">
								</el-switch>
							</el-tooltip>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="区域选择" prop="areaList" class="oneRow" v-show="updateForm.hasLimitArea == 1">
							<el-cascader :options="locationList" :props="props" v-model="updateForm.areaList"
								collapse-tags clearable></el-cascader>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="运费分类:" prop="type">
							<el-select v-model="cache.freightList" @change="freightChange" placeholder="选择分类" clearable
								multiple :value="9">
								<el-option v-for="item in freightList" :key="item.id" :label="item.name"
									:value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-show="updateForm.type.includes('1') || updateForm.type === '2'">
						<el-form-item label="是否包邮" prop="hasFreeShipp" class="oneRow">
							<el-switch v-model="updateForm.hasFreeShipp" :active-value="1" :inactive-value="-1">
							</el-switch>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<!-- 不包邮显示运费模板 -->
					<el-col :span="12"
						v-show="updateForm.hasFreeShipp == -1 && (updateForm.type.includes('1') || updateForm.type === '2')">
						<el-form-item label="运费模板:" prop="freightId">
							<el-select v-model="updateForm.freightId" placeholder="选择模板" clearable :value="9">
								<el-option v-for="item in freigh" :key="item.id" :label="item.remark" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<!-- 配送显示配送区域 -->
					<el-col :span="12" v-show="(updateForm.type.includes('3') || updateForm.type === '2')">
						<el-form-item label="支持配送地址:" prop="locationIds">
							<el-cascader :options="defaultLocationList" :props="props" v-model="updateForm.locationIds"
								collapse-tags clearable>
							</el-cascader>
						</el-form-item>
					</el-col>
				</el-row>

				<!-- 自提显示自提地址 -->
				<el-form-item label="自提地址" prop="selfMentionAddress"
					v-show="updateForm.type.includes('0')|| updateForm.type === '2'">
					<el-input v-model="plotFrom.address" :maxlength="30" clearable
						placeholder="请输入商品自提地址,用户可通过该地址导航到此处自提商品">
					</el-input>
					<div class="" style="color: #f66c6c;">
						提示: 请输入正确的商品自提地址,用户可通过该地址导航到此处自提商品
					</div>
					<el-button type="success" @click="codeAddress()">定位并修改地址</el-button>
					<div id="container" ref="cid"></div>
				</el-form-item>


				<el-form-item label="主图:" prop="avatar">
					<upload ref="updateAvatar" :limit_size="1" :bigBox="true"></upload>
				</el-form-item>
				<el-form-item label="轮播图" prop="img">
					<upload :isMultiple="true" :bigBox="true" ref="updateImg" :limit_size="5" :ImgSize="10" quality="70"
						:isCompress="true">
					</upload>
				</el-form-item>
				<el-form-item label="视频:" prop="video">
					<video class="video" controls v-if="videoShow" :src="videoShow" width="30%" />
					<input ref="videoFile" @change="fileChange($event)" type="file" id="video_file" accept="video/*" />
					<el-button type="warning" @click="cleanFile()" size="mini">重置</el-button>
				</el-form-item>
				<el-row>
					<el-col :span="12">
						<el-form-item label="原价(元)" prop="originalPrice" size="medium">
							<el-input-number v-model="updateForm.originalPrice" :precision="2" :step="0.1" :min="0">
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

				<el-row>
					<el-col :span="12">
						<el-form-item label="规格重量单位" prop="unit" class="oneRow">
							<el-input v-model="updateForm.unit" :maxlength="30" clearable
								placeholder="请输入数量/重量单位,如 件、斤、盒、个">
							</el-input>
							<div class="" style="color: #f66c6c;">
								提示: 输入数量/重量单位,如 件、斤、盒、个
							</div>
						</el-form-item>
					</el-col>

				</el-row>

				<el-form-item label="简介" prop="overview">
					<el-input v-model="updateForm.overview" :maxlength="100" clearable type="textarea"
						placeholder="请输入简介,限字数100">
					</el-input>
				</el-form-item>
				<el-form-item label="详情" prop="content">
					<editor :isClear="true" :value.sync="updateForm.content" :uploadImgServer="this.uploadImg.url"
						@uploadSuccess="addFileUrl" @idUrl="setIdUrl" ref="editorRef"></editor>
				</el-form-item>

				<!-- --------------- -->
				<el-descriptions title="拼团设置"></el-descriptions>

				<el-row>
					<el-col :span="12">
						<el-switch v-model="updateForm.hasSpec" @change="specChange" active-text="有规格"
							inactive-text="无规格" :inactive-value="-1" :active-value="1">
						</el-switch>
					</el-col>
					<el-col :span="12">
						<el-switch v-model="updateForm.hasBuyUnit" @change="buyChange" active-text="有可选数量/重量"
							inactive-text="无可选数量/重量" :inactive-value="false" :active-value="true">
						</el-switch>
					</el-col>
				</el-row>

				<!-- 规格设置 -->
				<el-row class="row-bg" type="flex" justify='space-around' v-show="updateForm.hasBuyUnit">
					<el-col>
						<!-- 拼团人数 -->
						<div class="grid-content bg-purple-light">
							<span class="priceTit">用户可选数量/重量:</span>
						</div>
						<!-- 规格标签 -->
						<div class="grid-cont">
							<el-tag :key="tag" v-for="tag in bulkPerson" closable :disable-transitions="false"
								@close="handleClose(tag,'bulkPerson')">
								{{tag}}
							</el-tag>
							<el-input class="input-new-tag" v-if="inputVisible2" v-model="inputValue2"
								ref="saveTagInput2" size="small" @keyup.enter.native="handleInputConfirm('bulkPerson')"
								@blur="handleInputConfirm('bulkPerson')">
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput(2)"
								style="border: none;color: #167cf3;">+ 添加</el-button>
						</div>
					</el-col>

					<!-- 添加规格 -->
					<el-col>
						<div class="grid-content bg-purple-light">
							<el-button class="button-new-tag" size="small" @click="addInput" style="color: #167cf3;">
								添加用户可选数量/重量</el-button>
						</div>
					</el-col>
				</el-row>

				<!-- 拼团参数信息 -->
				<el-row class="row-bg" type="flex" justify='space-around' style="" v-if="updateForm.hasSpec==1">
					<div class="tabTop">
						<span>拼团参数信息:</span>
						<el-button size="small" type="primary" @click="addSpec" round v-show="updateForm.hasSpec==1">
							添加规格
						</el-button>
					</div>


					<!-- 规格信息  默认打开 default-expand-all  -->
					<el-table :data="tableData" :span-method="spanMethod" style="width: 100%" border max-height="600"
						default-expand-all :header-cell-style="columnStyle">

						<!-- 展开价格档位填写 -->
						<el-table-column type="expand">
							<template slot-scope="props">
								<div class="" style="padding-left: 10px;">
									<div style="color: #f66c6c;">
										提示: 到达优惠档位将返回用户部分价格
										<el-button size="small" type="primary" @click="addGear(props.$index)" round
											v-show="updateForm.hasSpec==1">添加优惠档位</el-button>
									</div>
									<el-form label-position="left" inline class="demo-table-expand">
										<el-row style="margin-top: 10px;" v-for="(item,i) in props.row.priceGear"
											:key="i">
											<el-col :span="8">
												<el-form-item label="优惠档位:" prop="categoryId">
													<div style="display: flex;">
														<el-input v-model="item.successGear" :maxlength="30" clearable
															@blur="item.successGear=item.successGear.replace(/[^\d]/g,'')"
															placeholder="请输入达到该优惠的数量/重量"
															style="display:inline-block;margin: 0 10px">
														</el-input>
														<span style="display:inline-block;">{{updateForm.unit}}</span>
													</div>
												</el-form-item>
											</el-col>
											<el-col :span="8">
												<el-form-item label="优惠价格:" prop="title" class="oneRow">
													<template slot-scope="scope">
														<el-input-number v-model="item.discountPrice" :min="0"
															@blur="judgeSpecPrice(props.$index,item.discountPrice)">
														</el-input-number>&nbsp;元

														<el-button size="small" type="primary"
															@click="delGear(props.$index,i)">删除</el-button>
													</template>
												</el-form-item>
											</el-col>

											<el-col :span="8"
												v-show="item.discountPrice !== '' && item.successGear !== ''">
												<div>
													<span style="color: red;
                          position: relative;top: 5px">
														提示 : 当用户购买数量达到 {{item.successGear}}
														{{updateForm.unit}}时,每{{updateForm.unit}}价格为
														{{item.discountPrice}}元
													</span>
												</div>
											</el-col>

										</el-row>
									</el-form>
								</div>
							</template>
						</el-table-column>

						<el-table-column prop="specName" label="规格名称" min-width="250" v-if="updateForm.hasSpec">
							<template slot-scope="scope">
								<div style="display: flex;align-items: center;">
									<el-input v-model="scope.row.specName" placeholder="请输入规格名称"
										style="display:inline-block;"></el-input>
									<!-- <span style="display:inline-block;">{{updateForm.unit}}</span> -->
								</div>

							</template>
						</el-table-column>

						<el-table-column prop="originalPrice" :label="'原价'" v-if="updateForm.hasSpec" min-width="250"
							:min="0">
							<template slot-scope="scope">
								<el-input-number v-model="scope.row.originalPrice" placeholder="请输入原价" :min="0">
								</el-input-number>￥
							</template>
						</el-table-column>

						<el-table-column prop="inventory" class="table3" label="提示: 请注意,当库存不足时,用户将无法达到对应的优惠档位,请合理设置库存"
							v-if="updateForm.hasSpec" min-width="250">
							<template slot-scope="scope">
								<el-input-number v-model="scope.row.inventory" placeholder="-1为无限库存" :min="-1"
									controls-position="right">
								</el-input-number>
							</template>
						</el-table-column>

						<el-table-column prop="discountPrice" label="操作" fixed="right" width="150">
							<template slot-scope="scope">
								<el-button type="primary" @click="deleteRow(scope.row,1)">删 除</el-button>
							</template>
						</el-table-column>

					</el-table>
				</el-row>

				<!-- 无规格购买参数信息 -->
				<el-row class="row-bg" type="flex" justify='space-around' style="" v-show="updateForm.hasSpec==-1">
					<div class="tabTop" style="display: flex;justify-content: space-between;">
						<span>无规格购买参数信息:</span>
						<el-button size="small" type="primary" @click="addTableAlone" round>
							添加优惠档位
						</el-button>
					</div>

					<el-table :data="tableDataAlone" style="width: 100%" border>
						<el-table-column prop="successGear" label="优惠档位" width="350" label-class-name="table3">
							<template slot-scope="scope">
								<div style="display: flex;align-items: center;">
									<span style="color: red">用户购买数量达到</span>
									<el-input v-model="scope.row.successGear" :maxlength="30" clearable type="number"
										@blur="scope.row.successGear=scope.row.successGear.replace(/[^\d]/g,'')"
										placeholder="请输入数字" style="display:inline-block;width: 150px;margin: 0 10px">
									</el-input>
									<span style="display:inline-block;color: red">{{updateForm.unit}}</span>
								</div>
							</template>
						</el-table-column>

						<el-table-column prop="discountPrice" label="商品单价">
							<template slot-scope="scope">
								<el-input-number v-model="scope.row.discountPrice" :min="0">
								</el-input-number>￥
							</template>
							<template slot-scope="scope">
								<span style="color: red">每{{updateForm.unit}}价格</span>
								<el-input-number v-model="scope.row.discountPrice" :min="0" type="number"
									style="margin: 0 15px">
								</el-input-number> <span style="color: red">元</span>
							</template>
						</el-table-column>

						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" @click="deleteRow(scope.row,2)">删 除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-row>

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
  import service from '@/utils/service'
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
		data() {
			return {
				goodsItem: {}, //详情数据
				loading: null,
				plotFrom: {
					lat: "",
					lng: "",
					address: "北京市东城区天安门"
				},
				// 区域选择
				totalLocation: [], //未处理过的区域
				props: {
					multiple: true,
					value: 'id',
					label: 'name',
				},
				locationList: [],
				defaultLocationList: [],
				freightList: [{
					name: "自提",
					id: 0
				}, {
					name: "快递",
					id: 1
				}, {
					name: '配送',
					id: 3
				}, {
					name: "均支持",
					id: 2
				}, ],
				freigh: [], //获取的运费模板
				cache: {
					// 运费分类,选中缓存
					freightList: []
				},
				spanMethod: () => {},
				existSpec: false,
				existCount: true,

				arr: [],
				count: -1,
				tableData: [],
				tableDataAlone: [],
				flg: true, //规格设置
				label: ' 拼团人数',
				tableKey: 0,

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
				labelWidth: "100px",
				addDialog: false,
				updateDialog: false,

				videoPlay: false,
				categoryList: [],
				updateForm: {
					freightId: -1,
					unit: '斤',
					hasLimitArea: -1,
					hasSpec: false,
					video: "",
					originalPrice: 0,
					discountPrice: 0,
					peopleCount: 0,
					packFree: true, //包邮
					locationIds: [],
					type: '',
          isAutoShelving: -1,
          autoShelvingTime: '',
					reDefault: function() {
						this.updateForm = {
							freightId: -1,
							unit: '斤',
							hasLimitArea: -1,
							hasSpec: false,
							video: "",
							originalPrice: 0,
							discountPrice: 0,
							peopleCount: 0,
							packFree: true, //包邮
							locationIds: [],
							type: '',
              isAutoShelving: -1,
              autoShelvingTime: '',
						}
					}
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
					unit: {
						message: "请填写重量/数量单位",
						required: true
					},
					type: {
						message: "请选择运费分类",
						required: true
					},
					timeList: {
						message: "请设置拼团时间",
						required: true
					}
				},
			};
		},
		watch: {
      screenWidth() {
        return this.screenWidth <= 2010 ? '' : 10
      },
			updateForm(newVal) {
				if (this.updateForm.hasFreeShipp == 1) {
					this.updateForm.freightId = -1
				}
			}
		},
		mounted() {
			this.loading = this.$loading({
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(0, 0, 0, 0.7)'
			});

			console.log('222', this.$route);
			let url = this.$route.fullPath;
			if (url.indexOf("?") != -1) {
				this.params.id = url.substr(url.indexOf("=") + 1, 1);
			}
			this.getCategoryList();
			this.getLoactionList()
			this.getFreightList()
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
			// 运费分类改变事件
			freightChange(e) {
				let cache = this.cache;
				let form = this.updateForm
				// 如果只选一个就保存后返回
				if (e.length === 1) {
					form.type = e[0].toString();
					return
				}
				// 如果均支持直接重置选项为 单个均支持
				if (e.includes(2)) {
					cache.freightList = [2];
					form.type = "2";
					return
				}
				// 多选倒叙排列 转字符串
				cache.freightList.sort();
				cache.freightList.reverse();
				let number = cache.freightList.toString().replaceAll(",", "");
				// 判断是否均支持
				if (number === '310') {
					cache.freightList = [2];
					form.type = "2";
					return
				}
				form.type = number
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
					if (this.updateForm.type.indexOf("0") != -1) {
						//调用地址定位
						this.codeAddress()
					}

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
				this.geocoder.getLocation(address);
			},
			columnStyle(e) {
				if (e.columnIndex == 3)
					return "background:#e6cc6f;color:#f00;cursor: pointer";
			},
			//删除价格档位
			delGear(id, i) {
				console.log(id, i);
				this.tableData[id].priceGear.splice(i, 1)
			},
			//添加价格档位
			addGear(row) {
				console.log('价格档位', this.tableData);
				console.log('价格档位', row);
				this.tableData[row].priceGear.push({
					successGear: "",
					discountPrice: 0
				})
			},
			// 添加规格
			addSpec() {
				this.tableData.push({
					priceGear: [{
						successGear: '',
						discountPrice: null,
					}]
				})
			},
			buyChange() {
				this.bulkPerson = []
			},
			specChange() {
				this.tableData = []
				this.tableDataAlone = []
			},
			// 运费模板
			getFreightList() {
				this.$request.post({
					url: "merchant/merchantFreightTemplate/list",
					params: this.params,
					success: (res) => {
						this.freigh = res.list

					},
				});
			},
			// 处理区域列表 handling 处理方式 : 0 默认处理 1 根据 模板id 禁用部分区域
			dealLoaction(res, handling) {
        let _t = this;
				let arr = res
				let list = []
				let strArr = this.freigh.map(val => val.locationIds.split(","))
				let strArr1 = []
				// 运费模板的id
				if (handling === 1 && _t.updateForm.hasFreeShipp === -1
            && (_t.updateForm.type.includes('1') || _t.updateForm.type === '2')) {
					strArr.forEach(val => {
						strArr1.push.apply(strArr1, val)
					})
				}
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
								// 市的val 对应区的parentVal
								if (pro.val == val1.parentVal) {
									if (handling === 1 && _t.updateForm.hasFreeShipp === -1
                      && (_t.updateForm.type.includes('1') || _t.updateForm.type === '2')) {
										strArr1.forEach(str => {
											// 区的id  ==  运费模板的id  添加 disabled
											if (str == val1.id) {
												val1.disabled = true
												pro.children.push(val1)
											}
										})
									}
									pro.children.push(val1)
								}
							})
						}
					})
				})
				return list
			},
			// 获取区域列表
			getLoactionList() {
				let _t = this
				this.$request.post({
					url: "merchant/merchantGroupGoods/locationList",
					params: {},
					success: (res) => {
						this.totalLocation = JSON.parse(JSON.stringify(res))
						let parse = JSON.parse(JSON.stringify(res));
						this.locationList = this.dealLoaction(res, 1)
						_t.defaultLocationList = this.dealLoaction(parse, 0)
						this.openUpdateDialog(JSON.parse(localStorage.getItem('row')))
					},
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
			handChang() {
				++this.tableKey
				console.log(this.tableKey);
			},

			deleteRow(row, type) {
				this.$confirm("是否删除?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				}).then(() => {
					console.log('row', row)
					if (type == 1) {
						let index = this.tableData.findIndex(val => val.specName == row.specName)
						this.tableData.splice(index, 1)
					} else {
						let index = this.tableDataAlone.findIndex(val => val.successGear == row.successGear)
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
				if (/[^\d]/g.test(this.inputValue2)) {
					console.log('输入了' + this.inputValue2);
					msg.defaultMsg("请输入数字")
					this.inputValue2 = ''
					return
				}

				let inputValue = this.inputValue2
				if (!this[str].includes(inputValue)) {
					if (inputValue) {
						this[str].push(inputValue);
					}
				} else {
					msg.defaultMsg("不可重复")
				}

				this.inputVisible2 = false
				this.inputValue2 = ''
			},
			// -----------规格标签-------------
			// 添加无规格
			addTableAlone() {
				this.tableDataAlone.push({
					successGear: "",
					discountPrice: ''
				})
			},
			// 规格添加到信息
			addInput() {
				if (this.bulkPerson.length != 0) {
					this.updateForm.buyUnit = this.bulkPerson.join(",")
					msg.success('添加成功')
				}

			},

			// 处理规格数量  type 1 处理有规格   2 无规格
			dealNum(list, type) {
				let str = ""
				if (type == 1) {
					let arr = list.map(val => val.priceGear)
					let arr1 = []
					arr.forEach(val => {
						arr1.push(val.map(item => item.successGear))
					})
					arr1.forEach((val, i) => {
						if (i == arr1.length - 1) {
							str += val.join(",")
							return
						}
						str += val.join(",") + ","

					})
					// str = str.splice(0, str.length - 1);
					return str
				} else {
					list.forEach((val, i) => {
						if (i == list.length - 1) {
							str += val.successGear
							return
						}
						str += val.successGear + ","
					})
					console.log("处理后的数量", str);
					return str
				}

			},

			//修改商品
			updateGoods() {
				// 处理限购区域
				if (this.updateForm.hasLimitArea == 1) {
					if (!this.updateForm.areaList) {
						msg.defaultMsg("请选择限购区域")
						return
					}
				}

				// 处理可选数量
				if (this.updateForm.hasBuyUnit) {
					if (this.updateForm.buyUnit == "undefined") {
						msg.defaultMsg("请添加用户可选数量/重量")
						return
					}
				}

				// 处理选择包邮后  运费模板选择问题
				if ((this.updateForm.type.includes('1') || this.updateForm.type.includes('2')) && this.updateForm
					.hasFreeShipp == -1 && this
					.updateForm.freightId == -1) {
					msg.defaultMsg("请选择运费模板")
					return
				}

				if (this.updateForm.type.includes('0') || this.updateForm.type === '2') {
					if (this.plotFrom.lat == "39.908821") {
						msg.defaultMsg("请在自提地址框输入正确地址后点击定位按钮确定地址")
						return;
					}
				}
				if (this.updateForm.type.includes('3') || this.updateForm.type === '2') {
					if (typeof this.updateForm.locationIds === "undefined" || this.updateForm.locationIds.length === 0) {
						msg.defaultMsg("请选择当前商品支持配送的地址")
						return;
					}
				}

				if (!this.tableData) {
					msg.defaultMsg("请设置拼团信息")
					return
				}

        if(this.updateForm.isAutoShelving === 1){
          if (!service.check.isNumber(this.updateForm.autoShelvingTime)
              || this.updateForm.autoShelvingTime < 1){
            msg.defaultMsg("团购自动续期时间必须为整数, 且最小为 1")
            return;
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

							if (this.updateForm.hasFreeShipp == 1) {
								this.updateForm.freightId = -1
							}

							let table = null
							if (this.updateForm.hasSpec == 1) {
								table = this.tableData
								for (let i = 0; i < table.length; i++) {
									let price = table[i].priceGear
									for (let j = 0; j < price.length; j++) {
										if (table[i].inventory !== -1) {
											if (parseInt(price[j].successGear) > table[i].inventory) {
												msg.defaultMsg("拼团规格优惠挡位不能超过该规格的库存数, 规格名称: " + table[i]
													.specName)
												return
											}
										}
										if (parseFloat(price[j].discountPrice) >= parseFloat(table[i]
												.originalPrice)) {
											msg.defaultMsg("请检查团购规格参数,优惠价不能大于或等于原价");
											return
										}
									}
								}
							} else {
								table = this.tableDataAlone
								let t = this;
								if (this.updateForm.inventory !== -1) {
									let arr = JSON.parse(JSON.stringify(table));
									arr.sort((a, b) => parseInt(b.successGear) - parseInt(a.successGear));
									if (this.updateForm.inventory < parseInt(arr[0].successGear)) {
										msg.defaultMsg("优惠挡位 " + parseInt(table[0].successGear) +
											" 斤超过了库存数量")
										return
									}
									if (arr.some(e => e.discountPrice >= t.updateForm.originalPrice)) {
										msg.defaultMsg("请检查无规格购买参数, 优惠价不能高于或等于原价")
										return
									}
								}
							}

							let areaList;
							if (this.updateForm.areaList) {
								areaList = this.updateForm.areaList.map(val => {
									return val[2]
								})
								if (areaList === ',') {
									msg.defaultMsg("限购区域的地址格式错误, 请重选一次")
								}
							}

							let locationIds;
							if (typeof this.updateForm.locationIds !== "undefined" && this.updateForm
								.locationIds.length > 0) {
								locationIds = this.updateForm.locationIds.map(val => {
									return val[2]
								})
								if (locationIds[0] === ',') {
									msg.defaultMsg("支持配送的地址格式错误, 请重选一次")
                  return;
								}
							}

							if (this.updateForm.hasLimitArea == -1) {
								areaList = ''
							}


							const formData = new FormData();
							formData.append("id", this.updateForm.id);
							if (this.updateForm.video instanceof File) {
								console.log("有视频")
                formData.append("hasVideo", false);
							} else {
								if (this.updateForm.video !== undefined
                    && this.updateForm.video.indexOf("file") !== -1) {
									formData.append("hasVideo", true);
								}else{
                  formData.append("hasVideo", false);
                }
							}
              formData.append('isAutoShelving',this.updateForm.isAutoShelving);
              if (this.updateForm.isAutoShelving === 1){
                formData.append('autoShelvingTime',this.updateForm.autoShelvingTime);
              }
							formData.append("categoryId", this.updateForm.categoryId);
							formData.append("video", this.updateForm.video);
							formData.append("originalPrice", this.updateForm.originalPrice);
							formData.append("content", this.updateForm.content);
							formData.append("avatar", this.updateForm.avatar);
							formData.append("overview", this.updateForm.overview);
							formData.append("startTime", this.updateForm.timeList[0]);
							formData.append("endTime", this.updateForm.timeList[1]);
							formData.append("img", this.updateForm.img);
							formData.append("title", this.updateForm.title);
							formData.append("inventory", this.updateForm.inventory);
							formData.append("hasSpec", this.updateForm.hasSpec);
							formData.append("freightId", this.updateForm.freightId);
							formData.append("unit", this.updateForm.unit);
							formData.append("buyUnit", this.updateForm.buyUnit == undefined ? "" : this
								.updateForm.buyUnit);
							formData.append("priceList", JSON.stringify(table));
							formData.append("type", this.updateForm.type);
							let t = this.updateForm.type;
							// 不需要自提文字地址时 直接传入 空字符防止回显出现 意外值
							formData.append("selfMentionAddress", this.plotFrom.address = t === "2" || this
								.updateForm.type.includes('0') ? this.plotFrom.address : '');
							formData.append("latLng", this.plotFrom.lat + "," + this.plotFrom.lng);
							formData.append("hasFreeShipping", this.updateForm.hasFreeShipp);
							formData.append("areaList", areaList == undefined ? "" : areaList);
							formData.append("commission", this.updateForm.commission);
							formData.append("locationIds", locationIds);

							if (this.updateForm.urlId != undefined) {
								formData.append("urlId", this.updateForm.urlId);
							}



							const loading = this.$loading({
								lock: true,
								text: 'Loading',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
							});

							this.$request.post({
								url: "/merchant/merchantGroupGoods/updateGoods",
								params: formData,
								success: (result) => {
									this.$message.success("修改成功");
									this.updateDialog = false;
									this.updateForm.reDefault;
									this.uploadImg.addStatus = true
									this.videoShow = ""
									loading.close();
									this.$router.go(-1)
								},
								error(err) {
									loading.close();
									// this.updateForm.hasSpec=this.updateForm.hasSpec==1								
									// this.updateForm.hasSpec = true
								}
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
				let _this = this
				this.videoShow = ""
				this.updateForm = JSON.parse(JSON.stringify(row));
				this.updateForm.type = ""
				this.$set(this.updateForm, "timeList", [this.updateForm.startTime, this.updateForm.endTime])

				this.$request.post({
					url: "merchant/merchantGroupGoods/detail",
					params: {
						id: _this.updateForm.id
					},
					success: (res) => {
						console.log("detail", res);
						if (res.merchantGroupGoods.status === 0) {
							this.$notify({
								title: '请注意',
								message: "当前商品正在拼团中,仅可修改商品库存、标题、简介、详情页、主图、轮播图和视频。(修改其他参数将不会生效，例如价格等)如需修改其他参数，请先下架该商品",
								type: 'warning',
								duration: "0",
								position: 'bottom-left'
							});
						}
						// 处理运费分类多选
						let type = res.merchantGroupGoods.type;
						if (type !== null && type !== "" && typeof type !== "undefined") {
							let s = type.toString();
							this.updateForm.type = s
							for (let i = 0; i < s.length; i++) {
								this.cache.freightList.push(parseInt(s.charAt(i)))
							}
						} else {
							this.updateForm.type = ""
						}
						this.goodsItem = res.merchantGroupGoods
						if (this.goodsItem.buyUnit) {
							this.bulkPerson = this.goodsItem.buyUnit.split(",")
							this.updateForm.hasBuyUnit = true
						}

						// if (this.updateForm.hasSpec == 1) {
						// 	this.updateForm.hasSpec = true
						// } else {
						// 	this.updateForm.hasSpec = false
						// }
						this.loading.close();
						// 处理限购区域
						let snapshot = JSON.parse(this.goodsItem.snapshot)
						console.log("商品快照 : ", snapshot);

						// 处理修改限购区域
						if (snapshot.areaList == "") {
							// 没有 areaList
							this.$set(this.updateForm, "areaList", "")
						} else {
							// 有限购区域
							this.$set(this.updateForm, "hasLimitArea", "1")
							let str = snapshot.areaList
							this.updateForm.areaList = this.reLocationList(str)
						}


						console.log("updateForm.type " + type + "cache.freightList :" + this.cache.freightList)
						// 处理支持配送地址 [转数组]
						let local = this.goodsItem.locationIds;
						console.log("goodsItem : ", this.goodsItem)
						console.log(this.goodsItem.locationIds.split(",").length)
						if (local !== null && local !== "" && typeof local !== "undefined") {
							_this.updateForm.locationIds = _this.reLocationList(local)
							console.log(_this.updateForm.locationIds)
						}
						let table = JSON.parse(snapshot.priceList)
						let index = table.findIndex(val => val.inventory)
						console.log("价格表 : ", table);
						console.log("index : ", index)
						if (index == -1) {
							this.tableDataAlone = table
						} else {
							this.tableData = table
						}
						if (this.goodsItem.latLng != undefined) {
							console.log("123", this.goodsItem.latLng)
							this.plotFrom.address = this.goodsItem.selfMentionAddress
							this.plotFrom.lat = this.goodsItem.latLng.split(",")[0]
							this.plotFrom.lng = this.goodsItem.latLng.split(",")[1]
						}
						if (this.goodsItem.commission == null || this.goodsItem.commission == undefined) {
							this.updateForm.commission = 0
						}

						this.updateForm.isAutoShelving = this.goodsItem.isAutoShelving;
            if (this.goodsItem.isAutoShelving === 1) {
              this.updateForm.autoShelvingTime = this.goodsItem.autoShelvingTime;
            }
						this.TencentMap();
					},
				});

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
			// 区域回显数组拼接
			reLocationList(str) {
				if (!str) return
				let list = str.split(",")
				let arr = []
				//console.log(str)
				list.forEach((val, index) => {
					// 新建存放数组
					let arr1 = [Number(val)]
					// 查找id对应的一项 (区级)
					let quObj = this.totalLocation.find(item => item.id == val)
					//通过区级查到对应的市级
					let shiObj = this.totalLocation.find(item1 => item1.val == quObj.parentVal)
					arr1.unshift(shiObj.id)
					// 通过市级查到对应的省级
					let shenObj = this.totalLocation.find(item => item.val == shiObj.parentVal)
					arr1.unshift(shenObj.id)
					arr.push(arr1)
				})
				return arr
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
	.el-form-item--mini .el-form-item__label {
		white-space: nowrap !important;
	}

	/deep/.el-table__expand-icon>.el-icon {
		font-weight: bold;
		color: #167cf3;
	}

	.tabTop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
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
		z-index: 1 !important;
	}
</style>
