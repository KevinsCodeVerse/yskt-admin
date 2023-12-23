import requesta from "@/config/http"
import request from '@/utils/request' // 请求工具类
import qs from "qs"
export function fetchFlList(data) {
	return request({
		url: "/tmgl/getAllTmList",
		method: "post",
		data
	})
}

export function plfbTmxx(data) {
	return requesta({
		url: "/tmgl/plfbTmxx",
		method: "post",
		data
	})
}

export function getData(data) {
	return requesta({
		url: "/system/sysParam/platformParams",
		method: "post",
		data
	})
}

export function editPlatformParams(data) {
	return request.post({
		url: 'system/sysParam/editPlatformParams',
		params: {
			paramObjs: JSON.stringify(data)
		},
		success: (res) => {

		}

	});
}
