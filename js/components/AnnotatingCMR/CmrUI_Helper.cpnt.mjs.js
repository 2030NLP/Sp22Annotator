import {
  reactive, computed, onMounted, h,
  provide, inject,
  // Transition,
  Teleport,
  v,
  div, span, btn, watch
} from './VueShadow.mjs.js';
import { CMR, BS } from './Shadow.mjs.js';

import CmrDisplay from './CmrDisplay.cpnt.mjs.js';

Array.prototype.last = function() {return this[this.length-1]};


// 🔯🔯🔯🔯🔯🔯
// 整个组件
export default {
  props: ['spes', 'tokens'],
  emits: ['save', 'reset'],
  component: {
  },
  setup(props, ctx) {

    const idxesToBlocks = (idxes) => {
      let blocks = [];
      let tmp = [];
      let last = -999;
      for (let idx of idxes) {
        if (idx != last+1) {
          blocks.push(tmp);
          tmp = [];
        };
        tmp.push(idx);
        last = idx;
      };
      blocks.push(tmp);
      blocks = blocks.filter(it=>it.length);
      return blocks;
    };

    const idxesToText = idxes => {
      let _tokens = idxes.map(it => (props?.['tokens']??[])[it]);
      let txt = _tokens.map(it=>it?.to?.word ?? it.word).join("");
      return txt;
    };

    const idxesesToText = idxeses => {
      return idxesToBlocks(idxeses).map(block=>idxesToText(block)).join("+");
    };

    const onCopy = (blocks) => {
      console.log(blocks);
    };

    const 主体 = () => div({
      'class': [{'d-none': !props['spes']?.length}],
    }, [
      h("p", {'class': "mt-2 text-muted"}, "来自 task2 的 S-P-E 标注参考："),
      (props['spes']??[]).map((it, idx)=>div({
        'class': "my-2 hstack gap-4 align-items-center",
        'key': idx,
      }, [
        // JSON.stringify(it),
        it?.SPE?.S ? span({}, [
          span({'class': "text-muted me-1 align-middle"}, "S"),
          btn({
            'class': "py-0 px-1 mx-1",
            onClick: ()=>{onCopy(idxesToBlocks(it?.SPE?.S));},
            'title': `${JSON.stringify(idxesToBlocks(it?.SPE?.S))}`,
          }, idxesesToText(it?.SPE?.S), "light"),
        ]) : null,
        it?.SPE?.P ? span({}, [
          span({'class': "text-muted me-1 align-middle"}, "P"),
          btn({
            'class': "py-0 px-1 mx-1",
            onClick: ()=>{onCopy(idxesToBlocks(it?.SPE?.P));},
            'title': `${JSON.stringify(idxesToBlocks(it?.SPE?.P))}`,
          }, idxesesToText(it?.SPE?.P), "light"),
        ]) : null,
        it?.SPE?.E ? span({}, [
          span({'class': "text-muted me-1 align-middle"}, "E"),
          btn({
            'class': "py-0 px-1 mx-1",
            onClick: ()=>{onCopy(idxesToBlocks(it?.SPE?.E));},
            'title': `${JSON.stringify(idxesToBlocks(it?.SPE?.E))}`,
          }, idxesesToText(it?.SPE?.E), "light"),
        ]) : null,
      ])),
      h("p", {'class': "mt-2 text-muted small"}, "以上信息仅供参考"),
    ])

    return () => div({'class': "--border --p-2 my-1 vstack gap-2"}, [
      主体(),
    ]);
  },
};
// 整个组件 结束