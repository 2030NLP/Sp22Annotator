
const RootStep = {
      ref: "root",
      name: "评估材料的空间关系",
      mode: "root",
      props: {
        startBtn: {
          text: "开始标注", go:"start", style: "outline-dark",
        },
      },
    };

const TheSteps = (ctrl, currentStep) => {
  const stepRecords = {list:[]};
  const stepsDict = {
    start: {
      ref: "start",
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
          go:"start",
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
          go:"start",
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
          go:"start",
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

  };

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

  return { stepRecords, stepsDict, currentStep, stepMethods };

};
