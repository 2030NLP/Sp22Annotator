
// import { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } from 'vue';
const { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } = Vue;


const APP_NAME = "Sp22-Anno";
const APP_VERSION = "22-0216-00";
const PROJ_DESC = "SpaCE2022";
const PROJ_PREFIX = "Sp22";


const API_BASE_DEV = "http://127.0.0.1:5000";
const API_BASE_PROD = "http://101.43.244.203";
const DEVELOPING = false;
const API_BASE = DEVELOPING ? API_BASE_DEV : API_BASE_PROD;


const sourceID_to_name = { "A01": { "genre": "中小学语文课本", "file": "人教版_课标教材初中语文原始语料.txt", "用户显示名称": "初中语文课本" }, "A02":{ "genre":"中小学语文课本", "file": "人教版_课标教材高中语文原始语料.txt", "用户显示名称": "高中语文课本" }, "A03":{ "genre":"中小学语文课本", "file": "人教版_课标教材小学语文原始语料.txt", "用户显示名称": "小学语文课本" }, "A04":{ "genre":"中小学语文课本", "file": "人教版_全日制普通高中语文原始语料.txt", "用户显示名称": "高中语文课本" }, "A05":{ "genre":"中小学语文课本", "file": "人教版_义务教育教材_3年_初中语文原始语料.txt", "用户显示名称": "初中语文课本" }, "A06":{ "genre":"中小学语文课本", "file": "人教版_义务教育教材_6年_小学语文原始语料.txt", "用户显示名称": "小学语文课本" }, "B01": { "genre": "体育训练人体动作", "file": "shentiyundongxunlian.txt", "用户显示名称": "身体运动训练" }, "B02":{ "genre":"体育训练人体动作", "file": "tushouxunlian.txt", "用户显示名称": "儿童徒手训练" }, "B03":{ "genre":"体育训练人体动作", "file": "yujia.txt", "用户显示名称": "瑜伽" }, "B04":{ "genre":"体育训练人体动作", "file": "qingshaoniantushou.txt", "用户显示名称": "青少年徒手训练" }, "B05":{ "genre":"体育训练人体动作", "file": "lashen131.txt", "用户显示名称": "儿童拉伸训练" }, "B06":{ "genre":"体育训练人体动作", "file": "lashen130.txt", "用户显示名称": "青少年拉伸训练" }, "C01": { "genre": "人民日报", "file": "rmrb_2020-2021.txt", "用户显示名称": "人民日报" }, "D01": { "genre": "文学", "file": "似水流年_王小波.txt", "用户显示名称": "人民日报" }, "D02": { "genre": "文学", "file": "洗澡_杨绛.txt", "用户显示名称": "文学" }, "D03":{ "genre":"文学", "file": "天狗.txt", "用户显示名称": "文学" }, "D04":{ "genre":"文学", "file": "北京北京.txt", "用户显示名称": "文学" }, "D05":{ "genre":"文学", "file": "草房子.txt", "用户显示名称": "文学" }, "D06":{ "genre":"文学", "file": "兄弟.txt", "用户显示名称": "文学" }, "E01":{ "genre":"地理百科全书", "file": "geography.txt", "用户显示名称": "地理百科全书" }, "F01":{ "genre":"交通事故判决书", "file": "上海_交通判决书.txt", "用户显示名称": "交通事故判决书" }, "F02":{ "genre":"交通事故判决书", "file": "北京_交通判决书.txt", "用户显示名称": "交通事故判决书" }, "G01":{ "genre":"语言学论文例句", "file": "wenxian.txt", "用户显示名称": "语言学论文例句" }};

