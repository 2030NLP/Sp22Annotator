# SpaCE2022标注工具前端说明文档



### 一、作为标注者使用



---

---

---

### 二、作为管理者管理Schema



https://www.bejson.com/jsoneditoronline/index.html

https://json-editor.tangramjs.com/editor.html



---

---

---

### 三、部署和运行

#### 0、代码仓库

https://github.com/2030NLP/Sp22Annotator

分支：

- 离线版：`main` 分支
- 网络版：`newBackEnd` 分支
- 其他分支是历史版本归档，可忽略



#### 1、本地运行

1. 使用 git 从仓库 pull 代码，或者在仓库页面打包下载代码。
2. 在本地搭建简易服务器，挂载本项目，访问 index.html 即可。例如：
   1. 安装 Sublime Text 并打开。
   2. 安装并启用 SublimeServer 。
      1. 通过 Tools -> Install Package Control 安装插件包管理工具。
      2. 上一步完成后，通过 Tools -> Command Palette 呼出命令板，输入“`Package Control: Install Package`”并回车，搜索“`SublimeServer`”并回车安装。注：虽然这个项目已经不再维护，但不影响使用。
      3. 安装完成后，通过 Tools -> SublimeServer -> Start SublimeServer 启动本地服务。每次重启 Sublime Text 都需重启此功能。
   3. 将整个代码目录文件夹拖进软件窗口，然后在左侧列表打开 index.html。
   4. 在代码任意区域单击右键，选择 View in SublimeServer；或者直接在浏览器访问`localhost:8080/Sp22Annotator/index.html`。
   5. 即可在浏览器访问此项目。



#### 2、Github-pages

- 建立 Github 仓库，导入代码，或者直接从原始仓库 fork 代码。
- Settings -> Pages ，设置 Source 为 main 或 你需要的分支，Save 。
- 无需其他任何环境配置，即可通过相应链接访问。
- 但需注意，网络版涉及到与后端交互，要做两个处理：
  - 1、前端 `main.js` 里要将 `API_BASE_PROD` 设置为正确的地址。
  - 2、后端要将此仓库的 pages 地址的域名部分列入允许跨域访问的清单之中。



#### 3、部署到服务器

- 只要放到服务器并提供链接，无需其他任何环境配置，即可访问。
- 但需注意，网络版涉及到与后端交互，要做两个处理：
  - 1、前端 `main.js` 里要将 `API_BASE_PROD` 设置为正确的地址。
  - 2、后端要将前端所在域名或ip地址列入允许跨域访问的清单之中。



---

---

---

### 四、开发

#### 0、当前 TODO（2022-03-11）



#### 1、技术要求

- 【必须】掌握 HTML5, CSS3, JavaScript 基础
- 【必须】熟悉 Vue3 框架，或已经掌握 Vue2 框架并擅长学习
- 【必须】了解 Http 请求（post, get, put 等）
- 【必须】熟悉 Github 及 git 操作
- 【最好】熟悉 ES6 及以上规范
- 【最好】熟悉 Bootstrap 框架，或其他前端样式框架
- 【最好】了解 Axios 的使用
- 【最好】自备梯子，以便访问 Github



#### 2、技术栈

- 页面样式：Bootstrap
  - 布局：栅格系统，响应式布局，Flex布局，Fixed布局 等
  - 配色：primary, success, warning, danger, info, light, dark 等

- 页面的模板，样式与数据的绑定：Vue3
  - `Setup()`, `reactive()`, `onMounted()` 等
  - 注1：直接开发最终页面，不涉及构建流程，所以没有使用单文件组件
  - 注2：为了方便修改模板，整个页面是一个vue组件，没有进行组件拆分
- 逻辑实现：ES6 及以上的 JS 语法
- 前后端交互：Axios
- 其他第三方库（位于 `/lib` 目录下）：
  - clipboard.js: 实现文本复制功能
  - FileSaver.js: 实现文件保存功能
  - store.js: 实现缓存功能



#### 3、项目结构

