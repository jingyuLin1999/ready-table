<template>
  <div class="check-fields">
    <div class="field" v-for="(field, index) in fields" :key="index">
      <i class="field-icon" :class="icon"></i>
      <Checkbox v-model="value[field.field]">{{ field.title }}</Checkbox>
    </div>
  </div>
</template>

<script>
import { Checkbox } from "element-ui";
export default {
  name: "checkFields",
  props: {
    fields: { type: Array, default: () => [] },
    icon: { type: String, default: "el-icon-document" },
    value: { type: Object, default: () => ({}) },
  },
  components: { Checkbox },
  mounted() {
    this.defaultFields();
  },
  methods: {
    defaultFields() {
      if (Object.values(this.value).includes(true)) return;
      this.fields.map((field) => {
        this.$set(this.value, field.field, false);
      });
    },
  },
};
</script>

<style lang="scss">
.check-fields {
  padding: 0 10px;
  overflow: auto;
  .field {
    .field-icon {
      margin-right: 5px;
    }
  }
}
</style>