const TheSelector = (tokenList) => {


  const selection = reactive({
    isSelecting: false,
    start: null,
    end: null,
    end: null,
    array: [],
    again: false,
    hasDown: false,
  });


 const selectionMethods = {
    clearSelection: () => {
      Object.assign(selection, {
        isSelecting: false,
        start: null,
        end: null,
        end: null,
        array: [],
        again: false,
        hasDown: false,
      });
      for (let tkn of tokenList) {
        if (tkn._ctrl != null) {
          Object.assign(tkn._ctrl, {
            selecting: false,
            selected: false,
          })
        };
      };
    },
    onMouseDown:  (token) => {
      // console.log(['mouseDown', token.word]);
      //
      if (selection.hasDown) {
        return;
      };
      //
      selection.hasDown = true;
      for (let tkn of tokenList) {
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
        for (let tkn of tokenList) {
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
        for (let tkn of tokenList) {
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
      for (let tkn of tokenList) {
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
        for (let tkn of tokenList) {
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


  return { selection: toRefs(selection), selectionMethods };
};