export const defaultField = {
    title: "", // 显示的字段
    field: "", // 数据库字段名称<英文>
    width: "", // 字段的宽度，作用于表头
    sortable: true, // 字段是否可排序，作用于表头
    isSlot: false, // 是否开启插槽
    slotName: "", // 动态插槽名，当isSlot为true时有效，主要用于前端渲染重新自定义
    isShow: true, // 该字段是否显示
    searchable: false, // 该字段是否可搜索
    treeNode: false, // 树结构必须且只能有一个为true
    clickEdit: false, // 是否启动点击编辑模式
    noEdit: false, // 针对某一列
    showFormItem: true, // 在弹窗中是否显示该字段
    exportable: true, // 是否可导出
    importRequired: false, // 导入是否必填
    aline: false, // 独占一行
    showOverflow: true, // 用户控制是否显示溢出内容
    // 新增，还未实现
    formSort: 1, // 弹窗的输入顺序
    formColumns: 0, // 该字段是否几列显示
    fieldSort: 1, // 列表的显示顺序
    layoutWidget: "", // 如折叠面板或tab切换，默认为空
    widget: "input", // 该字段在新增或编辑弹窗时是用何种组件渲染
    // 可放入formLayout
    formLayout: {
        placeholder: "", // 占位符，如请输入
        options: [], // 选项
        disabled: false, // 弹窗字段禁用
    }, // 该字段的属性配置
    rules: {}, // 该字段的验证规则
}

export const defaultHooks = {
    fields: [], // 表字段
    checkeds: [], // 勾选的值
    formData: {}, // 弹窗的数据
    tablePage: {}, // 分页
    curPageData: [], // 当前页表的数据
    formCurKey: "", // 当前弹窗正在编辑的键值
    clickRow: {}, // 点击的行
    tableData: [], // 表的数据
}

export const defaultProp = {
    total: "total",
    data: "payload.list"
};

export const defaultTablePage = { // 默认分页
    total: 10, // 总共数据条数
    pageNum: 1, // 第几页
    pageSize: 15, // 每页大小
}

export const defaultTreeConfig = {
    children: 'children',
    accordion: false,
    expandAll: true,
    line: false,
    iconOpen: 'el-icon-remove-outline',
    iconClose: 'el-icon-circle-plus-outline',
}

export const defaultTooltipConfig = {
    showAll: false
}

export const defaultEditConfig = {
    trigger: "click",
    mode: "cell",
    showStatus: true
}

export const defaultToken = {
    key: "Authorization",
    value: "Authorization",
    baseUrl: "http://localhost:8080/"
}

export const defaultToolBar = {
    add: true,
    delete: true, // 删除勾选的
    deleteByCondition: false, // 删除符合过滤条件的数据
    update: true,
    search: false, // 普通搜索
    globalSearch: false, // 全局搜索
    print: false,
    inputSet: false,
    export: false,
    refresh: false,
    save: false,
    import: false,
    copy: false, // 复制
    exportable: {
        filter: false,
        curPage: true,
        checked: true,
        template: true,
    },
    screenfull: true, // 全屏
    columnSettings: true, // 列显示隐藏
}

export const defaultLayout = {
    border: false, // 显示边框
    grid: false, // 表单内部栅栏
    labelSuffix: ":", // 字段标题后缀内容，默认' : '
    labelWidth: "95px", // 标签宽度,默认50px
    validator: "input", // submit
    labelAlign: "right", // 标签对齐, 默认右对齐, 可选左对齐left
    labelInline: true, // 字段标题显示位置, 默认true左侧left,false显示在top上方
    colors: {
        theme: "", // #0D194B
        fontColor: "", // #37D0FA
        btnColor: "", // #F8F4F4
        btnBgColor: "", // #040C19
        activeColor: "", // #4F9FFE
        dateRangeBgColor: "", // #999
        multiOptionBgColor: "", //#ddd
        tableBorderColor: "", // #0d47a1
    },
    actions: [
        {
            name: "submit", // 按键的唯一标识符
            type: "primary", // 按键类型,默认为primary，具体可见element button
            title: "提交", // 按键的文字
            icon: "", // 按键图标 具体可见element icon
            right: true, // 如果=true，则显示在右侧
            visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
            tips: "提示信息", // 鼠标悬浮在按键的提示信息
            top: false, // 是否在上面, false则在下面
            size: "small", // medium / small / mini, 若未指明，则等同于form.size
        },
        {
            name: "reset", // 按键的唯一标识符
            type: "", // 按键类型,默认为primary，具体可见element button
            title: "重置", // 按键的文字
            icon: "", // 按键图标 具体可见element icon
            right: true, // 如果=true，则显示在右侧
            visible: true, // 按键是否可见,同时满足readonly===false和设置为true才会显示,默认为true
            tips: "提示信息", // 鼠标悬浮在按键的提示信息
            top: false, // 是否在上面, false则在下面
            size: "small", // medium / small / mini, 若未指明，则等同于form.size
        },
    ],
    layout: []
}
