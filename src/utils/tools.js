
/**
 * 获取年月日 时分秒
 *
 * @param {String} dateStr 时间毫秒数
 * @returns 格式化后的时间
 */
export function getDate(dateStr, formate) {
  if (!dateStr) return ""
  return formatDate(dateStr, formate ? formate : "yyyy-MM-dd HH:mm:ss")
}
/**
 * 格式化时间
 *
 * @param {String} dateStr 时间毫秒数
 * @returns 格式化后的时间
 */
export function formatDate(dateStr, format) {
  if (!dateStr) return ""
  var date = new Date(parseInt(dateStr))
  return date.pattern(format)
}
/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
 * eg: 
 * (new Date()).pattern('yyyy-MM-dd hh:mm:ss.S')==> 2006-07-02 08:09:04.423
 * (new Date()).pattern('yyyy-MM-dd E HH:mm:ss') ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern('yyyy-MM-dd EE hh:mm:ss') ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern('yyyy-MM-dd EEE hh:mm:ss') ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern('yyyy-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
    "H+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  }
  var week = {
    0: "\u65e5",
    1: "\u4e00",
    2: "\u4e8c",
    3: "\u4e09",
    4: "\u56db",
    5: "\u4e94",
    6: "\u516d"
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2
          ? "\u661f\u671f"
          : "\u5468"
        : "") + week[this.getDay() + ""]
    )
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      )
    }
  }
  return fmt
}
/**
 * @description 将arraybuffer转换成base64
 * @param {*} buffer
 * @returns
 */
export function arrayBufferToBase64(buffer) {
  let binary = ""
  let bytes = new Uint8Array(buffer)
  for (let len = bytes.byteLength, i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

/**
 * @description 下载文件方法
 * @param {Blob} blob 文件流
 * @param {String} fileName 文件名称
 */
export function downloadFile(blob, fileName) {
  if ("download" in document.createElement("a")) {
    const elink = document.createElement("a")
    elink.href = URL.createObjectURL(blob)
    elink.download = fileName
    elink.style.display = "none"
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
  } else {
    navigator.msSaveBlob(blob, fileName)
  }
}
/**
 * @description对象深拷贝
 */
export const getObjType = (obj) => {
  var toString = Object.prototype.toString
  var map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object"
  }
  if (obj instanceof Element) {
    return "element"
  }
  return map[toString.call(obj)]
}
export const deepClone = (data) => {
  var type = getObjType(data)
  var obj
  if (type === "array") {
    obj = []
  } else if (type === "object") {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === "object") {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

export const objToFormData = (obj) => {
  let formData = new FormData()
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    if (value && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object") {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item)
          } else {
            Object.keys(item).forEach((innerKey) => {
              if (item[innerKey]) {
                formData.append(`${key}[${index}].${innerKey}`, item[innerKey])
              }
            })
          }
        } else {
          if (item) {
            formData.append(`${key}[${index}]`, item)
          }
        }
      })
    } else {
      if (value) {
        formData.append(key, value)
      }
    }
  })
  return formData
}
// 判断文件类型
export const getFileType = (file) => {
  // 获取文件头信息
  const reader = new FileReader()
  reader.readAsArrayBuffer(file.slice(0, 4))
  return new Promise((resolve) => {
    reader.onloadend = () => {
      const buffer = reader.result
      const header = new Uint8Array(buffer)
      let type = "unknown"

      // 判断常见图片格式
      if (header[0] === 0xff && header[1] === 0xd8) {
        type = "image/jpeg"
      } else if (
        header[0] === 0x89 &&
        header[1] === 0x50 &&
        header[2] === 0x4e &&
        header[3] === 0x47
      ) {
        type = "image/png"
      } else if (
        header[0] === 0x47 &&
        header[1] === 0x49 &&
        header[2] === 0x46 &&
        header[3] === 0x38
      ) {
        type = "image/gif"
      } else if (header[0] === 0x42 && header[1] === 0x4d) {
        type = "image/bmp"

        // 判断常见文档格式
      } else if (
        header[0] === 0x25 &&
        header[1] === 0x50 &&
        header[2] === 0x44 &&
        header[3] === 0x46
      ) {
        type = "application/pdf"
      } else if (
        header[0] === 0x50 &&
        header[1] === 0x4b &&
        header[2] === 0x03 &&
        header[3] === 0x04
      ) {
        type = "application/zip"
      } else if (
        header[0] === 0x7b &&
        header[1] === 0x5c &&
        header[2] === 0x72 &&
        header[3] === 0x74
      ) {
        type = "text/rtf"
      } else if (
        header[0] === 0x50 &&
        header[1] === 0x4b &&
        header[2] === 0x53 &&
        header[3] === 0x20
      ) {
        type = "application/vnd.ms-powerpoint"

        // 判断常见视频格式
      } else if (
        header[0] === 0x52 &&
        header[1] === 0x49 &&
        header[2] === 0x46 &&
        header[3] === 0x46
      ) {
        const format = new DataView(buffer.slice(8, 12)).getUint32(0, false)
        if (format === 0x5741) {
          type = "video/x-ms-wmv"
        } else if (format === 0x4156) {
          type = "video/x-msvideo"
        } else if (format === 0x4852) {
          type = "video/mp4"
        }

        // 其他类型
      } else if (
        // eslint-disable-next-line no-dupe-else-if
        header[0] === 0x47 &&
        header[1] === 0x49 &&
        header[2] === 0x46 &&
        header[3] === 0x38
      ) {
        type = "image/gif"
      } else if (
        header[0] === 0x46 &&
        header[1] === 0x4c &&
        header[2] === 0x56 &&
        header[3] === 0x01
      ) {
        type = "video/x-flv"
      }

      resolve(type)
    }
  })
}
/**
 * @description 计算表头宽度(后端没给宽度前端自己计算)
 * @param {*} name 表格label
 * @param {*} width 后端反回宽度
 * @param {*} item 后端反回表格数据
 */
export function renderHeaderWidth(name, width, item) {
  if (width && width !== 0) {
    return width
  }
  let realWidth = 0
  let span = document.createElement("span")
  span.innerText = name
  document.body.appendChild(span)
  if (item.sfzcpx === "Y") {
    realWidth = span.getBoundingClientRect().width + 46
  } else if (item.sfss === "Y") {
    realWidth = span.getBoundingClientRect().width + 40
  } else {
    realWidth = span.getBoundingClientRect().width + 22
  }
  document.body.removeChild(span)
  return realWidth
}
/**
 * @description 根据名字判断类型
 *
 */
export function showFileType(fileName) {
  return fileName.indexOf(".pdf") != -1 ? "application/pdf" : "image"
}


export function listToTree(list) {
  let info = list.reduce(
    (map, node) => ((map[node.id] = node), (node.children = undefined), map),
    {}
  );
  return list.filter((node) => {
    if(info[node.parentId]) {
      if(!info[node.parentId].children) {
        info[node.parentId].children = []
      }
      info[node.parentId].children.push(node);
    }
    return node.parentId == -1;
  });
}