```
/README.md                说明文档
/index.html               前端主页
/favicon.ico              网站图标
/js                       前端逻辑代码目录
  /main.js                　前端核心逻辑
  /util.js                　前端实用函数，供 main.js 使用
  /components             　前端可复用的“组件”（注 ℹ️）
    /BaseAlert.js         　　组件：提示框
    /BaseSaver.js         　　组件：保存文件
    /BaseStore.js         　　组件：缓存
    /BaseReader.js        　　组件：文件读取（相对底层）
    /TheReader.js         　　组件：文件读取（相对高层）
    /TheSelector.js       　　组件：文本选取【已直接放到 main.js 里】
    /TheSteps.js          　　组件：标注步骤逻辑【已直接放到 main.js 里】
/css                      前端样式目录
  /style.css              　前端样式文件
/lib                      前端使用的第三方代码或样式的目录，可改为从CDN服务取用
  /......                 　略，参考技术栈
/schema                   前端页面可灵活配置的部分，以及数据样例的目录
```

> 注 ℹ️：这些“组件”并不是 vue 的单文件组件，也不是 ES6 模块，而是出于开发方便而单独分出的代码片段。后续开发可以考虑将其制作成 ES6 模块。不建议使用 vue 的单文件组件，因为会增加构建步骤，提高开发门槛。



#### 4、页面主要板块

页面主体布局通过若干的 `div.page` 块来组织，每个 `div.page` 可称为一个“板块”。

板块的布局主要通过 bootstrap 提供的样式类实现。

主要的板块如下：

##### 1）数据导入板块（限离线版）

cssPath: `div.page#page-import`

用途：填写姓名、导入导出数据、查看标注进度

内容：

###### ① 用户姓名输入框

- 如果输入的姓名为“`admin`”，则语料样式需作特殊处理，参看语料标注板块相关说明。

###### ② 标注进度条

###### ③ 文件选择框

###### ④ 导入按钮

###### ⑤ 加载缓存数据按钮

- 仅当输入了用户名，且存在缓存数据时显示

###### ⑥ 导出按钮

- 仅当当前存在加载的数据时可用

##### 2）页面选择板块（限网络版）

cssPath: `div.page#page-nav`

- 提供「配置」「清单」「标注」三个按钮，将页面主体板块分别切换到「用户信息配置板块」「待标注列表板块」「语料标注板块」。



##### 3）用户信息配置板块（限网络版）

cssPath: `div.page#page-setup`

- 仅当页面选择板块选中「配置」时显示。
- 供用户填写「姓名」「序列号」「标注目标数量」。
- 🚧【**TODO**】提供「更新」按钮，向服务器请求再分配「标注目标数量 - 已分配给此用户的任务数量」的任务给该用户。



##### 4）进度总览板块（限网络版）

cssPath: `div.page#page-overview`

- 提供一个进度条显示「已标注数量」相对于「标注目标数量」的进度。
- 🚧【**TODO**】显示一些细节，如「已丢弃的数量」「已跳过的数量」「已标注的数量」等。



##### 5）待标注列表板块

cssPath: `div.page#page-list`

- 仅当页面选择板块选中「清单」时显示。
- 转到此页面时，通过 `alltask` 接口从服务器获取当前用户需要标注的所有任务编号。
- 🚧【**TODO**】



##### 6）语料标注板块（最核心的功能板块）

cssPath: `div.page#page-main-editor`

- 仅当页面选择板块选中「标注」时显示。
- 此模块功能后面专门讨论，这里先不展开。



##### 7）语料切换控件板块

cssPath: `div.position-fixed`

- 用于在所有要标注的语料之间切换，具体包括三个功能：「上一条」「下一条」和「前往第x条」

- 仅当页面选择板块选中「标注」时显示。
- 注：这不是 `div.page`
- TODO：目前没有设置 id，不太好，建议设为 `div#page-ctrl-wrap` 之类（很不重要）





#### 5、语料标注板块



#### 6、Schema系统



#### 5、代码主要运行逻辑（`main.js`）





