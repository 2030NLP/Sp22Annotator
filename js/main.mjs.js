
// 引入依赖的模块

import {
  reactive,
  readonly,
  ref,
  toRef,
  toRefs,
  computed,
  onMounted,
  onUpdated,
  createApp as Vue_createApp
} from './modules_lib/vue_3.2.31_.esm-browser.prod.min.js';

import { timeString, foolCopy } from './util.mjs.js';
import BaseSaver from './modules/BaseSaver.mjs.js';
import TheReader from './modules/TheReader.mjs.js';
import AlertBox from './modules/AlertBox.mjs.js';
import TokenSelector from './modules/TokenSelector.mjs.js';
import StepControl from './modules/StepControl.mjs.js';
import BackEnd from './modules/BackEnd.mjs.js';
// import BackEndUsage from './modules/BackEndUsage.mjs.js';

import axios from './modules_lib/axios_0.26.1_.mjs.js';
import ClipboardJS from './modules_lib/clipboard_2.0.10_.mjs.js';
import __Wrap_of_store__ from './modules_lib/store_2.0.9_.legacy.min.mjs.js';



// 基本信息 变量
const APP_NAME = "Sp22-Anno";
const APP_VERSION = "22-0312-00";
const PROJ_DESC = "SpaCE2022";
const PROJ_PREFIX = "Sp22";

// 开发环境 和 生产环境 的 控制变量
const DEVELOPING = 1;
const DEVELOPING_LOCAL = 0;
const API_BASE_DEV_LOCAL = "http://127.0.0.1:5000";
const API_BASE_DEV = "http://192.168.124.28:8888";
const API_BASE_PROD = "http://101.43.244.203";
const API_BASE = DEVELOPING ? API_BASE_DEV : API_BASE_PROD;

// 语料信息映射
const fildId_to_info = { "A01": { "genre": "中小学语文课本", "file": "人教版_课标教材初中语文原始语料.txt", "用户显示名称": "初中语文课本" }, "A02":{ "genre":"中小学语文课本", "file": "人教版_课标教材高中语文原始语料.txt", "用户显示名称": "高中语文课本" }, "A03":{ "genre":"中小学语文课本", "file": "人教版_课标教材小学语文原始语料.txt", "用户显示名称": "小学语文课本" }, "A04":{ "genre":"中小学语文课本", "file": "人教版_全日制普通高中语文原始语料.txt", "用户显示名称": "高中语文课本" }, "A05":{ "genre":"中小学语文课本", "file": "人教版_义务教育教材_3年_初中语文原始语料.txt", "用户显示名称": "初中语文课本" }, "A06":{ "genre":"中小学语文课本", "file": "人教版_义务教育教材_6年_小学语文原始语料.txt", "用户显示名称": "小学语文课本" }, "B01": { "genre": "体育训练人体动作", "file": "shentiyundongxunlian.txt", "用户显示名称": "身体运动训练" }, "B02":{ "genre":"体育训练人体动作", "file": "tushouxunlian.txt", "用户显示名称": "儿童徒手训练" }, "B03":{ "genre":"体育训练人体动作", "file": "yujia.txt", "用户显示名称": "瑜伽" }, "B04":{ "genre":"体育训练人体动作", "file": "qingshaoniantushou.txt", "用户显示名称": "青少年徒手训练" }, "B05":{ "genre":"体育训练人体动作", "file": "lashen131.txt", "用户显示名称": "儿童拉伸训练" }, "B06":{ "genre":"体育训练人体动作", "file": "lashen130.txt", "用户显示名称": "青少年拉伸训练" }, "C01": { "genre": "人民日报", "file": "rmrb_2020-2021.txt", "用户显示名称": "人民日报" }, "D01": { "genre": "文学", "file": "似水流年_王小波.txt", "用户显示名称": "人民日报" }, "D02": { "genre": "文学", "file": "洗澡_杨绛.txt", "用户显示名称": "文学" }, "D03":{ "genre":"文学", "file": "天狗.txt", "用户显示名称": "文学" }, "D04":{ "genre":"文学", "file": "北京北京.txt", "用户显示名称": "文学" }, "D05":{ "genre":"文学", "file": "草房子.txt", "用户显示名称": "文学" }, "D06":{ "genre":"文学", "file": "兄弟.txt", "用户显示名称": "文学" }, "E01":{ "genre":"地理百科全书", "file": "geography.txt", "用户显示名称": "地理百科全书" }, "F01":{ "genre":"交通事故判决书", "file": "上海_交通判决书.txt", "用户显示名称": "交通事故判决书" }, "F02":{ "genre":"交通事故判决书", "file": "北京_交通判决书.txt", "用户显示名称": "交通事故判决书" }, "G01":{ "genre":"语言学论文例句", "file": "wenxian.txt", "用户显示名称": "语言学论文例句" }};


