import request from "@/config/http"
import qs from "qs"
export function fetchFlList(data) {
  return request({
    url: "/tmgl/getAllTmList",
    method: "post",
    data
  })
}

export function plfbTmxx(data) {
  return request({
    url: "/tmgl/plfbTmxx",
    method: "post",
    data
  })
}

export function getData(data) {
  return request({
    url: "/system/sysParam/platformParams",
    method: "post",
    data
  })
}

export function editPlatformParams(data) {
  return request({
    url: "/system/sysParam/editPlatformParams",
    method: "post",
    data
  })
}
