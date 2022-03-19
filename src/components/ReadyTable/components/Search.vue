<template>
  <div class="search-tool" v-if="showTool">
    <vxe-select
      size="mini"
      placeholder="查询"
      prefix-icon="el-icon-search"
      v-model="searchValue"
      :options="searchOptions"
      :style="{ width: '100px' }"
      @change="onChange"
    >
    </vxe-select>
    <vxe-modal
      v-model="isModal"
      :title="curModal.title"
      :width="curModal.width"
      :height="curModal.height"
      min-width="200"
      min-height="200"
      resize
      destroy-on-close
      :showFooter="true"
    >
      <div class="modal-body" v-if="curModal.name == 'simple'">
        <RichForm
          class="simple-form"
          :form="simpleLayout"
          :values="simpleForm.values"
        />
      </div>
      <div class="modal-body" v-if="curModal.name == 'senior'">
        <Expression
          title="查询条件选择"
          :fields="seniorFields"
          :data="seniorSearch"
        />
      </div>
      <div class="modal-body" v-if="curModal.name == 'repeat'">
        <check-fields :fields="fields" :value="repeatValue" />
      </div>
      <div class="modal-body" v-if="curModal.name == 'empty'">
        <check-fields :fields="fields" :value="emptyValue" />
      </div>
      <div slot="footer">
        <Button type="primary" size="small" @click="onSearch">确定</Button>
        <Button type="danger" size="small" @click="isModal = false"
          >取消</Button
        >
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import { Button } from "element-ui";
import BaseMixin from "./baseMixin";
import Expression from "./Expression";
import CheckFields from "./CheckFields";
import { RichForm } from "richform";
export default {
  name: "search-tool",
  mixins: [BaseMixin],
  components: { RichForm, Expression, CheckFields, Button },
  props: {
    fields: { type: Array, default: () => [] },
    selectConfig: { type: Object, default: () => ({}) }, // 查询配置
    simpleSearch: { type: Object, default: () => ({}) }, // 简单查询可以增加一些查询字段
  },
  methods: {
    onChange() {
      if (!this.searchValue) return;
      this.curModal = this.modal[this.searchValue];
      this.curModal.name = this.searchValue;
      this.isModal = !this.isModal;
      this.searchValue = null;
    },
    searchCondition() {
      let searchConditions = null;
      switch (this.curModal.name) {
        case "simple":
          searchConditions = this.simpleForm.values;
          break;
        case "senior":
          searchConditions = this.seniorSearch;
          break;
        case "repeat":
          searchConditions = this.repeatValue;
          break;
        case "empty":
          searchConditions = this.emptyValue;
          break;
        default:
          break;
      }
      return searchConditions;
    },
    async onSearch() {
      this.isModal = false;
      this.hooks.onSearch(this.searchCondition());
    },
    getFields() {
      let fieldOptions = [];
      this.fields.map((item) => {
        fieldOptions.push({
          label: item.title,
          value: item.field,
        });
      });
      return fieldOptions;
    },
  },
  data() {
    return {
      isModal: false,
      searchValue: "",
      curModal: {}, // 当前的模态框
      searchOptions: [
        { label: "简单查询", value: "simple" },
        { label: "高级查询", value: "senior" },
        { label: "查询重复数据", value: "repeat" },
        { label: "查询空项数据", value: "empty" },
      ],
      modal: {
        // 模态框配置
        simple: { width: 700, height: 250, title: "简单查询" },
        senior: { width: 700, height: 300, title: "高级查询" },
        repeat: { width: 210, height: 500, title: "查询重复数据" },
        empty: { width: 210, height: 500, title: "查询空项数据" },
      },
      simpleForm: {
        values: {},
        form: {},
      },
      seniorSearch: [],
      repeatValue: {},
      emptyValue: {}, //
    };
  },
  computed: {
    simpleLayout() {
      let fieldOptions = this.getFields();
      this.simpleForm.form = {
        border: false,
        grid: false,
        labelSuffix: true,
        labelWidth: "90px",
        labelInline: true,
        labelAlign: "right",
        layout: [
          {
            widget: "grid",
            showTitle: false,
            isClicked: false,
            fields: [
              [
                {
                  title: "字段名称",
                  widget: "select",
                  name: "fields",
                  size: "mini",
                  options: fieldOptions,
                },
              ],
              [
                {
                  title: "条件",
                  widget: "select",
                  name: "condition",
                  size: "mini",
                  options: [
                    {
                      value: "fuzzy",
                      label: "模糊匹配",
                    },
                    {
                      value: "accurate",
                      label: "精确匹配",
                    },
                  ],
                },
              ],
              [
                {
                  title: "值",
                  widget: "input",
                  name: "value",
                  size: "mini",
                },
              ],
            ],
          },
          this.simpleSearch,
        ],
      };
      return this.simpleForm.form;
    },
    seniorFields() {
      let fieldOptions = this.getFields();
      return [
        {
          name: "relationship",
          title: "连接关系",
          widget: "select",
          options: [
            { label: "与", value: "&&" },
            { label: "或", value: "||" },
          ],
        },
        {
          name: "compare",
          title: "比较字段",
          widget: "select",
          options: fieldOptions,
        },
        {
          name: "contact",
          title: "关系式",
          widget: "select", // input
          options: [
            { label: "与", value: "&&" },
            { label: "或", value: "||" },
          ],
        },
        {
          name: "compareValue",
          title: "比较值",
          widget: "input", // input
          options: fieldOptions,
        },
      ];
    },
  },
};
</script>

<style lang="scss">
.search-tool {
  .modal-body {
    .simple-form {
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>