import envConfig from './envConfig.js'

/**
 * 过滤图片路径
 * @return 绝对路径
 */
let fullPath = function(value) {
	return envConfig.serviceUrl + value;
}

/**
 * 图片懒加载过滤器
 * @return 绝对路径
 */
let lazyLoad = function(value) {
	value.src = envConfig.serviceUrl + value
}



let money = (value, style) => { //  货币格式
	/**
	 * style: 
	 *      currency：货币
	 *      number： 数字格式
	 */
	if (style == 'number') { // 数字格式
		return parseFloat(value.replace(/[^\d\.-]/g, ""));
	} else { // 货币格式, 并保留2位小数
		var n = 2;
		value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
		var l = value.split(".")[0].split("").reverse(),
			r = value.split(".")[1];
		var t = "";
		for (var i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		return t.split("").reverse().join("") + "." + r;
	}
}


export {
	fullPath,
	lazyLoad,
	money
};
