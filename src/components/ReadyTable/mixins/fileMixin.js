import {
    printOptions,
    exportOptions,
} from "../utils/defaultData";
import {
    allTableData,
} from "../utils/apis";
export default {
    data() {
        return {
            printValue: "",
            printOptions: printOptions,
            exportValue: "",
            exportOptions: exportOptions,
        }
    },
    methods: {
        onExport() {
            if (!this.exportValue) return;
            else if (this.exportValue == 'export') {
                this.onExportAllData();
            } else if (this.exportValue == 'templage') {
                this.exportTemplate();
            }
            this.exportValue = null
        },
        exportTemplate() {
            this.$refs.xTable.exportData({
                // original: true,
                data: [],
            });
        },
        async onExportAllData() {
            let exportConfig = JSON.parse(JSON.stringify(this.tableConfig));
            exportConfig.url += "?export=1";
            const { payload } = await allTableData({
                data: { ...this.tablePage },
                config: exportConfig,
            });
            this.$refs.xTable.openExport({
                filename: "自定义文件名",
                type: "csv",
                isHeader: true,
                isFooter: true,
                original: false,
                data: payload.tableData || [],
            });
        },
        // 打印
        async onPrint() {
            if (!this.printValue) return;
            switch (this.printValue) {
                case "allPage":
                    this.onExportData();
                    break;
                case "curPage":
                    this.$refs.xTable.print();
                    break;
                case "selected":
                    let checkedData = this.$refs.xTable.getCheckboxRecords();
                    if (checkedData.length == 0) {
                        this.printValue = "打印";
                        break;
                    }
                    this.$refs.xTable.print({
                        data: this.$refs.xTable.getCheckboxRecords(),
                    });
                    break;
            }
            this.printValue = null;
        },
        onImportData() {
            // this.$refs.xTable.openImport()
            this.$refs.xTable.importData();
        },
        afterImport({ options }) {
            // TODO 发起http请求保存数据
            console.log(options);
        },
    }
}