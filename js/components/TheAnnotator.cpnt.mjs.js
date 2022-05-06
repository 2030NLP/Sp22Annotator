import {  reactive, computed, onMounted, h  } from '../modules_lib/vue_3.2.31_.esm-browser.prod.min.js';
import BsBadge from './bs/BsBadge.cpnt.mjs.js';

export default {
  props: ["step", "engine", "tokenSelector", "stepCtrl", "tokens", "selection", "modifiedText"],
  emits: ["yy", "xx"],
  component: {
    BsBadge,
  },
  setup(props, ctx) {

    const div = (attrs, children) => {
      return h("div", attrs, children);
    };

    const someBtn = (btnSettings, clickFn, defaultText, disabled) => {
      return btnSettings ? h("button", {
        'type': "button",
        'class': ["btn btn-sm my-1 me-1", `btn-${btnSettings?.style??"outline-primary"}`],
        'onClick': ()=>{
          clickFn(btnSettings?.go);
          // console.log(selection_length.value);
          // console.log([btnSettings, clickFn, defaultText, disabled]);
        },
        'disabled': disabled??false,
      }, [
        btnSettings?.text ?? defaultText,
      ]) : null;
    };

    const someKeyText = (key) => {
      return step_configs.value?.[key] ? div({ 'class': "col col-12 my-1", }, [
        div({ }, [ step_configs.value?.[key], ]),
      ]) : null;
    };

    const modeMap = {
      "default": null,
      "finalResult": "finalResult",
      "selectValue": "selectValue",
      "interlude": "interlude",
      "multiSpans": "multiSpans",
      "add": "add",
      "modify": "modify",
      "delete": "delete",
      "choose": "choose",
      "text": "text",
      "root": "root",
    };

    const tokenSelector = props.tokenSelector;
    const stepCtrl = props.stepCtrl;

    const mode = computed(()=>props.step?.mode);
    const modeMatch = (...list) => {
      return list.map(it => modeMap[it]).includes(modeMap[mode.value])
    };

    const selection_length = computed(()=>(props.selection?.array?.length??0));

    const step_configs = computed(()=>props.step?.props);

    const isWeb = computed(()=>(props.engine??"").toLowerCase() == "web");

    const idxesToText = (idxes)=>{
      if (!props.tokens?.length) {
        return JSON.stringify(idxes);
      };
      return idxes.map(idx => props.tokens[idx]?.to?.word ?? props.tokens[idx]?.word ?? `[无效索引${idx}]`).join("");
    };

    const clearSelector = () => {tokenSelector.clear(props.tokens)};





    const webButtonsDiv = () => [
      // 网络版预设按钮
      // finalResult 模式
      // 现在只提供一个 保存并继续 的按钮
      div({ 'class': "col col-12 my-1", }, [

        // false ? someBtn({
        //   style: "success",
        //   text: "不保存并前往下一条",
        // }, ()=>{ctx.emit('web-next')}, "不保存并前往下一条") : null,

        // false ? someBtn({
        //   style: "success",
        //   text: "保存",
        // }, ()=>{ctx.emit('web-save')}, "保存") : null,

        // 保存并前往下一条 ⛔️

        someBtn({
          style: "success",
          text: "保存并继续",
        }, ()=>{ctx.emit('web-save-and-next')}, "保存并继续"),
      ]),
    ][0];

    const generalButtonsDiv = (fnObj, disableObj) => {
      const fnDict = {
        ok: (go)=>{ctx.emit('ok', go)},
        start: (go)=>{ctx.emit('start', go)},
        // clean: (go)=>{ctx.emit('clean', go)},
        cancel: (go)=>{ctx.emit('cancel', go)},
        reset: (go)=>{ctx.emit('reset', go)},
        next: (go)=>{ctx.emit('next', go)},
      };
      const disableDict = {
        ok: ()=>false,
        start: ()=>false,
        // clean: ()=>false,
        cancel: ()=>false,
        reset: ()=>false,
        next: ()=>false,
      };

      if (fnObj==null) {fnObj={}};
      Object.assign(fnDict, fnObj);

      if (disableObj==null) {disableObj={}};
      Object.assign(disableDict, disableObj);

      return div({ 'class': "col col-12 my-1", }, [
        someBtn(step_configs.value?.okBtn, fnDict['ok'], "完成", disableDict['ok']()),
        someBtn(step_configs.value?.startBtn, fnDict['start'], "开始", disableDict['start']()),
        // someBtn(step_configs.value?.cleanBtn, fnDict['clean'], "清除", disableDict['clean']()),
        someBtn(step_configs.value?.cancelBtn, fnDict['cancel'], "取消", disableDict['cancel']()),
        someBtn(step_configs.value?.resetBtn, fnDict['reset'], "重置", disableDict['reset']()),
        isWeb.value ? null : someBtn(step_configs.value?.nextBtn, fnDict['next'], "下一条", disableDict['next']()),  // 仅限离线版
      ]);
    };





    const editModeSection = () => [
      // add 模式
      // modify 模式
      // delete 模式

      // selectInstruction 选取指导语
      !selection_length.value ? someKeyText("selectInstruction") : null,

      // selected 已选指导语 + 已选片段(限1个token) | selectedTitle + selection
      selection_length.value&&step_configs.value?.selectedTitle ? div({ 'class': "col col-12 my-1", }, [
        div({ }, [
          step_configs.value?.selectedTitle,  // 类似于“选中的文本是”
          "“",
          idxesToText([props.selection?.array?.[0]]),  // 只能选一个 token 所以是 [0]
          "”",
        ]),
      ]) : null,

      // add 模式 专属内容
      ...(modeMatch("add") && selection_length.value ? [

        // 选边指导语
        // 类似于“选择左边还是右边”
        someKeyText("sideInstruction"),

        // 选框区
        div({ 'class': "col col-12 my-1", }, [
          h("select", {
            'class': "form-select form-select-sm",
            'onChange': (value)=>{props.step.props.data.side=value;},
          }, [
            step_configs.value?.options?.map?.((option, index) => h('option', {
              'key': index,
              'value': option.value,
            }, [option.text])),
          ]),
        ]),

        // 添加内容指导语
        // 类似于“要添加的文本是”
        someKeyText("addInstruction"),

        // 文本区
        div({ 'class': "col col-12 my-1", }, [
          h("input", {
            'class': "form-control form-control-sm",
            'type': "text",
            'onInput': (value)=>{props.step.props.data.target=value;},
            'placeholder': step_configs.value?.addInstruction,
          }),
        ]),
      ] : []),

      // modify 模式 专属内容
      ...(modeMatch("modify") && selection_length.value ? [
        // 指导语
        // 类似于“修改后的文本是”
        someKeyText("instruction"),

        // 文本区
        div({ 'class': "col col-12 my-1", }, [
          h("input", {
            'class': "form-control form-control-sm",
            'type': "text",
            'onInput': (value)=>{props.step.props.data.target=value;},
            'placeholder': step_configs.value?.instruction,
          }),
        ]),
      ] : []),

      // 通用结束按钮区
      generalButtonsDiv({
        'ok': ()=>{stepCtrl.handleWord(step_configs.value?.okBtn?.go, step_configs.value?.data)},
        'cancel': ()=>{stepCtrl.cancelStep(step_configs.value?.cancelBtn?.go)},
      }, {
        'ok': ()=> (!selection_length.value)||(modeMatch("add", "modify") && !step_configs.value?.data?.target?.length),
        'cancel': ()=>false,
      }),

    ];

    const commentModeSection = () => [
      // choose 模式
      // text 模式

      // selectInstruction 选取指导语
      !selection_length.value ? someKeyText("selectInstruction") : null,

      // selected 已选指导语 + 已选片段(不限token数) | selectedTitle + selection
      modeMatch("choose", "text")&&
      selection_length.value&&step_configs.value?.selectedTitle ? div({ 'class': "col col-12 my-1", }, [
        div({ }, [
          step_configs.value?.selectedTitle,  // 类似于“选中的文本是”
          "“",
          idxesToText(props.selection?.array),  // 可以和上面 editModeSection 代码合并
          "”",
        ]),
      ]) : null,


      // choose || text 模式 专属内容
      ...( (selection_length.value || step_configs.value?.canSkipSelection) ? [
        // 指导语
        // 类似于“要附加的说明性文本是”
        someKeyText("instruction"),

        // 选框区
        modeMatch("choose") ? div({ 'class': "col col-12 my-1", }, [
          h("select", {
            'class': "form-select form-select-sm",
            'onChange': (event)=>{props.step.props.data.withText=event.target.value;},
          }, [
            step_configs.value?.options?.map?.((option) => h('option', {
              'key': index,
              'value': option,
            }, [option])),
          ]),
        ]) : null,

        // 文本区
        modeMatch("text") ? div({ 'class': "col col-12 my-1", }, [
          h("input", {
            'class': "form-control form-control-sm",
            'type': "text",
            'onInput': (event)=>{props.step.props.data.withText=event.target.value;},
            'placeholder': step_configs.value?.instruction,
          }),
        ]) : null,

      ] : []),

      // 通用结束按钮区
      generalButtonsDiv({
        'ok': ()=>{stepCtrl.handleChooseOrText(step_configs.value?.okBtn?.go, step_configs.value?.data)},
        'cancel': ()=>{stepCtrl.cancelStep(step_configs.value?.cancelBtn?.go)},
      }, {
        'ok': ()=>
          (!step_configs.value?.canSkipSelection&&!selection_length.value)||
          (!step_configs.value?.canSkipText&&!step_configs.value?.data?.withText?.length),
        'cancel': ()=>false,
      }),

      // 针对修改错字的专门处理
      ...(
      selection_length.value&&
      modeMatch("text")&&
      props.step?.ref=="handleErrorString" ? [
        // 220330：对于修改字符错误的情形，添加区域显示修改后的完整的文本
        div({ 'class': "col col-12 my-1", }, [
          div({ }, [ "修改后的完整文本为：" ]),
        ]),
        div({ 'class': "col col-12 my-1", }, [
          div({ 'class': "text-muted small" }, [
            h("span", {}, [ prps.modifiedText.sideL ]),
            h("span", { 'class': "text-danger fw-bold" }, [ prps.modifiedText.sideM ]),
            h("span", {}, [ prps.modifiedText.sideR ]),
          ]),
        ]),
      ] : []),
    ];

    const multiSpansModeSection = () => [
      // 指导语
      someKeyText("instruction"),

      // 按钮
      // 增加到列表
      // 清除选区
      div({ 'class': "col col-12 my-1", }, [
        someBtn(step_configs.value?.addBtn, (go)=>{
          ctx.emit('add-to-list', go);
          step_configs.value?.data?.tokenarrays?.push?.(props.selection?.array);
          clearSelector();
        }, "add to list", selection_length.value<1),
        someBtn(step_configs.value?.clearBtn, (go)=>{
          ctx.emit('clear-selection', go);
          clearSelector();
        }, "clear selection"),
      ]),

      // 已选列表的标题
      someKeyText("listTitle"),

      // 已选列表
      div({ 'class': "col col-12 my-1", }, [
        div({ 'class': "card" }, [
          div({ 'class': "card-body" }, (step_configs.value?.data?.tokenarrays??[]).map((tokenIdxArray, idx) => h(
            BsBadge, {
              'class': "rounded-pill m-1",
              'key': "idx",
              'canRemove': true,
              'onRemove': ()=>{stepCtrl.deleteFromTokenarrays(props.step, idx)},
            },
            tokenIdxArray.map(tokenIdx => h(
              "span", {},
              [idxesToText([tokenIdx])],
            )),
          ))),
        ]),
      ]),

      // 选择数量提示 | 至少选2个片段
      (step_configs.value?.data?.tokenarrays?.length??0)<2 ? someKeyText("lengthTip") : null,

      // 通用结束按钮区
      generalButtonsDiv({
        'ok': ()=>{
          stepCtrl.handleMultiSpans(step_configs.value?.okBtn?.go, step_configs.value?.data);
          clearSelector();
        },
        'cancel': ()=>{
          stepCtrl.cancelStep(step_configs.value?.cancelBtn?.go);
          clearSelector();
        },
      }, {
        'ok': ()=>(step_configs.value?.data?.tokenarrays?.length<2),
        'cancel': ()=>false,
      }),

    ];





    return () => div({ 'class': "row", 'data-mode': mode.value, }, [
      ...(modeMatch("add", "modify", "delete") ? editModeSection() : []),
      ...(modeMatch("choose", "text") ? commentModeSection() : []),
      ...(modeMatch("multiSpans") ? multiSpansModeSection() : []),

      // 指导语
      // finalResult 模式
      // selectValue 模式
      // interlude 模式 且 showResults 👎
      // root 模式 👎
      modeMatch("finalResult", "selectValue", "root") ? someKeyText("instruction") : null,
      modeMatch("interlude") /*&& step_configs.value?.showResults*/ ? someKeyText("instruction") : null,

      // 选项按钮组
      // selectValue 模式
      // interlude 模式 👎
      modeMatch("selectValue", "interlude") &&
      step_configs.value?.optionBtns ? div({ 'class': "col col-12 my-1", }, [
        ...step_configs.value?.optionBtns.map(btn => someBtn(btn, ()=>{
          ctx.emit('option', btn);
          stepCtrl.goRefStep(btn.go, btn.data);
        })),
      ]) : null,


      // 一些通用的功能按钮，起初只考虑了离线版，所以和网络版可能有点冲突
      // 完成按钮 ok       | selectValue | interlude 👎 | multiSpans | add | modify | delete | choose | text
      // 开始按钮 start    | root 👎
      // 清除按钮 clean ⛔️ |                            | multiSpans
      // 取消按钮 cancel   | finalResult |              | multiSpans | add | modify | delete | choose | text
      // 重置按钮 reset    | selectValue | interlude 👎 | finalResult
      // 下一条按钮 next   | finalResult ⛔️
      modeMatch("finalResult", "selectValue", "interlude", "root") ? generalButtonsDiv({
        'cancel': ()=>{stepCtrl.cancelStep(step_configs.value?.cancelBtn?.go)},
        'start': ()=>{stepCtrl.cancelStep(step_configs.value?.startBtn?.go)},
        'reset': ()=>{stepCtrl.resetStep(step_configs.value?.resetBtn?.go)},
        'next': ()=>{stepCtrl.nextStep(step_configs.value?.nextBtn?.go)},
        'ok': ()=>{stepCtrl.goRefStep(step_configs.value?.okBtn?.go)},
      }) : null,


      // 网络版预设按钮
      // finalResult 模式
      // 现在只提供一个 保存并继续 的按钮
      modeMatch("finalResult") && isWeb.value ? webButtonsDiv() : null,

      // 备用
      // div({ 'class': "col col-12 my-1", }, []),
    ]);


  },
};


