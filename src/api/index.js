import request from "@/config/http"
// 题库分布
export function getUpToken() {
    return request({
        url: "/comm/getUpToken",
        method: "post"
    })
}