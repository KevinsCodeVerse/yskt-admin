<!--
	图片裁剪组件，整合element弹窗
	使用示例：
	<ImgCropper width="150" height="150" :img="imgUrl" @success="cropperSuccess" :show.sync="showCropper" ref="imgCropper"></ImgCropper>
	参数说明:
	width: 裁剪框宽度
	height: 裁剪框高度
	img: 需要裁剪的图片Base64字符串
	show: 是否显示弹窗
	success(data): 裁剪成功回调，参数为裁剪后图片的Base64字符串
-->
<template>
	<div id="imgCropper">
		<el-dialog title="图片裁剪" :visible.sync="isshow" width="700px" center :close-on-click-modal="false" @close="close">
			<div class="cropper-content">
				<div class="cropper-box">
					<div class="cropper">
						<vue-cropper
							ref="cropper"
							:img="option.img"
							:outputSize="option.outputSize"
							:outputType="option.outputType"
							:info="option.info"
							:canScale="option.canScale"
							:autoCrop="option.autoCrop"
							:autoCropWidth="option.autoCropWidth"
							:autoCropHeight="option.autoCropHeight"
							:fixed="option.fixed"
							:fixedNumber="option.fixedNumber"
							:full="option.full"
							:fixedBox="option.fixedBox"
							:canMove="option.canMove"
							:canMoveBox="option.canMoveBox"
							:original="option.original"
							:centerBox="option.centerBox"
							:height="option.height"
							:infoTrue="option.infoTrue"
							:maxImgSize="option.maxImgSize"
							:enlarge="option.enlarge"
							:mode="option.mode"
							@realTime="realTime"
							@imgLoad="imgLoad">
						</vue-cropper>
					</div>
					<!--预览效果图-->
					<div class="show-preview">
						<div :style="previews.div" class="preview">
							<img :src="previews.url" :style="previews.img" />
						</div>
					</div>
					<!--底部操作工具按钮-->
					<div class="footer-btn">
						<label class="btn" for="uploads">选择图片</label>
						<input type="file" id="uploads" style="position: absolute; clip: rect(0 0 0 0)" accept="image/png, image/jpeg, image/gif, image/jpg" @change="selectImg($event)" />
						<el-button size="mini" type="danger" plain icon="el-icon-zoom-in" @click="changeScale(1)">放大</el-button>
						<el-button size="mini" type="danger" plain icon="el-icon-zoom-out" @click="changeScale(-1)">缩小</el-button>
						<el-button size="mini" type="danger" plain @click="rotateLeft">↺ 左旋转</el-button>
						<el-button size="mini" type="danger" plain @click="rotateRight">↻ 右旋转</el-button>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isshow = false">取 消</el-button>
				<el-button type="primary" @click="uploadImg">裁 剪</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
	name: "CropperImage",
	components: {
		VueCropper,
	},
	props: {
		width: {
			type: String,
			required: true,
		},
		height: {
			type: String,
			required: true,
		},
		img: {
			type: String, 
			required: true,
		},
		show: {
			type: Boolean,
			required: true
		},
		maxSize: {
			type: Number,
			default: 20,
		}
	},
  	data() {
		return {
			name: this.Name,
			previews: {},
			option: {
				img: "", //裁剪图片的地址
				outputSize: 0.8, //裁剪生成图片的质量(可选0.1 - 1)
				outputType: "jpeg", //裁剪生成图片的格式（jpeg || png || webp）
				info: true, //图片大小信息
				canScale: true, //图片是否允许滚轮缩放
				autoCrop: true, //是否默认生成截图框
				autoCropWidth: 230, //默认生成截图框宽度
				autoCropHeight: 150, //默认生成截图框高度
				fixed: false, //是否开启截图框宽高固定比例
				fixedNumber: [1, 1], //截图框的宽高比例
				full: false, //false按原比例裁切图片，不失真
				fixedBox: false, //固定截图框大小，不允许改变
				canMove: true, //上传图片是否可以移动
				canMoveBox: false, //截图框能否拖动
				original: true, //上传图片按照原始比例渲染
				centerBox: true, //截图框是否被限制在图片里面
				height: false, //是否按照设备的dpr 输出等比例图片
				infoTrue: true, //true为展示真实输出图片宽高，false展示看到的截图框宽高
				maxImgSize: 1000, //限制图片最大宽度和高度
				enlarge: 1, //图片根据截图框输出比例倍数
				mode: ''  //图片默认渲染方式
			},
			isshow: false,
		};
	},
	mounted() {
		this.option.autoCropWidth = this.width
		this.option.autoCropHeight = this.height
	},
    watch:{
		show(value) {
			this.isshow = value
		},
		img(value){
			this.option.img = value;
		},
		width(value){
			this.option.autoCropWidth = value;
		},
		height(value){
			this.option.autoCropHeight = value;
		},
    },
	methods: {
		//初始化函数
		imgLoad(msg) {
			console.log("初始化函数=====" + msg);
			if (msg == 'error') {
				this.$message.warning('初始化失败，请选择正确的图片');
				this.close();
			}
		},
		//图片缩放
		changeScale(num) {
			num = num || 1;
			this.$refs.cropper.changeScale(num);
		},
		//向左旋转
		rotateLeft() {
			this.$refs.cropper.rotateLeft();
		},
		//向右旋转
		rotateRight() {
			this.$refs.cropper.rotateRight();
		},
		//实时预览函数
		realTime(data) {
			this.previews = data;
		},
		//选择图片
		selectImg(e) {
			let file = e.target.files[0];
			console.log(file.size);
			if (file.size > this.maxSize * 1024 * 1024) {
				this.$message.warning("图片大小不能大于" + this.maxSize + 'M');
				return false
			}
			if (!/\.(bmp|jpg|jpeg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp)$/.test(e.target.value.toLowerCase())) {
				this.$message.warning("请上传正确的图片格式");
				return false;
			}
			//转化为blob
			let reader = new FileReader();
			reader.onload = (e) => {
				let data;
				if (typeof e.target.result === "object") {
					data = window.URL.createObjectURL(new Blob([e.target.result]));
				} else {
					data = e.target.result;
				}
				this.option.img = data;
			};
			//转化为base64
			reader.readAsDataURL(file);
		},
		//上传图片
		uploadImg() {
			let _this = this;
			//获取截图的blob数据
			this.$refs.cropper.getCropData(async (data) => {
				this.$emit('success', data);
				this.close();
			});
		},
		close() {
			this.isshow = false
			this.$emit('update:show', false)
		},
		reload() {
			let interval = setInterval(() => {
				if (this.$refs.cropper) {
					this.$refs.cropper.reload();
					clearInterval(interval);
				}
			}, 100);
		}
	},
};
</script>

<style>
#imgCropper .el-dialog {
	margin-top: 4vh !important;
}
</style>

<style scoped lang="scss">
.cropper-content {
	display: flex;
	display: -webkit-flex;
	justify-content: flex-end;
	flex-direction: column;
	.cropper-box {
		width: 100%;
		.cropper {
			width: auto;
			height: 300px;
		}
	}

	.show-preview {
		flex: 1;
		-webkit-flex: 1;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		margin-top: 20px;
		.preview {
			overflow: hidden;
			border: 1px solid #67c23a;
			background: #cccccc;
		}
	}
}
.footer-btn {
	margin-top: 30px;
	display: flex;
	display: -webkit-flex;
	justify-content: center;
	.scope-btn {
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
		padding-right: 10px;
	}
	.upload-btn {
		flex: 1;
		-webkit-flex: 1;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
	}
	.btn {
		outline: none;
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		-webkit-appearance: none;
		text-align: center;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		outline: 0;
		-webkit-transition: 0.1s;
		transition: 0.1s;
		font-weight: 500;
		padding: 8px 15px;
		font-size: 12px;
		border-radius: 3px;
		color: #fff;
		background-color: #167cf3;
		border-color: #167cf3;
		margin-right: 10px;
	}
}
</style>

