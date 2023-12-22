import router from '@/router/index'
import common from '@/utils/common.js'

export default {
	
	init(){
		var token = sessionStorage.getItem('adminToken');
		if(!token){
			return;
		}
		
		var item = JSON.parse(sessionStorage.getItem('menuList'));
	
		// 获取所有子节点
		var routerList = [];
	
		routerList.push(
			{
				path: '/index',
				component: this.loadView('manage/Index'),
				meta: {
					title: '首页',
				},
			}
		)
		
		console.log("菜单表：",item);
		item.filter(item => item.parentId != -1 && item.flag == 2).forEach(item => {
			router.addRoutes([
				{
					path: '/',
					redirect: '/index'
				},
				{
					path: '/index',
					component: this.loadView('Manage'),
					meta: {
						title: '首页',
						requireAuth: true,
						
					},
					redirect: '/manage/welcome',
					children: [
						{
							path: item.requestUrl,
							component: this.loadView(item.component + "/index"),
							meta: {
								title: item.menuName
							}
						}
					]
				}
			])
		})
		
		
		router.addRoutes([
			{
				path: '/err_404',
				component: this.loadView('error/404'),
				meta: {	
					title: '找不到页面',
				}
			},		
		])		
		router.addRoutes([
			{
				// 通配符, 匹配所有路径, 没有匹配相应的路径时会进入到这里
				path: '*',
				component: this.loadView('error/404'),
			}
		])
		
		console.log("匹配后的路由表：",router.options.routes);
		
	},
	
	loadView(view) {  // 路由懒加载
	  return resolve => {
	      require.ensure([], (require) => {
	        resolve(require('@/views/' + view + '.vue'))
	      })
	    }
	}
	
}
