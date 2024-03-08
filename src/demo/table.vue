<template>
  <div class="ready-table-demo-page">
    <!-- <div @click="onChangeL">语言</div> -->
    <ready-table :showToolBtns="{
      import: true,
      export: true,
      update: true,
      delete: true,
      search: false,
      add: true,
      refresh: true,
      exportable: {
        filter: true,
      },
    }" :showToolBar="true" :showPageBar="true" :colors="colors" :addConfig="addConfig" :deleteConfig="deleteConfig"
      :updateConfig="updateConfig" :selectConfig="selectConfig" :downloadConfig="downloadConfig" :reqIgnoreKeys="['sort']"
      :filterCondition="{
        dataType: 'macStatus',
        endDate: '2022-06-24 12:19:00',
        mac_code: [],
        shopCode: 'j6-3-9',
        startDate: '2022-06-24 12:18:00',
      }" :autoPager="true" :token="{
  // url请求基本配置
  key: 'Authorization',
  value: 'token',
  baseUrl: 'http://localhost:8594',
}" :defaultProp="{
  // 后端返回的字段映射关系
  data: 'payload.tableData',
  total: 'payload.tablePage.total',
}" :formRules="formRules" :hooks="tableHooks" :fields="fields" :importConfig="importConfig"
      :toolBtnText="toolBtnText">
      <template #afterToolbar>
        <vxe-button icon="el-icon-download" status="primary" :disabled="tableHooks.checkeds.length != 1">下载</vxe-button>
      </template>
    </ready-table>
  </div>
</template>
<script>
import { Modal } from "vxe-table";
import ReadyTable from "@/components/ReadyTable";
export default {
  components: { ReadyTable, Modal },
  methods: {
    onChangeL() {
      this.$i18n.locale = this.$i18n.locale == "en" ? "zh-CN" : "en";
    },
  },
  data() {
    return {
      toolBtnText: {
        // update: { text: "更新" },
      },
      colors: {
        theme: "#0D194B",
        fontColor: "#37D0FA",
        btnColor: "#F8F4F4",
        btnBgColor: "#0C1442",
        activeColor: "#4F9FFE",
        dateRangeBgColor: "#999",
        multiOptionBgColor: "#ddd",
        tableBorderColor: "#4780BA",
        scrollbarThumbColor: "#262F65",
        nthChildEvenColor: "",
      },
      tableHooks: {
        checkeds: [],
      }, // 可以打印出来看看
      addConfig: { method: "post", url: "manage/machine/insertMacInfo.do" },
      selectConfig: { method: "get", url: "table/select", reqKey: "params" },
      updateConfig: { method: "get", url: "table/update" },
      deleteConfig: { method: "post", url: "manage/machine/deleteMacInfo.do" },
      importConfig: { method: "post", url: "manage/machine/uploadMacInfo.do" },
      downloadConfig: {
        method: "post",
        url: "http://192.168.100.217:8899/ae_cnc/fileDownload/detect_ExpExcel",
      },
      fields: [
        {
          title: "区域编号",
          field: "code",
          isSlot: false,
          sortable: false,
          searchable: true,
          importRequired: true,
          formSort: 9,
        },
        {
          title: "区域名称",
          field: "name",
          isSlot: false,
          sortable: false,
          searchable: true,
          importRequired: true,
          formSort: 10,
        },
        {
          title: "采集周期（毫秒）",
          field: "periodCollect",
          isSlot: false,
          sortable: false,
          importRequired: true,
        },
        {
          title: "重连间隔（秒）",
          field: "periodReconn",
          isSlot: false,
          sortable: false,
          importRequired: true,
        },
        {
          title: "排序",
          field: "sort",
          isSlot: false,
          sortable: false,
          isShow: false,
        },
        {
          title: "创建日期",
          field: "createtime",
          isSlot: false,
          sortable: false,
          showFormItem: false,
        },
      ],
      formRules: {
        $schema: "http://json-schema.org/draft-07/schema#",
        title: "table form",
        description: "A zone from Acme's catalog",
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            require: true,
          },
          code: {
            type: "string",
            minLength: 1,
            require: true,
          },
          factoryid: {
            type: "string",
            minLength: 1,
            require: true,
          },
          workshopid: {
            type: "string",
            minLength: 1,
            require: true,
          },
          periodCollect: {
            type: "string",
            minLength: 1,
            require: true,
          },
          periodReconn: {
            type: "string",
            minLength: 1,
            require: true,
          },
        },
      },
    };
  },
};
</script>

<style lang="scss">
.ready-table-demo-page {
  width: 100%;
  height: 100%;
}
</style>


