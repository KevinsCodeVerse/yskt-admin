import request from "@/config/http"
// 题库分布
export function getTkfb(params) {
  return request({
    url: "/bi/getTkfb",
    method: "get",
    params
  })
}
// 首页总体展示
export function getSyztzs(params) {
  return request({
    url: "/bi/getSyztzs",
    method: "get",
    params
  })
}
// 考试平均分
export function getKspjf(params) {
  return request({
    url: "/bi/getKspjf",
    method: "get",
    params
  })
}
// 明星学员
export function getMxxy(params) {
  return request({
    url: "/bi/getMxxy",
    method: "get",
    params
  })
}
// 访问次数
export function getFwcs(params) {
  return request({
    url: "/bi/getFwcs",
    method: "get",
    params
  })
}
