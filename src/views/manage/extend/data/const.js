import request from "../../../../utils/request";
//学历0小学 1初中 2高中 3中专 4专科 5本科 6硕士 7博士
export const degreeOptions = [
    {
        label: "小学",
        vaue: 0
    },
    {
        label: "初中",
        vaue: 1
    },
    {

        label: "高中",
        vaue: 2
    },
    {

        label: "中专",
        vaue: 3
    },
    {

        label: "专科",
        vaue: 4
    },
    {

        label: "本科",
        vaue: 5
    },
    {

        label: "硕士",
        vaue: 6
    },
    {

        label: "博士",
        vaue: 7
    }
]

export const genderOptions = [
    {

        label: "男",
        vaue: 1
    },
    {

        label: "女",
        vaue: 2
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

