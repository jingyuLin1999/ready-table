# Ready Table

## 说明
* 现成的表组件，封装一些常见的逻辑，开箱即用
  * 表的树结构  
  * 可自定义表的样式  
  * 双击单元格直接编辑功能
  * 大数据量导出，见常见问题解决方案  
  * 封装增、删、改、查、导入、导出、全屏放大、字段显示或隐藏设置、分页的逻辑

## 预览
```
npm install

npm run serve
```
[表](http://localhost:8080/#/)  
http://localhost:8080/#/

## 用法
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
注意：1、传入正确的增删改查路径 2、配置defaultProp响应的数据字段映射关系  

## 文档    
* formRules校验规则请见[richform](https://github.com/jingyuLin1999/richform)  
* 表字段属性  
```js
{
    title: "", // 显示的字段
    field: "", // 数据库字段名称<英文>
    width: "", // 字段的宽度，作用于表头
    sortable: true, // 字段是否可排序，作用于表头
    isSlot: false, // 是否开启插槽
    slotName: "", // 动态插槽名，当isSlot为true时有效，主要用于前端渲染重新自定义
    isShow: true, // 该字段是否显示
    searchable: false, // 该字段是否可搜索
    treeNode: false, // 树结构必须且只能有一个为true
    clickEdit: false, // 是否启动点击编辑模式
    noEdit: false, // 针对某一列
    showFormItem: true, // 在弹窗中是否显示该字段
    exportable: true, // 是否可导出
    importRequired: false, // 导入是否必填
    aline: false, // 独占一行
    showOverflow: true, // 用户控制是否显示溢出内容
    formSort: 1, // 弹窗的输入顺序
    fieldSort: 1, // 列表的显示顺序
    widget: "input", // 该字段在新增或编辑弹窗时是用何种组件渲染，具体请见richform
    formLayout: { // richform的字段属性
        placeholder: "", // 占位符，如请输入
        options: [], // 选项
        disabled: false, // 弹窗字段禁用
    },
}
```

## 常见问题解决方案  
1、大数据导出，可让后端先成excel文件，如java用easyexcel库生成文件，再返回文件流，此时需要配置downloadConfig，默认是用selectConfig请求回数据后在前端生成excel。  
java文件数据流返回样例：  
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
            System.out.println("下载excel报错了"+e.getMessage());
        }
    }
```
