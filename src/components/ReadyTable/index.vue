<!--
1、接口说明
表增删改查后端返回的格式：
  payload: {
      tablePage: {
          total: total + 1,
          pageNum,
          pageSize
      },
      tableData
  }
获取表的栏位，后端返回格式：
  payload: {
          tableFields: [
                { // 每个栏位属性
                          title: "图片",
                          field: "a",
                          sortable: true,
                          isSlot: false,
                          isShow: true,
                          slotName: "aaa",
                          name: "$input",
                          type: "",
                          span: 12,
                          placeholder: "",
                          options: [],
                }
          ]
  }

2、props参数
  fields: 如同上诉tableFields
  hooks:  将组件内部的一些默认值或函数挂载到该对象上，供组件外部使用，具体值如下：
  {
    fields: [], // 表字段
    checkeds: [], // 勾选的值
    add： function, // 增加函数
    deleteRows: function, // 删除动作
    formData: [], // 弹窗的所有值
    formCurKey: "", // 当前弹窗正在编辑的键值
  }

  @xTable // 该表的实例


3、弹框数据例子，若formData和formItems无传入，则会根据tableFields自动生成
  formData: {
    name: null,
    nickname: null,
    role: null,
    sex: null,
    age: null,
    num: null,
    checkedList: [],
    flag1: null,
    date3: null,
    address: null,
  },
-->

