<template>
	<div id="login">
		<div v-if="!$store.state.isPhone" class="back_img">
			<div class="shade">
				<div class="title">鹏飞课堂智能后台管理系统</div>
			</div>
		</div>
		<div class="form">
			<el-form :model="params" status-icon :rules="rules" ref="login" :hide-required-asterisk="true"
				@keyup.enter.native="submitForm()">
				<div class="form_title">登 录</div>
				<el-form-item prop="account">
					<el-input v-model="params.account" placeholder="账号" prefix-icon="el-icon-user"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="params.password" placeholder="密码" type="password" prefix-icon="el-icon-lock"
						show-password>
					</el-input>
				</el-form-item>
				<!-- <el-form-item prop="code">
					<el-row>
						<el-col :span="16">
							<el-input v-model="params.code" placeholder="验证码" prefix-icon="el-icon-lock"
								style="margin-right: 5px;"></el-input>
						</el-col>
						<el-col :span="8" class="align-right">
							<ImgCode :sign.sync="params.verifySign" ref="imgCode"
								style="width: 90%; height: 39px; margin-left: 10%;" />
						</el-col>
					</el-row>
				</el-form-item> -->
				<el-checkbox v-model="remember" @change="rememberChange">记住密码</el-checkbox>
				<el-button type="primary" class="form_btn" @click="submitForm" :loading='loading'>登录</el-button>
			</el-form>
		</div>
	</div>
</template>

<script>
	import ImgCode from '@/components/utils/ImgCode'
	import rsa from '@/utils/rsa'
	import routerUtil from '@/router/routerUtil'


	export default {
		components: {
			ImgCode
		},

		data() {
			return {
				remember: false,
				logo: require('@/assets/img/logo.png'),
				params: {
					account: '',
					password: '',
					code: '',
					verifySign: '',
				},
				rules: {
					account: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				},
				verifyCode: {
					codeUrl: '',
					sign: '',
					code: '',
				},
				loading: false,
			}
		},

		mounted() {
			sessionStorage.removeItem('adminToken');
			sessionStorage.removeItem("menuList");

			//读取账号密码

			var pfaccount = localStorage.getItem("pfaccount")
			var pfpwd = localStorage.getItem("pfpwd")
			var pfremeber = localStorage.getItem("pfremeber")
			if (this.$common.checkNull(pfaccount, pfpwd)) {
				this.params.account = pfaccount
				this.params.password = pfpwd
				console.log("记住:", this.remember);
				console.log("记住2:", pfremeber);
				if (pfremeber) {					
				this.remember = true
				}
			}
		},

		methods: {
			rememberChange() {
				if (!this.remember) {
					localStorage.removeItem("pfaccount")
					localStorage.removeItem("pfpwd")
				}

			},
			submitForm() {
				this.$refs['login'].validate((valid) => {
					if (valid) {
						this.loading = true;
						this.$request.post({
							url: 'admin/adInfo/public/login',
							params: {
								account: rsa.encryptByPublicKey(this.params.account),
								password: rsa.encryptByPublicKey(this.params.password),
								verifyCode: this.params.code,
								verifySign: this.params.verifySign
							},
							success: (res) => {
								if (this.remember) {
									localStorage.setItem("pfaccount", this.params.account)
									localStorage.setItem("pfpwd", this.params.password)
								}
								localStorage.setItem("pfremeber", this.remember)
								sessionStorage.setItem('adminToken', res.token);
								sessionStorage.setItem('userName', res.name)
								sessionStorage.setItem('id', res.id)
								sessionStorage.setItem('roleId', res.roleId)
								// this.$store.dispatch('router/setMenuList', res.menuList)
								sessionStorage.setItem('menuList', JSON.stringify(res.menuList));
								sessionStorage.setItem('roleName', res.roleName)
								routerUtil.init();
								this.$router.push('/index')
								//按钮权限控制						
								localStorage.setItem("perList", JSON.stringify(res.preList))
								this.$message.success('登录成功');
							},
							allError: (e) => {
								this.$refs.imgCode.getImgCode();
							},
							finally: () => {
								this.loading = false;
							}
						});
					} else {
						return false;
					}
				});
			},

			resetForm() {
				this.$refs['login'].resetFields();
			},


			getMenus() {
				this.loading = true;
				this.$request.post({
					url: 'admin/roleMenu/getMenuUrl',
					success: (res) => {
						sessionStorage.setItem("menuList", res);
						let redirect = decodeURIComponent(this.$route.query.redirect || '/');
						if (redirect.indexOf('/') != -1 || redirect.indexOf('login') != -1) {
							redirect = '/manage/welcome';
						}
						localStorage.setItem('account', this.admin.account);
						this.$router.replace(redirect);
					},
					finally: () => {
						this.loading = false;
					}
				});
			},

		},

	}
</script>

<style scoped>
	#login {
		display: flex;
		height: 100vh;
		width: 100%;
		box-sizing: border-box;
		min-width: 1200px;
		background: white;
	}

	#login>div {
		width: 100%;
		height: 100%;
	}

	#login .form {
		flex: 1;
		box-sizing: border-box;
		background: #97d6ff;
	}

	#login .form .el-form {
		width: 80%;
		margin: auto;
		margin-top: 18vh;
	}

	#login .back_img {
		flex: 3;
	}

	#login .form_title {
		font-weight: 550;
		font-size: 20px;
		margin-bottom: 15px;
		color: #444444;
	}

	#login .form .form_btn {
		width: 100%;
		margin-top: 30px;
	}

	#login .back_img {
		background: url('../assets/img/login_back.jpg') center no-repeat;
		background-size: 60%, 50%;
		display: flex;
		align-items: center;
		/* opacity: 0.7; */
	}

	#login .back_img .shade {
		width: 100%;
		height: 100%;
		/* background: rgba(0, 0, 0, 0.2); */
	}

	#login .back_img .title {
		font-size: 30px;
		width: 60%;
		background: white;
		margin: auto;
		margin-top: 3vh;
		padding: 2% 0;
		text-align: center;
		white-space: nowrap;
		opacity: 0.85;
	}

	@media screen and (max-width: 768px) {
		#login {
			width: 100%;
			min-width: auto;
		}
	}
</style>
