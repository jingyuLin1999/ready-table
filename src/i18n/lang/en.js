import enUS from 'vxe-table/lib/locale/lang/en-US'

export default {
    ...enUS,
    lang: "english",
    query: {
        title: "query criteria",
        query: "query",
        clear: "clear"
    },
    toolBar: {
        add: "add",
        delete: "delete",
        edit: "edit",
        deleteByCondition: "delete by query",
        copy: "copy",
        save: "save",
        rootNode: "root node",
        fullTableSearch: "full table search",
        export: {
            title: "export",
            filter: "filter",
            curPage: "current page",
            checked: "checked",
            template: "template"
        },
        import: {
            tooltip: "import",
            fileTitle: "import file",
            selectFile: "select file",
            preview: "preview",
            confirmImportText: "confirm import",
            cancelButtonText: "cancel"
        },
        refreshTooltip: "refresh",
        screenfullTooltip: "full screen",
    },
    modal: {
        addTitle: "add&save",
        editTitle: "edit&save",
        copyTitle: "copy&save",
        copyWarnMsg: "please select a row",
    },
    confirm: {
        delete: {
            confirmMsg: "This operation will batch delete eligible data. Do you want to continue?",
            confirmButtonText: "sure",
            cancelButtonText: "cancal",
            checkedRowMsg: "Please check the row first",
        }
    }

}