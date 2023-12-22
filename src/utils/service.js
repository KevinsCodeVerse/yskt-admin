
export default {
    check: {
        /**
         * 判断小数位数是否超过了指定位数
         * @param val 小数
         * @param digits 位数
         * */
        isDecimalOutBounds(val,digits){
            let s = val.toString();
            /* 不是小数或数字直接返回true */
            if (!this.isNumber(s) || !s.includes(".")){
                return true
            }
            return s.length - 1 - s.indexOf('.') > digits
        },
        isNumber(val){
            val = val.toString();

            let regPos = /^\d+(\.\d+)?$/;
            let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
            return regPos.test(val) || regNeg.test(val);
        },
        isNull(v) {
            let result = typeof v === "undefined" || v === null || v === ''
            if (typeof v === "string"){
                result = v.trim() === ''
            }
            if (Array.isArray(v)){
               result =  v.length === 0
            }
            return result
        },
        /**
         * 判断文件大小是否超标
         * 文件大小单位为 字节
         * @param arr 文件list
         * @param size 文件大小 单位 M
         * */
        fileSizeOutBounds(arr,size) {
            size *= 1000000
            return arr.some(e => {
                return e.size > size
            });
        }
    },
    copy(v){
       return JSON.parse(JSON.stringify(v))
    },
    /**
     * 数组转字符串 ,
     * arr 数组
     * separator 元素分割符号
     * */
    arrToString(arr,separator){
        if (arr.length === 0){
            return '';
        }else if(arr.length === 1){
            return arr[0] + '';
        }
        let result = '';
        arr.forEach(e => {
            result += e + separator
        })
        return result.substring(0, result.length-1)
    },

    /**
     * 用于获取响应中的多个参数 ,防止解析参数的过程中出错导致页面整体加载失败
     * task 需要执行的任务
     * errMsg 错误信息
     * errorFields 存储解析错误的字段数组
     * 执行任务
     * */
    executeTask(task = function () {} ,errorFields = [],errMsg = ''){
        try{
            task();
        }catch (e) {
            console.log(" executeTask - err : ",e)
            errorFields.push(errMsg)
        }
    },


    timeFormat: {
        /**
         * 传入时间戳 yyyy-MM-dd HH:mm:ss
         * */
        time6(v){
            if(typeof v == 'string'){
                v = Number(v)
            }
            let date = new Date(v);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = date.getDate() + ' ';
            let h ='';
            if (date.getHours() < 10){
                h = "0" + h;
            }
            h = h + date.getHours() + ':'
            let m ='';
            if (date.getMinutes() < 10){
                m = "0" + m;
            }
            m = m + date.getMinutes() + ':'
            let s ='';
            if(date.getSeconds() < 10) {
                s = "0" + s
            }
            s = s + date.getSeconds();
            return Y + M + D + h + m + s;
        },
        /**
         * 时间戳转 年-月-日 时:分:秒
         * */
        time7(v){
            if(typeof v == 'string'){
                v = Number(v)
            }
            let date = new Date(v);
            let Y = date.getFullYear() + '年 ';
            let M = (date.getMonth() + 1 < 10 ? + (date.getMonth()+1) : date.getMonth()+1) + '月 ';
            let D = date.getDate() + '日 ';
            let h = (date.getHours() === 0 ? 24 : date.getHours()) + '点 '
            let m = date.getMinutes() === 0 ? '' : date.getMinutes() + '分 '
            let s = date.getSeconds() === 0 ? '' :  date.getSeconds() + '秒';
            return Y + M + D + h + m + s ;
        }
    }
}