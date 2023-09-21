import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
export default {
    lang: "简体中文", // 这个写对应国语言
    ...zhCN,
    query: {
        title: "查询条件",
        query: "查询",
        clear: "清空"
    },
    toolBar: {
        add: "新增",
        delete: "删除",
        edit: "编辑",
        deleteByCondition: "删除符合过滤条件",
        copy: "复制",
        save: "保存",
        rootNode: "根节点",
        fullTableSearch: "全表搜索",
        export: {
            title: "导出",
            filter: "导出过滤",
            curPage: "导出当页",
            checked: "导出勾选",
            template: "模板导出"
        },
        import: {
            tooltip: "导入",
            fileTitle: "导入文件",
            selectFile: "选择文件",
            preview: "预览",
            confirmImportText: "确定导入",
            cancelButtonText: "取消"
        },
        refreshTooltip: "刷新",
        screenfullTooltip: "全屏",
    },
    modal: {
        addTitle: "新增&保存",
        editTitle: "编辑&保存",
        copyTitle: "复制&保存",
        copyWarnMsg: "请选重一行",
        deleteMsg: ""
    },
    confirm: {
        delete: {
            confirmMsg: "此操作将批量删除符合条件的数据, 是否继续?",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            checkedRowMsg: "请先勾选行",
        }
    }
}