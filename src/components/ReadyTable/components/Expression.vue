<template>
  <div class="expression-wrapper">
    <div class="title-wrapper">
      <span>{{ title }}</span>
      <div class="add-tool" @click="addTemplate">+</div>
    </div>
    <div class="header-fields">
      <div
        class="title"
        v-for="(field, index) in fields"
        :key="index"
        :style="{ width: 100 / fields.length + '%' }"
      >
        {{ field.title }}
      </div>
    </div>
    <div class="expression-body">
      <div class="row" v-for="(fields, index) in data" :key="index">
        <div class="column" v-for="key in Object.keys(fields)" :key="key">
          <el-select
            v-if="dict[key]['widget'] == 'select'"
            size="mini"
            placeholder="请选择"
            v-model="fields[key]"
          >
            <el-option
              v-for="(item, index) in dict[key].options"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            v-else-if="dict[key]['widget'] == 'input'"
            v-model="fields[key]"
            size="mini"
          ></el-input>
        </div>
        <div class="expression-remove" @click="removeItem(index)">-</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, dafault: "" },
    fields: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
  },
  data() {
    return {
      template: {},
      dict: {}, // 字典用于查询
    };
  },
  mounted() {
    this.pickTemplate();
  },
  methods: {
    pickTemplate() {
      this.fields.map((field) => {
        this.template[field.name] = "";
        this.dict[field.name] = field;
      });
      // if (this.data.length == 0)
      this.addTemplate();
    },
    addTemplate() {
      this.data.push(JSON.parse(JSON.stringify(this.template)));
    },
    removeItem(index) {
      if (this.data.length == 1) return;
      this.data.splice(index, 1);
    },
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.expression-wrapper {
  .title-wrapper {
    display: flex;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    border-bottom: 1px solid #ddd;
    > .add-tool {
      width: 26px;
      height: 26px;
      line-height: 21px;
      text-align: center;
      border-radius: 50%;
      background: #409eff;
      cursor: pointer;
      font-size: 25px;
      box-sizing: border-box;
      color: #fff;
    }
    > .add-tool:hover {
      background: #66b1ff;
    }
  }
  .header-fields {
    display: flex;
    justify-content: space-around;
    .title {
      text-align: center;
    }
  }
  .expression-body {
    height: 130px;
    overflow: auto;
    .row {
      height: 32px;
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      .column {
        margin: 0 5px;
      }
      .expression-remove {
        width: 25px;
        height: 25px;
        margin-top: 5px;
        line-height: 21px;
        text-align: center;
        box-sizing: border-box;
        background: #f0c8c8;
        cursor: pointer;
        font-size: 23px;
        color: #fff;
        border: 0;
        border-radius: 50%;
      }
      .expression-remove:hover {
        background: #f56c6c;
      }
    }
  }
}
</style>