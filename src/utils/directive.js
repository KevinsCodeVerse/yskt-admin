
import Vue from 'vue'
Vue.directive('permission', {
    // 在元素被插入到 DOM 中时触发
    inserted(el, binding) {
        console.log(el)
        let interfaceList = JSON.parse(sessionStorage.getItem('interfaceList'))
        if (binding.value) {
            const index = interfaceList.findIndex(item => item.requestUrl === binding.value)
            if (index === -1) {
                el.parentNode.removeChild(el)
            }
        }
    }
})
