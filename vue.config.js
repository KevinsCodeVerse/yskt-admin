const webpack = require('webpack')
const path = require("path")
// const ThemeColorReplacer = require('webpack-theme-color-replacer')
// const forElementUI = require('webpack-theme-color-replacer/forElementUI')
// 注意自己项目里的引入路径
const appConfig = require('./src/config/appConfig')
const JoinFileContentPlugin = require('join-file-content-plugin')
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const cdn = {
	css: [],
	js: [
		'https://unpkg.com/browse/vue@2.6.11/dist/vue.runtime.min.js',
		'https://unpkg.com/vue-router@3.2.0/dist/vue-router.min.js',
		'https://unpkg.com/vuex@3.4.0/dist/vuex.min.js',
		'https://unpkg.com/browse/axios@0.19.2/dist/axios.min.js',
	]
}
function resolve(dir) {
	return path.join(__dirname, dir)
  }
  
function setupSvg(config) {
	config.module.rule("svg").exclude.add(resolve("src/icons")).end()
	config.module
	  .rule("icons")
	  .test(/\.svg$/)
	  .include.add(resolve("src/icons"))
	  .end()
	  .use("svg-sprite-loader")
	  .loader("svg-sprite-loader")
	  .options({
		symbolId: "icon-[name]"
	  })
	  .end()
  }
  
module.exports = {
	// 公共路径(必须有的)
	publicPath: "./",
	// 输出文件目录
	outputDir: "dist",
	// 静态资源存放的文件夹(相对于ouputDir)
	assetsDir: "static",

	productionSourceMap: false, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
	// 开启代理
	devServer: {
		// overlay: { // 让浏览器 overlay 同时显示警告和错误
		//   warnings: true,
		//   errors: true
		// },
		open: false, // 是否打开浏览器
		port: "3000", // 代理端口
		https: false,
		hotOnly: true, // 热更新
		proxy: {
			// 接口代理
			"/api": {
				// target: "http://127.0.0.1:9000/", // 目标代理接口地址
				// target: "http://192.168.1.38:9013/", // 本地目标代理接口地址
				target: "https://pengfkt.com/apiV2/", // 线上目标代理接口地址
				secure: false,
				changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
				// ws: true, // 是否启用webso ckets 代理
					pathRewrite: {
						"^/api": "/"
					}
			},
			// 文件代理
			'/files': {
                // target: 'http://192.168.1.100:9999',//本地
                target: 'https://www.tdtye.com',//线上
                changeOrigin: true,
                secure: false
            },
		}
	},

	// 添加别名
	chainWebpack: config => {
		setupSvg(config)
		const path = require("path");
		const resolve = dir => path.join(__dirname, dir);
		if (IS_PROD) {
			// 删除预加载
			config.plugins.delete('prefetch')
			config.plugins.delete('preload');
			// 压缩代码
			config.optimization.minimize(true);
			// 生产环境注入cdn
			// config.plugin('html').tap(args => {
			// 	args[0].cdn = cdn;
			// 	return args;
			// });
		}
		config.resolve.alias
			.set("@", resolve("src"))
			.set("@assets", resolve("src/assets"))
			.set("@components", resolve("src/components"))
			.set("@img", resolve("src/assets/img"))
			.set("@css", resolve("src/assets/css"))
			.set("@js", resolve("src/assets/js"))
	},


/*	// sass 全局样式变量
	css: {
		extract: ["production", "prod"].includes(process.env.NODE_ENV),
		sourceMap: false,
		loaderOptions: {
			// scss: {
				// 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
				// 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
				// prependData: `
				// 	@import "@/assets/scss/element-variables.scss";
				// 	$src: "${process.env.VUE_APP_OSS_SRC}";
				// 	`
			// }
		},
		// 启用 CSS modules for all css / pre-processor files.
		// requireModuleExtension: false,
	},*/

	// 打包分析
/* 	chainWebpack: config => {
		const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
		const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
		if (IS_PROD) {
			config.plugin("webpack-report").use(BundleAnalyzerPlugin, [{
				analyzerMode: "static"
			}]);
		}
	}, */

	// 开启 Gzip 压缩
	configureWebpack: config => {
		const CompressionWebpackPlugin = require("compression-webpack-plugin");
		const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

		const plugins = [];
		if (IS_PROD) {
			// 用cdn方式引入依赖
			// config.externals = {
			// 	'vue': 'Vue',
			// 	'vuex': 'Vuex',
			// 	'vue-router': 'VueRouter',
			// 	'axios': 'axios',
			// }
			plugins.push(
				new CompressionWebpackPlugin({
					filename: "[path].gz[query]",
					algorithm: "gzip",
					test: productionGzipExtensions,
					threshold: 10240,
					minRatio: 0.8
				})
			);
		}
		config.plugins = [...config.plugins, ...plugins];
	},

	configureWebpack: {
		plugins: [
			// new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
			// 生成仅包含颜色的替换样式（主题色等）
			// new ThemeColorReplacer({
			// 	fileName: 'style/theme-colors.[contenthash:8].css',
			// 	matchColors: [
			// 		...forElementUI.getElementUISeries(appConfig.themeColor), // element-ui主色系列
			// 		'#0cdd3a', // 自定义颜色
			// 		'#c655dd'
			// 	],
			// 	changeSelector: forElementUI.changeSelector,
			// 	isJsUgly: process.env.NODE_ENV === 'production' ? true : undefined
			// })
		]
	}
};
