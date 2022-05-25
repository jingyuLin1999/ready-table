<template>
  <div class="import-component" :style="injectStyles">
    <Tooltip content="导入" placement="bottom-end" effect="light">
      <vxe-button
        icon="el-icon-upload2"
        circle
        :disabled="Object.keys(params.importConfig).length == 0"
        @click="openImportModal"
      ></vxe-button>
    </Tooltip>
    <vxe-modal
      v-model="isModal"
      title="批量导入"
      width="80%"
      height="80%"
      resize
      showFooter
      destroy-on-close
    >
      <div class="grid-border">
        <div class="grid-title">
          <span><i class="el-icon-s-operation"></i>导入信息</span>
          <div class="export-template" @click="exportTemplate">导出模板</div>
        </div>
        <div class="grid-container select-file">
          <vxe-button
            size="small"
            class="select-file-button"
            icon="fa fa-download"
            @click="selectImportFile"
            >选择文件</vxe-button
          >
          <div class="file-info" v-if="Object.keys(fileInfo).length > 0">
            {{ `${fileInfo.options.filename}.${fileInfo.options.type}` }}
          </div>
        </div>
        <div class="grid-title"><i class="el-icon-s-operation"></i>预览</div>
        <vxe-table
          class="grid-container"
          border
          :data="tableData"
          :cell-style="cellStyle"
          :header-cell-class-name="headerCellClassName"
        >
          <template v-for="item in perviewFields">
            <vxe-table-column
              align="center"
              show-overflow
              :visible="item.isShow"
              :key="item.field"
              :field="item.field"
              :title="item.title"
              :width="item.width"
              :sortable="item.sortable"
            >
            </vxe-table-column>
          </template>
        </vxe-table>
      </div>
      <template #footer>
        <Button
          size="small"
          type="primary"
          :disabled="tableData.length == 0"
          @click="onSureImport"
          >确定导入</Button
        >
        <Button size="small" @click="closeModal">取消</Button>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
import { Tooltip, Button } from "element-ui";
import BaseMixin from "./baseMixin";
import { uploadImportFile } from "../utils/apis";
export default {
  name: "import-component",
  mixins: [BaseMixin],
  props: {
    formData: { type: Object, default: () => ({}) },
  },
  components: { Tooltip, Button },
  computed: {
    filterFields() {
      let previewFields = JSON.parse(JSON.stringify(this.hooks.fields));
      previewFields = previewFields.filter((fieldItem) => {
        fieldItem.sortable = false;
        if (fieldItem.exportable) {
          fieldItem.isShow = true;
          return true;
        } else fieldItem.isShow = false;
      });
      previewFields.push({ title: "提示", field: "tips", sortable: false });
      return previewFields;
    },
  },
  methods: {
    async load() {
      await this.$nextTick();
      this.isPreview = true;
      this.fileInfo = {};
      this.tableData = [];
      this.perviewFields = this.filterFields;
      this.importConfig = this.params.importConfig;
      this.hooks.importFile = this.importFile;
    },
    cellStyle({ row, rowIndex, column }) {
      if (column.property === "tips") {
        if (row.tips && row.tips.length > 0) {
          return {
            backgroundColor: "#f00",
            color: "#fff",
            fontSize: "11px",
          };
        }
      }
    },
    openImportModal() {
      this.load();
      this.isModal = true;
    },
    selectImportFile() {
      this.hooks.xTable.importData();
    },
    importFile({ file, options }) {
      this.fileInfo = { options, file };
      return new Promise((resolve, reject) => {
        let formdata = new FormData();
        formdata.append("myfile", file);
        formdata.append("isPreview", this.isPreview);
        for (let key in this.formData) {
          formdata.append(key, this.formData[key]);
        }
        uploadImportFile({
          data: formdata,
          config: this.importConfig,
        }).then((response) => {
          const { payload } = response;
          if (this.isPreview) {
            this.tableData = Array.isArray(payload) ? payload : [];
          }
          resolve(true);
        });
      }).catch((error) => {
        console.error("上传失败", error);
        reject(error);
      });
    },
    async onSureImport() {
      let isTips = this.tableData.find(
        (item) => item.tips && item.tips.length > 0
      );
      if (isTips) {
        this.$message({
          type: "error",
          message: "请根据【提示】在Excel中排除异常数据，再重新【选择文件】",
        });
        return;
      }
      this.isPreview = false;
      let isImportSuccess = await this.importFile(this.fileInfo);
      if (isImportSuccess) {
        this.isModal = false;
        this.hooks.refresh();
      }
    },
    closeModal() {
      this.isModal = false;
      this.fileInfo = {};
      this.tableData = [];
    },
    exportTemplate() {
      this.hooks.exportTemplate();
    },
    headerCellClassName({ column, columnIndex }) {
      const rowInfo = this.filterFields.find(
        (item) => item.field == column.property
      );
      if (rowInfo && rowInfo.importRequired) {
        return "import-required";
      }
    },
  },
  data() {
    return {
      fileInfo: {},
      tableData: [],
      isModal: false,
      isPreview: true,
      importConfig: {},
      perviewFields: [],
    };
  },
};
</script>

<style lang="scss" >
$borderColor: var(--fontColor);
.import-component {
  margin-left: 8px;
  .grid-container .vxe-header--column.import-required {
    color: #f00;
  }

  .grid-border {
    border: 1px solid $borderColor;
    .grid-title {
      height: 35px;
      line-height: 35px;
      border-top: 1px solid $borderColor;
      border-bottom: 1px solid $borderColor;
      padding: 0 2px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      background: var(--btnBgColor);
      .export-template {
        margin-left: 10px;
        color: #f60;
        cursor: pointer;
      }
    }
    .grid-container {
      min-height: 50px;
      padding: 0 2px;
    }
    .select-file {
      display: flex;
      align-items: center;
      margin-bottom: 3px;
      .select-file-button {
        margin-right: 5px;
      }
    }
  }
}
</style>