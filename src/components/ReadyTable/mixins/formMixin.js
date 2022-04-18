import { deleteRows, addRow, updateRow } from "../utils/apis";
import { Message, MessageBox } from "element-ui";
import { defaultLayout } from "../utils/defaultData";
import { clone } from "ramda";

export default {
    data() {
        return {
            formValues: {},
            formHooks: {},
            remoteForm: {
                schema: {},
                layout: {},
            },
            curClickBtn: "", // 当前点击的按钮
            searchCondition: {}, // 过滤条件
            showSearchPanel: false, // 是否显示搜索面板
            calcuCheckRowKeys: [], // 分页后勾选会将勾选的id保存在这里，当切换回来是根据该数据重新手动勾选
        }
    },
    computed: {
        vxFormRules() {
            return Object.keys(this.formRules).length > 0
                ? this.formRules
                : this.remoteForm.schema;
        },
        vxFormLayout() {
            if (Object.keys(this.formLayout).length > 0) {
                this.formLayout.colors = this.vxColors;
                return this.formLayout;
            }
            return this.remoteForm.layout;
        },
        queryFormLayout() {
            let columns = [];
            for (let index = 0; index < 3; index++)columns.push([])
            let formRow = { widget: "grid", showTitle: false, isClicked: false, fields: [...columns] };
            let fields = clone(this.vXTableFields);
            this.toSort(fields, "fieldSort");
            for (let index = 0; index < fields.length; index++) {
                let fieldItem = fields[index];
                if (fieldItem.searchable) {
                    // 查找最小的下标
                    let minIndex = 0, fieldLength = 1000;
                    formRow.fields.map((column, index) => {
                        if (column.length < fieldLength) {
                            fieldLength = column.length;
                            minIndex = index;
                        }
                    })
                    formRow.fields[minIndex].push({
                        title: fieldItem.title,
                        widget: fieldItem.widget,
                        name: fieldItem.field,
                        disabled: fieldItem.disabled,
                        placeholder: fieldItem.placeholder,
                        ...fieldItem.formLayout
                    })
                    if (!this.showSearchPanel) this.showSearchPanel = true;
                }
            }
            let cloneDefaultLayout = JSON.parse(JSON.stringify(defaultLayout));
            cloneDefaultLayout.colors = this.vxColors;
            let defaultForm = cloneDefaultLayout;
            let collapse = {
                name: "network", widget: "collapse", title: "查询条件", style: { color: '#4F9FFE' }, expand: false, fields: [formRow], actions: [
                    { name: "queryCondition", type: "success", title: "搜索", icon: "el-icon-search", right: true, visible: true, tips: "提示信息", top: false, size: "small" },
                    { name: "clearCondition", type: "danger", title: "清空", icon: "", right: true, visible: true, tips: "提示信息", top: false, size: "small" },
                ],
            }
            defaultForm.layout = [collapse];
            return defaultForm;
        },
        vxCheckRowKeys() {
            this.handleCheckStatus();
            return this.checkRowKeys;
        },
        batchDeleteDisabled() {
            let canFilter = Object.values(this.searchCondition).find(item => item != null)
            return canFilter ? false : true
        },
        vxColors() {
            return Object.assign({ ...defaultLayout.colors }, { ...this.colors })
        },
        injectColors() { // 注入style
            let injectColors = {};
            for (let key in this.vxColors)
                injectColors["--" + key] = this.vxColors[key];
            return injectColors;
        },
    },
    methods: {
        // 复选框值改变了，需要同步控制复选框状态
        async handleCheckStatus() {
            await this.$nextTick();
            this.$set(this.$data, "calcuCheckRowKeys", JSON.parse(JSON.stringify(this.checkRowKeys)))
            this.$refs.xTable.setAllCheckboxRow(false);
            if (this.checkRowKeys.length > 0) {
                this.hooks.curPageData.map(row => {
                    if (this.checkRowKeys.includes(row[this.rowId])) {
                        this.$refs.xTable.setCheckboxRow(row, true);
                    }
                })
            }
        },
        // 单元格格式化
        onFormatter({ row, cellValue, column }) {
            try {
                let field = this.vXTableFields.find(item => item.field == column.property);
                let { options, defaultProp } = field.formLayout;
                if (options.length > 0) {
                    // 考虑树结构，故用递归查找
                    let labels = [];
                    let findOptions = this.iterationFormatter(options, cellValue, defaultProp || {});
                    if (findOptions.length) {
                        let propLabel = "label";
                        if (defaultProp && Object.keys(defaultProp).length && defaultProp.label) propLabel = defaultProp.label;
                        findOptions.map(item => labels.push(item[propLabel]))
                    }
                    return labels.length > 0 ? labels.join(",") : /\[.*?\]/g.test(cellValue) ? "" : cellValue;
                }
                return cellValue
            } catch (e) {
                console.error("单元格格式化错误:" + e)
            }
        },
        // 递归查找树
        iterationFormatter(data = [], cellValue, defaultProp = {}) {
            let result = []; // 结果必须是数组，可能是多选
            let propValue = "value"
            if (Object.keys(defaultProp).length && defaultProp.value) propValue = defaultProp.value;
            if (/\[.*?\]/g.test(cellValue)) cellValue = JSON.parse(cellValue)
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (Array.isArray(cellValue) && cellValue.includes(item[propValue])) result.push(item);
                else if (item[propValue] == cellValue) result.push(item);
                if (item.children && Object.keys(result).length == 0) {
                    result = this.iterationFormatter(item.children, cellValue, defaultProp);
                }
            }
            return result;
        },
        // 自动创建richform的布局
        createFormLayout() {
            let columns = [];
            let aLines = [];
            for (let index = 0; index < this.formColumns; index++)columns.push([])
            let defaultForm = JSON.parse(JSON.stringify(defaultLayout))
            let formRow = { widget: "grid", showTitle: false, isClicked: false, fields: [...columns] }
            for (let index = 0; index < this.vXTableFields.length; index++) {
                let fieldItem = this.vXTableFields[index];
                if (fieldItem.showFormItem) {
                    let field = {
                        title: fieldItem.title,
                        widget: fieldItem.widget,
                        name: fieldItem.field,
                        disabled: fieldItem.disabled,
                        placeholder: fieldItem.placeholder,
                        default: fieldItem.default,
                        ...fieldItem.formLayout
                    };
                    if (fieldItem.formLayout.aline) aLines.push(field);
                    else formRow.fields[index % this.formColumns].push(field)
                }
            }
            defaultForm.colors = this.colors;
            defaultForm.layout = [formRow, ...aLines];
            this.$set(this.remoteForm, "layout", defaultForm);
        },
        // 表单当前正在编辑的字段的键值
        formFieldChange(value, $event) {
            const fieldKey = value.property;
            const fieldValue = $event.value;
            this.$set(this.hooks, "formCurKey", fieldKey)
        },
        formSubmit(data) {
            this.$emit("beforeSubmit", this.formValues);
            if (!this.formHooks.validate()) return;
            if (!this.formAction) {
                this.$emit("action", this.curClickBtn)
                return;
            }
            // 内部自动校验
            switch (this.curClickBtn) {
                case "addSubmit":
                case "copySubmit":
                case "addTreeRoot":
                    this.addSubmit({
                        ...this.formValues,
                    });
                    break;
                case "editSubmit":
                    this.editSubmit({
                        ...this.formValues
                    })
                    break;
                default: break;
            }
        },
        formReset() {
            this.formHooks.reset();
        },
        // 新增弹窗
        addModal() {
            this.modalLabel = "新增&保存";
            this.isModal = !this.isModal;
            this.createFormLayout();
            this.createFormData();
            this.curClickBtn = "addSubmit"
        },
        // 新增提交
        async addSubmit(data) {
            try {
                await addRow({ data, config: this.addConfig });
                localStorage.setItem(`${this.tableId}-recentRow`, JSON.stringify(this.formValues));
                this.isModal = !this.isModal;
                this.$emit("action", "add");
                this.refresh();
            } catch (e) {
                console.error(`新增失败`, e)
            }
        },
        // 编辑弹窗
        editModal() {
            if (!Object.keys(this.editRow).length) {
                Message({ message: "请选重一行", type: "warnning", duration: 5 * 1000 });
                return;
            }
            this.curClickBtn = "editSubmit";
            this.createFormLayout();
            this.modalLabel = "编辑&保存";
            this.isModal = !this.isModal;
            this.formValues = JSON.parse(JSON.stringify(this.editRow));
        },
        // 复制数据
        onCopy() {
            this.editModal();
            this.modalLabel = "复制&保存";
            this.curClickBtn = "copySubmit";
        },
        // 编辑提交
        async editSubmit(data) {
            const result = await updateRow({
                data,
                config: this.updateConfig
            })
            this.$emit("action", "edit");
            this.isModal = !this.isModal;
            this.editRow = this.formValues; // 提交后需要赋值，否则再次点击进来不会改变
            this.refresh();
        },
        // 新增创建表单数据
        createFormData() {
            let formData = {};
            this.fields.map((fieldItem) => {
                formData[fieldItem.field] = null;
            })
            // 树结构赋父节点值
            if (this.curClickBtn == "addTreeRoot") formData.parentid = 0;
            else if (this.isTree && this.curClickBtn !== "addTreeRoot")
                formData.parentid = this.hooks.clickRow[this.rowId];
            this.$set(this.hooks, "formData", formData) // 挂载值
            this.inheritOnAdd(formData);
            this.formValues = Object.assign(formData, this.formData);
        },
        // 新增继承字段
        inheritOnAdd(formData) {
            let inherit = localStorage.getItem(`${this.tableId}-inputInherit`);
            let recentRow = localStorage.getItem(`${this.tableId}-recentRow`);
            if (!inherit || !recentRow) return;
            let inputInherit = JSON.parse(inherit)
            if (!Object.values(inputInherit).includes(true)) return;
            recentRow = JSON.parse(recentRow);
            Object.keys(inputInherit).forEach(key => {
                if (inputInherit[key]) formData[key] = recentRow[key];
            })
        },
        // 删除所勾选的行
        deleteRows() {
            return new Promise((resolve, reject) => {
                if (this.hooks.checkeds.length == 0) {
                    Message({ message: "请先勾选行", type: "error", duration: 4 * 1000, }); return resolve();
                }
                MessageBox.confirm(`${this.deleteTips}, 是否继续?`, {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(async () => {
                    try {
                        let deleteIds = [];
                        this.hooks.checkeds.map(item => {
                            deleteIds.push(item[this.rowId])
                        })
                        this.loading = true;
                        const payload = await deleteRows({
                            data: { deleteIds: JSON.stringify(deleteIds) },
                            config: this.deleteConfig,
                        });
                        // 后端删除了，前端对应的勾选状态也要删除
                        this.hooks.checkeds.map(item => {
                            // 删除勾选缓存的值
                            this.calcuCheckRowKeys.find((checked, index) => {
                                if (item[this.rowId] == checked) {
                                    this.calcuCheckRowKeys.splice(index, 1);
                                    return true;
                                }
                            })
                        })
                        this.refresh();
                        this.hooks.checkeds = [];
                        this.loading = false;
                        resolve()
                    } catch (e) { reject(e) }
                }).catch(() => { });
            })

        },
        // 删除符合过滤条件的
        async deleteByCondition() {
            let canFilter = Object.values(this.searchCondition).find(item => item != null)
            if (!canFilter) return;
            MessageBox.confirm("此操作将批量删除符合条件的数据, 是否继续?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                try {
                    await deleteRows({
                        data: this.searchCondition,
                        config: this.deleteByConditionConfig,
                    });
                } catch (e) {
                    console.warn("批量删除失败")
                }
            }).catch(() => { });
        },
        deepPick(keys = [], obj) {
            let pickObj = null;
            if (keys.length == 0) return obj;
            keys.map((key, index) => {
                pickObj = obj[key];
                if (pickObj && keys.length != index + 1)
                    obj = pickObj;
            })
            return pickObj;
        },
        // 重新设置表
        resetTable(response) {
            let { total: totalKey, data: dataKey } = this.vxDefaultProp;
            let list = this.deepPick(dataKey.split("."), response);
            let total = this.deepPick(totalKey.split("."), response)
            this.remote.tableData = list;
            Object.assign(this.hooks.tablePage, { total: total });
            this.hooks.tableData = list;
            this.setDefaultCheckbox(list);
            this.openTreeNode();
            this.$emit("tableData", list)
        },
        // 树结构展开所有节点
        openTreeNode() {
            if (!this.isTree || !this.vXtreeConfig.expandAll) return;
            setTimeout(() => {
                this.$refs.xTable.setAllTreeExpand(true);
            }, 200)
        },
        // 分页带来的选择框问题
        // 若选择框传入默认值，则勾选
        setDefaultCheckbox(pageData = []) {
            let pickDefaultCheckbox = [];
            if (this.calcuCheckRowKeys.length > 0 && pageData.length > 0) {
                for (let index = 0; index < pageData.length; index++) {
                    let item = pageData[index];
                    let rowId = item[this.rowId];
                    if (rowId && this.calcuCheckRowKeys.includes(rowId))
                        pickDefaultCheckbox[index] = item;
                }
                this.$refs.xTable.setCheckboxRow(pickDefaultCheckbox, true)
            }
        },
        // 扁平数据转树结构
        toTree(data) {
            // 删除 所有 children,以防止多次调用
            data.forEach(function (item) {
                delete item.children;
            });
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            let map = {};
            data.forEach(function (item) {
                map[item.name] = item;
            });
            let val = [];
            data.forEach(function (item) {
                item.id = item.name;
                // 以当前遍历项，的pid,去map对象中找到索引的id
                let parent = map[item.parentName];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            return val;
        },
        // 增加树根节点
        onTreeRoot() {
            this.modalLabel = "增加根节点&保存";
            this.isModal = !this.isModal;
            this.curClickBtn = "addTreeRoot";
            this.createFormLayout();
            this.createFormData();
        }
    }
}