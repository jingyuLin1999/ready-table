<template>
  <div class="ready-table-demo-page">
    <ready-table
      :showToolBtns="{
        import: true,
        export: true,
        update: true,
        delete: true,
        search: false,
        add: true,
        refresh: true,
        exportable: {
          filter: false,
        },
      }"
      :showToolBar="true"
      :showPageBar="true"
      :colors="colors"
      :addConfig="addConfig"
      :deleteConfig="deleteConfig"
      :updateConfig="updateConfig"
      :selectConfig="selectConfig"
      :filterCondition="{ test: 123, lxq: 'ljy' }"
      :token="{
        // url请求基本配置
        key: 'Authorization',
        value: 'token',
        baseUrl: 'http://localhost:8080/',
      }"
      :defaultProp="{
        // 后端返回的字段映射关系
        data: 'payload.tableData',
        total: 'payload.tablePage.total',
      }"
      :formRules="formRules"
      :hooks="tableHooks"
      :fields="fields"
      :importConfig="importConfig"
    >
    </ready-table>
  </div>
</template>
<script>
import ReadyTable from "@/components/ReadyTable";
export default {
  components: { ReadyTable },
  data() {
    return {
      colors: {
        theme: "#0D194B",
        fontColor: "#37D0FA",
        btnColor: "#F8F4F4",
        btnBgColor: "#232B60",
        activeColor: "#4F9FFE",
        dateRangeBgColor: "#999",
        multiOptionBgColor: "#ddd",
        tableBorderColor: "#4780BA",
      },
      tableHooks: {}, // 可以打印出来看看
      addConfig: { method: "post", url: "manage/machine/insertMacInfo.do" },
      selectConfig: { method: "get", url: "table/select" },
      updateConfig: { method: "post", url: "manage/machine/updateMacInfo.do" },
      deleteConfig: { method: "post", url: "manage/machine/deleteMacInfo.do" },
      importConfig: { method: "post", url: "manage/machine/uploadMacInfo.do" },
      fields: [
        {
          title: "区域编号",
          field: "code",
          isSlot: false,
          sortable: false,
          searchable: true,
          importRequired: true,
          formSort: 9,
          formSort: 2,
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
          widget: "inputnumber",
          importRequired: true,
          formLayout: {
            min: 0,
            max: 1000000000,
          },
        },
        {
          title: "重连间隔（秒）",
          field: "periodReconn",
          isSlot: false,
          sortable: false,
          widget: "inputnumber",
          importRequired: true,
          formLayout: {
            min: 0,
            max: 1000000000,
          },
        },
        {
          title: "排序",
          field: "sort",
          isSlot: false,
          sortable: false,
          widget: "inputnumber",
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
            type: "number",
            require: true,
            minimum: 1,
            require: true,
          },
          periodReconn: {
            type: "number",
            require: true,
            minimum: 1,
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