<template>
  <div class="simple-table-wrapper" :id="uuid" :style="injectStyles">
    <!-- 搜索 -->
    <RichForm :id="uuid + '-search-wrapper'" class="query-conditon-wrapper" v-show="showSearchPanel"
      :form="queryFormLayout" :values="searchCondition" :showBtns="false" @action="queryActions"></RichForm>
    <!-- 表单工具 -->
    <div class="toolbar-wrapper" v-if="showToolBar" :id="uuid + 'toolbar'">
      <div class="tool-button-left">
        <slot name="preToolbar"></slot>
        <vxe-button v-if="showToolsBar.add" :icon="toolButsText.add.icon
          ? toolButsText.add.icon
          : 'el-icon-circle-plus-outline'
          " status="primary" :disabled="isTree ? Object.keys(editRow).length == 0 : false" @click="addModal">{{
    toolButsText.add.text ? toolButsText.add.text : $t("toolBar.add")
  }}</vxe-button>
        <vxe-button v-if="showToolsBar.delete" :icon="toolButsText.delete.icon
          ? toolButsText.delete.icon
          : 'el-icon-remove-outline'
          " status="danger" :disabled="hooks.checkeds.length == 0" @click="deleteRows">{{ toolButsText.delete.text ?
    toolButsText.delete.text : $t("toolBar.delete") }}
        </vxe-button>
        <vxe-button v-if="showToolsBar.deleteByCondition" icon="el-icon-delete" status="danger"
          :disabled="batchDeleteDisabled" @click="deleteByCondition">{{ $t("toolBar.deleteByCondition") }}</vxe-button>
        <vxe-button v-if="showToolsBar.update" :icon="toolButsText.update.icon
          ? toolButsText.update.icon
          : 'vxe-icon--edit-outline'
          " status="success" @click="editModal" :disabled="hooks.checkeds.length != 1">{{ toolButsText.update.text ?
    toolButsText.update.text : $t("toolBar.edit") }}
        </vxe-button>
        <vxe-button v-if="showToolsBar.copy" icon="el-icon-document-copy" @click="onCopy"
          style="background: #31b393; color: #fff" :disabled="Object.keys(editRow).length == 0">{{ $t("toolBar.copy")
          }}</vxe-button>
        <vxe-button icon="el-icon-printer" v-if="showToolsBar.save" status="perfect" @click="onSave">{{ $t("toolBar.save")
        }}</vxe-button>
        <vxe-button v-if="isTree" icon="el-icon-s-home" status="info" @click="onTreeRoot">{{ $t("toolBar.rootNode")
        }}</vxe-button>

        <InputSettings :showTool="showToolsBar.inputSet" :hooks="hooks" />
        <Search :showTool="showToolsBar.search" :hooks="hooks" :fields="vXTableFields" :simpleSearch="simpleSearch"
          :selectConfig="selectConfig" />
        <slot name="afterToolbar"></slot>
        <Print :showTool="showToolsBar.print" :hooks="hooks" />
        <Export :showTool="showToolsBar.export" :hooks="hooks" :params="{
          queryConfig: selectConfig,
          queryCondition: searchCondition,
          filterCondition: filterCondition,
        }" :fields="vXTableFields" :toolBtnText="toolButsText" :defaultProp="vxDefaultProp"
          :downloadConfig="downloadConfig" :exportable="showToolsBar.exportable" />
      </div>
      <div class="tool-button-right">
        <Import v-if="showToolsBar.import" :hooks="hooks" :formData="formData" :isDark="isDark" :params="{
          importConfig: importConfig,
        }" />
        <Tooltip :content="$t('toolBar.refreshTooltip')" placement="bottom" :effect="isDark ? 'dark' : 'light'">
          <vxe-button circle icon="el-icon-refresh" v-if="showToolsBar.refresh" :loading="isRefresh"
            @click="refresh"></vxe-button>
        </Tooltip>
        <Tooltip :content="$t('toolBar.screenfullTooltip')" placement="bottom" :effect="isDark ? 'dark' : 'light'">
          <vxe-button v-if="showToolsBar.screenfull" circle :icon="isScreenfull ? 'el-icon-copy-document' : 'el-icon-full-screen'
            " @click="onScreenfull"></vxe-button>
        </Tooltip>
        <ColumnShow v-if="showToolsBar.columnSettings" :fields="vXTableFields" :hooks="hooks" />
        <vxe-input v-if="showToolsBar.globalSearch" v-model="filterValue" type="search"
          :placeholder="$t(`toolBar.fullTableSearch`)" @keyup="onSearch(filterValue)"></vxe-input>
      </div>
    </div>
    <!-- 表单 -->
    <vxe-table class="product-list-table" ref="xTable" row-key keep-source :size="size" :align="align" :row-id="rowId"
      :border="border" :loading="loading" :export-config="{}" :data="vXTableData" :resizable="resizable"
      :show-header="showHeader" :height="calcuTableHeight" :toolbar-config="tableToolbar"
      :highlight-hover-row="highlightHoverRow" :highlight-current-row="highlightCurrentRow" :tree-config="vXtreeConfig"
      :tooltip-config="Object.assign({}, defaultTooltipConfig)" :import-config="{
        remote: true,
        importMethod: importFile,
      }" :edit-config="Object.assign(defaultEditConfig, editConfig, {
  activeMethod: activeCellMethod,
})
  " :edit-rules="formRules" :checkbox-config="{ checkRowKeys: vxCheckRowKeys, checkStrictly: isTree }"
      @cell-click="rowClick" @cell-mouseenter="cellMounseenter" @checkbox-all="selectAllCheckbox"
      @checkbox-change="selectCheckbox" @edit-closed="editClosed">
      <!-- 复选框-->
      <vxe-table-column v-if="showCheckbox" type="checkbox" width="60"></vxe-table-column>
      <!-- 序号 -->
      <vxe-table-column v-if="showSeq" title="#" width="60" type="seq" :field="rowId"></vxe-table-column>
      <template v-for="item in vXTableFields">
        <!-- 普通模式，通过弹框编辑 -->
        <vxe-table-column v-if="!item.clickEdit" :visible="item.isShow" :key="item.field" :field="item.field"
          :title="item.title" :width="item.width" :sortable="item.sortable" :tree-node="item.treeNode"
          :formatter="onFormatter" :show-overflow="item.showOverflow" :align="item.treeNode ? 'left' : ''">
          <!-- 插槽 -->
          <template v-if="item.isSlot" v-slot="{ row }">
            <slot :name="item.slotName" :row="row"></slot>
          </template>
          <!-- 树节点有效 -->
          <template v-else-if="item.treeNode" v-slot="{ row }">
            <span>
              <template v-if="row.children && row.children.length">
                <i class="tree-node-icon fa" :class="
                    $refs.xTable.isTreeExpandByRow(row)
                      ? 'el-icon-folder-opened'
                      : 'el-icon-folder'
                  "></i>
              </template>
              <template v-else>
                <i class="el-icon-document"></i>
              </template>
              <span>{{ row[item.field] }}</span>
            </span>
          </template>
        </vxe-table-column>
        <!-- 点击直接编辑 -->
        <vxe-table-column v-else-if="item.clickEdit" :visible="item.isShow" :key="item.field" :field="item.field"
          :title="item.title" :width="item.width" :sortable="item.sortable" :tree-node="item.treeNode"
          :align="item.treeNode ? 'left' : ''" :edit-render="onEditRender(item)">
          <!-- 插槽 -->
          <template v-if="item.isSlot" v-slot="{ row }">
            <slot :name="item.slotName" :row="row"></slot>
          </template>
          <!-- 树节点有效 -->
          <template v-else-if="item.treeNode" v-slot="{ row }">
            <span>
              <template v-if="row.children && row.children.length">
                <i class="tree-node-icon fa" :class="
                    $refs.xTable.isTreeExpandByRow(row)
                      ? 'el-icon-folder-opened'
                      : 'el-icon-folder'
                  "></i>
              </template>
              <template v-else>
                <i class="el-icon-document"></i>
              </template>
              <span>{{ row[item.field] }}</span>
            </span>
          </template>
        </vxe-table-column>
      </template>
    </vxe-table>
    <!-- 表单分页 -->
    <vxe-pager :id="uuid + '-pager'" v-if="showPageBar" :loading="loading" :current-page="tablePage.pageNum"
      :page-size="tablePage.pageSize" :total="tablePage.total" :layouts="[
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'FullJump',
        'Sizes',
        'Total',
      ]" @page-change="onPageChange">
    </vxe-pager>
    <!-- 表单增、改弹框 -->
    <vxe-modal v-model="isModal" :title="dialogTitle" :className="colors.theme ? 'ready-table-modal' : ''"
      :width="modalWidth" :min-width="300" :min-height="100" resize showFooter destroy-on-close :loading="submitLoading">
      <el-alert v-if="formTips.length > 0" type="warning" show-icon :closable="false">
        {{ formTips }}
      </el-alert>
      <RichForm class="form-dialog" :form="vxFormLayout" :values="formValues" :schema="vxFormRules" :hooks="formHooks"
        :authorization="token" :showBtns="false"></RichForm>
      <template #footer>
        <Button size="small" type="primary" @click="formSubmit">提交</Button>
      </template>
    </vxe-modal>
    <!-- 外部弹窗必须放在这里，不然全屏的时候，外部弹窗会失效 -->
    <slot name="modal"></slot>
  </div>
