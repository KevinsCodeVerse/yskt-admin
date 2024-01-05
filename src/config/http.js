/**
 * Created by superman on 17/2/16.
 * http配置
 */
import axios from 'axios'
import router from '@/router/index'
import envConfig from '@/config/envConfig.js'
import message from "@/utils/message.js"

// axios 配置
axios.defaults.timeout = 60000 // 请求超时时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.baseURL = envConfig.api // axios请求默认追加前缀

// http request 拦截器
axios.interceptors.request.use(
	config => {
		var adminToken = sessionStorage.getItem('adminToken');
		if (adminToken) {
			config.headers.Authorization = adminToken
		}
		return config
	},
	err => {
		return Promise.reject(err)
	},
)

// http response 拦截器
axios.interceptors.response.use(
	response => {
		return response
	},
	error => {
		if (error.response) {			
			switch (error.response.status) {
				case 401:
				case 403:
					// 401 清除token信息并跳转到登录页面
					message.error(error.response.data.result)
					break;
				case 500:
					message.error("服务器错误，请稍候再试")
					break;
			}
			sessionStorage.removeItem('adminToken');
			// 只有在当前路由不是登录页面才跳转
			router.currentRoute.path !== '/login' &&
				router.replace({
					path: '/login',
					query: {
						redirect: router.currentRoute.path
					},
				})
		}
		return Promise.reject(error)
	},
)
export default axios
