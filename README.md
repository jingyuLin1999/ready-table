# Ready Table

## 说明
完备表组件，封装一些常见的逻辑，开箱即用。
具有如下功能：树结构; 自定义表的样式; 双击单元格直接编辑功能; 大数据量导出，见常见问题解决方案; 增、删、改、查、导入、导出、全屏放大、字段显示或隐藏设置、分页的逻辑。

## 预览
```
npm install

npm run serve
```
[表](http://localhost:8080/#/)  
http://localhost:8080/#/

## 用法
若无数据显示，请检查传入正确的增删改查路径，defaultProp响应的数据字段映射关系是否正确   

```
npm i ready-table -S
```

```html
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
      :colors="colors"
      :addConfig="addConfig"
      :deleteConfig="deleteConfig"
      :updateConfig="updateConfig"
      :selectConfig="selectConfig"
      :importConfig="importConfig"
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
    >
    </ready-table>
  </div>
</template>
```

```js
import { ReadyTable } from "ready-table";
export default {
  components: { ReadyTable },
  data() {
    return {
      colors: { // 表的颜色配置
        theme: "#0D194B",
        fontColor: "#37D0FA",
        btnColor: "#F8F4F4",
        btnBgColor: "#232B60",
        activeColor: "#4F9FFE",
        dateRangeBgColor: "#999",
        multiOptionBgColor: "#ddd",
        tableBorderColor: "#4780BA",
        scrollbarThumbColor: "#262F65",
        nthChildEvenColor: "",
      },
      tableHooks: {}, // 将一些常用的函数或参数挂载到钩子，可以打印出来看看
      addConfig: { method: "post", url: "manage/machine/insertMacInfo.do" },
      selectConfig: { method: "get", url: "table/select" },
      updateConfig: { method: "post", url: "manage/machine/updateMacInfo.do" },
      deleteConfig: { method: "post", url: "manage/machine/deleteMacInfo.do" },
      importConfig: { method: "post", url: "manage/machine/uploadMacInfo.do" },
      downloadConfig: { method: "get",url: "manage/detectInfo/downloadToExcel.do"},
      fields: [
        {
          title: "区域编号",
          field: "code",
          isSlot: false,
          sortable: false,
          searchable: true,
          importRequired: true,
        },
        {
          title: "区域名称",
          field: "name",
          isSlot: false,
          sortable: false,
          searchable: true,
          importRequired: true,
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
```

## 文档    
* formRules校验规则请见[richform](https://github.com/jingyuLin1999/richform)  
* 表属性  
| 字段名                  | 含义               | 类型    | 默认值                   | 备注                                                                                     |
| ----------------------- | ------------------ | ------- | ------------------------ | ---------------------------------------------------------------------------------------- |
| tableId                 | 表ID               | String  | ""                       | 用于本地保存数据key的区分                                                                |
| size                    | 尺寸大小           | String  | medium                   | 可选medium / small / mini                                                                |
| fields                  | 栏位字段           | Array   | ""                       |                                                                                          |
| tableData               | 表数据             | Array   | []                       |                                                                                          |
| border                  | 是否显示边界       | Boolean | true                     |                                                                                          |
| highlightHoverRow       |                    | Boolean | true                     |                                                                                          |
| highlightCurrentRow     |                    | Boolean | true                     |                                                                                          |
| showSeq                 | 显示序号           | Boolean | true                     |                                                                                          |
| rowId                   | 显示序号           | String  | id                       | 当showSeq为true时，必须设置                                                              |
| checkRowKeys            | 默认勾选的行id集合 | Array   | []                       |                                                                                          |
| showHeader              | 显示表头           | Boolean | true                     |                                                                                          |
| colors                  | 显示序号           | Object  | {}                       |                                                                                          |
| autoPager               | 是否自动分页       | Boolean | true                     | 当为false时表示后端一次性把所有数据都返回，这种情况会手动分页                            |
| scrollbarWidth          | 滚动条宽度         | String  | true                     |                                                                                          |
| showToolBar             | 显示工具栏         | Boolean | true                     |                                                                                          |
| showToolBtns            | 工具栏按钮控制     | Object  | 具体参数见defaultData    |                                                                                          |
| showPageBar             | 显示分页           | Boolean | true                     |                                                                                          |
| showCheckbox            | 显示checkbox       | Boolean | true                     |                                                                                          |
| isLoading               | 正在加载中         | Boolean |                          | true                                                                                     |
| resizable               | 列宽是否允许拖动   | Boolean | true                     |                                                                                          |
| align                   | 对其方式           | String  |                          | center                                                                                   |
| tableToolbar            | 配置文件           | Object  | {}                       | 表配置文件                                                                               |
| simpleSearch            | 查询过滤条件       | Boolean |                          | 简单查询可以传一些自定义的数据给richform                                                 |
| filterCondition         | 过滤条件           | Object  | {}                       | 初始化的时就要过滤掉                                                                     |
| modalTitle              | 模态框标题         | String  | 编辑&保存                |                                                                                          |
| hooks                   | 钩子               | Object  | {}                       | 挂内部一些数据，供外部使用                                                               |
| formData                | 弹出数据           | Object  | {}                       | 与formvalue合并                                                                          |
| formLayout              | 弹窗布局           | Object  | {}                       | 具体见Richform，不传入自动生成                                                           |
| formRules               | 弹窗布局是几列     | Object  | {}                       | 具体见Richform，                                                                         |
| formColumns             | 模态框标题         | Number  | 2                        |                                                                                          |
| formAction              | 内部动作           | Boolean | true                     | this.$emit("action")                                                                     |
| formTips                | 弹窗提示语句       | String  | ""                       |                                                                                          |
| deleteTips              | 删除提示语句       | String  | 此操作将删除所有勾选的行 |                                                                                          |
| token                   | 服务器交互权限认证 | Object  |                          |                                                                                          |
| editConfig              | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| fieldConfig             | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| addConfig               | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| deleteConfig            | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| updateConfig            | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| selectConfig            | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| searchConfig            | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| importConfig            | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| downloadConfig          | 配置文件           | Object  |                          | {url:'',method: ""}                                                                      |
| deleteByConditionConfig | 配置文件           | Object  |                          | 删除符合过滤条件的                                                                       |
| defaultProp             | 响应请求映射关系   | Object  |                          | { data: 'tableData', total: 'tablePage.total', pageNum: "pageNum",pageSize: "pageSize" } |
| treeConfig              | 配置文件           | Object  |                          | 树配置                                                                                   |
| isTree                  | 是否为树           | Boolean | false                    |                                                                                          |

* 字段属性  
| 字段名         | 含义                   | 默认值 | 备注                                                             |
| -------------- | ---------------------- | ------ | ---------------------------------------------------------------- |
| title          | 显示的字段名           | ""     |                                                                  |
| field          | 数据库字段名称<英文>   | ""     |                                                                  |
| width          | 字段的宽度             | ""     |                                                                  |
| sortable       | 字段是否可排序         | true   |                                                                  |
| isSlot         | 是否开启插槽           | false  |                                                                  |
| slotName       | 动态插槽名             | ""     | 当isSlot为true时有效 <template #WorkStatus="{row }"> </template> |
| isShow         | 字段是否显示           | true   |                                                                  |
| searchable     | 是否可搜索             | false  |                                                                  |
| treeNode       | 是否为树节点           | false  | 树结构必须且只能有一个为true                                     |
| clickEdit      | 启动点击编辑模式       | false  |                                                                  |
| noEdit         | 不允许编辑             | false  | 针对某一列                                                       |
| showFormItem   | 弹窗中是否显示该字段   | true   |                                                                  |
| exportable     | 是否可导出             | true   |                                                                  |
| importRequired | 导入是否必填           | false  |                                                                  |
| aline          | 独占一行               | false  |                                                                  |
| showOverflow   | 是否显示溢出内容       | true   |                                                                  |
| formSort       | 弹窗字段顺序           | 1      |                                                                  |
| fieldSort      | 列表字段顺序           | 1      |                                                                  |
| widget         | 弹窗时是用何种组件渲染 | input  | 具体字段见[Richform](https://github.com/jingyuLin1999/richform)  |
| formLayout     | Richform字段属性       | {}     | 具体字段见Richform                                               |

## 常见问题解决方案  
* 大数据导出，可让后端先成excel文件，再返回文件流。此时需要配置downloadConfig，默认是用selectConfig请求回数据后在前端生成excel。java采用easyexcel库生成文件，返回文件数据流样例：  
```java
  public static void downloadExcel(File file, HttpServletResponse response) {
      try{
          String fileName = file.getName();
          // 返回数据
          response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
          response.setCharacterEncoding("utf-8");
          response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName);
          response.setHeader("X-Accel-Buffering", "no");
          response.setHeader("Content-Length",file.length()+ ""); // 整个文件的大小，前端根据这个计算进度
          // 发送给客户端的数据
          OutputStream outputStream = response.getOutputStream();
          byte[] buff = new byte[1024];
          BufferedInputStream bis = null;
          // 读取filename
          bis = new BufferedInputStream(new FileInputStream(file));
          int i = bis.read(buff);
          while (i != -1) {
              outputStream.write(buff, 0, buff.length);
              outputStream.flush();
              i = bis.read(buff);
          }
          bis.close();
      }catch (Exception e) {
          System.out.println("下载excel出错了"+e.getMessage());
      }
  }
```
