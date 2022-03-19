<template>
  <div class="input-settings" v-if="showTool">
    <vxe-select
      prefix-icon="el-icon-edit"
      class="select-tool"
      v-model="inputSetValue"
      placeholder="输入设置"
      size="mini"
      :options="inputSettingOptions"
      :style="{ width: '100px' }"
      @change="onChange"
    >
    </vxe-select>
    <vxe-modal
      v-model="curModal.isModel"
      :title="curModal.title"
      :width="curModal.width"
      min-width="200"
      min-height="200"
      resize
      destroy-on-close
      :showFooter="true"
    >
      <check-fields :fields="hooks.fields" :value="inheritValue" />
      <div slot="footer">
        <Button type="primary" size="small" @click="sureInherit">确定</Button>
        <Button type="danger" size="small" @click="onCancel">取消</Button>
      </div>
    </vxe-modal>
  </div>
</template>

<script>
import { Button } from "element-ui";
import BaseMixin from "./baseMixin";
import CheckFields from "./CheckFields";
export default {
  mixins: [BaseMixin],
  components: { CheckFields, Button },
  inject: ["tableId"],
  data() {
    return {
      inputSetValue: "",
      inheritValue: {}, // 继承的字段
      inputSettingOptions: [{ label: "继承字段", value: "inherit" }],
      curModal: {}, // 当前的模态框
      modal: {
        // 模态框配置
        inherit: { isModel: false, width: "250", title: "继承字段设置" },
      },
    };
  },
  methods: {
    onChange() {
      if (!this.inputSetValue) return;
      this.curModal = this.modal[this.inputSetValue];
      switch (this.inputSetValue) {
        case "inherit":
          this.$set(this.curModal, "isModel", true);
          break;
        default:
          break;
      }
      this.inputSetValue = null;
    },
    sureInherit() {
      this.onCancel();
      localStorage.setItem(
        `${this.tableId}-inputInherit`,
        JSON.stringify(this.inheritValue)
      );
    },
    onCancel() {
      this.$set(this.curModal, "isModel", false);
    },
  },
};
</script>

<style>
</style>