const RootComponent = {
  setup() {

    const fileInfo = (originId) => {
      const fileId = originId.split("-")[0];
      return sourceID_to_name[fileId];
    };

    // ↓ 参看 js/components/BaseSaver.js
    const theSaver = BaseSaver();
    // ↑ 参看 js/components/BaseSaver.js

    const theAlert = reactive(BaseAlert());
    // ↓ 参看 js/components/TheReader.js
    const theReader = TheReader(theAlert.pushAlert);
    // ↑ 参看 js/components/TheReader.js

    onMounted(()=>{
      theAlert.lastIdx = 1;
      theAlert.alerts = [];
      theAlert.pushAlert(`您好！`, 'success', 3000);
    });


    const theClipboard = ref(null);


    const theApi = axios.create({
      baseURL: `${API_BASE}/api/`,
      timeout: 10000,
      headers: {'Catch-Cotrol': 'no-cache'},
    });



    onMounted(()=>{
      theClipboard.value = new ClipboardJS(".btn-copy-selection");
      theClipboard.value.on('success', function (e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
        theAlert.pushAlert(`成功拷贝文本【${e.text}】`, "success");
        e.clearSelection();
      });
      theClipboard.value.on('error', function (e) {
        // console.info('Action:', e.action);
        // console.info('Trigger:', e.trigger);
        theAlert.pushAlert(`拷贝失败！`, "danger");
      });
    });


    const selection = reactive({
      isSelecting: false,
      start: null,
      end: null,
      end: null,
      array: [],
      again: false,
      hasDown: false,
    });

    // ↓ 参看 js/components/TheSelector.js
    // const theSelector = TheSelector(exampleWrap, selection);
    // const selectionMethods = theSelector.selectionMethods;
    // ↑ 参看 js/components/TheSelector.js
    const back_new = {
      back_task: () => {
        theApi.get('/alltask/' + appData.ctrl.currentWorker)
          .then(function (response) {
            appData.ctrl.doneNum = response.data.annotated.length;
            appData.ctrl.totalNum = response.data.task.length;
            var data1 = response.data.task
            var data2 = [];
            for (var i in data1) {
              theApi.post('/task/' + data1[i], {
                'user_id': appData.ctrl.currentWorker
              })
                .then(function (response) {
                  if (response.data.err == '') {
                    data2.push(response.data.task.eId)
                  }
                })
            }
            exampleWrap.example3 = data2
          })
        // back_new.back_word1();
      },
      back_tasks: (id) => {
        if (id == '222') {
          var data1 = exampleWrap.example3
          for (var i in data1) {
            theApi.post('/annotation/1', {
              'user_id': appData.ctrl.currentWorker
            })
              .then(function (response) {
                // console.log(response.data)
                if (response.data.annotation.skipped || !response.data.annotation.skipped) {
                  back_new.back_work();
                }
              })
          }
        }

      },
      back_work: () => {
        theApi.get('/entry/3')
          .then(function (response) {
            let obj = JSON.stringify(response.data.entry.content);
            exampleWrap.example1.push(JSON.parse(obj));
          })
        theApi.post('/annotation/1', {
          'user_id': '1'
        })
          .then(function (response) {
            let obj = JSON.stringify(response.data.annotation.content);
            exampleWrap.example2.push(JSON.parse(obj));
          })
      },
      back_write: () => {
        back_new.back_word1();
      },
      back_word1: () => {
        data1 = exampleWrap.example1;
        var data2 = [];
        let newobj = {}
        Object.assign(newobj, exampleWrap.example1[0], exampleWrap.example2[0]);
        data2.push(newobj);
        exampleWrap.example = newobj;
        console.log(newobj)
        // for (var i in data1) {
        //   let newobj = {}
        //   Object.assign(newobj, exampleWrap.example1[i], exampleWrap.example2[i]);
        //   data2.push(newobj);
        //   exampleWrap.example = newobj;
        //   console.log(newobj)
        // }
        exampleWrap.example = newobj;
      },
      back_renew: () => {
        theApi.post('/init/', {
          'user_id': 'admin',
          'password': 'admin2022',
          'topic': '第⼀期'
        })
          .then(function (response) {
            console.log(response);
          })
        theApi.post('/newtask/', {
          'user_id': appData.ctrl.currentWorker,
          'password': appData.ctrl.currentWorkerSecret,
          'count': appData.ctrl.currentWorkerTarget,
          'topic': '第一期'
        })
          .then(function (response) {
            console.log(response);
          })
      }
    };

    const selectionMethods = {
      selectedReplacedText: () => {
        if (!selection?.array?.length) {return "";};
        const text = selection.array.map(idx=>getReplacedToken(idx)).join("");
        return text;
      },
      selectedOriginText: () => {
        if (!selection?.array?.length) {return "";};
        const text = selection.array.map(idx=>getOriginToken(idx)).join("");
        return text;
      },
      copySelection: () => {
        //
      },
      clearSelection: () => {
        if (!selection.array.length) {return;};
        Object.assign(selection, {
          isSelecting: false,
          start: null,
          end: null,
          end: null,
          array: [],
          again: false,
          hasDown: false,
        });
        for (let tkn of exampleWrap?.example?.material?.tokenList) {
          if (tkn._ctrl != null) {
            Object.assign(tkn._ctrl, {
              selecting: false,
              selected: false,
            })
          };
        };
      },
      onMouseDown:  (token, event) => {
        // console.log(['mouseDown', token.word]);
        //
        if (event.buttons == 2) {
          console.log("右键");
          return;
        };
        //
        if (selection.hasDown) {
          return;
        };
        //
        selection.hasDown = true;
        for (let tkn of exampleWrap?.example?.material?.tokenList) {
          tkn._ctrl = tkn._ctrl ?? {};
          tkn._ctrl.selected = false;
        };
        token._ctrl.selecting = true;
        //
        selection.isSelecting = true;
        selection.start = token.idx;
        selection.current = token.idx;
        selection.end = null;
      },
      onMouseEnter: (token) => {
        // console.log(['mouseEnter', token.word]);
        if (!selection.isSelecting) { return; };
        selection.current = token.idx;
        let [aa, bb] = [selection.start, selection.current];
        if (bb < aa) {
          [bb, aa] = [aa, bb];
        };
        let array = []
        for (let idx = aa; idx<=bb; idx++) {
          array.push(idx);
          for (let tkn of exampleWrap?.example?.material?.tokenList) {
            tkn._ctrl.selecting = (array.includes(tkn.idx));
          };
        };
      },
      onMouseOut:   (token) => {
        selection.current = null;
        // console.log(['mouseOut', token.word]);
      },
      onMouseUp:    (token) => {
        // console.log(['mouseUp', token.word]);
        //
        if (selection.start == null) {return;};
        //
        //
        selection.end = token.idx;
        let [aa, bb] = [selection.start, selection.end];
        if (bb < aa) {
          [bb, aa] = [aa, bb];
        };
        selection.isSelecting = false;
        selection.array = [];
        for (let idx = aa; idx<=bb; idx++) {
          selection.array.push(idx);
          for (let tkn of exampleWrap?.example?.material?.tokenList) {
            if (selection.array.includes(tkn.idx)) {
              // tkn._ctrl = tkn._ctrl ?? {};
              tkn._ctrl.selecting = false;
              tkn._ctrl.selected = true;
            }
          };
        };
        selection.hasDown = false;
        // console.log(selection.array);
      },
      onMouseDown_Old:  (token) => {
        // console.log(['mouseDown', token.word]);
        //
        if (selection.isSelecting) {
          selection.again = true;
          return;
        };
        //
        selection.again = false;
        for (let tkn of exampleWrap?.example?.material?.tokenList) {
          tkn._ctrl = tkn._ctrl ?? {};
          tkn._ctrl.selected = false;
        };
        token._ctrl.selecting = true;
        //
        selection.isSelecting = true;
        selection.start = token.idx;
        selection.current = token.idx;
        selection.end = null;
      },
      onMouseUp_Old:    (token) => {
        // console.log(['mouseUp', token.word]);
        //
        if (selection.start == null) {return;};
        //
        if (selection.start == token.idx) {
          if (!selection.again) {return;};
          selection.again = false;
        };
        //
        selection.end = token.idx;
        let [aa, bb] = [selection.start, selection.end];
        if (bb < aa) {
          [bb, aa] = [aa, bb];
        };
        selection.isSelecting = false;
        selection.array = [];
        for (let idx = aa; idx<=bb; idx++) {
          selection.array.push(idx);
          for (let tkn of exampleWrap?.example?.material?.tokenList) {
            if (selection.array.includes(tkn.idx)) {
              // tkn._ctrl = tkn._ctrl ?? {};
              tkn._ctrl.selecting = false;
              tkn._ctrl.selected = true;
            }
          };
        };
        // console.log(selection.array);
      },
    };



    const exampleWrap = reactive({
      example: {},
      example1: [],//entry表
      example2: [],//annotation表
      example3: []
    });

    const appData = reactive({
      fileWrapWrap: {
        fileWrap: {},
      },
      fileError: false,
      dataWrap: {
        dataItems: [],
      },
      tasks: [{id:"666",skipped:true},{id:"888",dropped:true},{id:"222",valid:true},{id:"333"},{id:"111"}],
      ctrl: {
        currentWorker: "",
        currentWorkerSecret: "",
        currentWorkerTarget: 600,
        currentPage: "setup",
        haveStore: false,
        doneNum: 60,
        totalNum: 600,
        donePct: "10%",
        currentIdx: 0,
        targetIdx: 0,
        showOrigin: false,
      },
    });

    onMounted(()=>{
      let storedVersion = store.get(`${APP_NAME}:version`);
      if (storedVersion == APP_VERSION) {
        appData.ctrl.haveStore = true;
      };
      let storedWorker = store.get(`${APP_NAME}:worker`);
      appData.ctrl.currentWorker = storedWorker;
    });

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

      onClose: async () => {},
      beforeSave: async () => {
      },
      saveStore: async () => {
        await dataMethods.beforeSave();
        store.set(`${APP_NAME}:dataWrap`, foolCopy(appData.dataWrap));
        store.set(`${APP_NAME}:version`, APP_VERSION);
        let worker = appData.ctrl.currentWorker;
        store.set(`${APP_NAME}:worker`, worker);
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
        dataMethods.saveStore();
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

        ctrlMethods.updateProgress();
        await ctrlMethods.goIdx(appData.dataWrap._ctrl.currentIdx);
      },

      ensureExampleStep: () => {
        // 保存当前步骤
        if (!('_ctrl' in exampleWrap.example)) {
          exampleWrap.example._ctrl = {};
        };
        exampleWrap.example._ctrl.currentStepRef = currentStep.ref;
        exampleWrap.example._ctrl.currentSchema = {
          name: stepsDictWrap.name ?? null,
          version: stepsDictWrap.version ?? null,
          using: stepsDictWrap.using ?? null,
        };
      },
      saveExample: () => {
        if (!appData.dataWrap.dataItems.length) {return;};
        dataMethods.ensureExampleStep();
        // 覆盖
        appData.dataWrap.dataItems[appData.ctrl.currentIdx] = foolCopy(exampleWrap.example);
      },
    };
    const ctrlMethods = {
      fineIdx: (idx) => {
        idx = Math.min(idx, appData.dataWrap.dataItems.length-1);
        idx = Math.max(idx, 0);
        return idx;
      },
      goIdx: async (idx) => {
        dataMethods.saveStore();
        await updateSteps();
        selectionMethods.clearSelection();

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
          await stepMethods.goRefStep(stepRef);
        };

        selectionMethods.clearSelection();
      },
      toogleShowOrigin: () => {
        appData.ctrl.showOrigin = !appData.ctrl.showOrigin;
        // console.debug(appData.ctrl.showOrigin);
      },
      updateProgress: () => {
        let endStep = stepsDictWrap?.[stepsDictWrap?.using]?.endStep;
        appData.ctrl.totalNum = appData.ctrl.currentWorkerTarget;
        appData.ctrl.doneNum = 60;  // TODO
        appData.ctrl.donePct = `${appData.ctrl.doneNum / appData.ctrl.totalNum * 100}%`;
      },
      // 0228 之前的旧版函数
      // __updateProgress: () => {
      //   let endStep = stepsDictWrap?.[stepsDictWrap?.using]?.endStep;
      //   appData.ctrl.totalNum = appData.dataWrap.dataItems.length;
      //   appData.ctrl.doneNum = appData.dataWrap.dataItems.filter(it=>{
      //     return it?._ctrl?.currentStepRef == endStep && endStep?.length;
      //   }).length;
      //   appData.ctrl.donePct = `${appData.ctrl.doneNum / appData.ctrl.totalNum * 100}%`;
      // },
    };



    // // ↓ 参看 js/components/TheSteps.js
    // const currentStep = reactive(RootStep);
    // const theSteps = TheSteps(appData.ctrl, currentStep);
    // const stepsDict = readonly(theSteps.stepsDict);
    // const stepRecords = reactive(theSteps.stepRecords);
    // const stepMethods = theSteps.stepMethods;
    // // ↑ 参看 js/components/TheSteps.js



    const stepsDictWrap = reactive({
      version: "00",
    });
    const stepsDict = reactive({});
    const RootStep = reactive({});
    const currentStep = reactive({});
    // console.debug(currentStep);

    const stepRecords = {list:[]};
    const stepMethods = {
      goStep: async (stepObj_, data) => {
        // await updateSteps();
        if (data!=null) {
          stepMethods.dealWithData(data, da=>da);
        };

        if (data) {
          // TODO
          // 在 exampleWrap?.example?._ctrl 中记录 这条语料是 dropped
          // 在 update 时，构造 post 参数时检查 _ctrl 有没有 dropped，并写到 post 参数里
          // 注意检查 _ctrl 的更新，避免影响其他 entry
          theApi.post('/update/', {
            "id": "2",
            "topic": "第一期",
            "task_id": "2",
            "user": "1",
            "content": {
              "annotations": [
                {
                  "label": "fine",
                  "desc": "这段话中的空间信息完全正常",
                  "idx": 0,
                  "mode": "selectValue",
                  "_schema": [
                    "SpaCE2022",
                    "220304v1",
                    "第1期"
                  ]
                }
              ],
              "_ctrl": {
                "currentStepRef": "end",
                "currentSchema": {
                  "name": "SpaCE2022",
                  "version": "220304v1",
                  "using": "第1期"
                }
              }
            },
            "dropped": false,
            "skipped": false,
            "valid": true
          })
            .then(function (response) {
              console.log(response);
            })
        };

        // 消除 stepObj 的引用关系
        let stepObj = {
          ref: stepObj_?.ref ?? null,
          name: stepObj_?.name ?? null,
          mode: stepObj_?.mode ?? null,
          props: foolCopy(stepObj_?.props ?? null),
        };
        appData.ctrl.showOrigin = stepObj?.props?.showOrigin ?? false;
        Object.assign(currentStep, stepObj);

        dataMethods.ensureExampleStep();
        dataMethods.saveExample();
        ctrlMethods.updateProgress();
        dataMethods.saveStore();
      },
      goRefStep: async (ref, data) => {
        let stepObj = foolCopy(stepsDict?.[ref] ?? null);
        await stepMethods.goStep(stepObj, data);
      },
      cancelStep: async (ref) => {
        await stepMethods.goRefStep(ref, null);  // 不要把 data 放进去，避免重复标记
        stepRecords.list = [];
        selectionMethods.clearSelection();
      },
      resetStep: async (ref) => {
        exampleWrap.example.annotations = [];
        stepMethods.cancelStep(ref);
      },

      dealWithData: (data, fn) => {
        // 按照 schema 补充必要的数据字段
        let idx = exampleWrap.example.annotations.length;
        data.idx = idx;
        data.mode = currentStep.mode;

        data = fn(data);

        data._schema = [
          stepsDictWrap.name ?? null,
          stepsDictWrap.version ?? null,
          stepsDictWrap.using ?? null,
        ];

        // 加入 annotations 清单
        exampleWrap.example.annotations.push(foolCopy(data));

        return data;
      },

      handleTemplate: async (ref, data, fn) => {
        // 这个函数是一个抽象出来的通用流程框架
        // 之前的 value 改成了 data

        stepMethods.dealWithData(data, fn);

        selectionMethods.clearSelection();
        await stepMethods.goRefStep(ref);  // 不要把 data 放进去，避免重复标记
      },

      handleChooseOrText: async (ref, data) => {
        // 这个函数就是之前的「goRefStepChoose」
        // 之前的 value 改成了 data

        let fn = (da)=>{
          da.on = selection.array;
          return da;
        };
        await stepMethods.handleTemplate(ref, data, fn);
      },

      handleWord: async (ref, data) => {
        let fn = (da)=>{
          da.source = selection.array[0];
          return da;
        };
        await stepMethods.handleTemplate(ref, data, fn);
      },

      handleAdd: async (ref, data) => {
        // TODO 这个函数还没写好，想用来试试替换法
        let tokenList = exampleWrap.example.material.tokenList;
        let fn = (da)=>{
          da.source = selection.array[0];
          da.targetText = da.side==1 ? `${da.target}${da.source}` : `${da.source}${da.target}`;

          if (da?._pattern?.length) {
            let face = da._pattern;
            for (let kk of ["source", "target", "targetText", "side"]) {
              face = face.replace(`<[%${kk}%]>`, da[kk]??" [?] ");
            };
            da._face = face;
          };

          return da;
        };
        await stepMethods.handleTemplate(ref, data, fn);
      },

      handleQita: async (ref, data) => {
        let fn = (da)=>{
          return da;
        };
        await stepMethods.handleTemplate(ref, data, fn);
      },

      handleMultiSpans: async (ref, data) => {
        let aa = data.tokenarrays.flat(Infinity);
        let should = (aa.length == Array.from(new Set(aa)).length);

        let flag = 0;
        for (i = 0; i < exampleWrap.example.annotations.length; i++) {
          if ((exampleWrap.example.annotations[i].mode == "multiSpans") && (exampleWrap.example.annotations[i].label == data.label)) {
            let flag1 = 0;
            for (j = 0; j < exampleWrap.example.annotations[i].tokenarrays.length; j++) {
              for (k = 0; k < data.tokenarrays.length; k++) {
                if (exampleWrap.example.annotations[i].tokenarrays[j].toString() == data.tokenarrays[k].toString()) {
                  flag1 = flag1 + 1;
                }
                for (t = 0; t < data.tokenarrays[k].length; t++) {
                  if ((exampleWrap.example.annotations[i].tokenarrays[j].indexOf(data.tokenarrays[k][t])) != -1) {
                    flag = 1;
                  }
                }
              }
              if (flag1) {
                if ((flag1 == exampleWrap.example.annotations[i].tokenarrays.length) && (flag1 == data.tokenarrays.length)) {
                  flag = 2;
                }
              }
            }
          }
        }

        if (!should) {
          alert("存在重复的片段，请重新选择");
          data.tokenarrays = [];
          return;
        };

        if (flag == 1) {
          if (!confirm("与之前标注相比有部分重复，点击取消即重新选择，反之则点击确定。")) {
            data.tokenarrays = [];
            return;
          }
        }

        if (flag == 2) {
          alert("与之前标注相比完全重复，请重新选择");
          data.tokenarrays = [];
          return;
        }

        let fn = (da) => {
          return da;
        };
        await stepMethods.handleTemplate(ref, data, fn);
      },

    };

    const anotherAxios = axios.create({
      headers: {'Catch-Cotrol': 'no-cache'},
    });

    const updateSteps = async () => {
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
      theAlert.pushAlert(`收到 schema（版本：${wrap.version}，规范：${wrap.using}）`, "warning");
      Object.assign(stepsDictWrap, wrap);
      Object.assign(stepsDict, stepsDictWrap?.[stepsDictWrap?.using]?.steps??null);
      Object.assign(RootStep, stepsDictWrap?.[stepsDictWrap?.using]?.steps?.[stepsDictWrap?.[stepsDictWrap?.using]?.startStep]??null);
      Object.assign(currentStep, RootStep);
    };

    onMounted(async ()=>{
      await updateSteps();
    });


    const getReplacedToken = (idx) => {
      let tokenList = exampleWrap.example.material.tokenList;
      return tokenList[idx]?.replaced ? tokenList[idx]?.to?.word : tokenList[idx].word;
    };
    const getOriginToken = (idx) => {
      let tokenList = exampleWrap.example.material.tokenList;
      return tokenList[idx].word;
    };


    return {
      //
      ...toRefs(exampleWrap),  // 提供 example
      // ...toRefs(data),
      theAlert,
      //
      ...toRefs(appData),
      ...dataMethods,
      ...ctrlMethods,
      //
      selection,
      ...selectionMethods,
      ...back_new,
      //
      stepRecords,
      stepsDict,
      RootStep,
      currentStep,
      ...stepMethods,
      //
      stepsDictWrap,
      updateSteps,
      //
      theAlert,
      //
      theSaver,
      //
      getReplacedToken,
      //
      fileInfo,
      //
      theApi,
      anotherAxios,
      //
      // formFiles,
      // getAnnoBtnClass,
    };
  },  // setup() end


  // TODO:
  // [ ] 1. 文件导入导出的调整
  // [ ] 2. stepsSchema还没完善好
  // [x] 3. example改成遍历的
  // [y] 4. 页码控件
  // [ ] 5. 本地存储标注进度，自动填入标注人姓名


};


const app = Vue.createApp(RootComponent);
const the_vue = app.mount('#bodywrap');
app.config.globalProperties.$axios = axios;
