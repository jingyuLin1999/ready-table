import { Message } from "element-ui";
import { totalTableData, tableData } from "../utils/apis";
export default {
    props: {
        hooks: { type: Object, default: () => ({}) }, // 挂载对象
        showTool: { type: Boolean, default: false }, // 是否显示该按钮功能
        params: { type: Object, default: () => ({}) }, // 一些参数
    },
    inject: ["injectColors"],
    methods: {
        // 获取所有数据
        async getTotalData() {
            let tableData = [];
            // 正常情况下table无法获取全部数据，故需从服务器加载所有数据
            try {
                const { payload } = await totalTableData({ config: this.params.queryConfig });
                tableData = payload.tableData;
            } catch (e) {
                Message({
                    message:
                        "从服务器获取数据失败，无法导出所有数据，若继续导出，只能导出模板",
                    type: "error",
                    duration: 10 * 1000,
                });
                console.error(`从服务器获取数据失败，无法导出所有数据:${e}`);
            }
            return tableData
        },
        getQueryData() {
            const { queryCondition, queryConfig } = this.params;
            return new Promise((resolve, reject) => {
                tableData({
                    data: {
                        pageNum: 1,
                        pageSize: 100000000, // 一百万条数据
                        queryCondition: JSON.stringify(queryCondition),
                    },
                    config: queryConfig
                }).then(response => {
                    const { payload } = response;
                    resolve(payload)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}