// import { reactive, readonly, ref, toRefs, computed, onMounted, onUpdated } from 'vue';
const { reactive, readonly, ref, toRefs, computed, onMounted, onUpdated } = Vue;

const RootComponent = {
  setup() {
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
            "tokenarrays": [[3], [4]],  // [ 杯, 铁 ]
          },
          {
            "idx": 1,
            "toSolve": 0,  // 针对哪一个标注内容进行的进一步改正
            "label": "修改",
            "mode": "modify",
            "source": 3,  // 杯
            "target": "块",
          },
          {
            "idx": 2,
            "label": "两段材料中的空间关系相同",
            "mode": "choose",
          },
          {
            "idx": 3,
            "label": "两段材料中的空间关系不同",
            "mode": "choose",
          },
          {
            "idx": 4,
            "label": "两段材料中的空间关系可能相同也可能不同",
            "mode": "choose",
          },
        ]
      }
    });


    // const showOrigin = ref(false);
    const ctrl = reactive({
      showOrigin: false,
    });
    const ctrlMethods = {
      toogleShowOrigin: () => {
        ctrl.showOrigin = !ctrl.showOrigin;
        console.log(ctrl.showOrigin);
      },
    };


    const stepsDict = reactive({
      judgeSpConfig: {
        ref: "judgeSpConfig",
        name: "评估材料的空间关系",
        mode: "selectValue",
        props: {
          instruction: "这段材料中的空间关系____。",
          optionBtns: [
            {text: "完全正常", value: "fine", go:"judgeSimilarity", style: "outline-primary", },
            {text: "尚能说通", value: "someFine", go:"judgeSimilarity", style: "outline-primary", },
            {text: "比较牵强", value: "someBad", go:"manageReasons", style: "outline-primary", },
            {text: "根本不对", value: "bad", go:"manageReasons", style: "outline-primary", },
          ],
        },
      },
      judgeSimilarity: {
        ref: "judgeSimilarity",
        name: "评估材料的空间关系",
        mode: "selectValue",
        props: {
          instruction: "这两段材料中的空间关系____。",
          showOrigin: true,
          optionBtns: [
            {text: "相同", value: "same", go:"end", style: "outline-primary", },
            {text: "可能相同也可能不同", value: "ambi", go:"end", style: "outline-primary", },
            {text: "不同", value: "diff", go:"end", style: "outline-primary", },
          ],
          canReset: true,
          resetBtn: {
            text: "重置",
            go:"judgeSpConfig",
            style: "outline-dark",
          },
        },
      },
      manageReasons: {
        ref: "manageReasons",
        name: "管理归因",
        mode: "interlude",  // 幕间
        props: {
          data: {
            annotations: [],
          },
          instruction: "这段材料中的空间关系存在的异常有____。",
          optionBtns: [
            {text: "➕ 搭配不当", go:"addDaPeiBuDang", style: "outline-primary", },
            {text: "➕ 语义冲突", go:"xxx", style: "outline-primary", },
            {text: "➕ 不符合常识", go:"xxx", style: "outline-primary", },
          ],
          okBtn: {
            text: "✔️ 结束",
            go:"end",
            style: "outline-success",
          },
          canReset: true,
          resetBtn: {
            text: "重置",
            go:"judgeSpConfig",
            style: "outline-dark",
          },
        },
      },
      end: {
        ref: "end",
        name: "标注结果",
        mode: "finalResult",
        props: {
          instruction: "标注结果如下：",
          canReset: true,
          resetBtn: {
            text: "清空并重新标注",
            go:"judgeSpConfig",
            style: "outline-dark",
          },
        },
      },

      addDaPeiBuDang: {
        ref: "addDaPeiBuDang",
        name: "新增搭配不当",
        mode: "multiSpans",
        props: {
          instruction: "请在文中依次选择造成搭配不当的全部文本片段。选择完成后，可将其加入列表。",
          listTitle: "造成搭配不当的文本片段是：",
          data: {
            label: "搭配不当",
            tokenarrays: [],
          },
          addBtn: {
            text: "将所选片段加入列表",
            style: "primary",
          },
          clearBtn: {
            text: "清除选区",
            style: "info",
          },
          okBtn: {
            text: "不再添加，完成",
            go: "manageReasons",
            style: "success",
          },
        },
      },

    });



    const stepRecords = reactive({list:[]});
    const currentStep = reactive({
      ref: "judgeSpConfig",
      name: "评估材料的空间关系",
      mode: "selectValue",
      props: {
        instruction: "这段材料中的空间关系____。",
        optionBtns: [
          {text: "完全正常", value: "fine", go:"judgeSimilarity", style: "outline-primary", },
          {text: "尚能说通", value: "someFine", go:"judgeSimilarity", style: "outline-primary", },
          {text: "比较牵强", value: "someBad", go:"manageReasons", style: "outline-primary", },
          {text: "根本不对", value: "bad", go:"manageReasons", style: "outline-primary", },
        ],
      },
    });
    const stepMethods = {
      goStep: (stepObj_, value) => {
        stepRecords.list.push(value);
        let stepObj = {
          ref: stepObj_?.ref ?? null,
          name: stepObj_?.name ?? null,
          mode: stepObj_?.mode ?? null,
          props: stepObj_?.props ?? null,
        };
        ctrl.showOrigin = stepObj?.props?.showOrigin ?? false;
        Object.assign(currentStep, stepObj);
      },
      goRefStep: (ref, value) => {
        let stepObj = stepsDict[ref];
        stepMethods.goStep(stepObj, value);
      },
      resetStep: (ref) => {
        let stepObj = stepsDict[ref];
        stepMethods.goStep(stepObj);
        stepRecords.list = [];
      },
    };



    const data = reactive({
      //
      "file_meta_list": [],
      "current_file_meta": {},
      //
      "data": [],
      //
      "worker": "",
      //
      //
      //
      //
      //
      //
      //
      "tag_map_1": ['难以判断', '不成立', '成立', '', '勉强成立'],
      "tag_map_2": ['难以判断', '搭配不当', '意义冲突', '语义变化不大', '语义变化大', '', '', '', '', ''],
      "index1":0,
      "index2":0,
      "sites": [
        { text: '无法搭配' },
        { text: '语义冲突' },
        { text: '在常识严重相悖' },
        { text: '在上下文严重相悖' }
      ],
      "showLoadLocalStorage": false,
      "documentId": -1,
      "desc": "空间关系认知语料标注",
      "apiVersion": "21-0131-00",
      "meta": {
        "workers": [],
        "createdTime": "2021-01-30",
        "modifiedTime": "2021-01-30",
        "stage": 1
      },
    });


    const timeString = () => {
      let the_date = new Date();
      let str = `${(''+the_date.getFullYear()).slice(2,4)}${(''+(the_date.getMonth()+1)).length==1?'0':''}${the_date.getMonth()+1}${(''+the_date.getDate()).length==1?'0':''}${the_date.getDate()}-${(''+the_date.getHours()).length==1?'0':''}${the_date.getHours()}${(''+the_date.getMinutes()).length==1?'0':''}${the_date.getMinutes()}${(''+the_date.getSeconds()).length==1?'0':''}${the_date.getSeconds()}`;
      return str;
    };


    // ↓ 参看 js/components/TheSelector.js
    const theSelector = TheSelector(exampleWrap.example.material.tokenList);
    const selection = reactive(theSelector.selection);
    const selectionMethods = theSelector.selectionMethods;
    // ↑ 参看 js/components/TheSelector.js

    // const getAnnoBtnClass(anno_label) {
    //   const map = {
    //     "搭配不当": "",
    //   };
    // };

    return {
      //
      ...toRefs(exampleWrap),
      //
      ctrl,
      ...ctrlMethods,
      //
      selection,
      ...selectionMethods,
      //
      stepRecords,
      stepsDict,
      currentStep,
      ...stepMethods,
      //
      // getAnnoBtnClass,
    };
  },  // setup() end




  data() {
    return {
      //
      ctrl: {
        currentIdx: 32345245,
      },

      //
      //
      //
      "file_meta_list": [],
      "current_file_meta": {},
      "data": [],
      "worker": "",
      "tag_map_1": ['难以判断', '不成立', '成立', '', '勉强成立'],
      "tag_map_2": ['难以判断', '搭配不当', '意义冲突', '语义变化不大', '语义变化大', '', '', '', '', ''],
      "index1":0,
      "index2":0,
      "sites": [
        { text: '无法搭配' },
        { text: '语义冲突' },
        { text: '在常识严重相悖' },
        { text: '在上下文严重相悖' }
      ],
      "showLoadLocalStorage": false,
      "documentId": -1,
      "desc": "空间关系认知语料标注",
      "apiVersion": "21-0131-00",
      "meta": {
        "workers": [],
        "createdTime": "2021-01-30",
        "modifiedTime": "2021-01-30",
        "stage": 1
      },
    };
  },
  computed: {
    question_done_num: function() {
      let self = this;
      let sum = 0;
      for (let dataItem of self.data) {
        for (let cluster of dataItem.clusters) {
          if (!cluster.neglect && cluster.question.trim() != "") {
            sum++;
          }
        }
      }
      return sum;
    },
    question_total_num: function() {
      let self = this;
      let sum = 0;
      for (let dataItem of self.data) {
        for (let cluster of dataItem.clusters) {
          let judgeType4Num = 0;
          for (let changes_obj of dataItem.changesObjects) {
            if (changes_obj.clusterId == cluster.id) {
              if (changes_obj.judgeType == 4) {
                judgeType4Num += 1;
              }
            }
          }
          if (judgeType4Num <= 0) {
            cluster.neglect = true;
          } else {
            cluster.neglect = false;
            sum++;
          }
        }
      }
      return sum;
    },

    question_done_pct: function() {
      let self = this;
      if (self.question_total_num == 0)
        return `${0}%`;
      return `${self.question_done_num / self.question_total_num * 100}%`;
    },

    done_num: function() {
      let self = this;
      let sum = 0;
      for (let dataItem of self.data) {
        if (!dataItem.originalError) {
          for (let changes_obj of dataItem.changesObjects) {
            if (changes_obj.finished && !changes_obj.dropped) {
              sum++;
            };
          };
        };
      };
      return sum;
    },
    total_num: function() {
      let self = this;
      let sum = 0;
      for (let dataItem of self.data) {
        if (!dataItem.originalError) {
          sum += dataItem.sentencesLength;
        };
      };
      return sum;
    },
    done_pct: function() {
      let self = this;
      return `${self.done_num / self.total_num * 100}%`;
    },

    done_num1: function() {
      let self = this;
      let sum = 0;
      for (let dataItem of self.data) {
        if (!dataItem.originalError) {
          for (let changes_obj of dataItem.changesObjects) {
            if ((changes_obj.judgeCorrection == 2) && (changes_obj.judgeType == 4)) {
              if (changes_obj.choicesMade == 2) {
                sum++;
              };
            };
          };
          for (let changes_obj of dataItem.clusters) {
            if (changes_obj.originObject.choicesMade == 2) {
              sum++;
            };
          };
        };
      };
      return sum;
    },
    total_num1: function() {
      let self = this;
      let sum = 0;
      for (let dataItem of self.data) {
        if (!dataItem.originalError) {
          for (let changes_obj of dataItem.changesObjects) {
            if ((changes_obj.judgeCorrection == 2) && (changes_obj.judgeType == 4)) {
              sum++;
            };
          };
          for (let changes_obj of dataItem.clusters) {
            sum++;
          };
        };
      };
      return sum;
    },
    done_pct1: function() {
      let self = this;
      return `${self.done_num1 / self.total_num1 * 100}%`;
    },

  },
  methods: {

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
    onImport: function() {
      let self = this;
      let fileList = document.forms["file-form"]["file-input"].files;
      // console.log(fileList);
      let file_meta_list = [];
      let idx = 0;
      for (let file of fileList) {
        file_meta_list.push({
          "idx": idx,
          "name": file.name,
          "file": file,
          "url": URL.createObjectURL(file),
          // "content": "",
        });
        idx += 1;
      }
      self.file_meta_list = file_meta_list;
      self.current_file_meta = file_meta_list[idx - 1];
      // console.log(self.current_file_meta);
      self.readData();
    },

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
