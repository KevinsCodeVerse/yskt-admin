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
