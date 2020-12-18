# cl-crud

## Install

#### npm

```shell
npm i cl-crud
```

#### yarn

```shell
yarn add cl-crud
```

#### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/cl-crud@1.6.71/dist/cl-crud.min.js"></script>
```

## Demo

[https://show.cool-admin.com](https://show.cool-admin.com/)

账号 admin
密码 123456

## Document

[https://docs.cool-admin.com/#/front/crud](https://docs.cool-admin.com/#/front/crud)

## Version

-   1.6.8 
    -   添加 app 方法 setAdvForm, getAdvForm, hiddenAdvItem, getAdvItemRef
    -   添加 on 监听事件 advOpen, advClose

-   1.6.7 添加@babel/preset-env

-   1.6.6 添加自定义事件，app.on(name, callback)

-   1.6.5 修改 on.advReset(data, { close }) 

-   1.6.4 添加 on.advReset({ close }) 高级搜索重置回调事件

-   1.6.3

    -   优化 cl-crud 高度计算方式
    -   cl-form 支持自定义内容（\$slots.default）

-   1.6.2 添加 tabs 示例，调整 on 事件

-   1.6.1 解决 pagination props 参数处理错误问题

-   1.6.0

    -   更新 cl-crud 高度计算方式
    -   cl-form 添加 on.load 事件，添加 setForm, getForm
    -   table.op 下拉菜单模式修改

-   1.5.9 解决 cloneDeep, dataset 取值错误

-   1.5.8 解决内嵌 crud 下 `query` 点击刷新页面问题

-   1.5.7 dataset 处理错误

-   1.5.6 data-table cell 尺寸修改（以 el-table size 为标准），去掉默认的 font-weight，background-color 样式

-   1.5.5 解决 \$crud 注入错误问题

-   1.5.4 优化一点

-   1.5.3 添加 插件模式（组件注入）

-   1.5.2 添加 app.setPagination

-   1.5.1 处理自定义头与拖动冲突

-   1.5.0 更新异常

-   1.4.9 处理 el-table-column type='expand' 不生效问题

-   1.4.8 layout 支持 function({scope, h}) {...}

-   1.4.7 app.close 调用错误

-   1.4.6 el-dialog 样式冲突

-   1.4.5 优化 upsert 渲染方式，表单添加 hdr 参数，支持自定义布局

-   1.4.4 解决 prop 为空参数带入 undefined

-   1.4.3 解决 table-column formatter 未处理问题

-   1.4.2

    -   解决 upsert:slot 失效
    -   添加 app.hiddenItem(prop, flag?)、app.hiddenColumn(prop, flag?)、app.getForm(prop?)、app.submit 方法
    -   app.data => app.getData

-   1.4.1 解决 table scopedSlots 渲染监听不成功

-   1.4.0 解决 table empty 创建问题

-   1.3.9 扩展 table 参数，添加 table-empty...

-   1.3.8 cl-form 组件添加 forceUpdate（强制更新）参数

-   1.3.7 解决 onresize 重写问题

-   1.3.6 添加 flat 方法

-   1.3.5 添加 flat 兼容

-   1.3.4 解决 refs 冲突；样式规范修改

-   1.3.3 优化 table.op

-   1.3.2 解决 upsert.form 未完全清空问题

-   1.3.1 解决 options 重新设置不生效问题

-   1.3.0 解决 app.refs 获取异常

-   1.2.9 修改方法 fn.permission 为接收一个返回值

-   1.2.8 优化布局渲染、添加表格操作列的下拉菜单模式、解决高级搜索默认显示异常的问题

-   1.2.7 优化、调整

-   1.2.6 优化表单输入框宽度处理方法

-   1.2.5 优化表单处理

-   1.2.4 兼容多级表头

-   1.2.3 优化深拷贝，处理高级搜索重置问题

-   1.2.2 自定义表单 data 方法冲突，导致 bound data

-   1.2.1 优化自定义表单

-   1.2.0 处理 \$createElement 插入 props 导致 { type: null } 问题

-   1.1.95 修改 el-dialog 拖动指针显示

-   1.1.94 修改 el-dialog 拖动异常，添加 resize 事件

-   1.1.93 修改 el-dialog 切换异常

-   1.1.92 修改 el-dialog 拖动异常

-   1.1.91 修改 update 自动校正

-   1.1.9 添加窗口操作
