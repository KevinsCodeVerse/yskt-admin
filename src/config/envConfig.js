const proxyConfig = {

	// 通用参数
	common: {

	},

	//开发环境
	dev: {
		// 服务url
		serviceUrl: 'https://pengfkt.com/api/',

		// websocket url
		wsUrl: '/ws/webSocketServer',

		// 是否显示菜单管理操作按钮
		isShowMenuOpertionBtn: true,

		api: '/api'
	},


	//线上环境
	prod: {
		// 服务url
		serviceUrl: document.location.protocol + "//" + document.location.host,

		// websocket url
		wsUrl: (document.location.protocol + "//" + document.location.host + 'ws/webSocketServer'),

		// 是否显示菜单管理操作按钮
		isShowMenuOpertionBtn: false,

		api: '/apiV2',
	}
}

var envConfig = (process.env.NODE_ENV === 'development' ? proxyConfig.dev : proxyConfig.prod)

var commonConfig = proxyConfig.common

var result = Object.assign(envConfig, commonConfig)

export default result
