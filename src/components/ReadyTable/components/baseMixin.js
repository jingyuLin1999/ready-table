export default {
    props: {
        hooks: { type: Object, default: () => ({}) }, // 挂载对象
        showTool: { type: Boolean, default: false }, // 是否显示该按钮功能
        params: { type: Object, default: () => ({}) }, // 一些参数
    },
    inject: ["injectStyles"],
}