</template>

<script>
import "vxe-table/lib/style.css";
import short from "short-uuid";
import { Tooltip, Button } from "element-ui";
import screenfull from "screenfull";
import { RichForm } from "richform";
import formMixin from "./mixins/formMixin";
import editMixin from "./mixins/editMixin";
import { mergeDeepRight, clone } from "ramda";
import Vue from "vue";
import "xe-utils";
import VXETable from "vxe-table";
import VXETablePluginExportXLSX from "vxe-table-plugin-export-xlsx";
VXETable.use(VXETablePluginExportXLSX);
Vue.use(VXETable);
import elementResizeDetectorMaker from "element-resize-detector";
import { _debounce, observerDomResize, getRgbValueFromHex } from "./utils";

import {
  InputSettings,
  Export,
  Print,
  Search,
  Import,
  ColumnShow,
} from "./components";
import {
  defaultProp,
  defaultField,
  defaultTreeConfig,
  defaultEditConfig,
  defaultTooltipConfig,
  defaultToken,
  defaultHooks,
  defaultToolBar,
  defaultTablePage,
  defaultToolBtnText,
} from "./utils/defaultData";
import { tableData, tableFields, searchTable } from "./utils/apis";

export default {
  name: "simple-table",
  mixins: [formMixin, editMixin],
  components: {
    InputSettings,
    Export,
    Print,
    Search,
    RichForm,
    Import,
    ColumnShow,
    Tooltip,
    Button,
  },
  props: {
    tableId: { type: String, default: "" }, // 该表ID，用于本地保存数据key的区分
    size: { type: String, default: "medium" }, // 可以设置大小尺寸：medium / small / mini
    fields: { type: Array, default: () => [] }, // 表单栏位字段
    tableData: { type: Array, default: () => [] }, // 表单数据,若由外部传入，分页逻辑由外部处理，建议传入selectConfig
    tableHeight: { type: Number, default: 0 }, // 表的高度
    border: { type: Boolean, default: true }, // 表单是否显示边界
    highlightHoverRow: { type: Boolean, default: true },
    highlightCurrentRow: { type: Boolean, default: true },
    showSeq: { type: Boolean, default: true }, // 显示序号
    rowId: { type: String, default: "id" }, // 行，当showSeq为true时，必须设置正确
    checkRowKeys: { type: Array, default: () => [] }, // 默认勾选的行id集合
    showHeader: { type: Boolean, default: true }, // 是否显示表头
    colors: { type: Object, default: () => ({}) }, // 表单颜色，具体字段请见defaultLayout
    autoPager: { type: Boolean, default: true }, // 是否自动分页，当为false时表示后端一次性把所有数据都返回，这种情况需要手动分页
    scrollbarWidth: { type: String, default: "12px" }, // 滚动条宽度
    // -------工具栏-------
    showToolBar: { type: Boolean, default: true }, // 显示工具栏
    showToolBtns: { type: Object, default: () => ({}) }, // 工具栏按钮控制,具体参数见defaultData
    toolBtnText: { teype: Object, default: () => ({}) }, // text
    showPageBar: { type: Boolean, default: true }, // 显示分页
    showCheckbox: { type: Boolean, default: true }, // 是否显示checkbox
    isLoading: { type: Boolean, default: true }, // 正在加载中
    resizable: { type: Boolean, default: true }, // 列宽是否允许拖动
    align: { type: String, default: "center" }, // 对其方式
    tableToolbar: { type: Object, default: () => ({}) }, // 配置文件
    simpleSearch: { type: Object, default: () => ({}) }, // 简单查询可以传一些自定义的数据给richform
    filterCondition: { type: Object, default: () => ({}) }, // 过滤条件，比如初始化的时就要过滤掉
    // --------弹框---------
    modalTitle: { type: String, default: "编辑&保存" }, // 模态框标题
    hooks: { type: Object, default: () => ({}) }, // 用于挂在内部的一些数据，供外部使用
    formData: { type: Object, default: () => ({}) }, // 弹出数据，与formvalue合并
    formLayout: { type: Object, default: () => ({}) },
    formRules: { type: Object, default: () => ({}) }, // 弹窗校验规则
    formColumns: { type: Number, default: 2 }, // 弹窗布局是几列
    formLabelWidth: { type: String, default: "95px" }, // 弹窗label宽度
    formAction: { type: Boolean, default: true }, // 弹窗提交时内部动作
    formTips: { type: String, default: "" }, // 弹窗提示语句
    deleteTips: { type: String, default: "此操作将删除所有勾选的行" }, // 删除提示语句
    reqIgnoreKeys: { type: Array, default: () => [] }, // 增,改，过滤请求参数
    // -----增删改查路径-----
    token: { type: Object, default: () => ({}) }, // 令牌,服务器交互权限认证
    editConfig: { type: Object, default: () => ({}) },
    fieldConfig: { type: Object, default: () => ({}) },
    addConfig: { type: Object, default: () => ({}) }, // {url:'',method: ""}
    deleteConfig: { type: Object, default: () => ({}) },
    updateConfig: { type: Object, default: () => ({}) },
    selectConfig: { type: Object, default: () => ({}) },
    searchConfig: { type: Object, default: () => ({}) },
    importConfig: { type: Object, default: () => ({}) },
    downloadConfig: { type: Object, default: () => ({}) },
    deleteByConditionConfig: { type: Object, default: () => ({}) }, // 删除符合过滤条件的
    defaultProp: { type: Object, default: () => ({}) }, // 映射关系
    // -----树配置-----
    treeConfig: { type: Object, default: () => ({}) },
    isTree: { type: Boolean, default: false },
  },
  provide() {
    return {
      tableId: this.tableId,
      colors: this.vxColors,
      injectStyles: this.injectStyles,
    };
  },
  data() {
    return {
      uuid: "vxe-" + short.generate(),
      filterValue: "",
      loading: false,
      isModal: false,
      submitLoading: false,
      erd: elementResizeDetectorMaker({
        strategy: "scroll",
      }),
      modalLabel: "", // 弹框标签
      modalWidth: "800", // 模态框宽度
      editRow: {}, // 正在编辑的行数据
      autoTableHeight: 600,
      defaultTreeConfig, // 默认树配置
      defaultTooltipConfig,
      defaultEditConfig, // 默认编辑配置
      noEditFields: {}, // 不允许编辑的栏位
      defaultHooks, // 默认挂载容器
      tablePage: JSON.parse(JSON.stringify(defaultTablePage)),
      checkedPageList: {}, // 记录每页的勾选值，用于记录全部勾选或取消的临时变量
      remote: {
        // 远端数据,必须写成obj格式，以备更新
        tableData: [],
        tableFields: [],
      },
      isScreenfull: false, // 是否全屏
      isRefresh: false, // 是否刷新
      tableHeightDebounce: null,
    };
  },
  created() {
    Object.assign(this.hooks, clone(this.defaultHooks), this.hooks);
  },
  async mounted() {
    this.onAuthorize();
    this.bodyScrollbarClass();
    await this.load();
    this.registerScreenfullEvent();
  },
  watch: {
    selectConfig() {
      this.load();
    },
  },
  computed: {
    // 工具栏权限控制
    showToolsBar() {
      return mergeDeepRight(clone(defaultToolBar), this.showToolBtns);
    },
    vXtreeConfig() {
      return Object.assign({}, defaultTreeConfig, this.treeConfig);
    },
    vXTableFields() {
      let fields =
        this.fields.length > 0 ? this.fields : this.remote.tableFields;
      fields = fields.map((fieldItem) => {
        let assignField = mergeDeepRight(defaultField, fieldItem);
        if (assignField.noEdit)
          this.noEditFields[assignField.title] = assignField.title;
        return assignField;
      });
      fields = this.toSort(fields, "formSort");
      this.hooks.fields = fields;
      return fields;
    },
    vXTableData() {
      let tableData =
        this.tableData.length > 0 ? this.tableData : this.remote.tableData;
      this.hooks.curPageData = tableData;
      return tableData;
    },
    dialogTitle() {
      return this.modalLabel || this.modalTitle;
    },
    calcuTableHeight() {
      return this.tableHeight ? this.tableHeight : this.autoTableHeight;
    },
    vxDefaultProp() {
      // 后端返回来的字段需要做映射
      return Object.assign({ ...defaultProp }, this.defaultProp);
    },
    isDark() {
      // 计算主题是否为暗颜色
      let theme = this.vxColors.theme;
      if (!theme) return false;
      let rgbTheme = getRgbValueFromHex(theme);
      let $grayLevel =
        rgbTheme[0] * 0.299 + rgbTheme[1] * 0.587 + rgbTheme[2] * 0.114;
      return $grayLevel < 192;
    },
    toolButsText() {
      return Object.assign(clone(defaultToolBtnText), this.toolBtnText);
    },
  },
  methods: {
    async load() {
      try {
        this.initHooks();
        this.listenSearchDomHeight();
        this.calcuHeight();
        this.loadInitData();
        this.listenTableParent();
      } catch (e) {
        console.warn(`表字段获取失败:${e}`);
      }
    },
    toSort(data = [], sortKey) {
      data.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return -1;
        else if (a[sortKey] > b[sortKey]) return 1;
        else return 0;
      });
      return data;
    },
    async loadInitData() {
      await this.loadTableFields();
      await this.loadTableData();
    },
    initHooks() {
      // 挂载一些数据或函数
      this.hooks.remote = this.remote;
      this.hooks.refresh = this.refresh;
      this.hooks.onSearch = this.onSearch;
      this.hooks.addModal = this.addModal;
      this.hooks.xTable = this.$refs.xTable;
      this.hooks.tablePage = this.tablePage;
      this.hooks.editValid = this.editValid; // 直接编辑模式验证
      this.hooks.addSubmit = this.addSubmit;
      this.hooks.editModal = this.editModal;
      this.hooks.fields = this.vXTableFields;
      this.hooks.editSubmit = this.editSubmit;
      this.hooks.deleteRows = this.deleteRows;
      this.hooks.formValues = this.formValues;
      this.hooks.calcuHeight = this.calcuHeight;
      this.hooks.loadTableData = this.loadTableData;
      this.hooks.searchCondition = this.searchCondition;
      this.$emit("xTable", this.$refs.xTable);
    },
    // 刷新
    async refresh() {
      this.isRefresh = true;
      if (Object.keys(this.selectConfig).length == 0) return;
      this.hooks.tablePage = this.tablePage;
      await this.loadTableData();
      this.isRefresh = false;
    },
    // 查询
    queryActions(event) {
      if (event.name == "clearCondition") {
        for (let key in this.searchCondition)
          this.$set(this.searchCondition, key, null);
      }
      this.hooks.tablePage.pageNum = 1; // 必须重置第一页。可能点击第5页再去搜索，结果却只有一笔数据，而第5页没数据
      this.loadTableData();
    },
    // 加载数据
    async loadTableData() {
      if (this.tableData.length > 0) return;
      try {
        if (Object.keys(this.selectConfig).length == 0) {
          console.warn("请传入正确的selectConfig获取远程数据或传入tableData");
          return;
        }
        this.loading = true;
        let filterCondition = Object.assign(
          this.filterCondition,
          this.searchCondition
        );
        let { pageNum, pageSize } = this.hooks.tablePage;
        let response = await tableData({
          data: {
            ...filterCondition,
            [this.vxDefaultProp.pageNum]: pageNum,
            [this.vxDefaultProp.pageSize]: pageSize,
            queryCondition: JSON.stringify(filterCondition),
          },
          config: this.selectConfig,
        });
        this.loading = false;
        this.resetTable(response);
      } catch (e) {
        console.warn(`获取表数据失败，请检查url和method是否正确！`, e);
      } finally {
        this.loading = false;
      }
    },
    // 加载表的栏位
    async loadTableFields() {
      if (this.fields.length > 0) return;
      try {
        if (Object.keys(this.fieldConfig).length == 0) {
          console.warn("请传入正确的fieldConfig！");
          return;
        }
        const { payload } = await tableFields({ config: this.fieldConfig });
        this.remote.tableFields = payload.tableFields;
        this.hooks.fields = this.remote.tableFields;
      } catch (e) {
        console.warn(
          `获取表数据失败，请检查url和method是否正确！,错误信息：${e}`
        );
        throw e;
      }
    },
    onAuthorize() {
      const { key, value, baseUrl } = Object.assign(defaultToken, this.token);
      sessionStorage.setItem("auth-key", key);
      sessionStorage.setItem("auth-value", value);
      sessionStorage.setItem("base-url", baseUrl);
    },
    async onSearch(filterValue) {
      try {
        if (Object.keys(this.searchConfig).length == 0) {
          console.error("请传入正确的searchConfig！");
          return;
        }
        let { pageNum, pageSize } = this.hooks.tablePage;
        let { result } = await searchTable({
          params: {
            filterText: filterValue,
            tablePage: this.hooks.tablePage,
          },
          config: this.searchConfig,
        });
        // 分页容错处理
        Object.assign(this.hooks.tablePage, {
          pageNum,
          pageSize,
          total: result.totalCount,
        });
        this.hooks.remote.tableData = result.items;
      } catch (e) { }
    },
    // 修改滚动条样式
    bodyScrollbarClass() {
      if (!this.vxColors.fontColor) return;
      this.$nextTick(() => {
        let tableBodyDom = document.querySelector(
          `#${this.uuid} .vxe-table--body-wrapper`
        );
        if (tableBodyDom) tableBodyDom.classList.add("vx-body-scrollbar");
      });
    },
    // 监听搜索区域的dom
    listenSearchDomHeight() {
      this.$nextTick(() => {
        let startHeight = null;
        const searchDom = document.getElementById(
          this.uuid + "-search-wrapper"
        );
        const debounce = _debounce(() => {
          startHeight = null;
        }, 50);
        this.erd.listenTo(searchDom, (element) => {
          if (startHeight == null) startHeight = element.offsetHeight;
          else {
            const endHeight = element.offsetHeight;
            let distance = startHeight - endHeight;
            this.autoTableHeight += distance;
            startHeight = endHeight;
          }
          debounce(element);
        });
      });
    },
    listenTableParent() {
      this.$nextTick(() => {
        const tableEl = document.getElementById(this.uuid);
        if (!tableEl) return;
        const tablbeParentDom = tableEl.parentElement;
        if (!tablbeParentDom) return;
        this.tableHeightDebounce = _debounce(() => {
          this.calcuHeight();
        }, 50);
        observerDomResize(tablbeParentDom, (el) => {
          this.tableHeightDebounce();
        });
      });
    },
    calcuHeight() {
      this.$nextTick(() => {
        // 计算表高度
        let tableContainer = document.getElementById(this.uuid);
        if (!tableContainer) return;
        let _tableHeight = tableContainer.offsetHeight;
        if (!_tableHeight) return;
        if (this.showSearchPanel) {
          const searchDom = document.getElementById(
            this.uuid + "-search-wrapper"
          );
          _tableHeight -= searchDom.offsetHeight;
        }
        if (this.showToolBar) {
          const toolbarDom = document.getElementById(this.uuid + "toolbar");
          _tableHeight -= toolbarDom.offsetHeight;
        }
        if (this.showPageBar) {
          let pagerDom = document.getElementById(this.uuid + "-pager");
          pagerDom.style.height =
            document.body.clientWidth < 639 ? "68px" : "44px";
          _tableHeight -= pagerDom.offsetHeight;
        }
        this.autoTableHeight = _tableHeight;
        // 计算弹窗宽度
        let clientWidth = document.body.clientWidth;
        this.modalWidth =
          clientWidth < 900 ? (clientWidth < 430 ? "98%" : "500") : "800";
      });
    },
    onPageChange(pageInfo) {
      const { currentPage, pageSize } = pageInfo;
      this.tablePage.pageSize = pageSize;
      this.tablePage.pageNum = currentPage;
      if (this.autoPager) this.loadTableData();
      else this.manualPager();
    },
    selectCheckbox({ records, checked, row }) {
      // 点击复选框则选中该行
      this.$refs.xTable.setCurrentRow(row);
      // 有默认勾选至，则首次要复制给this.hooks.checkeds
      if (
        this.calcuCheckRowKeys.length > 0 &&
        this.hooks.checkeds.length == 0
      ) {
        this.calcuCheckRowKeys.map((id) => {
          // 这样做不合理，因为checkRowKeys的id可能在第二页，而当前在第一页，未获取到第二页数据
          if (id != undefined || id != null) {
            this.hooks.checkeds.push({ [this.rowId]: id });
          }
        });
      }
      // 记录每页勾选的值，全取消的时候是用该数组循环
      if (!Array.isArray(this.checkedPageList[this.tablePage.pageNum]))
        this.checkedPageList[this.tablePage.pageNum] = [];
      this.checkedPageList[this.tablePage.pageNum] = records;
      // 查找勾选的下标
      const rowId = row[this.rowId];
      const checkIdx = this.hooks.checkeds.findIndex(
        (item) => item[this.rowId] == rowId
      );
      if (checked) {
        if (checkIdx == -1) this.hooks.checkeds.push(row);
        // 默认有勾选值，若取消则需要取消checkRowKeys的值
        if (!this.calcuCheckRowKeys.includes(rowId))
          this.calcuCheckRowKeys.push(rowId);
      } else {
        if (checkIdx > -1) this.hooks.checkeds.splice(checkIdx, 1);
        if (this.calcuCheckRowKeys.includes(rowId)) {
          const checkKeyIdx = this.calcuCheckRowKeys.findIndex(
            (key) => key == rowId
          );
          this.calcuCheckRowKeys.splice(checkKeyIdx, 1);
        }
        // 情景复选框选了两笔数据，取消第二笔数据，clickRow则要赋值第一笔数据
        if (this.hooks.checkeds.length == 1) {
          this.hooks.clickRow = this.hooks.checkeds[0];
          this.editRow = this.hooks.clickRow;
        }
      }
    },
    selectAllCheckbox({ records, checked }) {
      // 当全选则要清空编辑的值
      this.editRow = {};
      this.$refs.xTable.clearCurrentRow();
      if (checked) {
        this.checkedPageList[this.tablePage.pageNum] = records; // 记录全部勾选的值
        records.map((row) => {
          let findRow = this.hooks.checkeds.find(
            (item) => item[this.rowId] == row[this.rowId]
          );
          if (!findRow) this.hooks.checkeds.push(row);

          let checkKey = this.calcuCheckRowKeys.find(
            (key) => key == row[this.rowId]
          );
          if (!checkKey) this.calcuCheckRowKeys.push(row[this.rowId]);
        });
      } else {
        // 删除当页
        if (!Array.isArray(this.checkedPageList[this.tablePage.pageNum]))
          this.checkedPageList[this.tablePage.pageNum] = []; // 容错处理
        this.checkedPageList[this.tablePage.pageNum].map((row) => {
          let findIdx = this.hooks.checkeds.findIndex(
            (item) => item[this.rowId] == row[this.rowId]
          );
          if (findIdx > -1) this.hooks.checkeds.splice(findIdx, 1);
          let checkKeyIdx = this.calcuCheckRowKeys.findIndex(
            (key) => key == row[this.rowId]
          );
          if (checkKeyIdx > -1) this.calcuCheckRowKeys.splice(checkKeyIdx, 1);
        });
        this.checkedPageList[this.tablePage.pageNum] = [];
      }
    },
    // 当编辑按钮是放在每行，需触发此方法
    cellMounseenter({ row }) {
      if (this.showToolsBar.update) return;
    },
    async rowClick(event) {
      const { column, row } = event;
      this.hooks.clickRow = {};
      // 点击的行则手动赋值复选框
      const selectRecords = await this.$refs.xTable.getCheckboxRecords();
      const hasChecked = selectRecords.find(
        (item) => item[this.rowId] == row[this.rowId]
      );
      if (column.type != "checkbox") {
        await this.$refs.xTable.clearCheckboxRow();
        this.editRow = {};
        this.hooks.checkeds = [];
        this.calcuCheckRowKeys = [];
        await this.$refs.xTable.setCheckboxRow(row, !hasChecked);
        if (!hasChecked) {
          // 没勾选就勾选
          this.editRow = row;
          this.hooks.clickRow = row;
          this.hooks.checkeds.push(row);
          this.calcuCheckRowKeys.push(row[this.rowId]);
        }
      } else {
        let hasIndex = this.hooks.checkeds.findIndex(
          (item) => item[this.rowId] == row[this.rowId]
        );
        if (!hasChecked) {
          // this.editRow = {};
          if (hasIndex > -1) this.hooks.checkeds.splice(hasIndex, 1);
        } else {
          this.editRow = row;
          this.hooks.clickRow = row;
          if (hasIndex == -1) this.hooks.checkeds.push(row);
        }
      }
      this.$emit("clickRow", event);
    },
    // 本来想挂在hooks上，但vxe-table貌似不支持
    importFile({ file, options }) {
      return new Promise(async (resolve, reject) => {
        await this.hooks.importFile({ file, options });
        resolve();
      });
    },
    // 全屏
    onScreenfull() {
      const defaultScreefullElement = document.getElementById(this.uuid);
      let screefullElement = defaultScreefullElement;
      if (!screefullElement) return;
      screenfull.toggle(screefullElement);
    },
    // 全屏或推出全屏改变图标
    registerScreenfullEvent() {
      screenfull.on("change", () => {
        this.isScreenfull = !this.isScreenfull;
      });
    },
    $_resizeHandler() {
      this.calcuHeight();
    },
  },
  beforeMount() {
    window.addEventListener("resize", this.$_resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.$_resizeHandler);
    window.removeEventListener("resize", this.tableHeightDebounce);
  },
};
</script>