const RootComponent = {
  setup() {

    // 语料信息映射 函数
    const fileInfo = (originId) => {
      const fileId = originId.split("-")[0];
      return fildId_to_info[fileId];
    };

    // 初始化 文件保存 模块
    const theSaver = new BaseSaver();

    // 初始化 提示框 模块
    const alertBox = reactive(new AlertBox());

    // 初始化 文件读取 模块
    const theReader = new TheReader(alertBox.pushAlert);


    // 初始化 剪贴板 插件
    // const theClipboardRef = ref(null);
    onMounted(() => {
      let theClipboard = new ClipboardJS(".btn-copy-selection");
      theClipboard.on('success', function (e) {
        // console.info('Action:', [e.action, e.text, e.trigger]);
        alertBox.pushAlert(`成功拷贝文本【${e.text}】`, "success");
        e.clearSelection();
      });
      theClipboard.on('error', function (e) {
        // console.info('Action:', [e.action, e.trigger]);
        alertBox.pushAlert(`拷贝失败！`, "danger");
      });
    });


    // 初始化 文本片段选择 模块
    const selection = reactive({
      isSelecting: false,
      start: null,
      end: null,
      end: null,
      array: [],
      again: false,
      hasDown: false,
    });
    const tokenSelector = new TokenSelector(selection);

    // 初始化 后端 API
    const theApi = axios.create({
      baseURL: `${API_BASE}/api/`,
      timeout: 30000,
      headers: {'Catch-Cotrol': 'no-cache'},
    });
    const theBackEnd = new BackEnd(theApi, alertBox.pushAlert);

    const exampleWrap = reactive({
      example: {},
    });

    // const backEndData = reactive({
    //   tasks: [],
    //   //
    //   newThings: {
    //     theUser: {},
    //     topic: "",
    //     lastEID: null,
    //     //
    //     tasksShowValid: true,
    //     tasksShowDropped: true,
    //     tasksShowUndone: true,
    //   },
    //   //
    //   tasksShowValid: true,
    //   tasksShowDropped: true,
    //   tasksShowUndone: true,
    //   //
    //   ctrl: {
    //     currentWorker: "",
    //     currentWorkerId: "",
    //     currentWorkerSecret: "",
    //     currentWorkerTarget: 600,
    //     //
    //     haveStore: false,
    //     //
    //     currentPage: "setup",
    //     //
    //     doneNum: 0,
    //     totalNum: 1,
    //     donePct: "10%",
    //   },
    // });


    // 对 后端 API 进行基础的使用 开始
    const apiMethods = {
      apiTouchTask: async (task_btn) => {
        try {
          let resp = await theBackEnd.getThing(appData.ctrl.currentWorkerId, task_btn?.id);
          // alertBox.pushAlert(resp?.data);
          if (resp?.data?.err?.length) {
            alertBox.pushAlert(`【发生错误】${resp?.data?.err}`, 'danger');
            return;
          };
          return resp?.data?.thing;
        } catch (error) {
          alertBox.pushAlert(error, 'danger');
        };
      },
      apiTouchTaskBtn: async (task_btn) => {
        try {
          saveStore();
          await updateSchema();
          tokenSelector.clear(exampleWrap?.example?.material?.tokenList);
          //
          exampleWrap.example = {};
          //
          let thing = await apiMethods.apiTouchTask(task_btn);
          if (thing?.entry) {
            let content = thing?.entry?.content;
            content.annotations = thing?.annotation?.content?.annotations ?? [];
            content._ctrl = thing?.annotation?.content?._ctrl ?? {};
            content._info = {
              btn_idx: task_btn.idx,
              task_id: thing?.task?.id,
              entry_id: thing?.entry?.id,
              anno_id: thing?.annotation?.id,
            };
            // TODO
            console.debug(content);
            // alertBox.pushAlert(content);

            exampleWrap.example = {};
            exampleWrap.example = foolCopy(content);

            // 还原步骤
            let stepRef;
            if (!exampleWrap?.example?._ctrl?.currentStepRef?.length) {
              stepRef = stepsDictWrap?.[stepsDictWrap?.using]?.startStep ?? 'start';
            } else {
              stepRef = exampleWrap.example._ctrl.currentStepRef;
            };
            if (stepRef in stepsDict) {
              await stepCtrl.goRefStep(stepRef);
            };
            tokenSelector.clear(exampleWrap?.example?.material?.tokenList);

            //
            appData.ctrl.currentPage = 'anno';
            appData.newThings.lastEID = thing?.entry?.id;
            store.set(`${APP_NAME}:lastEID`, appData.newThings.lastEID);
            return content;
          };
        } catch (error) {
          alertBox.pushAlert(error, 'danger');
        };
      },

      apiConnect: async () => {
        // alertBox.pushAlert("apiConnect 开始", 'secondary');
        try {
          let resp = await theBackEnd.getUser(null, appData.ctrl.currentWorker, appData.ctrl.currentWorkerSecret);
          if (resp?.data?.err?.length) {
            alertBox.pushAlert(`【发生错误】${resp?.data?.err}`, 'danger');
            return;
          };
          appData.newThings.topic = resp?.data?.topic;
          await apiMethods.apiUpdateUser(resp?.data?.user);
          alertBox.pushAlert(`${resp?.data?.user?.name}的信息已同步`);
          await apiMethods.apiUpdateTaskList();
        } catch (error) {
          alertBox.pushAlert(error, 'danger');
        };
        // alertBox.pushAlert("apiConnect 结束", 'secondary');
      },

      apiUpdateTarget: async () => {
        // alertBox.pushAlert("apiUpdateTarget 开始", 'secondary');
        try {
          let oldCount = appData.ctrl.currentWorkerTaskCount;
          let target = appData.ctrl.currentWorkerTarget;
          let delta = target - oldCount;
          if (delta <= 0) {
            alertBox.pushAlert(`【操作取消】新目标要大于原始目标才行`, 'secondary');
            appData.ctrl.currentWorkerTarget = appData.ctrl.currentWorkerTaskCount;
            return;
          };
          if (delta > 50) {
            delta = 50;
            alertBox.pushAlert(`【操作调整】新目标比原始目标多过50条，已自动调整`, 'secondary');
          };
          let resp = await theBackEnd.newTask(appData.ctrl.currentWorkerId, delta, appData.newThings.topic||null);
          if (resp?.data?.err?.length) {
            alertBox.pushAlert(`【发生错误】${resp?.data?.err}`, 'danger');
            appData.ctrl.currentWorkerTarget = appData.ctrl.currentWorkerTaskCount;
            return;
          };
          await apiMethods.apiConnect();
          let newDelta = appData.ctrl.currentWorkerTaskCount - oldCount;
          if (newDelta <= 0) {
            alertBox.pushAlert(`【操作未果】没有更多可分配的任务`, 'info');
            return
          };
          alertBox.pushAlert(`【操作成功】已为您分配 ${newDelta} 条新任务`, 'success');
        } catch (error) {
          alertBox.pushAlert(error, 'danger');
        };
        // alertBox.pushAlert("apiUpdateTarget 结束", 'secondary');
      },

      apiUpdateTaskList: async () => {
        // alertBox.pushAlert("apiUpdateTaskList 开始");
        try {
          let aa = alertBox.pushAlert("正在获取任务列表，请稍等……", "info", 99999999);
          let resp = await theBackEnd.getWorkList(appData.ctrl.currentWorkerId, appData.ctrl.currentWorkerSecret);
          alertBox.removeAlert(aa);
          if (resp?.data?.err?.length) {
            alertBox.pushAlert(`【发生错误】${resp?.data?.err}`, 'danger');
            return;
          };
          let work_list = resp?.data?.work_list ?? [];
          console.debug(work_list);
          let task_btn_list = [];
          for (let work of work_list) {
            let task = work.task;
            let anno = work?.annotation;
            let task_btn = {
              id: task.id,
              eId: task.eId,
              valid: anno && !anno?.dropped && !anno?.skipped ? true : false,
              dropped: anno?.dropped ? true : false,
              skipped: anno?.skipped ? true : false,
            };
            task_btn_list.push(task_btn);
          };
          task_btn_list = task_btn_list.sort((a,b)=> +a.eId-b.eId);
          for (let idx in task_btn_list) {
            task_btn_list[idx].idx = idx;
          };
          appData.tasks = task_btn_list;
          //
          updateProgress();

        } catch (error) {
          alertBox.pushAlert(error, 'danger');
        };
        // alertBox.pushAlert("apiUpdateTaskList 结束");
      },

      apiUpdateUser: (user) => {
        console.log(user);
        let it = {
          worker: user.name,
          workerId: user.id,
          secret: user.password,
          target: user.task.length,
          taskCount: user.task.length,
        };
        appData.ctrl.currentWorker = user.name;
        appData.ctrl.currentWorkerId = user.id;
        appData.ctrl.currentWorkerSecret = user.password;
        appData.ctrl.currentWorkerTarget = user.task.length;
        appData.ctrl.currentWorkerTaskCount = user.task.length;
        appData.newThings.theUser = user;
        store.set(`${APP_NAME}:it`, it);
        store.set(`${APP_NAME}:theUser`, user);
      },



      apiSave: async (content) => {
        try {
          let task_id = content?._info?.task_id;
          let anno_wrap = {
            'annotations': exampleWrap?.example?.annotations,
            '_ctrl': exampleWrap?.example?._ctrl,
          };
          if (!anno_wrap?.annotations?.length) {
            alertBox.pushAlert(`【操作取消】没有标注内容，无需保存`, 'secondary');
            return false;
          }
          if (anno_wrap.annotations.filter(anno => anno.isDropping).length) {
            anno_wrap.isDropping = true;
          };
          let resp = await theBackEnd.updateAnno(appData.ctrl.currentWorkerId, task_id, anno_wrap, appData?.newThings?.topic);
          if (resp?.data?.err?.length) {
            alertBox.pushAlert(`【发生错误】${resp?.data?.err}`, 'danger');
            return false;
          };
          alertBox.pushAlert(`已保存`, 'success', 500);
          if (!anno_wrap.isDropping) {
            appData.tasks[content?._info?.btn_idx].valid = true;
          } else {
            appData.tasks[content?._info?.btn_idx].dropped = true;
          };
          return true;
        } catch (error) {
          alertBox.pushAlert(error, 'danger');
          return false;
        };
      },

      apiGoIdx: async (idx) => {
        if (idx < appData.tasks.length && idx >= 0) {
          let btn = appData.tasks[idx];
          let content = await apiMethods.apiTouchTaskBtn(btn);
          return content;
        };
        return null;
      },

      apiLast: async (content) => {
        let last_idx = + content?._info?.btn_idx - 1;
        let it = await apiMethods.apiGoIdx(last_idx);
        if (it == null) {
          alertBox.pushAlert(`没有上一条了`, 'secondary');
        };
      },

      apiNext: async (content) => {
        let next_idx = + content?._info?.btn_idx + 1;
        let it = await apiMethods.apiGoIdx(next_idx);
        if (it == null) {
          alertBox.pushAlert(`没有下一条了`, 'secondary');
        };
      },

      apiSaveAndLast: async (content) => {
        let result = await apiMethods.apiSave(content);
        if (result) {
          await apiMethods.apiLast(content);
        };
      },

      apiSaveAndNext: async (content) => {
        let result = await apiMethods.apiSave(content);
        if (result) {
          await apiMethods.apiNext(content);
        };
      },

    };
    // 对 后端 API 进行基础的使用 结束



    const appData = reactive({
      fileWrapWrap: {
        fileWrap: {},
      },
      fileError: false,
      dataWrap: {
        dataItems: [],
      },
      tasks: [],  // 清单页面里的任务按钮，例子：[{id:"666",skipped:true},{id:"888",dropped:true},{id:"222",valid:true},{id:"333"},{id:"111"}],
      ctrl: {
        currentWorker: "",
        currentWorkerId: "",
        currentWorkerSecret: "",
        currentWorkerTarget: 600,
        //
        currentPage: "setup",
        //
        haveStore: false,
        //
        doneNum: 0,
        totalNum: 1,
        donePct: "10%",
        //
        currentIdx: 0,
        targetIdx: 0,
        showOrigin: false,
        //
      },
      newThings: {
        theUser: {},
        topic: "",
        lastEID: null,
        //
        tasksShowValid: true,
        tasksShowDropped: true,
        tasksShowUndone: true,
      },
    });






    onMounted(() => {
      let storedVersion = store.get(`${APP_NAME}:version`);
      if (storedVersion == APP_VERSION) {
        appData.ctrl.haveStore = true;
      };
      let stored = store.get(`${APP_NAME}:it`);
      appData.ctrl.currentWorker = stored?.worker;
      appData.ctrl.currentWorkerId = stored?.workerId;
      appData.ctrl.currentWorkerSecret = stored?.secret;
      appData.ctrl.currentWorkerTarget = stored?.target;
      appData.ctrl.currentWorkerTaskCount = stored?.taskCount;
      appData.newThings.lastEID = store.get(`${APP_NAME}:lastEID`);
    });





    const saveStore = () => {
      store.set(`${APP_NAME}:dataWrap`, foolCopy(appData.dataWrap));
      store.set(`${APP_NAME}:version`, APP_VERSION);
      // let worker = appData.ctrl.currentWorker;
      // store.set(`${APP_NAME}:worker`, worker);
      store.set(`${APP_NAME}:it`, {
        worker: appData.ctrl.currentWorker,
        workerId: appData.ctrl.currentWorkerId,
        secret: appData.ctrl.currentWorkerSecret,
        target: appData.ctrl.currentWorkerTarget,
        taskCount: appData.ctrl.currentWorkerTaskCount,
      });
    };





    // const formFilesRef = (document?.forms?.["file-form"]?.["file-input"]?.files);
    // const formFiles = computed(() => formFilesRef);
    const dataMethods = {
      log: (action) => {
        let worker = appData.ctrl.currentWorker;
        let info = {
          time: JSON.parse(JSON.stringify(new Date())),
          person: worker,
          action: action,
        };
        appData.dataWrap.handleLogs.push(info);
        appData.dataWrap.lastModifiedAt = info.time;
        appData.dataWrap.appVersion = APP_VERSION;
      },


      loadStore: async () => {
        appData.dataWrap = store.get(`${APP_NAME}:dataWrap`);
        await dataMethods.fixData();
        dataMethods.log(`load from store at idx(${appData?.dataWrap?._ctrl?.currentIdx})`);
      },
      onExport: async () => {
        if (!appData?.dataWrap?.dataItems?.length) {return;};
        await dataMethods.beforeSave();
        dataMethods.log(`export to file at idx(${appData?.dataWrap?._ctrl?.currentIdx})`);
        let worker = appData.ctrl.currentWorker;
        let fid = appData.dataWrap.fID;
        let using = stepsDictWrap.using;
        let fileName = `${PROJ_PREFIX}-${using} [${fid}] @${worker} (${timeString()}).json`;
        theSaver.saveJson(appData.dataWrap, fileName);
      },
      onImport: async () => {
        let fileItem = document.forms["file-form"]["file-input"].files[0];
        console.debug(fileItem);

        if (fileItem == null) {return;};

        let fileWrap = {};
        fileWrap.file = fileItem;
        fileWrap.name = fileItem.name;
        fileWrap.isUsable = true;
        fileWrap.readed = false;
        fileWrap.readed2 = false;
        fileWrap.tmp = false;
        fileWrap.encodingGot = false;
        fileWrap.encoding = null;

        await theReader.readFileAsBinaryString(fileWrap, fileWrap.encoding);
        await theReader.readFile(fileWrap);
        // Object.assign(appData.fileWrapWrap, {fileWrap: fileWrap});
        appData.fileWrapWrap.fileWrap = fileWrap;
        // console.debug(appData.fileWrapWrap.fileWrap);

        await dataMethods.readData();


        dataMethods.log(`import from file at idx(${appData?.dataWrap?._ctrl?.currentIdx})`);
        saveStore();
      },
      readData: async () => {
        let fileWrap = appData.fileWrapWrap.fileWrap;
        let obj = JSON.parse(fileWrap.content);
        // fileWrap.obj = obj;

        // 看是不是用于这次评测的数据
        // TODO: 未来如果版本有大改，可能要针对 appVersion 做某些判断和处理。
        if (obj?.desc != PROJ_DESC) {
          appData.fileError = true;
          return;
        };
        appData.fileError = false;

        // ↓ 读取数据
        // Object.assign(appData.dataWrap, foolCopy(obj));
        appData.dataWrap = foolCopy(obj);

        await dataMethods.fixData();
      },
      fixData: async () => {
        console.debug("开始 fixData");
        console.debug(foolCopy(appData.dataWrap));

        // 更新当前要标注的材料的序号
        if (!('_ctrl' in appData.dataWrap)) {
          appData.dataWrap._ctrl = {};
        };
        if (!('currentIdx' in appData.dataWrap._ctrl)) {
          appData.dataWrap._ctrl.currentIdx = 0;
        };
        // console.debug(appData.dataWrap._ctrl.currentIdx);

        for (item of appData.dataWrap.dataItems) {
          if (!('annotations' in item)) {
            item.annotations = [];
          };
          if (!('_ctrl' in item)) {
            item._ctrl = {};
          };
        };

        if (!('handleLogs' in appData.dataWrap)) {
          appData.dataWrap.handleLogs = [{
            time: JSON.parse(JSON.stringify(new Date())),
            person: "App",
            action: "fix",
          }];
        };

        console.debug(foolCopy(appData.dataWrap));
        console.debug("结束 fixData");

        updateProgress();
        await ctrlMethods.goIdx(appData.dataWrap._ctrl.currentIdx);
      },

      ensureExampleStep: () => {
        // 保存当前步骤
        if (!('_ctrl' in exampleWrap.example)) {
          exampleWrap.example._ctrl = {};
        };
        exampleWrap.example._ctrl.currentStepRef = currentStep.ref;
        // exampleWrap.example._ctrl.currentSchema = {
        //   name: stepsDictWrap.name ?? null,
        //   version: stepsDictWrap.version ?? null,
        //   using: stepsDictWrap.using ?? null,
        // };
        // 网络版节约空间
        exampleWrap.example._ctrl.schema = [
          stepsDictWrap.version ?? null,
          stepsDictWrap.using ?? null,
        ];
      },
      saveExample: () => {
        if (!appData.dataWrap.dataItems.length) {return;};
        dataMethods.ensureExampleStep();
        // 覆盖
        appData.dataWrap.dataItems[appData.ctrl.currentIdx] = foolCopy(exampleWrap.example);
      },
    };





      const updateProgress = () => {
        appData.ctrl.doneNum = appData.tasks.filter(it=>it.valid||it.dropped).length ?? 0;
        appData.ctrl.totalNum = appData.tasks.length ?? 1;
        appData.ctrl.donePct = `${Math.min(100, appData.ctrl.doneNum / appData.ctrl.totalNum * 100)}%`;
      };



    const ctrlMethods = {
      fineIdx: (idx) => {
        idx = Math.min(idx, appData.dataWrap.dataItems.length-1);
        idx = Math.max(idx, 0);
        return idx;
      },
      goIdx: async (idx) => {
        saveStore();
        await updateSchema();
        tokenSelector.clear(exampleWrap?.example?.material?.tokenList);

        idx = ctrlMethods.fineIdx(idx);
        appData.ctrl.currentIdx = idx;
        // Object.assign(exampleWrap.example, foolCopy(appData.dataWrap.dataItems[appData.ctrl.currentIdx]));
        if (!appData.dataWrap.dataItems.length) {
          dataMethods.log(`goIdx(${idx}) returned`);
          return;
        };
        dataMethods.log(`goIdx(${idx})`);

        // 覆盖
        exampleWrap.example = foolCopy(appData.dataWrap.dataItems[appData.ctrl.currentIdx]);
        appData.dataWrap._ctrl.currentIdx = idx;
        appData.ctrl.targetIdx = null;

        // 还原步骤
        let stepRef;
        if (!exampleWrap?.example?._ctrl?.currentStepRef?.length) {
          stepRef = stepsDictWrap?.[stepsDictWrap?.using]?.startStep ?? 'start';
        } else {
          stepRef = exampleWrap.example._ctrl.currentStepRef;
        };
        if (stepRef in stepsDict) {
          await stepCtrl.goRefStep(stepRef);
        };

        tokenSelector.clear(exampleWrap?.example?.material?.tokenList);
      },
      toogleShowOrigin: () => {
        appData.ctrl.showOrigin = !appData.ctrl.showOrigin;
        // console.debug(appData.ctrl.showOrigin);
      },
      // 0228 之前的旧版函数
      // __updateProgress: () => {
      //   let endStep = stepsDictWrap?.[stepsDictWrap?.using]?.endStep;
      //   appData.ctrl.totalNum = appData.dataWrap.dataItems.length;
      //   appData.ctrl.doneNum = appData.dataWrap.dataItems.filter(it=>{
      //     return it?._ctrl?.currentStepRef == endStep && endStep?.length;
      //   }).length;
      //   appData.ctrl.donePct = `${Math.min(100, appData.ctrl.doneNum / appData.ctrl.totalNum * 100)}%`;
      // },
    };




    const RootStep = reactive({});
    const currentStep = reactive({});
    const stepsDict = reactive({});
    const stepsDictWrap = reactive({
      version: "00",
    });


    const anotherAxios = axios.create({
      headers: {'Catch-Cotrol': 'no-cache'},
    });
    const updateSchema = async () => {
      let response = await anotherAxios.request({
        url: "schema/steps.schema.json",
        method: 'get',
      });
      let wrap = (response.data);
      // console.debug(wrap);
      if (stepsDictWrap.name == wrap.name &&
        stepsDictWrap.version == wrap.version &&
        stepsDictWrap.using == wrap.using) {
        return;
      };
      alertBox.pushAlert(`收到 schema（版本：${wrap.version}，规范：${wrap.using}）`, "warning");
      Object.assign(stepsDictWrap, wrap);
      Object.assign(stepsDict, stepsDictWrap?.[stepsDictWrap?.using]?.steps??null);
      Object.assign(RootStep, stepsDictWrap?.[stepsDictWrap?.using]?.steps?.[stepsDictWrap?.[stepsDictWrap?.using]?.startStep]??null);
      Object.assign(currentStep, RootStep);
    };

    onMounted(async () => {
      await updateSchema();
    });


    const appPack = {
      reactive_data: appData,
      reactive_exam_wrap: exampleWrap,
      tokenSelector: tokenSelector,
      theBackEnd: theBackEnd,
      pushAlertFn: alertBox.pushAlert,
      appName: APP_NAME,
      storeTool: store,
      updateSchemaFn: updateSchema,
      stepsDictWrap: stepsDictWrap,

      reactive_currentStep: currentStep,
      reactive_stepsDict: stepsDict,
      reactive_stepsDictWrap: stepsDictWrap,

      ioControl: dataMethods,
      updateProgressFn: updateProgress,
      saveStoreFn: saveStore,
    };

    const stepCtrl = new StepControl(appPack);

    appPack.stepCtrl = stepCtrl;

    const bEU = new BackEndUsage(appPack);


    const getReplacedToken = (idx) => {
      let tokenList = exampleWrap.example.material.tokenList;
      return tokenSelector.getReplacedToken(idx, tokenList);
      // return tokenList[idx]?.replaced ? tokenList[idx]?.to?.word : tokenList[idx].word;
    };
    const getOriginToken = (idx) => {
      let tokenList = exampleWrap.example.material.tokenList;
      return tokenSelector.getOriginToken(idx, tokenList);
      // return tokenList[idx].word;
    };


    return {
      //
      ...toRefs(exampleWrap),  // 提供 example
      // ...toRefs(data),
      alertBox,
      //
      ...toRefs(appData),
      ...dataMethods,
      ...ctrlMethods,
      //
      tokenSelector,
      selection,
      //
      theBackEnd,
      ...apiMethods,
      bEU,
      //
      // stepRecords,
      stepsDict,
      RootStep,
      currentStep,
      //
      stepCtrl,
      //
      stepsDictWrap,
      updateSchema,
      //
      alertBox,
      //
      theSaver,
      //
      getReplacedToken,
      getOriginToken,
      //
      fileInfo,
      //
      theApi,
      anotherAxios,
      //
      saveStore,
      updateProgress,
      //
    };
  },
};


const the_app = Vue_createApp(RootComponent);
const app = the_app.mount('#bodywrap');
window.app = app;
// the_app.config.globalProperties.$axios = axios;  // 用 app.theBackEnd 就可以调试了。

export default app;


