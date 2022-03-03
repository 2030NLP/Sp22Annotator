// import { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } from 'vue';
const { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } = Vue;


const APP_NAME = "Sp22-Anno";
const APP_VERSION = "22-0216-00";
const PROJ_DESC = "SpaCE2022";
const PROJ_PREFIX = "Sp22";

const RootComponent = {
  setup() {

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

    const selectionMethods = {
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
      example: {}
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
          time: timeString(),
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
        dataMethods.log("load from store");
      },
      onExport: async () => {
        if (!appData?.dataWrap?.dataItems?.length) {return;};
        await dataMethods.beforeSave();
        dataMethods.log("export to file");
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


        dataMethods.log("import from file");
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
            time: timeString(),
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
        if (!appData.dataWrap.dataItems.length) {return;};

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

        let flag=0;
        for (i = 0; i < exampleWrap.example.annotations.length; i++) {
           if((exampleWrap.example.annotations[i].mode=="multiSpans")&&(exampleWrap.example.annotations[i].label==data.label)){
               let flag1=0;
               for (j = 0; j < exampleWrap.example.annotations[i].tokenarrays.length; j++) {
                   for (k = 0; k < data.tokenarrays.length; k++) {
                        if(exampleWrap.example.annotations[i].tokenarrays[j].toString()==data.tokenarrays[k].toString()){
                            flag1=flag1+1;
                        }
                        for (t = 0; t < data.tokenarrays[k].length; t++) {
                            if((exampleWrap.example.annotations[i].tokenarrays[j].indexOf(data.tokenarrays[k][t]))!=-1){
                                flag=1;
                            }
                        }
                   }
                   if(flag1){
                       if((flag1==exampleWrap.example.annotations[i].tokenarrays.length)&&(flag1==data.tokenarrays.length)){
                            flag=2;
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

        if(flag==1){
            if(!confirm("与之前标注相比有部分重复，点击取消即重新选择，反之则点击确定。")){
                data.tokenarrays = [];
                return;
            }
        }

        if(flag==2){
              alert("与之前标注相比完全重复，请重新选择");
              data.tokenarrays = [];
              return;
        }

        let fn = (da)=>{
          return da;
        };
        await stepMethods.handleTemplate(ref, data, fn);
      },

    };


    const updateSteps = async () => {
      let response = await axios.request({
        url: "schema/steps.schema.json",
        method: 'get',
        headers: {'Catch-Cotrol': 'no-cache'},
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
