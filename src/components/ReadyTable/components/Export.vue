<template>
  <div class="export-tool" v-if="showTool">
    <vxe-button :icon="toolBtnText.export.icon ? toolBtnText.export.icon : 'el-icon-download'
    " status="warning" :loading="loading" size="small" :content="exportLabel">
      <template #dropdowns>
        <vxe-button v-if="exportable.filter" type="text" :content="$t('toolBar.export.filter')"
          @click="exportFilter"></vxe-button>
        <vxe-button v-if="exportable.curPage" type="text" :content="$t('toolBar.export.curPage')"
          @click="exportCurPage"></vxe-button>
        <vxe-button v-if="exportable.checked" type="text" :content="$t('toolBar.export.checked')"
          @click="exportChecked"></vxe-button>
        <vxe-button v-if="exportable.template" type="text" status="success" :content="$t('toolBar.export.template')"
          @click="createExcel"></vxe-button>
      </template>
    </vxe-button>
  </div>
</template>

<script>
import dayjs from "dayjs";
import axios from "axios";
import BaseMixin from "./baseMixin";
import { Message } from "element-ui";
import { isUrl } from "../utils/index";
import { tableData } from "../utils/apis";

export default {
  mixins: [BaseMixin],
  props: {
    exportable: { type: Object, default: () => ({}) }, // 是否可以下载
    downloadConfig: { type: Object, default: () => ({}) }, // 下载配置
    defaultProp: { type: Object, default: () => ({}) },
    fields: { type: Array, default: () => [] }, // 表单栏位字段
  },
  data() {
    return {
      loading: false,
      downloadProgress: 0, // 导出进度
      mockInterval: null,
    };
  },
  computed: {
    exportLabel() {
      let baseLabel = this.toolBtnText.export.text || this.$t("toolBar.export.title");
      if (this.downloadProgress > 0 && this.downloadProgress <= 100)
        baseLabel = baseLabel + this.downloadProgress + "%";
      return baseLabel;
    },
    exportParams() {
      let { queryCondition, filterCondition } = this.params;
      return Object.assign({}, filterCondition, queryCondition);
    },
  },
  mounted() {
    this.initHooks();
  },
  methods: {
    exportColumns() {
      let detailExportFields = [], exportFields = []
      if (Array.isArray(this.fields)) {
        this.fields.map((item) => {
          if (item.exportable && item.isShow) {
            detailExportFields.push({
              field: item.field,
            });
            exportFields.push(item.field)
          }
        });
      }
      return { detailExportFields, exportFields };
    },
    initHooks() {
      this.hooks.exportTemplate = this.createExcel;
    },
    // 导出符合当前的过滤条件数据
    async exportFilter() {
      try {
        this.loading = true;
        // 大数据导出需要后端配合
        if (Object.keys(this.downloadConfig).length > 0) {
          await this.downloadServerFile(this.exportParams);
        } else {
          // 根据过滤条件获取数据，并在前端生成文件
          await tableData({
            data: {
              pageNum: 1,
              pageSize: 1000000, // 一百万条数据
              ...this.exportParams,
              queryCondition: this.exportParams,
            },
            config: this.params.queryConfig,
          })
            .then(async (response) => {
              let dataKey = this.defaultProp.data;
              let list = this.deepPick(dataKey.split("."), response);
              if (Array.isArray(list) && list.length > 0)
                await this.createExcel(list);
            })
            .catch((e) => {
              console.warn("下载获取数据失败", e);
            });
        }
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    },
    deepPick(keys = [], obj) {
      let pickObj = null;
      if (keys.length == 0 || !keys[0]) return obj;
      keys.map((key, index) => {
        pickObj = obj[key];
        if (pickObj && keys.length != index + 1) obj = pickObj;
      });
      return pickObj;
    },
    // 大数据导出模拟进度
    mockProgress() {
      let progress = 1;
      this.downloadProgress = progress;
      let downloadTotalData = this.hooks.tablePage.total || 1;
      let calcuTime = (downloadTotalData / 100) * 34; // 100笔大概需要35ms
      this.mockInterval = setInterval(() => {
        progress += 1;
        this.downloadProgress = progress;
        if (progress > 97) clearInterval(this.mockInterval); // 卡在98%
      }, calcuTime / 97);
    },
    // 从服务器中导出excel,备注 new XMLHttpRequest()打包后会报错
    async downloadServerFile(params) {
      this.mockProgress();
      let { url, method } = this.downloadConfig;
      let authKey = sessionStorage.getItem("auth-key");
      let authValue = sessionStorage.getItem("auth-value");
      let baseUrl = sessionStorage.getItem("base-url");
      url =
        !isUrl(url) && baseUrl ? sessionStorage.getItem("base-url") + url : url;
      await axios({
        url,
        method: method || "get",
        [method == "get" ? "params" : "data"]: {
          ...params,
          [this.defaultProp.exportFields]: this.exportColumns().exportFields
        },
        responseType: "blob",
        headers: {
          [authKey]: authValue,
        },
        onDownloadProgress: (evt) => {
          let { loaded, total } = evt;
          if (this.mockInterval) clearInterval(this.mockInterval); // 删除虚假的
          let progress = parseInt((loaded / (total || 1)) * 100);
          if (progress >= this.downloadProgress)
            this.downloadProgress = progress;
        },
      })
        .then((response) => {
          let blob = new Blob([response.data], {
            type: "application/octet-stream",
          });
          // 创建a链接 href链接地址 download为下载下来后文件的名称
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.innerHTML = "表下载链接";
          downloadElement.download =
            "export_" + dayjs().format("YYYYMMDDHHmmss") + ".xlsx";
          downloadElement.style.display = "none"; //隐藏a标签 直接调用a标签的点击事件
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href); //释放掉blob对象
          this.downloadProgress = 0;
          this.mockInterval = null;
        })
        .catch((e) => {
          Message({ type: "error", message: `下载文件失败${e}` });
          console.error("下载文件失败", e);
        });
    },
    // 导出当页数据
    exportCurPage() {
      if (this.hooks.curPageData.length == 0) {
        Message({ type: "warning", message: "无数据可导出" });
        return;
      }
      this.createExcel(this.hooks.curPageData);
    },
    // 导出已选择的数据
    exportChecked() {
      if (!this.hooks.checkeds.length) {
        Message({ type: "warning", message: "请勾选要导出的数据" });
        return;
      }
      this.createExcel(this.hooks.checkeds);
    },
    // 导出模板
    async createExcel(data = []) {
      this.loading = true;
      await this.hooks.xTable.exportData({
        type: "xlsx",
        data: data,
        original: false,
        columns: this.exportColumns().detailExportFields,
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.export-tool {
  box-sizing: border-box;
  width: 90px;

  .vxe-button,
  .vxe-button--dropdown {
    margin-left: 0;
    margin-right: 8px;
  }

  .vxe-button--dropdown {
    margin-right: 0px;
  }
}
</style>