<template>
  <div class="column-show">
    <Popover placement="bottom" width="150" v-model="visible">
      <p class="field" v-for="(field, index) in fields" :key="index">
        <Checkbox
          :checked="field.isShow"
          v-model="value[field.field]"
          @change="onChange(field)"
          >{{ field.title }}
        </Checkbox>
      </p>
      <vxe-button slot="reference" icon="el-icon-s-grid" circle></vxe-button>
    </Popover>
  </div>
</template>

<script>
import { Popover, Checkbox } from "element-ui";
export default {
  props: {
    fields: { type: Array, default: () => [] },
    hooks: { type: Object, default: () => ({}) },
  },
  components: { Popover, Checkbox },
  data() {
    return {
      visible: false,
      value: {},
    };
  },
  methods: {
    onChange(field) {
      field.isShow = !field.isShow;
      const { showColumn, hideColumn } = this.hooks.xTable;
      if (field.isShow) showColumn(field.field);
      else hideColumn(field.field);
    },
  },
};
</script>

<style lang="scss">
.column-show {
  .check-fields {
    padding: 0 10px;
    overflow: auto;
    .field {
      .field-icon {
        margin-right: 5px;
      }
    }
  }
}
</style>