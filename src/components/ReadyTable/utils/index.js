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

export function observerDomResize(dom, callback) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

    const observer = new MutationObserver(callback)

    observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true, subtree: true, })

    return observer
}

