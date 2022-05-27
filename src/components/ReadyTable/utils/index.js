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

/**
 * @description Get the rgb value of the hex color
 * @param {String} color Hex color
 * @return {Array<Number>} Rgb value of the color
 */
export function getRgbValueFromHex(color) {
    color = color.replace('#', '');
    if (color.length === 3) color = Array.from(color).map(function (hexNum) {
        return hexNum + hexNum;
    }).join('');
    color = color.split('');
    return new Array(3).fill(0).map(function (t, i) {
        return parseInt("0x".concat(color[i * 2]).concat(color[i * 2 + 1]));
    });
}

export function isUrl(url) {
    let Exp = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
    return Exp.test(url);
}
