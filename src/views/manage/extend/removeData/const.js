import request from "../../../../utils/request";
//学历0小学 1初中 2高中 3中专 4专科 5本科 6硕士 7博士
export const degreeOptions = [
    {
        label: "小学",
        value: 0
    },
    {
        label: "初中",
        value: 1
    },
    {

        label: "高中",
        value: 2
    },
    {

        label: "中专",
        value: 3
    },
    {

        label: "专科",
        value: 4
    },
    {

        label: "本科",
        value: 5
    },
    {

        label: "硕士",
        value: 6
    },
    {

        label: "博士",
        value: 7
    }
]

export const genderOptions = [
    {

        label: "男",
        value: 1
    },
    {

        label: "女",
        value: 2
    }
]

export const getPromotionChannel = (callback) => {
    request.post({
        url: "/admin/adPromotionChannel/listNoPage",
        params: {},
        success: (res) => {
            callback(res)
        },
    })
}

