/**
 * 防抖函数
 * @param {function} fn
 * @param {number} delay
 * let debounce = debounce(fn, delay); debounce()
 */
export function _debounce(fn, delay) {
    let timer
    return function () {
        let context = this
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(function () {
            fn.apply(context, args)
        }, delay)
    }
    
}

// 对于sql数据永远是扁平式的
export function json2obj() {

}

