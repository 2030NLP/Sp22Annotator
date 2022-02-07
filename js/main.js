// import { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } from 'vue';
const { reactive, readonly, ref, toRef, toRefs, computed, onMounted, onUpdated } = Vue;

const APP_VERSION = "22-0207-00";

const RootComponent = {
  setup() {

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
        "replacedItemIdx": 5,
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
        "annotations": [
          {
            "idx": 0,
            "label": "搭配不当",
            "mode": "multiSpans",
            "tokenarrays": [],  // [ 杯, 铁 ]
          },
          {
            "idx": 1,
            "toSolve": 0,  // 针对哪一个标注内容进行的进一步改正
            "label": "修改",
            "mode": "modify",
            "source": 3,  // 杯
            "target": "块",
          },
        ]
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
      resetStep: (ref) => {
        stepMethods.cancelStep(ref);
        exampleWrap.example.annotations = [];
      },
      cancelStep: (ref) => {
        let stepObj = JSON.parse(JSON.stringify(stepsDict?.[ref]??null));
        stepMethods.goStep(stepObj);
        stepRecords.list = [];
        selectionMethods.clearSelection();
      },
      goStep: (stepObj_, data) => {
        // stepRecords.list.push(data);
        // data 其实没用了

        let stepObj = {
          ref: stepObj_?.ref ?? null,
          name: stepObj_?.name ?? null,
          mode: stepObj_?.mode ?? null,
          props: JSON.parse(JSON.stringify(stepObj_?.props ?? null)),
        };
        appData.ctrl.showOrigin = stepObj?.props?.showOrigin ?? false;
        Object.assign(currentStep, stepObj);
      },
      goRefStep: (ref, data) => {
        // data 其实没用了

        let stepObj = stepsDict[ref];
        stepMethods.goStep(stepObj, data);
      },

      handleTemplate: (ref, data, fn) => {
        // 这个函数是一个抽象出来的通用流程框架
        // 之前的 value 改成了 data

        // 按照 schema 补充必要的数据字段
        let idx = exampleWrap.example.annotations.length;
        data.idx = idx;
        data.mode = currentStep.mode;

        data = fn(data);

        data._schema = {
          name: stepsDictWrap.name ?? null,
          version: stepsDictWrap.version ?? null,
          using: stepsDictWrap.using ?? null,
        };

        // 加入 annotations 清单
        exampleWrap.example.annotations.push(JSON.parse(JSON.stringify(data)));

        selectionMethods.clearSelection();
        stepMethods.goRefStep(ref, data);  // data 其实没用了
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

      handleMultiSpans: (ref, data) => {
        let fn = (da)=>{
          return da;
        };
        stepMethods.handleTemplate(ref, data, fn);
      },



      readdata1: (ref, value) => {
        var file = document.getElementById("my_file").files[0];
        var reader=new FileReader();
        reader.readAsText(file);
        reader.onload = function (e)
        {
          var fileText = e.target.result;
          console.log(fileText);
        }
      },
      onExport1:()=>{
        let jn = JSON.stringify(exampleWrap.example, null, 2);
        let filename =exampleWrap.example.dbID+"注结果";
        var file = new File([jn], (`${filename}`), {
            type: "text/plain; charset=utf-8"
          });
        saveAs(file);
      },
      goRefStep1: (ref, value) => {
        // 搭配不当
        exampleWrap.example.annotations[0].tokenarrays.push(value.tokenarrays);
        console.log(exampleWrap.example.annotations[0].tokenarrays);

        stepMethods.goRefStep(ref, value);

        value.tokenarrays=[];
        console.log(value)
      },
      goRefStep2: (ref, value) => {
        // 常识
        var data1={}
        data1[data.modetype]=value.tokenarrays;
        console.log(data1)
        exampleWrap.example.annotations[3].withText.push(data1);
        console.log(exampleWrap.example.annotations[3].withText);

        stepMethods.goRefStep(ref, value);

        value.tokenarrays=[];
        data.modetype="常识1";
      },
      goRefStep3: (ref, value) => {
        // add
        exampleWrap.example.annotations[4].source.push(value.tokenarrays);
        exampleWrap.example.annotations[4].target.push(data.add_target);

        stepMethods.goRefStep(ref, value);

        value.tokenarrays=[];
        data.add_target="";
      },
      goRefStep4: (ref, value) => {
        // delete
        exampleWrap.example.annotations[5].source.push(value.tokenarrays);

        stepMethods.goRefStep(ref, value);

        value.tokenarrays=[];
      },
      goRefStep5: (ref, value) => {
        // modify
        exampleWrap.example.annotations[6].source.push(value.tokenarrays);
        exampleWrap.example.annotations[6].target.push(data.modify_target);

        stepMethods.goRefStep(ref, value);

        value.tokenarrays=[];
        data.modify_target="";
      },
      opt2:()=>{
        let obj1 = document.getElementById("pid1");
        data.indext1 = obj1.options[obj1.selectedIndex].value;
        if(data.indext1==0){
          data.modetype="常识1";
        }else{
          data.modetype="常识2";
        }

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
      // getAnnoBtnClass,
    };
  },  // setup() end





  ____methods: {

    submit: function(changes_obj) {
      let self = this;
      changes_obj.formFilled = true;
      changes_obj.finished = true;
    },
    mouse1: function(changes_obj){
      if (changes_obj.judgeCorrection == 1 && changes_obj.judgeType==-1){
        if (this.index2==0){
          this.word1=''
          let text = window.getSelection().toString();
          if (this.index1==0){
            changes_obj.whyNot.text_1_1=text
          }
          else if (this.index1==1){
            changes_obj.whyNot.text_2_1=text
          }
          else if (this.index1==2){
            changes_obj.whyNot.text_4_1=text
          }
          else{
            changes_obj.whyNot.text_5_1=text
          }
          this.index2=1
        }
        else{
          this.word2=''
          let text = window.getSelection().toString();
          if (this.index1==0){
            changes_obj.whyNot.text_1_2=text
          }
          else if (this.index1==1){
            changes_obj.whyNot.text_2_2=text
          }
          else if (this.index1==2){
            changes_obj.whyNot.text_4_2=text
          }
          else{
            changes_obj.whyNot.text_5_2=text
          }
          this.index2=0
        }
      }
    },
    opt1(){
      let obj1 = document.getElementById("pid1");
      this.index1 = obj1.options[obj1.selectedIndex].value;
    },
    // onImport__: function() {
    //   let self = this;
    //   let fileList = document.forms["file-form"]["file-input"].files;
    //   // console.log(fileList);
    //   let file_meta_list = [];
    //   let idx = 0;
    //   for (let file of fileList) {
    //     file_meta_list.push({
    //       "idx": idx,
    //       "name": file.name,
    //       "file": file,
    //       "url": URL.createObjectURL(file),
    //       // "content": "",
    //     });
    //     idx += 1;
    //   }
    //   self.file_meta_list = file_meta_list;
    //   self.current_file_meta = file_meta_list[idx - 1];
    //   // console.log(self.current_file_meta);
    //   self.readData();
    // },

    onExport: function() {
      let self = this;
      if (!this.worker) {
        alert("请填写姓名！")
      } else {
        let jn = JSON.stringify(self.makeExport(), null, 2);
        let filename = self.makeFileName(self.current_file_meta.name);
        var file = new File([jn], (`${filename}`), {
          type: "text/plain; charset=utf-8"
        });
        saveAs(file);
      }
    },

    makeExport: function() {
      let self = this;

      let product = {};

      product.documentId = self.documentId;
      product.desc = self.desc;
      product.apiVersion = self.apiVersion;

      for (let dataItem of self.data) {
        // 删掉句子，压缩文件大小
        for (let changes_obj of dataItem.changesObjects) {
          changes_obj.sentence = [];
        };
        // 添加工作人员，并去除人员列表中的空字符串
        if (dataItem.workers.indexOf(self.worker) == -1 && self.worker.trim() != "") {
          dataItem.workers.push(self.worker.trim());
        };
        dataItem.workers = dataItem.workers.filter(i => i != "");
      };
      product.data = self.data;

      if (true) {
        self.meta.modifiedTime = self.timeString();
        // 添加工作人员，并去除人员列表中的空字符串
        if (self.meta.workers.indexOf(self.worker) == -1 && self.worker.trim() != "") {
          self.meta.workers.push(self.worker.trim());
        };
        self.meta.workers = self.meta.workers.filter(i => i != "");
      };
      product.meta = self.meta;

      return product;
    },

    timeString: function() {
      let self = this;
      let the_date = new Date();
      let str = `${(''+the_date.getFullYear()).slice(2,4)}${(''+(the_date.getMonth()+1)).length==1?'0':''}${the_date.getMonth()+1}${(''+the_date.getDate()).length==1?'0':''}${the_date.getDate()}-${(''+the_date.getHours()).length==1?'0':''}${the_date.getHours()}${(''+the_date.getMinutes()).length==1?'0':''}${the_date.getMinutes()}${(''+the_date.getSeconds()).length==1?'0':''}${the_date.getSeconds()}`;
      return str;
    },

    makeFileName: function(name) {
      let self = this;
      let time_str = self.timeString();
      let the_reg = /(--\d{6}-\d{6})?(\.[a-zA-Z0-9]+)$/;
      //let filename = name.replace(the_reg, `--${time_str}`);
      let filename = `空间关系理解-${self.documentId}-${self.meta.stage==1?"[标注]":"[出题]"}-${self.worker}--${time_str}.json`;
      //filename = `${filename}.json`
      return filename;
    },

    readData: function() {
      let self = this;
      let reader = new FileReader();
      reader.readAsText(self.current_file_meta.file, "utf-8");
      reader.onload = function(evt) {
        let result = JSON.parse(this.result);
        let data = [];

        if ('desc' in result && result.desc == '空间关系认知语料标注') {
          data = result.data || [];
          self.documentId = result.documentId || -1;
          // self.apiVersion = result.apiVersion || self.apiVersion;
          self.meta = result.meta || {
            workers: [],
            createdTime: self.timeString(),
            modifiedTime: self.timeString(),
            stage: 1,
          };
        } else if (result.length && 'originalSentence' in result[0]) {
          data = result;
        };
        self.data = self.repairData(data);
      }
    },

    readDataFromLocalStorage: function() {
      let self = this;
      self.data = JSON.parse(window.localStorage['data']);
    },

    repairData: function(data) {
      let self = this;
      let repaired_data = [];
      let count = 0;
      for (let dataItem of data) {
        let repaired_item = {};
        //
        // repaired_item.substitutableCount = dataItem.substitutableCount || -1;
        //
        self.documentId = typeof(data.documentId) != 'undefined' ? data.documentId : dataItem.documentId;
        // self.documentId = dataItem.documentId;
        repaired_item.documentId = dataItem.documentId;
        repaired_item.batchId = typeof(dataItem.batchId) != 'undefined' ? dataItem.batchId : -1;
        repaired_item.itemId = typeof(dataItem.itemId) != 'undefined' ? dataItem.itemId : -1;
        repaired_item.foundFre = typeof(dataItem.foundFre) != 'undefined' ? dataItem.foundFre : 0;
        repaired_item.originalError = dataItem.originalError || false;
        repaired_item.showSentences = dataItem.showSentences || false;
        repaired_item.showSentences2 = dataItem.showSentences2 || false;
        repaired_item.finished = dataItem.finished || false;
        //
        repaired_item.feedback1 = typeof(dataItem.feedback1) != 'undefined' ? dataItem.feedback1 : "";
        //
        repaired_item.isCorrecting = typeof(dataItem.isCorrecting) != 'undefined' ? dataItem.isCorrecting : false;
        //
        repaired_item.droppedIdxs = [];
        repaired_item.sentencesLength = 0;
        repaired_item.branchLength = 0;
        //功能2
        repaired_item.newBranchLength = 0; //替换句里存在"成立，语义变化大"的被替换词个数
        repaired_item.newSentencesLength = 0; //两种"成立"的替换句总数
        //功能2
        repaired_item.clusters = dataItem.clusters || [];
        //
        repaired_item.workers = dataItem.workers || [];
        repaired_item.originalSentence = dataItem.originalSentence || [];
        for (let frag of repaired_item.originalSentence) {
          if (frag.substitutable) {
            frag.notSpatial = typeof(frag.notSpatial) != 'undefined' ? frag.notSpatial : false;
          } else {
            frag.notSpatial = typeof(frag.notSpatial) != 'undefined' ? frag.notSpatial : true;
          };
        }

        let changesObjects = dataItem.changesObjects || dataItem.substitutedSentences || [];
        let repaired_changes_objs = [];

        for (let changes_obj of changesObjects) {
          let repaired_changes_obj = {};
          //
          repaired_changes_obj.docIdx = count; //替换句在文档中的编号
          count += 1;
          //
          repaired_changes_obj.changes = changes_obj.changes || changes_obj.substitutedWords || [];
          repaired_changes_obj.changed_idxs = changes_obj.changed_idxs || [];
          repaired_changes_obj.clusterId = typeof(changes_obj.clusterId) != 'undefined' ? changes_obj.clusterId : -1;
          //
          repaired_changes_obj.finished = changes_obj.finished || false;
          repaired_changes_obj.judgeCorrection = typeof(changes_obj.judgeCorrection) != 'undefined' ? changes_obj.judgeCorrection : -1; // {'-1':'未判断', '0':'难以判断', '1':'不成立', 2:'成立', 4:'勉强成立'}
          repaired_changes_obj.judgeType = typeof(changes_obj.judgeType) != 'undefined' ? changes_obj.judgeType : -1; // {'-1':'未判断', '0':'难以判断', 1:'不成立，搭配不当', 2:'不成立，意义冲突', 3:'成立，语义变化不大', 4:'成立，语义变化大', 6:'不成立，详述', 7:'勉强成立，详述'}
          //
          repaired_changes_obj.choices = changes_obj.choices || [{
            content: "材料语义错误"
          }, {
            content: "难以判断"
          }];
          repaired_changes_obj.choicesString = changes_obj.choicesString || `["材料语义错误","难以判断"]`;
          repaired_changes_obj.choicesMade = typeof(changes_obj.choicesMade) != 'undefined' ? changes_obj.choicesMade : -1;
          //
          // repaired_changes_obj.localID = changes_obj.localID || -1;
          //
          repaired_changes_obj.whyNot = changes_obj.whyNot || {
            isDaPeiBuDang: false,
            isYuYiChongTu: false,
            isQiTa: false,
            isChangShiError: false,
            isYuJingError: false,
            text_1_1: '',
            text_1_2: '',
            text_2_1: '',
            text_2_2: '',
            text_3: '',
            text_4_1: '',
            text_4_2: '',
            text_5_1: '',
            text_5_2: ''
          };
          repaired_changes_obj.explanation = typeof(changes_obj.explanation) != 'undefined' ? changes_obj.explanation : "";
          repaired_changes_obj.formFilled = typeof(changes_obj.formFilled) != 'undefined' ? changes_obj.formFilled : false;
          //
          repaired_changes_objs.push(repaired_changes_obj);
        };
        repaired_item.changesObjects = repaired_changes_objs;

        self.updateSpatial(repaired_item);
        self.updateSentences(repaired_item);

        repaired_data.push(repaired_item);
      };
      return repaired_data;
    },

    genTmpCluster: function(changesObject, dataItem) {
      // 初始化cluster信息
      let self = this;
      let tmp_cluster = {
        id: -1,
        dropped: changesObject.dropped,
        neglect: true,
        sentenceNum: 0,
        changed_idxs: changesObject.changed_idxs,
        changed: [],
        question: "",
        originObject: {
          choices: [{
            content: "材料语义错误",
            isCorrect: false
          }, {
            content: "难以判断",
            isCorrect: false
          }],
          choicesString: `["材料语义错误","难以判断"]`,
          choicesMade: -1,
        },
      };
      for (let change of changesObject.changes) { // 添加被替换词信息
        tmp_cluster.changed.push({
          idx: change.idx,
          from: dataItem.originalSentence[+change.idx].word,
        });
      };
      // console.log(tmp_cluster);
      return tmp_cluster;
    },
    showSign: function(dataItem, cluster) {
      let self = this;
      let cnt = 0;

      for (let changes_obj of dataItem.changesObjects) {
        if (changes_obj.clusterId == cluster.id && changes_obj.judgeType == 4) {
          cnt += 1;
        }
      };
      //cluster.Count = cnt;
      if (cnt > 0)
        return true;
      return false;
    },
    makeClusters: function(dataItem) {
      //先对changesObjects中的每个替换词（未被drop）生成一个cluster，然后压缩clusters
      let self = this;
      //
      let oldClusters = dataItem.clusters;
      //
      // 重新生成 changed_idxs
      // 重新判断 changes_obj 是否被 drop
      let tmp_clusters = [];
      for (let changes_obj of dataItem.changesObjects) {
        let changed_idxs = [];
        changes_obj.dropped = false;
        for (let change of changes_obj.changes) {
          change.dropped = false;
          //indexOf()如果未找到则返回-1，“+”可将后面的字符串转换成数字值
          if (dataItem.droppedIdxs.indexOf(+change.idx) > -1) { //在drop列表中找到idx
            change.dropped = true;
            changes_obj.dropped = true;
          };
          changed_idxs.push(+change.idx);
        };
        changes_obj.changed_idxs = changed_idxs;
        //
        if (!changes_obj.dropped) { //对每个替换词都生成cluster（有重复，需要去重）
          let tmp_cluster = self.genTmpCluster(changes_obj, dataItem);
          tmp_clusters.push(tmp_cluster);
        };
      };
      //
      //
      // let example_final_cluster = {
      //     id: 6,
      //     dropped: false, question: "选哪个？",
      //     changed: [{idx: 13, from: "来"}, {idx: 25, from: "上面"}], changed_idxs: [13, 25],
      //     originObject: {
      //         choices: [{content:"别选这个",isCorrect: false}, {content:"选这个啦",isCorrect: true},
      //                   {content:"材料语义错误",isCorrect: false}, {content:"难以判断",isCorrect: false}],
      //         choicesString: `["别选这个","选这个啦","材料语义错误","难以判断"]`, choicesMade: -1,
      //     },
      // };
      //
      //
      // 把以前的数据写进来
      let tmp2_clusters = [];
      for (let tmp_cluster of tmp_clusters) {
        for (let oldCluster of oldClusters) {
          if (JSON.stringify(tmp_cluster.changed) == JSON.stringify(oldCluster.changed)) {
            let ccc = JSON.parse(JSON.stringify(oldCluster));
            ccc.id = -1;
            tmp2_clusters.push(ccc);
            tmp_cluster.used = true;
          };
        };
        // };
        // for (let tmp_cluster of tmp_clusters) {
        if (!tmp_cluster.used) {
          let ccc = JSON.parse(JSON.stringify(tmp_cluster));
          ccc.id = -1;
          tmp2_clusters.push(ccc);
        };
      };
      //
      // 重制 clusters 的序号
      //
      let tmp_json_clusters = [];
      for (let tmp2_cluster of tmp2_clusters) {
        // console.log([tmp2_cluster.question]);
        let it = JSON.stringify(tmp2_cluster);
        tmp_json_clusters.push(it);
        // console.log([tmp2_cluster.question, it]);
      };
      // console.log(['bfr', ...tmp_json_clusters]);
      tmp_json_clusters = [...new Set(tmp_json_clusters)]; // 去重
      // console.log(['aft', ...tmp_json_clusters]);
      let clusters = [];
      for (let id in tmp_json_clusters) {
        clusters.push(JSON.parse(tmp_json_clusters[id]));
        clusters[id].id = id;
        // console.log(clusters[id]);
      };
      // console.log(clusters);
      dataItem.clusters = clusters;
      dataItem.branchLength = clusters.length;
      //
      //使 changes_obj 与 clusters 对应
      for (let changes_obj of dataItem.changesObjects) {
        for (let cluster of dataItem.clusters) {
          if (JSON.stringify(cluster.changed_idxs) == JSON.stringify(changes_obj.changed_idxs)) {
            changes_obj.clusterId = cluster.id;
          };
        };
      };
      //
      //
    },

    updateSentences: function(dataItem) {
      let self = this;
      //
      self.makeClusters(dataItem);
      //
      // 重新生成 changes_obj 对应的 sentence
      // 顺便计算句子数量
      dataItem.sentencesLength = 0;
      for (let changes_obj of dataItem.changesObjects) {
        changes_obj.sentence = [];
        if (!changes_obj.dropped) { //如果替换词未被drop
          // changes_obj.localID = dataItem.sentencesLength;
          dataItem.sentencesLength += 1;
          self.makeSentence(changes_obj, dataItem);
        };
      };
      //
    },

    makeSentence: function(changes_obj, dataItem) {
      let self = this;
      //
      let sentence = [];
      let origin = dataItem.originalSentence;
      for (let idx in origin) {
        let frag = origin[idx];
        let thing = {
          POSTag: frag.POSTag,
          isEntity: frag.isEntity,
          substitutable: (frag.substitutable && !frag.notSpatial),
          notSpatial: frag.notSpatial,
        };
        let idy = changes_obj.changed_idxs.indexOf(+idx);
        let change = changes_obj.changes[+idy];
        if (idy > -1 && !change.dropped) {
          thing.word = change.to;
          thing.word_origin = frag.word;
          thing.changed = true;
          thing.bert = change.bert || false;
        } else {
          thing.word = frag.word;
          thing.word_origin = null;
          thing.changed = false;
          thing.bert = false;
        };
        sentence.push(thing);
      };
      changes_obj.sentence = sentence;
    },

    updateSpatial: function(dataItem) {
      //更新每个句子drop掉的空间方位词在句子中的索引
      let self = this;
      dataItem.droppedIdxs = [];
      let frags = dataItem.originalSentence;
      for (let idx in dataItem.originalSentence) {
        if (frags[idx].substitutable && frags[idx].notSpatial) {
          dataItem.droppedIdxs.push(+idx);
        };
      };
      // self.updateSentences(dataItem);
    },

    changeSpatial: function(frag, dataItem) {
      let self = this;
      if (frag.substitutable) {
        frag.notSpatial = !frag.notSpatial
      };
      dataItem.showSentences = false;
      self.updateSpatial(dataItem);
      self.updateSentences(dataItem);
    },

    judge: function(changes_obj, xx) {
      let self = this;
      // 点击保存的时候
      if ((xx[0] == 1 && xx[1] == 6) || xx[0] == 4 && xx[1] == 7) {
        if (!((changes_obj.whyNot.text_1_1 && changes_obj.whyNot.text_1_2) || (changes_obj.whyNot.text_2_1 && changes_obj.whyNot.text_2_2) || (changes_obj.whyNot.text_3) || (changes_obj.whyNot.text_4_1 && changes_obj.whyNot.text_4_2) || (changes_obj.whyNot.text_5_1 && changes_obj.whyNot.text_5_2))) {
          alert('请填写原因');
        } else {
          changes_obj.judgeCorrection = xx[0];
          changes_obj.judgeType = xx[1];
        }
      } else {
        changes_obj.judgeCorrection = xx[0];
        changes_obj.judgeType = xx[1];
      }

      if (xx[0] == 1 && (xx[1] == 1 || xx[1] == 2)) {

      } else if (xx[0] != -1 && xx[1] != -1) {
        changes_obj.finished = true;
      } else if (xx[0] == -1 && xx[1] == -1) {
        changes_obj.finished = false;
        changes_obj.explanation = "";
        changes_obj.formFilled = false;
        changes_obj.whyNot = {
          isDaPeiBuDang: false,
          isYuYiChongTu: false,
          isQiTa: false,
          isChangShiError: false,
          isYuJingError: false,
          text_1_1: '',
          text_1_2: '',
          text_2_1: '',
          text_2_2: '',
          text_3: '',
          text_4_1: '',
          text_4_2: '',
          text_5_1: '',
          text_5_2: ''
        };
      };
      if (window.localStorage) {
        window.localStorage['data'] = JSON.stringify(self.data);
        window.localStorage['documentId'] = self.documentId;
      }
    },
    judge_2: function(changes_obj) {
      let self = this;
      if (changes_obj.judgeCorrection == 1) {
        self.judge(changes_obj, [1, 6]);
      } else if (changes_obj.judgeCorrection == 4) {
        self.judge(changes_obj, [4, 7]);
      };
    },

    makeChoices: function(changes_obj) {
      let self = this;
      let choice_contents = [];
      try {
        choice_contents = JSON.parse(changes_obj.choicesString);
        changes_obj.choicesMade = 1;
      } catch (eee) {
        changes_obj.choicesString += `【数据格式错误（${eee}）！】`;
        console.log(`【数据格式错误（${eee}）！】`);
        changes_obj.choicesMade = 0;
      } finally {
        changes_obj.choices = [{
          content: "材料语义错误",
          isCorrect: false
        }, {
          content: "难以判断",
          isCorrect: false
        }];
        for (choice_content of choice_contents) {
          if (choice_content != "难以判断" && choice_content != "材料语义错误")
            changes_obj.choices.push({
              content: choice_content,
              isCorrect: false,
            });
        };
      };

    },

    makeCorrect: function(answer, changes_obj) {
      let self = this;
      for (choice of changes_obj.choices) {
        choice.isCorrect = (choice.content == answer);
        // console.log([choice.content,answer,choice.isCorrect]);
      };
    },

    updateStage2Statistics: function() {
      let self = this;
      for (let dataItem of self.data) {
        let newBranchLength = 0;
        let newSentencesLength = 0;
        for (let cluster of dataItem.clusters) {
          let judgeType3Num = 0;
          let judgeType4Num = 0;
          for (let changes_obj of dataItem.changesObjects) {
            if (changes_obj.clusterId == cluster.id) {
              if (changes_obj.judgeType == 3) {
                judgeType3Num += 1;
              } else if (changes_obj.judgeType == 4) {
                judgeType4Num += 1;
              }
            }
          }
          if (judgeType4Num <= 0) {
            cluster.neglect = true;
          } else {
            cluster.neglect = false;
            cluster.sentenceNum = judgeType4Num + judgeType3Num;
            newBranchLength += 1;
            newSentencesLength += cluster.sentenceNum;
          }
        }
        dataItem.newBranchLength = newBranchLength;
        dataItem.newSentencesLength = newSentencesLength;
      }
    },

    stage: function(num) {
      let self = this;
      if (num == 2) {
        self.updateStage2Statistics()
      }
      self.meta.stage = num;
    }
  },
  watch: {
    documentId(val) {
      // 如果有localStorage，且对于该documentId有缓存数据，就显示【加载缓存数据】按钮
      console.log(window.localStorage['documentId'], val)
      if (window.localStorage && window.localStorage['documentId'] == val) {
        this.showLoadLocalStorage = true;
      } else {
        this.showLoadLocalStorage = false;
      }
    }
  },
  mounted() {
    // 如果有标注者，则自动填入标注者
    // if (!self.worker){
    //     let self = this;
    //     self.worker = self.meta.workers ? self.meta.workers.slice(-1)[0] : ''
    // }
  },
  // beforeDestroyed() {
  //     let self = this;
  // },

};


const app = Vue.createApp(RootComponent);
const the_vue = app.mount('#bodywrap');
