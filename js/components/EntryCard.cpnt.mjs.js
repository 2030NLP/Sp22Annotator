import {  h  } from '../modules_lib/vue_3.2.31_.esm-browser.prod.min.js';

const EntryCard = {
  props: ["db", "entry"],
  emits: ["open-modal", 'update-entry'],
  setup(props, ctx) {
    const onOpenModal = () => {
      ctx.emit('open-modal', ['entry-detail', props.entry]);
    };
    const updateEntry = () => {
      ctx.emit('update-entry', props.entry.id);
    };
    return { onOpenModal, updateEntry };
  },
  render() {
    // console.log(this);
    if (!this.entry) {
      return h('div', {}, ["没有找到这条语料"]);
    };
    return h('div', {
        'class': "border rounded p-1 mx-1 my-1",
      }, [
        h('button', {
            'type': "button",
            'class': ["btn btn-sm my-1 me-2", this.entry?.deleted?'btn-danger':'btn-outline-dark'],
            'onClick': this.onOpenModal,
            // 'title': JSON.stringify(this.entry),
          },
          [`entry#${this.entry?.id}`],
        ),
        h('button', {
            'type': "button",
            'class': "btn btn-sm btn-light my-1 me-2",
            'onClick': this.updateEntry,
            'title': `完整加载`,
          },
          [`📥`],
        ),
        this.entry.polygraph ? h('div', {
            'class': "my-1",
          },
          [
            h('span', {
                'class': "badge bg-warning text-dark text-wrap my-1 me-2",
              },
              [`质检标签: ${this.entry.polygraph}`],
            ),
            this.entry.polygraphType ? h('span', {
                'class': "badge bg-warning text-dark text-wrap my-1 me-2",
              },
              [`质检类型: ${this.entry.polygraphType}`],
            ) : null,
            this.entry.results?._temp_labels ? h('span', {
                'class': "badge bg-light text-dark text-wrap my-1 me-2",
              },
              [`参考标签: ${this.entry.results?._temp_labels}`],
            ) : null,
            this.entry.results?._temp_annots ? h('span', {
                'class': "badge bg-light text-dark text-wrap my-1 me-2",
              },
              [`参考标注: ${JSON.stringify(this.entry.results?._temp_annots)}`],
            ) : null,
            this.entry.results?._temp_annos ? h('span', {
                'class': "badge bg-light text-dark text-wrap my-1 me-2",
              },
              [`参考标注来源: ${this.entry.results?._temp_annos}`],
            ) : null,
          ],
        ) : null,
        this.entry?.content?.material?.tokenList ? h('div', {
          'class':"my-1 material-area admin show-notice"
        }, [
          h('p', {}, this.entry?.content?.material?.tokenList.map(token=>h('span', {
            'key': token.idx,
            'class': "token",
            'title': `idx: ${token.idx}\npos: ${token.pos}${token.replaced?'\norigin: '+token.word:''}`,
            'data-idx': token.idx,
            'data-pos': token.pos,
            'data-auto-dverb': token?.autoDVerb,
            'data-auto-entity': token.autoEntity,
            'data-auto-spatial': token.autoSpatial,
            'data-selecting': token?._ctrl?.selecting,
            'data-selected': token?._ctrl?.selected,
            'data-replaced': token?.replaced ?? false,
            'data-word': token.word,
            'data-to-word': token?.to?.word,
          }, [`${token?.to?.word ?? token.word ?? ""}`]))),
        ]) : null,
      ],
    );
  },
};

export default EntryCard;

