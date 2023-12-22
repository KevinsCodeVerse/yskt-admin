<template>
	<el-container>
		<LeftNav />
		<el-container id="container">
			<Header />
			<Main />
			<!-- <Footer /> -->
		</el-container>
		<Drawer />
	</el-container>
</template>

<script>
	import Header from '@/components/models/Header'
	import LeftNav from '@/components/models/LeftNav'
	import Main from '@/components/models/Main'
	import Drawer from '@/components/models/Drawer'
	// import Footer from '@/components/models/Footer'
	// import ws from '@/utils/websocket'

	export default {
		components: {
			Header,
			LeftNav,
			Main,
			Drawer
			// Footer
		},

		data() {
			return {
				notify: {}
			};
		},

		watch: {

		},

		mounted() {
			// this.websubscribe();
			PubSub.subscribe('showNotify', (msg, data)=>{
				var obj = this.$notify({title: data.title, message: data.message, duration: 0, position: 'bottom-right', showClose: false})
				this.notify[data.uid] = obj;
			})
		},

		methods: {
			websubscribe() {
				// ws.subscribe(
				// 	{
				// 		destination: '/queue/restore',
				// 		result: msg => {
    //           				var result = JSON.parse(msg.body)
				// 			if(result.result == true){
				// 				this.$alert('数据回滚成功, 请重新登录', {
				// 				confirmButtonText: '确定',
				// 				callback: action => {
				// 					this.$router.replace('/login')
				// 				}
				// 				});
				// 			}else{
				// 				this.$message.error('回滚失败')
				// 			}
    //           				this.notify[result.uid].close();
				// 		}
				// 	}
				// )
			}
		},

		beforeDestroy() {
			// ws.disconnect()
			// // 取消订阅, 防止造成多次订阅
			// PubSub.unsubscribe('showNotify')
		},

	}
</script>

<style>
	#container {
		display: flex;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
	}
</style>

<style scoped>

</style>
