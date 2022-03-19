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