<style lang="scss">
.ready-table-modal {
  .vxe-modal--content {

    /* 修改滚动条宽度和颜色 */
    &::-webkit-scrollbar {
      width: 11px;
      background-color: var(--theme);
    }

    /* 修改滚动条轨道颜色 */
    &::-webkit-scrollbar-track {
      background-color: var(--btnBgColor);
    }

    /* 修改滚动条滑块颜色 */
    &::-webkit-scrollbar-thumb {
      background-color: var(--scrollbarThumbColor);
    }

    /* 修改滚动条滑块在hover状态下的颜色 */
    &::-webkit-scrollbar-thumb:hover {
      background-color: var(--activeColor);
    }
  }
}

.simple-table-wrapper {
  height: 100%;
  min-height: 100px;
  position: relative;

  .el-alert__icon {
    font-size: 18px;
  }

  .toolbar-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 5px 0;
    background: var(--theme);

    >.tool-button-left {
      display: flex;
      align-items: center;
      padding: 0 3px;
      flex-wrap: wrap;

      .vxe-button,
      .vxe-button--dropdown {
        margin-left: 0;
        margin-right: 8px;
      }

      .vxe-button--dropdown {
        margin-right: 0px;
      }

      ::-webkit-input-placeholder {
        color: #555;
        font-size: 12px;
      }

      >button {
        display: flex;
        align-items: center;
      }
    }

    >.tool-button-right {
      display: flex;
      margin-right: 3px;

      >* {
        margin: 3px;
      }
    }
  }

  .form-dialog {
    min-height: 50px;
    max-height: 400px;
  }

  // ==============修改样式=================
  .vxe-modal--header {
    background: var(--btnBgColor);
  }

  /* 修改vxe表格样式 */
  .vxe-table {
    .vxe-table--header-wrapper {
      position: relative;
      background: var(--theme);
    }

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      left: 0;
      top: 0px;
      background: var(--tableBorderColor);
      z-index: 99;
    }

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      left: 0;
      bottom: 0px;
      background: var(--tableBorderColor);
      z-index: 99;
    }

    .vxe-table--main-wrapper::after {
      content: "";
      position: absolute;
      width: 1px;
      height: 100%;
      left: 0;
      bottom: 0px;
      background: var(--tableBorderColor);
      z-index: 99;
    }

    .vxe-table--main-wrapper::before {
      content: "";
      position: absolute;
      width: 1px;
      height: 100%;
      right: 0;
      bottom: 0px;
      background: var(--tableBorderColor);
      z-index: 99;
    }

    .vxe-table--header-wrapper {
      .vxe-table--header {
        background: var(--theme);

        &::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 100%;
          left: 0;
          top: 0px;
          background: var(--tableBorderColor);
          z-index: 99;
        }

        .vxe-header--row {
          >.vxe-header--column {
            position: relative;

            &::after {
              content: "";
              position: absolute;
              width: 100%;
              left: 0;
              bottom: 0px;
              height: 1px;
              background: var(--tableBorderColor);
              z-index: 99;
            }

            &::before {
              content: "";
              position: absolute;
              width: 1px;
              height: 100%;
              right: 0;
              bottom: 0px;
              background: var(--tableBorderColor);
              z-index: 99;
            }
          }

          >.col--gutter {
            position: relative;

            &::after {
              content: "";
              position: absolute;
              width: 100%;
              height: 1px;
              right: 0;
              bottom: 0;
              background: var(--tableBorderColor);
              z-index: 99;
            }
          }
        }
      }
    }

    .vxe-table--body-wrapper {
      color: var(--fontColor);

      .vxe-body--row::after {
        content: "";
        position: absolute;
        width: 1px;
        height: 100%;
        left: 0;
        bottom: 0px;
        background: var(--tableBorderColor);
        z-index: 99;
      }

      .vxe-body--row>.vxe-body--column {
        position: relative;
      }

      .vxe-body--row>.vxe-body--column::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 1px;
        left: 0;
        bottom: 0px;
        background: var(--tableBorderColor);
        z-index: 99;
      }

      .vxe-body--row>.vxe-body--column::before {
        content: "";
        position: absolute;
        width: 1px;
        height: 100%;
        right: 0;
        bottom: 0px;
        background: var(--tableBorderColor);
        z-index: 99;
      }

      .vxe-body--row:nth-child(odd) {
        background: var(--theme);
      }

      .vxe-body--row:nth-child(even) {
        background: var(--nthChildEvenColor);
      }
    }
  }

  /* 修改table滚动条样式 */
  .vx-body-scrollbar {
    scrollbar-width: auto;

    &::-webkit-scrollbar {
      width: var(--scrollbarWidth);
    }

    &::-webkit-scrollbar-track {
      background: var(--theme);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--scrollbarThumbColor);
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--tableBorderColor);
    }

    &::-webkit-scrollbar-corner {
      background: #179a16;
    }
  }
}
</style>