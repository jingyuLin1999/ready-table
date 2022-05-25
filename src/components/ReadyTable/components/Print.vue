<template>
  <vxe-button
    v-if="showTool"
    size="small"
    status="danger"
    icon="el-icon-printer"
    transfer
    placement="bottom"
  >
    <template #default>打印</template>
    <template #dropdowns>
      <vxe-button
        v-for="item in printOptions"
        :key="item.value"
        type="text"
        :content="item.label"
        @click="onChange(item)"
      ></vxe-button>
    </template>
  </vxe-button>
</template>

<script>
import BaseMixin from "./baseMixin";
import { Message } from "element-ui";
import { totalTableData } from "../utils/apis";

export default {
  mixins: [BaseMixin],
  data() {
    return {
      printOptions: [
        { label: "打印当页", value: "curPage" },
        { label: "打印选中", value: "checked" },
        { label: "打印所有", value: "totalPage" },
      ],
    };
  },
  methods: {
    onChange({ value }) {
      let printValue = value;
      if (!printValue) return;
      switch (printValue) {
        case "curPage":
          this.printCurPage();
          break;
        case "checked":
          this.printChecked();
          break;
        case "totalPage":
          this.printTotal();
          break;
        default:
          break;
      }
    },
    printCurPage() {
      this.hooks.xTable.print();
    },
    printChecked() {
      let checkedRecords = this.hooks.checkeds;
      if (checkedRecords == 0) {
        this.$message({
          message: "请勾选要打印的行",
          type: "warning",
        });
        return;
      }
      this.hooks.xTable.print({
        data: checkedRecords,
      });
    },
    printTotal() {
      let tableData = this.getTotalData();
      this.hooks.xTable.print({
        data: tableData,
      });
    },
    // 获取所有数据
    async getTotalData() {
      let tableData = [];
      // 正常情况下table无法获取全部数据，故需从服务器加载所有数据
      try {
        const { payload } = await totalTableData({
          config: this.params.queryConfig,
        });
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
      return tableData;
    },
  },
};
</script>

<style lang="scss" scoped>
.print-tool {
  .vxe-button,
  .vxe-button--dropdown {
    margin-left: 0;
    margin-right: 8px;
  }
  width: 90px;
  .select-tool {
    width: 80px;
  }
}
</style>