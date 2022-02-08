// import { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } from 'vue';
const { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } = Vue;

const APP_VERSION = "22-0207-00";

const RootComponent = {
  setup() {


    // ↓ 参看 js/components/BaseSaver.js
    const theSaver = BaseSaver();
    // ↑ 参看 js/components/BaseSaver.js

    // ↓ 参看 js/components/TheReader.js
    const theReader = TheReader();
    // ↑ 参看 js/components/TheReader.js


    const exampleWrap = reactive({
      example: {
        "dbID": "1-77-34",
        "batchID": 1,
        "fID": 77,
        "srcID": 34,
        "innerID": 3,
        //
        "isReplacedItem": true,
        "rpID": "1-77-34-5",
        "rpIdx": 5,
        //
        "material": {
          "content": "桌上有碗汤",
          "tokenList": [
            {
              "word": "桌",
              "idx": 0,
              "pos": "n",
              "autoEntity": true,
              "autoSpatial": false
            },
            {
              "word": "上",
              "idx": 1,
              "pos": "f",
              "autoEntity": false,
              "autoSpatial": true,
              "replaced": true,
              "to": {
                "word": "下",
                "pos": "f",
                "class": "上下左右类",
              },
            },
            {
              "word": "有",
              "idx": 2,
              "pos": "v",
              "autoEntity": false,
              "autoSpatial": false
            },
            {
              "word": "碗",
              "idx": 3,
              "pos": "q",
              "autoEntity": false,
              "autoSpatial": false,
              "replaced": true,
              "to": {
                "word": "杯",
                "pos": "q",
                "class": "容器量词",
              },
            },
            {
              "word": "米饭",
              "idx": 4,
              "pos": "n",
              "autoEntity": true,
              "autoSpatial": false,
              "replaced": true,
              "to": {
                "word": "钢铁",
                "pos": "n",
                "class": "物质名词",
              },
            },
            {
              "word": "。",
              "idx": 5,
              "pos": "w",
              "autoEntity": false,
              "autoSpatial": false
            }
          ]
        },
        //
        "annotations": [],
        //
        "_ctrl": {
          "schema": [],  // 当前正在使用的步骤方案 [name, version, using]
          "step": "",  // 当前步骤
        },
      }
    });


    const appData = reactive({
      fileWrapWrap: {
        fileWrap: {},
      },
      fileError: false,
      meta: {
        currentWorker: "",
        handleLogs: [],
      },
      dataWrap: {
        dataItems: [],
      },
      ctrl: {
        doneNum: 0,
        totalNum: 0,
        donePct: "0%",
        currentIdx: 0,
        showOrigin: false,
      },
    });

    const dataMethods = {
      onImport: async () => {
        let fileItem = document.forms["file-form"]["file-input"].files[0];
        console.debug(fileItem);


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
        Object.assign(appData.fileWrapWrap, {fileWrap: fileWrap});
        console.debug(appData.fileWrapWrap.fileWrap);

        dataMethods.readData();

      },
      readData: async () => {
        let fileWrap = appData.fileWrapWrap.fileWrap;
        let obj = JSON.parse(fileWrap.content);
        // fileWrap.obj = obj;

        if (obj?.desc != "SpaCE2022") {
          appData.meta.fileError = true;
          return;
        };
        appData.meta.fileError = false;

        // TODO: 未来如果版本有大改，可能要针对 _appVersion 做某些判断和处理。

        // ↓ 读取过往操作记录
        Object.assign(appData.meta, {handleLogs: obj.handleLogs});
        // appData.meta.handleLogs.push({});

        // ↓ 读取数据条目
        Object.assign(appData.dataWrap, {dataItems: obj.dataItems});
        ctrlMethods.updateProgress();

      },
    };
    const ctrlMethods = {
      toogleShowOrigin: () => {
        appData.ctrl.showOrigin = !appData.ctrl.showOrigin;
        // console.debug(appData.ctrl.showOrigin);
      },
      updateProgress: () => {
        appData.ctrl.totalNum = appData.dataWrap.dataItems.length;
        appData.ctrl.doneNum = appData.dataWrap.dataItems.filter(it=>it?._ctrl?.done).length;
        appData.ctrl.donePct = `${appData.ctrl.doneNum / appData.ctrl.totalNum * 100}%`;
      },
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

    const updateSteps = async () => {
      let response = await axios.request({
        url: "schema/steps.schema.json",
        method: 'post',
        headers: {'Catch-Cotrol': 'no-cache'},
      });
      let wrap = (response.data);
      console.debug(wrap);
      if (stepsDictWrap.name == wrap.name &&
        stepsDictWrap.version == wrap.version &&
        stepsDictWrap.using == wrap.using) {
        return;
      };
      Object.assign(stepsDictWrap, wrap);
      Object.assign(stepsDict, stepsDictWrap?.[stepsDictWrap?.using]?.steps??null);
      Object.assign(RootStep, stepsDictWrap?.[stepsDictWrap?.using]?.steps?.[stepsDictWrap?.[stepsDictWrap?.using]?.startStep]??null);
      Object.assign(currentStep, RootStep);
    };

    onMounted(async ()=>{
      await updateSteps();
    });


    const stepRecords = {list:[]};
    const stepMethods = {
      goStep: (stepObj_, data) => {
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
      },
      goRefStep: (ref, data) => {
        let stepObj = foolCopy(stepsDict?.[ref] ?? null);
        stepMethods.goStep(stepObj, data);
      },
      cancelStep: (ref) => {
        stepMethods.goRefStep(ref, null);  // 不要把 data 放进去，避免重复标记
        stepRecords.list = [];
        selectionMethods.clearSelection();
      },
      resetStep: (ref) => {
        stepMethods.cancelStep(ref);
        exampleWrap.example.annotations = [];
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

      handleTemplate: (ref, data, fn) => {
        // 这个函数是一个抽象出来的通用流程框架
        // 之前的 value 改成了 data

        stepMethods.dealWithData(data, fn);

        selectionMethods.clearSelection();
        stepMethods.goRefStep(ref);  // 不要把 data 放进去，避免重复标记
      },

      handleChooseOrText: (ref, data) => {
        // 这个函数就是之前的「goRefStepChoose」
        // 之前的 value 改成了 data

        let fn = (da)=>{
          da.on = selection.array;
          return da;
        };
        stepMethods.handleTemplate(ref, data, fn);
      },

      handleWord: (ref, data) => {
        let fn = (da)=>{
          da.source = selection.array[0];
          return da;
        };
        stepMethods.handleTemplate(ref, data, fn);
      },

      handleQita: (ref, data) => {
        let fn = (da)=>{
          return da;
        };
        stepMethods.handleTemplate(ref, data, fn);
      },

      handleMultiSpans: (ref, data) => {
        let fn = (da)=>{
          return da;
        };
        stepMethods.handleTemplate(ref, data, fn);
      },

    };



    // ↓ 参看 js/components/TheSelector.js
    const theSelector = TheSelector(exampleWrap.example.material.tokenList);
    const selection = reactive(theSelector.selection);
    const selectionMethods = theSelector.selectionMethods;
    // ↑ 参看 js/components/TheSelector.js





    return {
      //
      ...toRefs(exampleWrap),
      // ...toRefs(data),
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
      theSaver,
      // getAnnoBtnClass,
    };
  },  // setup() end


  // TODO:
  // 1. 文件导入导出的调整
  // 2. stepsSchema还没完善好
  // 3. example改成遍历的
  // 4. 控件逻辑
  // 5. 本地存储标注进度，自动填入标注人姓名


};


const app = Vue.createApp(RootComponent);
const the_vue = app.mount('#bodywrap');
